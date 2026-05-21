from sentence_transformers import SentenceTransformer, util
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from app.services.nlp_engine import extract_skills_from_text, parse_job_description

# Load once at startup
model = SentenceTransformer('all-MiniLM-L6-v2')


def calculate_skills_match(resume_skills: list, jd_skills: list) -> dict:
    """Calculate skills overlap between resume and JD"""
    resume_set = set(s.lower() for s in resume_skills)
    jd_set = set(s.lower() for s in jd_skills)

    matched = resume_set & jd_set
    missing = jd_set - resume_set

    match_percentage = (len(matched) / len(jd_set) * 100) if jd_set else 0

    return {
        "matched_skills": list(matched),
        "missing_skills": list(missing),
        "match_percentage": round(match_percentage, 1),
        "total_required": len(jd_set),
        "total_matched": len(matched)
    }


def calculate_semantic_similarity(resume_text: str, jd_text: str) -> float:
    """Semantic similarity using Sentence Transformers"""
    resume_embedding = model.encode(resume_text[:1000], convert_to_tensor=True)
    jd_embedding = model.encode(jd_text[:1000], convert_to_tensor=True)
    similarity = util.cos_sim(resume_embedding, jd_embedding)
    return float(similarity[0][0]) * 100


def calculate_keyword_match(resume_text: str, jd_text: str) -> float:
    """TF-IDF based keyword matching score"""
    try:
        vectorizer = TfidfVectorizer(stop_words='english', max_features=100)
        tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
        return float(similarity[0][0]) * 100
    except Exception:
        return 0.0


def assess_resume_quality(parsed_resume: dict) -> float:
    """Score resume quality based on structure and content"""
    score = 0
    sections = parsed_resume.get("sections", {})

    # Check important sections
    if sections.get("experience"):
        score += 25
    if sections.get("education"):
        score += 20
    if sections.get("skills"):
        score += 20
    if sections.get("projects"):
        score += 20
    if sections.get("summary"):
        score += 10

    # Word count check (ideal: 400-800 words)
    word_count = parsed_resume.get("word_count", 0)
    if 400 <= word_count <= 800:
        score += 5

    # Has certifications
    if parsed_resume.get("has_certifications"):
        score += 5 if score < 100 else 0

    return min(score, 100)


def calculate_project_relevance(parsed_resume: dict, jd_text: str) -> float:
    """Check if resume projects align with JD requirements"""
    projects_text = parsed_resume.get("sections", {}).get("projects", "")
    if not projects_text:
        return 30.0  # Base score if no projects section

    return calculate_semantic_similarity(projects_text, jd_text)


def calculate_shortlisting_probability(ats_score: float) -> dict:
    """Predict shortlisting probability based on ATS score"""
    if ats_score >= 80:
        return {
            "label": "High",
            "color": "green",
            "percentage": round(ats_score * 0.95, 1),
            "message": "Strong match! Very likely to be shortlisted."
        }
    elif ats_score >= 60:
        return {
            "label": "Medium",
            "color": "amber",
            "percentage": round(ats_score * 0.85, 1),
            "message": "Decent match. With improvements, shortlisting chances increase significantly."
        }
    else:
        return {
            "label": "Low",
            "color": "red",
            "percentage": round(ats_score * 0.7, 1),
            "message": "Resume needs significant improvement to match this job description."
        }


def run_ats_analysis(parsed_resume: dict, jd_text: str) -> dict:
    """
    Main ATS Analysis function
    Weights:
      Skills Match        → 40%
      Project Relevance   → 25%
      Keyword Match       → 15%
      Resume Quality      → 10%
      Technical Alignment → 10%
    """
    resume_text = parsed_resume.get("raw_text", "")
    resume_skills = parsed_resume.get("skills", [])

    # Parse JD
    jd_parsed = parse_job_description(jd_text)
    jd_skills = jd_parsed.get("required_skills", [])

    # Calculate individual scores
    skills_data = calculate_skills_match(resume_skills, jd_skills)
    skills_score = skills_data["match_percentage"]

    project_score = calculate_project_relevance(parsed_resume, jd_text)
    keyword_score = calculate_keyword_match(resume_text, jd_text)
    quality_score = assess_resume_quality(parsed_resume)
    semantic_score = calculate_semantic_similarity(resume_text, jd_text)

    # Weighted ATS score
    ats_score = (
        skills_score      * 0.40 +
        project_score     * 0.25 +
        keyword_score     * 0.15 +
        quality_score     * 0.10 +
        semantic_score    * 0.10
    )
    ats_score = round(min(ats_score, 100), 1)

    shortlisting = calculate_shortlisting_probability(ats_score)

    return {
        "ats_score": ats_score,
        "score_breakdown": {
            "skills_match": round(skills_score, 1),
            "project_relevance": round(project_score, 1),
            "keyword_match": round(keyword_score, 1),
            "resume_quality": round(quality_score, 1),
            "technical_alignment": round(semantic_score, 1)
        },
        "matched_skills": skills_data["matched_skills"],
        "missing_skills": skills_data["missing_skills"],
        "total_skills_required": skills_data["total_required"],
        "total_skills_matched": skills_data["total_matched"],
        "shortlisting_probability": shortlisting,
        "jd_keywords": jd_parsed.get("keywords", [])[:15]
    }
