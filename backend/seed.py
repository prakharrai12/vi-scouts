from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User, InterviewSession, Feedback
from auth import get_password_hash
from datetime import datetime, timedelta

Base.metadata.create_all(bind=engine)

def seed():
    db = SessionLocal()
    
    dummy_users = [
        {"email": "demo@vi-scouts.com", "password": "password123"},
        {"email": "test@example.com", "password": "password123"},
        {"email": "candidate@vi-scouts.com", "password": "password123"}
    ]
    
    for u in dummy_users:
        user = db.query(User).filter(User.email == u["email"]).first()
        if not user:
            hashed_password = get_password_hash(u["password"])
            user = User(email=u["email"], hashed_password=hashed_password)
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"Created dummy user: {u['email']} / {u['password']}")
            
            # Seed some initial history for demo@vi-scouts.com and test@example.com so dashboard has data
            session1 = InterviewSession(user_id=user.id, created_at=datetime.utcnow() - timedelta(days=2))
            db.add(session1)
            db.commit()
            db.refresh(session1)
            
            fb1 = Feedback(
                session_id=session1.id,
                question="Tell me about a time you had to overcome a significant technical challenge.",
                answer="In my previous role, we faced a critical bottleneck where database queries took over 5 seconds under high load. I investigated using query execution plans, identified missing indexing and N+1 query problems in our ORM. By adding compound indexes and refactoring the ORM queries to eager loading, we reduced response times by 85% to under 300ms.",
                confidence_score=92,
                communication_score=88,
                strengths="Clear STAR structure (Situation, Task, Action, Result). Mentioned specific technical tools and quantifiable metrics.",
                weaknesses="Could briefly touch upon how the team communicated during the outage or high-load scenario.",
                tips="Always emphasize both technical precision and cross-functional team collaboration when discussing system optimizations."
            )
            db.add(fb1)
            db.commit()
        else:
            user.hashed_password = get_password_hash(u["password"])
            db.commit()
            print(f"Updated dummy user: {u['email']} / {u['password']}")
            
    db.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed()

