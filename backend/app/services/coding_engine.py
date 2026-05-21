import httpx
import asyncio
import base64
from app.core.config import settings

# Judge0 language IDs
LANGUAGE_IDS = {
    "python": 71,
    "java": 62,
    "cpp": 54,
    "c": 50,
    "javascript": 63
}

JUDGE0_HEADERS = {
    "X-RapidAPI-Key": settings.JUDGE0_API_KEY or "",
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    "Content-Type": "application/json"
}


async def submit_code(
    source_code: str,
    language: str,
    stdin: str = "",
    expected_output: str = ""
) -> dict:
    """Submit code to Judge0 and get submission token"""
    language_id = LANGUAGE_IDS.get(language.lower(), 71)

    payload = {
        "source_code": base64.b64encode(source_code.encode()).decode(),
        "language_id": language_id,
        "stdin": base64.b64encode(stdin.encode()).decode() if stdin else "",
        "expected_output": base64.b64encode(
            expected_output.encode()
        ).decode() if expected_output else "",
        "base64_encoded": True,
        "wait": False
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.JUDGE0_URL}/submissions",
            headers=JUDGE0_HEADERS,
            json=payload,
            timeout=30
        )
        data = response.json()
        return data.get("token", "")


async def get_submission_result(token: str, max_retries: int = 10) -> dict:
    """Poll Judge0 for submission result"""
    async with httpx.AsyncClient() as client:
        for attempt in range(max_retries):
            response = await client.get(
                f"{settings.JUDGE0_URL}/submissions/{token}",
                headers=JUDGE0_HEADERS,
                params={"base64_encoded": "true", "fields": "*"},
                timeout=30
            )
            data = response.json()

            status_id = data.get("status", {}).get("id", 0)

            # Status IDs: 1=In Queue, 2=Processing, 3=Accepted, 4+=Error
            if status_id in [1, 2]:
                await asyncio.sleep(1)
                continue

            # Decode base64 outputs
            def decode_b64(val):
                if val:
                    try:
                        return base64.b64decode(val).decode("utf-8", errors="replace")
                    except Exception:
                        return val
                return ""

            return {
                "status": data.get("status", {}).get("description", "Unknown"),
                "status_id": status_id,
                "stdout": decode_b64(data.get("stdout")),
                "stderr": decode_b64(data.get("stderr")),
                "compile_output": decode_b64(data.get("compile_output")),
                "time": data.get("time"),           # execution time in seconds
                "memory": data.get("memory"),        # memory in KB
                "exit_code": data.get("exit_code")
            }

    return {"status": "Timeout", "status_id": 0, "stdout": "", "stderr": "Execution timed out"}


async def run_against_test_cases(
    source_code: str,
    language: str,
    test_cases: list
) -> dict:
    """
    Run code against multiple test cases
    test_cases: [{"input": "...", "expected_output": "..."}]
    """
    results = []
    passed = 0

    for i, tc in enumerate(test_cases):
        token = await submit_code(
            source_code=source_code,
            language=language,
            stdin=tc.get("input", ""),
            expected_output=tc.get("expected_output", "")
        )

        if not token:
            results.append({
                "test_case": i + 1,
                "passed": False,
                "error": "Submission failed",
                "input": tc.get("input", ""),
                "expected": tc.get("expected_output", ""),
                "actual": ""
            })
            continue

        result = await get_submission_result(token)

        is_passed = result["status_id"] == 3  # Accepted
        if is_passed:
            passed += 1

        results.append({
            "test_case": i + 1,
            "passed": is_passed,
            "status": result["status"],
            "input": tc.get("input", ""),
            "expected": tc.get("expected_output", ""),
            "actual": result["stdout"].strip(),
            "error": result["stderr"] or result["compile_output"],
            "runtime_ms": round(float(result["time"] or 0) * 1000, 2),
            "memory_kb": result["memory"] or 0
        })

    total = len(test_cases)
    score = round((passed / total * 100) if total > 0 else 0, 1)

    # Average runtime from passed tests
    passed_results = [r for r in results if r["passed"]]
    avg_runtime = (
        sum(r["runtime_ms"] for r in passed_results) / len(passed_results)
        if passed_results else 0
    )
    avg_memory = (
        sum(r["memory_kb"] for r in passed_results) / len(passed_results)
        if passed_results else 0
    )

    return {
        "test_cases_passed": passed,
        "test_cases_total": total,
        "score": score,
        "avg_runtime_ms": round(avg_runtime, 2),
        "avg_memory_kb": round(avg_memory, 2),
        "results": results,
        "all_passed": passed == total
    }


def calculate_code_quality_score(
    test_result: dict,
    has_compile_error: bool = False
) -> dict:
    """Generate code quality assessment"""
    if has_compile_error:
        return {
            "score": 0,
            "label": "Compilation Error",
            "feedback": "Code has syntax errors and could not be compiled."
        }

    score = test_result["score"]

    if score == 100:
        label = "Excellent"
        feedback = "All test cases passed! Great solution."
    elif score >= 80:
        label = "Good"
        feedback = f"{test_result['test_cases_passed']}/{test_result['test_cases_total']} test cases passed. Minor edge cases missed."
    elif score >= 60:
        label = "Average"
        feedback = f"{test_result['test_cases_passed']}/{test_result['test_cases_total']} test cases passed. Logic needs improvement."
    elif score >= 40:
        label = "Below Average"
        feedback = "Partial solution. Core logic has issues."
    else:
        label = "Needs Work"
        feedback = "Most test cases failed. Review the problem and approach."

    return {
        "score": score,
        "label": label,
        "feedback": feedback,
        "runtime_ms": test_result["avg_runtime_ms"],
        "memory_kb": test_result["avg_memory_kb"]
    }
