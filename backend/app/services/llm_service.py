import json
import re
from anthropic import Anthropic
from app.core.config import settings

client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
MODEL = "claude-sonnet-4-20250514"


def call_claude(prompt: str, system: str = "", max_tokens: int = 1500) -> str:
    """Base function to call Claude API"""
    messages = [{"role": "user", "content": prompt}]

    response = client.messages.create(
        model=MODEL,
        max_tokens=max_tokens,
        system=system or "You are an expert AI assistant for a hiring intelligence platform called IntelliHire.",
        messages=messages
    )
    return response.content[0].text


def parse_json_response(text: str) -> dict:
    """Safely parse JSON from LLM response"""
    # Remove markdown code blocks if present
    text = re.sub(r'```json\n?', '', text)
    text = re.sub(r'```\n?', '', text)
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to extract JSON object from text
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return json.loads(match.group())
        return {}


# ─────────────────────────────────────────────────
# RESUME IMPROVEMENT SUGGESTIONS
# ─────────────────────────────────────────────────
def generate_resume_suggestions(
    resume_text: str,
    jd_text: str,
    missing_skills: list
) -> dict:
    prompt = f"""
You are an expert resume coach and ATS optimization specialist.

RESUME TEXT:
{resume_text[:2000]}

JOB DESCRIPTION:
{jd_text[:1500]}

MISSING SKILLS: {', '.join(missing_skills[:10])}

Generate practical, specific resume improvement suggestions. Return ONLY valid JSON:
{{
    "wording_improvements": [
        {{
            "section": "Experience",
            "before": "original weak phrase from resume",
            "after": "improved professional version",
            "reason": "why this is better"
        }}
    ],
    "missing_keyword_suggestions": [
        {{
            "keyword": "keyword to add",
            "where_to_add": "which section",
            "example": "example sentence using this keyword"
        }}
    ],
    "structure_suggestions": [
        "specific structural improvement 1",
        "specific structural improvement 2"
    ],
    "project_improvements": [
        {{
            "before": "weak project description",
            "after": "strong STAR-format description"
        }}
    ],
    "overall_tips": [
        "tip 1",
        "tip 2",
        "tip 3"
    ]
}}

Make suggestions specific to THIS resume and THIS job description. Max 5 items per list.
"""
    response = call_claude(prompt)
    return parse_json_response(response)


# ─────────────────────────────────────────────────
# INTERVIEW QUESTION GENERATION
# ─────────────────────────────────────────────────
def generate_interview_question(
    resume_summary: str,
    jd_text: str,
    missing_skills: list,
    previous_qa: list,
    question_number: int,
    difficulty: str = "medium"
) -> dict:
    prev_context = ""
    if previous_qa:
        last = previous_qa[-1]
        prev_context = f"""
Previous Question: {last.get('question', '')}
Candidate's Answer: {last.get('answer', '')}
Answer Score: {last.get('score', 'N/A')}/10
"""

    prompt = f"""
You are an expert technical interviewer for the role described in the job description below.

RESUME SUMMARY:
{resume_summary[:800]}

JOB DESCRIPTION:
{jd_text[:800]}

MISSING SKILLS IN RESUME: {', '.join(missing_skills[:8])}

QUESTION NUMBER: {question_number} of 10
DIFFICULTY LEVEL: {difficulty}

{prev_context}

Generate the next interview question. Choose question type intelligently:
- Questions 1-3: Resume-based (about their actual projects/experience)  
- Questions 4-6: JD-based (about skills/technologies required)
- Questions 7-8: Missing skill probing (about gaps in their resume)
- Questions 9-10: Adaptive follow-up or scenario-based

Return ONLY valid JSON:
{{
    "question": "the full question text",
    "type": "resume_based | jd_based | missing_skill | follow_up | scenario",
    "difficulty": "easy | medium | hard",
    "topic": "topic this question covers",
    "expected_keywords": ["keyword1", "keyword2", "keyword3"],
    "hint_for_evaluation": "what a good answer should cover"
}}
"""
    response = call_claude(prompt)
    return parse_json_response(response)


# ─────────────────────────────────────────────────
# ANSWER EVALUATION
# ─────────────────────────────────────────────────
def evaluate_answer(
    question: str,
    user_answer: str,
    expected_keywords: list,
    hint_for_evaluation: str,
    interview_mode: str = "text"
) -> dict:
    prompt = f"""
You are an expert technical interviewer evaluating a candidate's answer.

QUESTION: {question}
CANDIDATE'S ANSWER: {user_answer}
EXPECTED KEYWORDS: {', '.join(expected_keywords)}
EVALUATION HINT: {hint_for_evaluation}
INTERVIEW MODE: {interview_mode}

Evaluate strictly and fairly. Return ONLY valid JSON:
{{
    "technical_score": <0-10, how technically correct/complete the answer is>,
    "clarity_score": <0-10, how clearly and concisely they communicated>,
    "depth_score": <0-10, how deep their understanding is>,
    "relevance_score": <0-10, how relevant the answer is to the question>,
    "overall_score": <0-10, weighted average>,
    "strengths": ["strength 1", "strength 2"],
    "improvements": ["what to improve 1", "what to improve 2"],
    "missed_points": ["important point they missed 1", "missed point 2"],
    "ideal_answer_summary": "2-3 sentence summary of what an ideal answer looks like",
    "follow_up_suggestion": "a good follow-up question based on their answer"
}}

Be honest - if the answer is poor, give low scores. If excellent, give high scores.
"""
    response = call_claude(prompt)
    return parse_json_response(response)


