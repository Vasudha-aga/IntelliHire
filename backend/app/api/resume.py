from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, Resume
from app.services.nlp_engine import parse_resume
from app.services.ats_engine import run_ats_analysis
from app.services.llm_service import generate_resume_suggestions

router = APIRouter(prefix="/api/resume", tags=["Resume"])


@router.post("/upload-and-analyze")
async def upload_and_analyze(
    resume: UploadFile = File(...),
    jd_text: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload resume PDF + paste JD → full ATS analysis
    """
    # Validate file type
    if not resume.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    # Read file
    file_bytes = await resume.read()
    if len(file_bytes) > 5 * 1024 * 1024:  # 5MB limit
        raise HTTPException(status_code=400, detail="File too large. Max 5MB.")

    # Step 1: Parse resume
    parsed = parse_resume(file_bytes)

    # Step 2: ATS Analysis
    ats_result = run_ats_analysis(parsed, jd_text)

    # Step 3: Resume improvement suggestions (from LLM)
    suggestions = generate_resume_suggestions(
        resume_text=parsed["raw_text"],
        jd_text=jd_text,
        missing_skills=ats_result["missing_skills"]
    )

    # Step 4: Save to database
    resume_record = Resume(
        user_id=current_user.id,
        filename=resume.filename,
        raw_text=parsed["raw_text"],
        parsed_data=parsed,
        jd_text=jd_text,
        ats_score=ats_result["ats_score"],
        ats_details=ats_result
    )
    db.add(resume_record)
    db.commit()
    db.refresh(resume_record)

    return {
        "resume_id": resume_record.id,
        "parsed_resume": {
            "skills": parsed["skills"],
            "email": parsed["email"],
            "years_of_experience": parsed["years_of_experience"],
            "word_count": parsed["word_count"],
            "sections_found": [k for k, v in parsed["sections"].items() if v]
        },
        "ats_analysis": ats_result,
        "improvement_suggestions": suggestions
    }


@router.get("/history")
async def get_resume_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all resumes uploaded by user"""
    resumes = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.created_at.desc())
        .all()
    )

    return [
        {
            "id": r.id,
            "filename": r.filename,
            "ats_score": r.ats_score,
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in resumes
    ]


@router.get("/{resume_id}")
async def get_resume_details(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get full details of a specific resume analysis"""
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    return {
        "id": resume.id,
        "filename": resume.filename,
        "ats_score": resume.ats_score,
        "ats_details": resume.ats_details,
        "parsed_data": resume.parsed_data,
        "created_at": resume.created_at.isoformat() if resume.created_at else None
    }
