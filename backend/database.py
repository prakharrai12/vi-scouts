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

def ensure_schema():
    from sqlalchemy import text
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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
