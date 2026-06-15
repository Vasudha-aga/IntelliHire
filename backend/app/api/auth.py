from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
import httpx

from app.core.database import get_db
from app.core.security import (
    get_password_hash, verify_password,
    create_access_token, get_current_user
)
from app.core.config import settings
from app.models.models import User

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


class SignupRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/signup")
async def signup(data: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        full_name=data.full_name,
        email=data.email,
        hashed_password=get_password_hash(data.password),
        auth_provider="local"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer",
            "user": {"id": user.id, "full_name": user.full_name, "email": user.email}}


@router.post("/login")
async def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if user.auth_provider and user.auth_provider != "local":
        raise HTTPException(status_code=400, detail=f"Please login with {user.auth_provider}")
    if not verify_password(data.password, user.hashed_password or ""):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account deactivated")
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer",
            "user": {"id": user.id, "full_name": user.full_name, "email": user.email}}


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "avatar_url": current_user.avatar_url,
        "auth_provider": current_user.auth_provider,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None
    }


@router.post("/logout")
async def logout():
    return {"message": "Logged out successfully"}


@router.get("/google")
async def google_login():
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=501, detail="Google OAuth not configured. Add GOOGLE_CLIENT_ID to .env")
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={settings.GOOGLE_CLIENT_ID}"
        f"&redirect_uri={settings.GOOGLE_REDIRECT_URI}"
        "&response_type=code"
        "&scope=openid email profile"
        "&access_type=offline"
    )
    return RedirectResponse(url=google_auth_url)


@router.get("/google/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=501, detail="Google OAuth not configured")
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            }
        )
        token_data = token_resp.json()
        g_access_token = token_data.get("access_token")
        if not g_access_token:
            raise HTTPException(status_code=400, detail="Google token exchange failed")
        user_resp = await client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {g_access_token}"}
        )
        user_info = user_resp.json()

    email = user_info.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Could not get email from Google")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            full_name=user_info.get("name", ""),
            email=email,
            google_id=user_info.get("sub"),
            avatar_url=user_info.get("picture", ""),
            auth_provider="google",
            hashed_password=None
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user.google_id = user_info.get("sub")
        user.avatar_url = user_info.get("picture", "")
        db.commit()

    jwt_token = create_access_token({"sub": str(user.id)})
    return RedirectResponse(url=f"{settings.FRONTEND_URL}/auth/callback?token={jwt_token}")


@router.get("/github")
async def github_login():
    if not settings.GITHUB_CLIENT_ID:
        raise HTTPException(status_code=501, detail="GitHub OAuth not configured")
    github_auth_url = (
        "https://github.com/login/oauth/authorize"
        f"?client_id={settings.GITHUB_CLIENT_ID}"
        f"&redirect_uri={settings.GITHUB_REDIRECT_URI}"
        "&scope=read:user user:email"
    )
    return RedirectResponse(url=github_auth_url)


@router.get("/github/callback")
async def github_callback(code: str, db: Session = Depends(get_db)):
    if not settings.GITHUB_CLIENT_ID:
        raise HTTPException(status_code=501, detail="GitHub OAuth not configured")
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": settings.GITHUB_REDIRECT_URI,
            },
            headers={"Accept": "application/json"}
        )
        token_data = token_resp.json()
        gh_access_token = token_data.get("access_token")
        if not gh_access_token:
            raise HTTPException(status_code=400, detail="GitHub token exchange failed")
            
        user_resp = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {gh_access_token}"}
        )
        user_info = user_resp.json()
        
        email_resp = await client.get(
            "https://api.github.com/user/emails",
            headers={"Authorization": f"Bearer {gh_access_token}"}
        )
        emails = email_resp.json()

    # Get primary email
    primary_email = next((e["email"] for e in emails if e.get("primary")), None)
    if not primary_email and emails:
        primary_email = emails[0]["email"]
        
    if not primary_email:
        raise HTTPException(status_code=400, detail="Could not get email from GitHub")

    user = db.query(User).filter(User.email == primary_email).first()
    if not user:
        user = User(
            full_name=user_info.get("name") or user_info.get("login", ""),
            email=primary_email,
            github_id=str(user_info.get("id")),
            avatar_url=user_info.get("avatar_url", ""),
            auth_provider="github",
            hashed_password=None
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user.github_id = str(user_info.get("id"))
        if not user.avatar_url:
            user.avatar_url = user_info.get("avatar_url", "")
        db.commit()

    jwt_token = create_access_token({"sub": str(user.id)})
    return RedirectResponse(url=f"{settings.FRONTEND_URL}/auth/callback?token={jwt_token}")

