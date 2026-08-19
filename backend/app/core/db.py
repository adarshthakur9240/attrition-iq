"""
app/core/db.py
──────────────
SQLAlchemy async-compatible engine and session factory.
DATABASE_URL is read from the .env file (or environment variables).

Usage (sync, e.g. in scripts):
    from app.core.db import engine, get_session
    with get_session() as session:
        ...

Usage (FastAPI dependency):
    from app.core.db import get_db
    @router.get("/")
    def read(db: Session = Depends(get_db)): ...
"""

from contextlib import contextmanager
from typing import Generator

from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.settings import settings


# ---------------------------------------------------------------------------
# Engine
# ---------------------------------------------------------------------------
engine = create_engine(
    settings.DATABASE_URL,
    # Keep a small pool – fine for a dev/data-science workload
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,   # detect stale connections automatically
    echo=False,           # set to True to log all SQL statements
)


# ---------------------------------------------------------------------------
# Session factory
# ---------------------------------------------------------------------------
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


# ---------------------------------------------------------------------------
# Base class for ORM models
# ---------------------------------------------------------------------------
class Base(DeclarativeBase):
    pass


# ---------------------------------------------------------------------------
# Context-manager helper (scripts / one-off use)
# ---------------------------------------------------------------------------
@contextmanager
def get_session() -> Generator[Session, None, None]:
    """Yield a session and guarantee cleanup."""
    session: Session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


# ---------------------------------------------------------------------------
# FastAPI dependency (request-scoped)
# ---------------------------------------------------------------------------
def get_db() -> Generator[Session, None, None]:
    """Dependency for FastAPI route handlers."""
    db: Session = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Quick connectivity check
# ---------------------------------------------------------------------------
def ping() -> bool:
    """Return True if the database is reachable."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
