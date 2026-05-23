# IntelliHire
A modern AI-powered interview and hiring intelligence platform for recruiters and talent teams.

## Product Summary
IntelliHire helps hiring teams move faster and smarter by automating candidate evaluation, resume screening, JD matching, interview readiness checks, and performance reports.

This repository contains a complete proof-of-concept platform with:
- AI resume parsing and ATS-style score generation
- Job description analysis and skills match scoring
- Interview workflows for text, voice, and video coaching
- Coding problem generation and execution support
- Candidate performance reports and recruiter dashboards

## Why IntelliHire?
Recruiters and hiring managers want tools that reduce manual review, surface top talent, and provide objective readiness signals. IntelliHire delivers:
- Faster resume screening with skill extraction and ATS insights
- Clear interview readiness scoring and feedback
- Data-driven candidate reports for hiring decisions
- A unified recruiter view for pipelines and analytics

## Core Capabilities
- Resume parsing with skill, experience, and section extraction
- Job description analysis for required skills and keywords
- Interview session management across text, voice, and video modes
- Automated coding challenge generation and scoring
- AI-driven post-interview reports and recommendations
- Candidate dashboard, analytics, and history tracking

## Project Structure
- `backend/` — FastAPI service for core business logic, APIs, resume parsing, interview workflows, and reporting
- `frontend/` — Next.js user interface for recruiters/candidates, dashboard, authentication, and session management
- `.gitignore` — repository ignore rules
- `frontend/.gitignore` — frontend-focused ignore rules

## Recruiter-Facing Value
- Use IntelliHire to accelerate screening of resumes and job descriptions
- Review candidate readiness through blended AI analytics and scorecards
- Generate polished reports that summarize candidate strengths and gaps
- Easily connect frontend UX with backend hiring intelligence APIs

## Setup Summary
This repo is intended for evaluation and demonstration. The install process includes a Python backend and a modern React-based frontend.

### Backend
1. Navigate to `backend/`
2. Create and activate the Python environment
3. Install dependencies from `requirements.txt`
4. Download required SpaCy language models
5. Configure `.env` from `.env.example`

### Frontend
1. Navigate to `frontend/`
2. Install dependencies with `pnpm install`
3. Configure `frontend/.env.local` with the API URL

## Run Locally
- Backend: `uvicorn main:app --reload --port 8000`
- Frontend: `pnpm dev`

Frontend UI is available at `http://localhost:3000` and backend API docs are available at `http://127.0.0.1:8000/docs`.

## Notes for Recruiters
- This is a working prototype built for demo purposes.
- The system is designed to support both recruiter workflows and candidate coaching.
- Credentials, API keys, and local environment files must remain private and are excluded from Git.

## Next Steps for Production
- Add secure deployment for backend and frontend
- Configure managed database and secret storage
- Implement authentication / authorization for real users
- Expand integration with ATS systems and HR tools

## Contribution
Pull requests are welcome. Please keep sensitive data out of source control and follow best practices for environment configuration.

---

*IntelliHire is a candidate assessment and hiring intelligence platform built to help recruiting teams evaluate talent faster, more consistently, and with better insights.*
