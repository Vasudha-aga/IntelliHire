from sqlalchemy import (Column, Integer, String, Float, Boolean,
    DateTime, Text, ForeignKey, JSON, Enum)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class InterviewMode(str, enum.Enum):
    text = "text"
    voice = "voice"
    video = "video"


class InterviewStatus(str, enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)
    google_id = Column(String(255), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    auth_provider = Column(String(50), default="local")  # local | google
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    resumes = relationship("Resume", back_populates="user", cascade="all, delete")
    interviews = relationship("Interview", back_populates="user", cascade="all, delete")
    reports = relationship("Report", back_populates="user", cascade="all, delete")


class Resume(Base):
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String(255))
    raw_text = Column(Text)
    parsed_data = Column(JSON)
    jd_text = Column(Text)
    ats_score = Column(Float)
    ats_details = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="resumes")
    interviews = relationship("Interview", back_populates="resume")


class Interview(Base):
    __tablename__ = "interviews"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=True)
    mode = Column(Enum(InterviewMode), default=InterviewMode.text)
    status = Column(Enum(InterviewStatus), default=InterviewStatus.pending)
    job_role = Column(String(255))
    difficulty = Column(String(50), default="medium")
    questions_answers = Column(JSON, default=list)
    overall_score = Column(Float)
    speech_metrics = Column(JSON)
    vision_metrics = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))

    user = relationship("User", back_populates="interviews")
    resume = relationship("Resume", back_populates="interviews")
    coding_scores = relationship("CodingScore", back_populates="interview", cascade="all, delete")
    report = relationship("Report", back_populates="interview", uselist=False)


class CodingScore(Base):
    __tablename__ = "coding_scores"
    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"), nullable=False)
    problem_title = Column(String(255))
    difficulty = Column(String(50))
    language = Column(String(50))
    user_code = Column(Text)
    test_cases_passed = Column(Integer, default=0)
    test_cases_total = Column(Integer, default=0)
    runtime_ms = Column(Float)
    memory_kb = Column(Float)
    score = Column(Float)
    feedback = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    interview = relationship("Interview", back_populates="coding_scores")


class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    interview_id = Column(Integer, ForeignKey("interviews.id"), nullable=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=True)
    job_role = Column(String(255))
    ats_score = Column(Float)
    interview_score = Column(Float)
    coding_score = Column(Float)
    overall_readiness = Column(Float)
    full_report = Column(JSON)
    recommendations = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="reports")
    interview = relationship("Interview", back_populates="report")
