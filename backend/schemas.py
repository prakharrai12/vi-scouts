from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
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

class SessionResponse(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    feedbacks: List[FeedbackResponse] = []

    class Config:
        from_attributes = True
