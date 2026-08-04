import json
from pydantic import BaseModel, Field, field_validator
try:
    from pydantic import EmailStr
    class _TestEmailSchema(BaseModel):
        email: EmailStr
except (ImportError, Exception):
    EmailStr = str

from typing import Optional, List, Any
from datetime import datetime

# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Interview Schemas
class AnswerRequest(BaseModel):
    question: str = Field(..., description="The interview question being answered")
    answer: str = Field(..., min_length=1, description="Candidate interview answer text")

    @field_validator("answer")
    @classmethod
    def sanitize_answer(cls, v: str) -> str:
        cleaned = v.trim() if hasattr(v, "trim") else v.strip()
        if not cleaned:
            raise ValueError("Candidate answer cannot be empty or whitespace only")
        return cleaned

class FeedbackResponse(BaseModel):
    id: int
    session_id: int
    question: str
    answer: str
    confidence_score: int
    communication_score: int
    strengths: str
    weaknesses: str
    tips: str
    created_at: datetime

    class Config:
        from_attributes = True

class SessionCreate(BaseModel):
    category: Optional[str] = "General Technical & Architecture"
    questions: Optional[List[str]] = None

class SessionResponse(BaseModel):
    id: int
    user_id: int
    category: Optional[str] = "General Technical & Architecture"
    questions: Optional[List[str]] = []
    created_at: datetime
    feedbacks: List[FeedbackResponse] = []

    @field_validator("questions", mode="before")
    @classmethod
    def parse_questions(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return []
        if isinstance(v, list):
            return v
        return []

    class Config:
        from_attributes = True