# ─────────────────────────────────────────────────
# CODING QUESTION GENERATION
# ─────────────────────────────────────────────────
def generate_coding_question(
    jd_text: str = "",
    company: str = "",
    difficulty: str = "medium",
    language: str = "python",
    question_type: str = "random"
) -> dict:
    context = f"Job Description: {jd_text[:500]}" if jd_text else f"Company: {company}"

    prompt = f"""
You are an expert coding interviewer. Generate a realistic coding interview question.

CONTEXT: {context}
DIFFICULTY: {difficulty}
PREFERRED LANGUAGE: {language}
QUESTION TYPE: {question_type} (random = any standard DSA topic, pyq = commonly asked)

Return ONLY valid JSON:
{{
    "title": "Problem Title",
    "difficulty": "{difficulty}",
    "topic": "Arrays | Strings | Trees | DP | Graphs | etc",
    "problem_statement": "Full clear problem description with examples",
    "examples": [
        {{
            "input": "example input",
            "output": "expected output",
            "explanation": "why this is the output"
        }},
        {{
            "input": "example input 2",
            "output": "expected output 2",
            "explanation": "explanation"
        }}
    ],
    "constraints": [
        "1 <= n <= 10^5",
        "other constraints"
    ],
    "hints": [
        "hint 1 (subtle)",
        "hint 2 (more specific)"
    ],
    "starter_code": {{
        "python": "def solution(...):\\n    # Write your solution here\\n    pass",
        "java": "class Solution {{\\n    public ... solution(...) {{\\n        // Write here\\n    }}\\n}}",
        "cpp": "class Solution {{\\npublic:\\n    ... solution(...) {{\\n        // Write here\\n    }}\\n}};",
        "c": "// Write your solution here"
    }},
    "test_cases": [
        {{"input": "test input 1", "expected_output": "output 1"}},
        {{"input": "test input 2", "expected_output": "output 2"}},
        {{"input": "edge case input", "expected_output": "edge output"}}
    ],
    "optimal_complexity": {{
        "time": "O(n log n)",
        "space": "O(n)"
    }}
}}
"""
    response = call_claude(prompt, max_tokens=2000)
    return parse_json_response(response)


# ─────────────────────────────────────────────────
# FINAL REPORT GENERATION
# ─────────────────────────────────────────────────
def generate_final_report(
    user_name: str,
    job_role: str,
    ats_data: dict,
    interview_qa: list,
    speech_metrics: dict,
    vision_metrics: dict,
    coding_scores: list
) -> dict:
    interview_summary = ""
    if interview_qa:
        scores = [qa.get("score", 0) for qa in interview_qa if qa.get("score")]
        avg_score = sum(scores) / len(scores) if scores else 0
        interview_summary = f"Average answer score: {avg_score:.1f}/10 across {len(interview_qa)} questions"

    coding_summary = ""
    if coding_scores:
        avg_coding = sum(s.get("score", 0) for s in coding_scores) / len(coding_scores)
        coding_summary = f"Coding score: {avg_coding:.1f}%, {len(coding_scores)} problems attempted"

    prompt = f"""
You are generating a comprehensive interview readiness report for IntelliHire.

CANDIDATE: {user_name}
TARGET ROLE: {job_role}

ATS SCORE: {ats_data.get('ats_score', 0)}%
MATCHED SKILLS: {', '.join(ats_data.get('matched_skills', [])[:8])}
MISSING SKILLS: {', '.join(ats_data.get('missing_skills', [])[:8])}

INTERVIEW SUMMARY: {interview_summary}
SPEECH METRICS: {speech_metrics}
VISION METRICS: {vision_metrics}

CODING SUMMARY: {coding_summary}

Generate a comprehensive report. Return ONLY valid JSON:
{{
    "overall_readiness_score": <0-100, weighted composite score>,
    "readiness_label": "Not Ready | Needs Improvement | Almost Ready | Interview Ready | Exceptional",
    "executive_summary": "3-4 sentence overall assessment",
    "score_breakdown": {{
        "resume_score": <0-100>,
        "interview_score": <0-100>,
        "communication_score": <0-100>,
        "coding_score": <0-100>
    }},
    "strengths": [
        "strength 1 with specific detail",
        "strength 2",
        "strength 3"
    ],
    "areas_for_improvement": [
        "area 1 with specific advice",
        "area 2",
        "area 3"
    ],
    "personalized_recommendations": [
        {{
            "priority": "High | Medium | Low",
            "action": "specific action to take",
            "resource": "suggested resource or approach",
            "timeline": "1 week | 2 weeks | 1 month"
        }}
    ],
    "next_steps": [
        "immediate action 1",
        "immediate action 2",
        "immediate action 3"
    ]
}}
"""
    response = call_claude(prompt, max_tokens=2000)
    return parse_json_response(response)
