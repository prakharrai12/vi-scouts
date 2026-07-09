from sqlalchemy.orm import Session
try:
    from database import SessionLocal, engine
    from models import Base, User
    from auth import get_password_hash
except ImportError:
    from backend.database import SessionLocal, engine
    from backend.models import Base, User
    from backend.auth import get_password_hash

Base.metadata.create_all(bind=engine)

def seed():
    """Seeds only the essential demo account without any mock sessions or dummy data."""
    db = SessionLocal()
    try:
        email = "demo@vi-scouts.com"
        user = db.query(User).filter(User.email == email).first()
        if not user:
            hashed_password = get_password_hash("password123")
            user = User(email=email, hashed_password=hashed_password)
            db.add(user)
            db.commit()
            print(f"Created clean demo account: {email}")
        else:
            print(f"Demo account already exists: {email}")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
