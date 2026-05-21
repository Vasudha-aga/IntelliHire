import re
import pdfplumber
import spacy
from typing import Optional

# Load spaCy model (run: python -m spacy download en_core_web_lg)
try:
    nlp = spacy.load("en_core_web_lg")
except OSError:
    # Fallback to small model if large not available
    nlp = spacy.load("en_core_web_sm")


# ── Common tech skills vocabulary ──────────────────────────────
TECH_SKILLS = {
    "languages": [
        "python", "java", "javascript", "typescript", "c++", "c#", "c",
        "go", "rust", "kotlin", "swift", "ruby", "php", "scala", "r",
        "matlab", "sql", "html", "css", "bash", "shell"
    ],
    "frameworks": [
        "react", "next.js", "vue", "angular", "fastapi", "flask", "django",
        "spring", "express", "node.js", "tensorflow", "pytorch", "keras",
        "scikit-learn", "pandas", "numpy", "opencv", "mediapipe",
        "tailwind", "bootstrap", "graphql", "rest", "fastapi"
    ],
    "cloud_devops": [
        "aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "jenkins",
        "github actions", "terraform", "ansible", "linux", "nginx"
    ],
    "databases": [
        "postgresql", "mysql", "mongodb", "redis", "sqlite", "firebase",
        "cassandra", "elasticsearch", "dynamodb", "supabase"
    ],
    "ai_ml": [
        "machine learning", "deep learning", "nlp", "computer vision",
        "llm", "transformers", "bert", "gpt", "huggingface", "langchain",
        "rag", "vector database", "pinecone", "weaviate"
    ],
    "tools": [
        "git", "github", "postman", "jira", "figma", "vs code",
        "jupyter", "colab", "airflow", "spark", "kafka"
    ]
}

# Flatten all skills into one set for quick lookup
ALL_SKILLS = set()
for category_skills in TECH_SKILLS.values():
    ALL_SKILLS.update(category_skills)


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract raw text from PDF bytes"""
    import io
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()


def extract_skills_from_text(text: str) -> list[str]:
    """Extract technical skills from resume/JD text"""
    text_lower = text.lower()
    found_skills = []

    for skill in ALL_SKILLS:
        # Use word boundary matching
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.append(skill)

    return list(set(found_skills))


def extract_email(text: str) -> Optional[str]:
    pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    match = re.search(pattern, text)
    return match.group() if match else None


def extract_phone(text: str) -> Optional[str]:
    pattern = r'[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}'
    match = re.search(pattern, text)
    return match.group() if match else None


def extract_sections(text: str) -> dict:
    """Extract resume sections using regex + NLP"""
    sections = {
        "education": "",
        "experience": "",
        "skills": "",
        "projects": "",
        "certifications": "",
        "summary": ""
    }

    section_headers = {
        "education": r"(?i)(education|academic|qualification)",
        "experience": r"(?i)(experience|work history|employment|internship)",
        "skills": r"(?i)(skills|technical skills|core competencies|technologies)",
        "projects": r"(?i)(projects|personal projects|academic projects)",
        "certifications": r"(?i)(certifications|certificates|achievements|awards)",
        "summary": r"(?i)(summary|objective|profile|about)"
    }

    lines = text.split('\n')
    current_section = None
    section_content = {k: [] for k in sections}

    for line in lines:
        detected = False
        for section_name, pattern in section_headers.items():
            if re.search(pattern, line) and len(line.strip()) < 50:
                current_section = section_name
                detected = True
                break

        if not detected and current_section:
            section_content[current_section].append(line)

    for section_name, content_lines in section_content.items():
        sections[section_name] = '\n'.join(content_lines).strip()

    return sections


def extract_years_of_experience(text: str) -> int:
    """Estimate years of experience from text"""
    patterns = [
        r'(\d+)\+?\s*years?\s*of\s*experience',
        r'(\d+)\+?\s*years?\s*experience',
        r'experience\s*of\s*(\d+)\+?\s*years?',
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return int(match.group(1))
    return 0


def parse_resume(file_bytes: bytes) -> dict:
    """Main function to parse resume PDF and return structured data"""
    raw_text = extract_text_from_pdf(file_bytes)
    sections = extract_sections(raw_text)
    skills = extract_skills_from_text(raw_text)
    doc = nlp(raw_text[:5000])  # limit for performance

    # Extract named entities
    organizations = [ent.text for ent in doc.ents if ent.label_ == "ORG"]
    locations = [ent.text for ent in doc.ents if ent.label_ == "GPE"]

    return {
        "raw_text": raw_text,
        "email": extract_email(raw_text),
        "phone": extract_phone(raw_text),
        "skills": skills,
        "years_of_experience": extract_years_of_experience(raw_text),
        "organizations": list(set(organizations))[:10],
        "locations": list(set(locations))[:5],
        "sections": sections,
        "word_count": len(raw_text.split()),
        "has_projects": bool(sections.get("projects")),
        "has_certifications": bool(sections.get("certifications"))
    }


def parse_job_description(jd_text: str) -> dict:
    """Extract structured data from job description"""
    skills_required = extract_skills_from_text(jd_text)

    # Extract experience requirement
    exp_required = extract_years_of_experience(jd_text)

    # Extract important keywords (nouns and noun phrases)
    doc = nlp(jd_text[:3000])
    keywords = []
    for chunk in doc.noun_chunks:
        word = chunk.text.lower().strip()
        if 3 < len(word) < 40 and word not in ["we", "you", "our", "your", "the"]:
            keywords.append(word)

    return {
        "required_skills": skills_required,
        "experience_required": exp_required,
        "keywords": list(set(keywords))[:30],
        "word_count": len(jd_text.split())
    }
