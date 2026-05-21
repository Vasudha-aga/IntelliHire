from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, Interview, Resume, InterviewMode, InterviewStatus
from app.services.llm_service import generate_interview_question, evaluate_answer
from app.services.speech_engine import analyze_speech
from app.services.vision_engine import analyze_frame, aggregate_vision_metrics

router = APIRouter(prefix="/api/interview", tags=["Interview"])


# ── Pydantic Schemas ──────────────────────────────────────
class StartInterviewRequest(BaseModel):
    resume_id: int
    mode: str = "text"       # text | voice | video
    job_role: str = ""
    difficulty: str = "medium"


class SubmitTextAnswerRequest(BaseModel):
    interview_id: int
    question: str
    answer: str
    question_meta: dict = {}  # expected_keywords, hint, type etc.


class EndInterviewRequest(BaseModel):
    interview_id: int
    frame_results: Optional[List[dict]] = []   # aggregated frame data from video mode


# ── Routes ───────────────────────────────────────────────
@router.post("/start")
async def start_interview(
    data: StartInterviewRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new interview session and return first question"""
    # Fetch resume
    resume = db.query(Resume).filter(
        Resume.id == data.resume_id,
        Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    # Create interview session
    interview = Interview(
        user_id=current_user.id,
        resume_id=resume.id,
        mode=InterviewMode(data.mode),
        status=InterviewStatus.in_progress,
        job_role=data.job_role,
        questions_answers=[]
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)

    # Generate first question
    parsed_data = resume.parsed_data or {}
    resume_summary = f"""
    Skills: {', '.join(parsed_data.get('skills', [])[:15])}
    Experience: {parsed_data.get('years_of_experience', 0)} years
    Projects: {parsed_data.get('sections', {}).get('projects', '')[:300]}
    Education: {parsed_data.get('sections', {}).get('education', '')[:200]}
    """
    jd_text = resume.jd_text or ""
    ats_details = resume.ats_details or {}
    missing_skills = ats_details.get("missing_skills", [])

    question_data = generate_interview_question(
        resume_summary=resume_summary,
        jd_text=jd_text,
        missing_skills=missing_skills,
        previous_qa=[],
        question_number=1,
        difficulty=data.difficulty
    )

    return {
        "interview_id": interview.id,
        "mode": data.mode,
        "question_number": 1,
        "total_questions": 10,
        "question": question_data
    }


@router.post("/answer/text")
async def submit_text_answer(
    data: SubmitTextAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit text answer, get evaluation + next question"""
    interview = db.query(Interview).filter(
        Interview.id == data.interview_id,
        Interview.user_id == current_user.id
    ).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    # Evaluate answer
    evaluation = evaluate_answer(
        question=data.question,
        user_answer=data.answer,
        expected_keywords=data.question_meta.get("expected_keywords", []),
        hint_for_evaluation=data.question_meta.get("hint_for_evaluation", ""),
        interview_mode="text"
    )

    # Save Q&A to interview record
    qa_entry = {
        "question_number": len(interview.questions_answers) + 1,
        "question": data.question,
        "question_type": data.question_meta.get("type", "general"),
        "answer": data.answer,
        "score": evaluation.get("overall_score", 0),
        "evaluation": evaluation
    }

    questions_answers = list(interview.questions_answers or [])
    questions_answers.append(qa_entry)

    # Generate next question (if not last)
    question_number = len(questions_answers) + 1
    next_question = None
    is_complete = question_number > 10

    if not is_complete:
        resume = interview.resume
        parsed_data = resume.parsed_data or {}
        resume_summary = f"Skills: {', '.join(parsed_data.get('skills', [])[:15])}"
        jd_text = resume.jd_text or ""
        missing_skills = (resume.ats_details or {}).get("missing_skills", [])

        next_question = generate_interview_question(
            resume_summary=resume_summary,
            jd_text=jd_text,
            missing_skills=missing_skills,
            previous_qa=questions_answers,
            question_number=question_number
        )
    else:
        # Mark complete
        interview.status = InterviewStatus.completed
        interview.completed_at = datetime.utcnow()

        # Calculate overall score
        scores = [qa["score"] for qa in questions_answers if qa.get("score")]
        interview.overall_score = sum(scores) / len(scores) if scores else 0

    interview.questions_answers = questions_answers
    db.commit()

    return {
        "evaluation": evaluation,
        "next_question": next_question,
        "question_number": question_number,
        "is_complete": is_complete,
        "interview_id": interview.id
    }


@router.post("/answer/voice")
async def submit_voice_answer(
    interview_id: int = Form(...),
    question: str = Form(...),
    question_meta: str = Form(default="{}"),
    audio: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit voice answer - processes audio + evaluates answer"""
    import json

    interview = db.query(Interview).filter(
        Interview.id == interview_id,
        Interview.user_id == current_user.id
    ).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    # Read audio
    audio_bytes = await audio.read()
    file_ext = audio.filename.split(".")[-1] if "." in audio.filename else "wav"

    # Analyze speech
    speech_metrics = analyze_speech(audio_bytes, file_ext)
    transcript = speech_metrics.get("transcript", "")

    # Parse question meta
    try:
        meta = json.loads(question_meta)
    except Exception:
        meta = {}

    # Evaluate answer using transcript
    evaluation = evaluate_answer(
        question=question,
        user_answer=transcript,
        expected_keywords=meta.get("expected_keywords", []),
        hint_for_evaluation=meta.get("hint_for_evaluation", ""),
        interview_mode="voice"
    )

    # Combine interview score with communication score
    answer_score = evaluation.get("overall_score", 0)
    comm_score = speech_metrics.get("communication_score", 0) / 10  # convert to 0-10
    combined_score = round(answer_score * 0.7 + comm_score * 0.3, 1)

    # Save QA
    qa_entry = {
        "question_number": len(interview.questions_answers or []) + 1,
        "question": question,
        "answer": transcript,
        "score": combined_score,
        "evaluation": evaluation,
        "speech_metrics": {
            "speaking_pace": speech_metrics.get("speaking_pace"),
            "filler_words": speech_metrics.get("filler_words"),
            "confidence": speech_metrics.get("confidence"),
            "hesitations": speech_metrics.get("hesitations"),
            "communication_score": speech_metrics.get("communication_score")
        }
    }

    questions_answers = list(interview.questions_answers or [])
    questions_answers.append(qa_entry)
    interview.questions_answers = questions_answers

    # Update cumulative speech metrics
    interview.speech_metrics = speech_metrics
    db.commit()

    # Generate next question
    question_number = len(questions_answers) + 1
    is_complete = question_number > 10
    next_question = None

    if not is_complete:
        resume = interview.resume
        parsed_data = resume.parsed_data or {}
        next_question = generate_interview_question(
            resume_summary=f"Skills: {', '.join(parsed_data.get('skills', [])[:15])}",
            jd_text=resume.jd_text or "",
            missing_skills=(resume.ats_details or {}).get("missing_skills", []),
            previous_qa=questions_answers,
            question_number=question_number
        )
    else:
        interview.status = InterviewStatus.completed
        interview.completed_at = datetime.utcnow()
        scores = [qa["score"] for qa in questions_answers if qa.get("score")]
        interview.overall_score = sum(scores) / len(scores) if scores else 0
        db.commit()

    return {
        "transcript": transcript,
        "speech_metrics": speech_metrics,
        "evaluation": evaluation,
        "combined_score": combined_score,
        "next_question": next_question,
        "is_complete": is_complete
    }


@router.post("/analyze-frame")
async def analyze_webcam_frame(
    frame: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Analyze single webcam frame for eye contact and engagement"""
    frame_bytes = await frame.read()
    result = analyze_frame(frame_bytes)
    return result


@router.post("/end")
async def end_interview(
    data: EndInterviewRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """End interview session and aggregate all metrics"""
    interview = db.query(Interview).filter(
        Interview.id == data.interview_id,
        Interview.user_id == current_user.id
    ).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    # Aggregate vision metrics (for video mode)
    if data.frame_results:
        vision_metrics = aggregate_vision_metrics(data.frame_results)
        interview.vision_metrics = vision_metrics

    # Mark complete
    interview.status = InterviewStatus.completed
    interview.completed_at = datetime.utcnow()

    questions_answers = interview.questions_answers or []
    if questions_answers:
        scores = [qa.get("score", 0) for qa in questions_answers if qa.get("score")]
        interview.overall_score = sum(scores) / len(scores) if scores else 0

    db.commit()

    return {
        "interview_id": interview.id,
        "overall_score": interview.overall_score,
        "total_questions": len(questions_answers),
        "vision_metrics": interview.vision_metrics,
        "speech_metrics": interview.speech_metrics,
        "status": "completed"
    }


@router.get("/history")
async def get_interview_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all interviews for dashboard"""
    interviews = (
        db.query(Interview)
        .filter(Interview.user_id == current_user.id)
        .order_by(Interview.created_at.desc())
        .all()
    )

    return [
        {
            "id": i.id,
            "mode": i.mode,
            "status": i.status,
            "job_role": i.job_role,
            "overall_score": i.overall_score,
            "total_questions": len(i.questions_answers or []),
            "created_at": i.created_at.isoformat() if i.created_at else None,
            "completed_at": i.completed_at.isoformat() if i.completed_at else None
        }
        for i in interviews
    ]
