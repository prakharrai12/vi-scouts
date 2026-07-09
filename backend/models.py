from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
try:
    from database import Base
except ImportError:
    from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    sessions = relationship("InterviewSession", back_populates="user")

class InterviewSession(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category = Column(String, default="General Technical & Architecture")
    questions = Column(Text, default="[]") # JSON list of dynamic AI assessment questions
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="sessions")
    feedbacks = relationship("Feedback", back_populates="session")

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    question = Column(String)
    answer = Column(Text)
    confidence_score = Column(Integer)
    communication_score = Column(Integer)
    strengths = Column(Text)
    weaknesses = Column(Text)
    tips = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("InterviewSession", back_populates="feedbacks")
