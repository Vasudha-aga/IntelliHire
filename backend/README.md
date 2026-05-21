# IntelliHire Backend — Setup Guide

## ⚡ Quick Start (Local Development)

### Step 1 — Clone & Setup Environment
```bash
cd intellihire-backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python -m spacy download en_core_web_lg
```

### Step 2 — Configure Environment
```bash
cp .env.example .env
# Open .env and fill in your values (see below)
```

### Step 3 — Setup Database
- Go to https://supabase.com → Create free project
- Copy the Database URI from Project Settings → Database
- Paste it as DATABASE_URL in .env

### Step 4 — Run Server
```bash
uvicorn main:app --reload --port 8000
```

### Step 5 — Test API
- Swagger docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

---

## 🔑 API Keys You Need

| Service | Where to Get | Required? |
|---------|-------------|-----------|
| Supabase (PostgreSQL) | supabase.com | ✅ Yes |
| Anthropic (Claude) | console.anthropic.com | ✅ Yes |
| Google OAuth | console.cloud.google.com | For Google login |
| Judge0 (Coding) | rapidapi.com/judge0-official | For coding round |

---

## 🔗 Google OAuth Setup
1. Go to https://console.cloud.google.com
2. Create new project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Add Authorized redirect URI: `http://localhost:8000/api/auth/google/callback`
5. Copy Client ID & Secret to .env

---

## 🌐 Frontend Integration

### Install axios in your frontend
```bash
cd intellihire-frontend
npm install axios
```

### Copy these files to your frontend
```
lib/api.ts           → frontend/lib/api.ts
hooks/useAuth.ts     → frontend/hooks/useAuth.ts
app/auth/callback/page.tsx → frontend/app/auth/callback/page.tsx
```

### Add to frontend .env.local
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📡 Complete API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register new user |
| POST | /api/auth/login | Login, get JWT token |
| GET | /api/auth/me | Get current user info |
| GET | /api/auth/google | Redirect to Google OAuth |
| GET | /api/auth/google/callback | Google OAuth callback |

### Resume
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/resume/upload-and-analyze | Upload PDF + JD → ATS analysis |
| GET | /api/resume/history | All user resumes |
| GET | /api/resume/{id} | Single resume details |

### Interview
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/interview/start | Start new session, get Q1 |
| POST | /api/interview/answer/text | Submit text answer |
| POST | /api/interview/answer/voice | Submit voice audio |
| POST | /api/interview/analyze-frame | Analyze webcam frame |
| POST | /api/interview/end | End session |
| GET | /api/interview/history | All interviews |

### Coding
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/coding/generate-question | Generate coding problem |
| POST | /api/coding/run | Quick run code |
| POST | /api/coding/submit | Submit against test cases |
| GET | /api/coding/history | All coding attempts |

### Report
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/report/generate | Generate final AI report |
| GET | /api/report/{id} | Get specific report |
| GET | /api/report/ | List all reports |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/analytics/dashboard | Dashboard stats |
| GET | /api/analytics/performance | Full performance data |

---

## 🚀 Deployment (Render.com — Free)

1. Push backend to GitHub
2. Go to render.com → New → Web Service
3. Connect your GitHub repo
4. Build command: `pip install -r requirements.txt && python -m spacy download en_core_web_lg`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add all environment variables from .env

### Update for production:
- `FRONTEND_URL` → your Vercel URL
- `GOOGLE_REDIRECT_URI` → `https://your-api.onrender.com/api/auth/google/callback`
- `DEBUG=False`
