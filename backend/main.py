from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import create_tables
from app.api import auth, resume, interview, coding, report, analytics


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create DB tables
    create_tables()
    print("✅ Database tables created")
    yield
    # Shutdown cleanup (if needed)
    print("👋 IntelliHire shutting down")


app = FastAPI(
    title="IntelliHire API",
    description="AI-Powered Hiring Intelligence Platform Backend",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# ── Middlewares ─────────────────────────────────────────
app.add_middleware(GZipMiddleware, minimum_size=1000)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ─────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(interview.router)
app.include_router(coding.router)
app.include_router(report.router)
app.include_router(analytics.router)


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "app": "IntelliHire API", "version": "1.0.0"}


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy"}
