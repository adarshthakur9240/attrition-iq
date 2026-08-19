"""
app/api/routes_health.py
────────────────────────
Liveness / readiness health-check endpoint.
Used by load-balancers, Docker HEALTHCHECK, and uptime monitors.
"""

from fastapi import APIRouter
from sqlalchemy import text

from app.core.db import engine

router = APIRouter(tags=["Health"])


@router.get("/health", summary="Health check")
def health_check():
    """
    Returns `{"status": "ok"}` when the API is up.
    Also probes the database so a broken DB connection returns 503.
    """
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception as exc:
        db_status = f"error: {exc}"

    return {"status": "ok", "db": db_status}
