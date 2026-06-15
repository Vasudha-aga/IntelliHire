from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, CodingScore, Interview
from app.services.llm_service import generate_coding_question
from app.services.coding_engine import run_against_test_cases, calculate_code_quality_score

router = APIRouter(prefix="/api/coding", tags=["Coding"])


class GenerateQuestionRequest(BaseModel):
    source: str = "jd"               # "jd" or "company"
    jd_text: Optional[str] = ""
    company: Optional[str] = ""
    difficulty: str = "medium"       # easy | medium | hard
    language: str = "python"
    question_type: str = "random"    # random | pyq
    interview_id: Optional[int] = None


class SubmitCodeRequest(BaseModel):
    interview_id: Optional[int] = None
    problem_title: str
    difficulty: str
    language: str
    source_code: str
    test_cases: List[dict]           # [{"input": "...", "expected_output": "..."}]
    wrapper_code: Optional[str] = ""

class RunCodeRequest(BaseModel):
    language: str
    source_code: str
    stdin: str = ""
    wrapper_code: Optional[str] = ""


@router.post("/generate-question")
async def generate_question(
    data: GenerateQuestionRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate a coding question based on JD or company"""
    question = generate_coding_question(
        jd_text=data.jd_text or "",
        company=data.company or "",
        difficulty=data.difficulty,
        language=data.language,
        question_type=data.question_type
    )
    return question


@router.post("/run")
async def run_code(
    data: RunCodeRequest,
    current_user: User = Depends(get_current_user)
):
    """Quick run — execute code against a single stdin input"""
    from app.services.coding_engine import submit_code, get_submission_result
    
    # Append wrapper if provided for LeetCode style execution
    final_code = data.source_code
    if data.wrapper_code:
        final_code += "\n" + data.wrapper_code

    token = await submit_code(
        source_code=final_code,
        language=data.language,
        stdin=data.stdin
    )
    if not token:
        raise HTTPException(status_code=502, detail="Code execution service unavailable")
    result = await get_submission_result(token)
    return {
        "status": result["status"],
        "stdout": result["stdout"],
        "stderr": result["stderr"],
        "compile_output": result["compile_output"],
        "runtime_ms": round(float(result.get("time") or 0) * 1000, 2),
        "memory_kb": result.get("memory", 0)
    }


@router.post("/submit")
async def submit_code_endpoint(
    data: SubmitCodeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit code — run against all test cases and save score"""
    if not data.test_cases:
        raise HTTPException(status_code=400, detail="No test cases provided")

    # Append wrapper if provided for LeetCode style execution
    final_code = data.source_code
    if data.wrapper_code:
        final_code += "\n" + data.wrapper_code

    results = await run_against_test_cases(
        source_code=final_code,
        language=data.language,
        test_cases=data.test_cases
    )

    quality = calculate_code_quality_score(results)

    # Save to DB if interview_id provided
    if data.interview_id:
        interview = db.query(Interview).filter(
            Interview.id == data.interview_id,
            Interview.user_id == current_user.id
        ).first()
        if interview:
            coding_record = CodingScore(
                interview_id=data.interview_id,
                problem_title=data.problem_title,
                difficulty=data.difficulty,
                language=data.language,
                user_code=data.source_code,
                test_cases_passed=results["test_cases_passed"],
                test_cases_total=results["test_cases_total"],
                runtime_ms=results["avg_runtime_ms"],
                memory_kb=results["avg_memory_kb"],
                score=results["score"],
                feedback=quality["feedback"]
            )
            db.add(coding_record)
            db.commit()

    return {
        "test_results": results,
        "quality_assessment": quality,
        "score": results["score"]
    }


@router.get("/history")
async def get_coding_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all coding attempts for current user"""
    scores = (
        db.query(CodingScore)
        .join(Interview)
        .filter(Interview.user_id == current_user.id)
        .order_by(CodingScore.created_at.desc())
        .limit(20)
        .all()
    )
    return [
        {
            "id": s.id,
            "problem_title": s.problem_title,
            "difficulty": s.difficulty,
            "language": s.language,
            "score": s.score,
            "test_cases_passed": s.test_cases_passed,
            "test_cases_total": s.test_cases_total,
            "runtime_ms": s.runtime_ms,
            "created_at": s.created_at.isoformat() if s.created_at else None
        }
        for s in scores
    ]
