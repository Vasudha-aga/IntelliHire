import httpx

# Piston API language mappings
PISTON_LANGUAGES = {
    "python": {"language": "python", "version": "3.10.0"},
    "java": {"language": "java", "version": "15.0.2"},
    "cpp": {"language": "c++", "version": "10.2.0"},
    "c": {"language": "c", "version": "10.2.0"},
    "javascript": {"language": "javascript", "version": "18.15.0"}
}

PISTON_URL = "https://emkc.org/api/v2/piston/execute"

async def execute_code(
    source_code: str,
    language: str,
    stdin: str = "",
    expected_output: str = ""
) -> dict:
    """Execute code using Piston API (Free, no auth required)"""
    lang_config = PISTON_LANGUAGES.get(language.lower(), PISTON_LANGUAGES["python"])
    
    payload = {
        "language": lang_config["language"],
        "version": "*", # Auto-select latest version
        "files": [
            {
                "content": source_code
            }
        ],
        "stdin": stdin,
        "run_timeout": 5000 # 5 seconds
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                PISTON_URL,
                json=payload,
                timeout=15.0
            )
            data = response.json()
            
            if response.status_code != 200:
                return {
                    "status": "Error",
                    "status_id": 4,
                    "stdout": "",
                    "stderr": data.get("message", "API Error"),
                    "compile_output": "",
                    "time": 0,
                    "memory": 0,
                    "exit_code": 1
                }

            run_result = data.get("run", {})
            compile_result = data.get("compile", {})
            
            # If compile failed, Piston returns code != 0 in compile object
            if compile_result and compile_result.get("code", 0) != 0:
                return {
                    "status": "Compilation Error",
                    "status_id": 4,
                    "stdout": "",
                    "stderr": "",
                    "compile_output": compile_result.get("stderr", ""),
                    "time": 0,
                    "memory": 0,
                    "exit_code": compile_result.get("code")
                }

            exit_code = run_result.get("code", 0)
            status_id = 3 if exit_code == 0 else 4 # 3 is Accepted, 4 is Error
            
            # In Piston, expected_output needs to be checked manually
            stdout = run_result.get("stdout", "")
            
            if expected_output and exit_code == 0:
                if stdout.strip() != expected_output.strip():
                    status_id = 4 # Wrong Answer

            return {
                "status": "Accepted" if status_id == 3 else "Wrong Answer" if exit_code == 0 else "Runtime Error",
                "status_id": status_id,
                "stdout": stdout,
                "stderr": run_result.get("stderr", ""),
                "compile_output": "",
                "time": 0.1, # Piston doesn't easily return execution time in seconds, mocking it for now
                "memory": 0,
                "exit_code": exit_code
            }

        except Exception as e:
            return {"status": "Timeout", "status_id": 0, "stdout": "", "stderr": str(e), "exit_code": 1}


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
        expected = tc.get("expected_output", "")
        result = await execute_code(
            source_code=source_code,
            language=language,
            stdin=tc.get("input", ""),
            expected_output=expected
        )

        is_passed = result["status_id"] == 3
        # Strict checking against expected output
        if is_passed and expected:
            is_passed = result["stdout"].strip() == expected.strip()
            
        if is_passed:
            passed += 1

        results.append({
            "test_case": i + 1,
            "passed": is_passed,
            "status": result["status"] if is_passed else ("Wrong Answer" if result["exit_code"] == 0 else "Runtime Error"),
            "input": tc.get("input", ""),
            "expected": expected,
            "actual": result["stdout"].strip(),
            "error": result["stderr"] or result["compile_output"],
            "runtime_ms": 100, # Mocked metric since Piston API doesn't return time
            "memory_kb": 1024 # Mocked metric
        })

    total = len(test_cases)
    score = round((passed / total * 100) if total > 0 else 0, 1)

    return {
        "test_cases_passed": passed,
        "test_cases_total": total,
        "score": score,
        "avg_runtime_ms": 100,
        "avg_memory_kb": 1024,
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
