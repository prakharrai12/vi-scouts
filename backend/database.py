import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Check all Vercel/Lambda serverless indicators or if current dir is read-only
if os.environ.get("VERCEL") or os.environ.get("VERCEL_ENV") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME") or os.environ.get("LAMBDA_TASK_ROOT") or not os.access(".", os.W_OK):
    SQLALCHEMY_DATABASE_URL = "sqlite:////tmp/ai_interview.db"
else:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./ai_interview.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

_has_seeded = False

def ensure_schema_and_seed(db):
    global _has_seeded
    if _has_seeded:
        return
    try:
        from sqlalchemy import text
        try:
            import models
            import auth
        except ImportError:
            from backend import models
            from backend import auth

        Base.metadata.create_all(bind=engine)

        with engine.connect() as conn:
            try:
                conn.execute(text("ALTER TABLE sessions ADD COLUMN category VARCHAR DEFAULT 'General Technical & Architecture'"))
            except Exception:
                pass
            try:
                conn.execute(text("ALTER TABLE sessions ADD COLUMN questions TEXT DEFAULT '[]'"))
            except Exception:
                pass
            conn.commit()

        # Ensure demo account #1 exists
        demo1 = db.query(models.User).filter(models.User.email == "demo@vi-scouts.com").first()
        if not demo1:
            hashed1 = auth.get_password_hash("password123")
            demo1 = models.User(email="demo@vi-scouts.com", hashed_password=hashed1)
            db.add(demo1)

        # Ensure demo account #2 exists
        demo2 = db.query(models.User).filter(models.User.email == "candidate@vi-scouts.com").first()
        if not demo2:
            hashed2 = auth.get_password_hash("candidate123")
            demo2 = models.User(email="candidate@vi-scouts.com", hashed_password=hashed2)
            db.add(demo2)

        db.commit()
        _has_seeded = True
    except Exception as e:
        print(f"Schema auto-seed check: {e}")

def get_db():
    db = SessionLocal()
    try:
        ensure_schema_and_seed(db)
        yield db
    finally:
        db.close()
