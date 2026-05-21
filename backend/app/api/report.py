from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, Report, Interview, Resume, CodingScore
from app.services.llm_service import generate_final_report

router = APIRouter(prefix="/api/report", tags=["Report"])


class GenerateReportRequest(BaseModel):
    interview_id: int
    resume_id: Optional[int] = None


@router.post("/generate")
async def generate_report(
    data: GenerateReportRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate full AI report after interview completion"""
    interview = db.query(Interview).filter(
        Interview.id == data.interview_id,
        Interview.user_id == current_user.id
    ).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    # Get resume data
    resume = interview.resume
    ats_data = {}
    if resume:
        ats_data = resume.ats_details or {}

    # Get coding scores
    coding_scores = db.query(CodingScore).filter(
        CodingScore.interview_id == interview.id
    ).all()
    coding_list = [
        {"problem_title": c.problem_title, "score": c.score,
         "test_cases_passed": c.test_cases_passed, "test_cases_total": c.test_cases_total}
        for c in coding_scores
    ]

    # Calculate scores
    qa_list = interview.questions_answers or []
    scores = [qa.get("score", 0) for qa in qa_list if qa.get("score")]
    interview_score = (sum(scores) / len(scores) * 10) if scores else 0  # 0-100

    coding_avg = (
        sum(c.score or 0 for c in coding_scores) / len(coding_scores)
        if coding_scores else 0
    )

    ats_score = ats_data.get("ats_score", 0)

    # Generate AI report
    report_data = generate_final_report(
        user_name=current_user.full_name,
        job_role=interview.job_role or "Software Engineer",
        ats_data=ats_data,
        interview_qa=qa_list,
        speech_metrics=interview.speech_metrics or {},
        vision_metrics=interview.vision_metrics or {},
        coding_scores=coding_list
    )

    # Compute overall readiness
    overall = round(
        ats_score * 0.30 +
        interview_score * 0.40 +
        coding_avg * 0.30,
        1
    )

    # Save report
    report = Report(
        user_id=current_user.id,
        interview_id=interview.id,
        resume_id=resume.id if resume else None,
        job_role=interview.job_role,
        ats_score=ats_score,
        interview_score=interview_score,
        coding_score=coding_avg,
        overall_readiness=overall,
        full_report=report_data,
        recommendations=report_data.get("personalized_recommendations", [])
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return {
        "report_id": report.id,
        "overall_readiness": overall,
        "readiness_label": report_data.get("readiness_label", ""),
        "score_breakdown": {
            "ats_score": ats_score,
            "interview_score": round(interview_score, 1),
            "coding_score": round(coding_avg, 1)
        },
        "full_report": report_data,
        "interview_details": {
            "mode": interview.mode,
            "total_questions": len(qa_list),
            "questions_answers": qa_list,
            "speech_metrics": interview.speech_metrics,
            "vision_metrics": interview.vision_metrics
        },
        "ats_details": ats_data,
        "coding_scores": coding_list
    }


@router.get("/{report_id}")
async def get_report(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a previously generated report"""
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == current_user.id
    ).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    return {
        "report_id": report.id,
        "job_role": report.job_role,
        "overall_readiness": report.overall_readiness,
        "score_breakdown": {
            "ats_score": report.ats_score,
            "interview_score": report.interview_score,
            "coding_score": report.coding_score
        },
        "full_report": report.full_report,
        "recommendations": report.recommendations,
        "created_at": report.created_at.isoformat() if report.created_at else None
    }


@router.get("/")
async def list_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all reports for the current user"""
    reports = (
        db.query(Report)
        .filter(Report.user_id == current_user.id)
        .order_by(Report.created_at.desc())
        .all()
    )
    return [
        {
            "id": r.id,
            "job_role": r.job_role,
            "overall_readiness": r.overall_readiness,
            "ats_score": r.ats_score,
            "interview_score": r.interview_score,
            "coding_score": r.coding_score,
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in reports
    ]
