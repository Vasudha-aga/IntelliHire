from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, Interview, Report, Resume, CodingScore, InterviewStatus

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/dashboard")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Main dashboard stats — used by /dashboard page"""
    # Total completed interviews
    total_interviews = db.query(Interview).filter(
        Interview.user_id == current_user.id,
        Interview.status == InterviewStatus.completed
    ).count()

    # Average ATS score
    avg_ats = db.query(func.avg(Resume.ats_score)).filter(
        Resume.user_id == current_user.id
    ).scalar() or 0

    # Best interview score
    best_score = db.query(func.max(Interview.overall_score)).filter(
        Interview.user_id == current_user.id
    ).scalar() or 0

    # Recent interviews (last 5) for activity table
    recent_interviews = (
        db.query(Interview)
        .filter(Interview.user_id == current_user.id)
        .order_by(Interview.created_at.desc())
        .limit(5)
        .all()
    )

    # Recent reports for readiness trend
    recent_reports = (
        db.query(Report)
        .filter(Report.user_id == current_user.id)
        .order_by(Report.created_at.desc())
        .limit(5)
        .all()
    )

    return {
        "stats": {
            "interviews_completed": total_interviews,
            "average_ats_score": round(float(avg_ats), 1),
            "best_interview_score": round(float(best_score) * 10, 1) if best_score else 0,
            "total_reports": len(recent_reports)
        },
        "recent_activity": [
            {
                "id": i.id,
                "date": i.created_at.strftime("%b %d, %Y") if i.created_at else "",
                "job_role": i.job_role or "General Interview",
                "mode": i.mode,
                "ats_score": i.resume.ats_score if i.resume else None,
                "interview_score": round(float(i.overall_score) * 10, 1) if i.overall_score else None,
                "status": i.status
            }
            for i in recent_interviews
        ],
        "readiness_trend": [
            {
                "date": r.created_at.strftime("%b %d") if r.created_at else "",
                "score": r.overall_readiness
            }
            for r in reversed(recent_reports)
        ]
    }


@router.get("/performance")
async def get_performance_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Detailed performance analytics for /analytics page"""
    # All completed interviews
    interviews = (
        db.query(Interview)
        .filter(
            Interview.user_id == current_user.id,
            Interview.status == InterviewStatus.completed
        )
        .order_by(Interview.created_at.asc())
        .all()
    )

    # All reports
    reports = (
        db.query(Report)
        .filter(Report.user_id == current_user.id)
        .order_by(Report.created_at.asc())
        .all()
    )

    # All resumes
    resumes = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .all()
    )

    # All coding scores
    coding_scores = (
        db.query(CodingScore)
        .join(Interview)
        .filter(Interview.user_id == current_user.id)
        .all()
    )

    # Score over time chart data
    score_trend = [
        {
            "date": i.created_at.strftime("%b %d") if i.created_at else "",
            "interview_score": round(float(i.overall_score or 0) * 10, 1),
            "ats_score": i.resume.ats_score if i.resume else 0
        }
        for i in interviews
    ]

    # Skill gap analysis — aggregate missing skills across all ATS analyses
    missing_skills_count: dict = {}
    for resume in resumes:
        ats = resume.ats_details or {}
        for skill in ats.get("missing_skills", []):
            missing_skills_count[skill] = missing_skills_count.get(skill, 0) + 1

    weak_skills = sorted(
        [{"skill": k, "frequency": v} for k, v in missing_skills_count.items()],
        key=lambda x: x["frequency"],
        reverse=True
    )[:10]

    # Matched skills strength
    matched_skills_count: dict = {}
    for resume in resumes:
        ats = resume.ats_details or {}
        for skill in ats.get("matched_skills", []):
            matched_skills_count[skill] = matched_skills_count.get(skill, 0) + 1

    strong_skills = sorted(
        [{"skill": k, "score": min(100, v * 20)} for k, v in matched_skills_count.items()],
        key=lambda x: x["score"],
        reverse=True
    )[:10]

    # Interview history table (all)
    interview_history = [
        {
            "id": i.id,
            "date": i.created_at.strftime("%b %d, %Y") if i.created_at else "",
            "job_role": i.job_role or "General",
            "mode": i.mode,
            "interview_score": round(float(i.overall_score or 0) * 10, 1),
            "ats_score": i.resume.ats_score if i.resume else None,
            "status": i.status
        }
        for i in reversed(interviews)
    ]

    # Coding stats
    coding_stats = {
        "total_problems": len(coding_scores),
        "average_score": round(
            sum(c.score or 0 for c in coding_scores) / len(coding_scores), 1
        ) if coding_scores else 0,
        "languages_used": list(set(c.language for c in coding_scores if c.language)),
        "by_difficulty": {
            "easy": sum(1 for c in coding_scores if c.difficulty == "easy"),
            "medium": sum(1 for c in coding_scores if c.difficulty == "medium"),
            "hard": sum(1 for c in coding_scores if c.difficulty == "hard"),
        }
    }

    return {
        "score_trend": score_trend,
        "weak_skills": weak_skills,
        "strong_skills": strong_skills,
        "interview_history": interview_history,
        "coding_stats": coding_stats,
        "total_sessions": len(interviews),
        "avg_readiness": round(
            sum(r.overall_readiness or 0 for r in reports) / len(reports), 1
        ) if reports else 0
    }
