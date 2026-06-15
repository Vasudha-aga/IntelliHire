from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "IntelliHire"
    DEBUG: bool = True
    FRONTEND_URL: str = "http://localhost:3000"

    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/intellihire"

    SECRET_KEY: str = "change-this-secret-key-in-production-minimum-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/auth/google/callback"

    GITHUB_CLIENT_ID: Optional[str] = None
    GITHUB_CLIENT_SECRET: Optional[str] = None
    GITHUB_REDIRECT_URI: str = "http://localhost:8000/api/auth/github/callback"

    ANTHROPIC_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None

    JUDGE0_API_KEY: Optional[str] = None
    JUDGE0_URL: str = "https://judge0-ce.p.rapidapi.com"

    REDIS_URL: str = "redis://localhost:6379"

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


settings = Settings()
