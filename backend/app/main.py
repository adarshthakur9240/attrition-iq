"""
app/main.py
────────────
FastAPI application entry-point.

Run locally:
    uvicorn app.main:app --reload

The app mounts two routers:
  • /          → root info + docs redirect
  • /health    → liveness + DB probe
  • /analytics → all 9 analytics view endpoints
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.api.routes_analytics import router as analytics_router
from app.api.routes_health import router as health_router
from app.api.routes_predict import router as predict_router

# ---------------------------------------------------------------------------
# Application instance
# ---------------------------------------------------------------------------
app = FastAPI(
    title="AttritionIQ API",
    description=(
        "REST API powering the AttritionIQ HR analytics dashboard. "
        "Exposes pre-built Postgres analytics views as typed JSON endpoints."
    ),
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# CORS — allow local servers, Vercel deployments, and custom production origins
# ---------------------------------------------------------------------------
import os

env_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "").split(",")
    if origin.strip()
]

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    *env_origins,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(health_router)
app.include_router(analytics_router)
app.include_router(predict_router)


# ---------------------------------------------------------------------------
# Root endpoint
# ---------------------------------------------------------------------------
@app.get("/", include_in_schema=False)
def root():
    """Redirect bare root requests to the interactive API docs."""
    return RedirectResponse(url="/docs")


@app.get("/info", tags=["Meta"], summary="API info")
def api_info():
    """Returns basic API metadata — useful for programmatic discovery."""
    return {
        "name": "AttritionIQ API",
        "version": "0.1.0",
        "docs": "/docs",
        "health": "/health",
        "analytics_endpoints": [
            "/analytics/overview",
            "/analytics/by-department",
            "/analytics/by-salary",
            "/analytics/by-overtime",
            "/analytics/by-satisfaction",
            "/analytics/by-worklife-balance",
            "/analytics/by-age-group",
            "/analytics/by-promotion-gap",
            "/analytics/high-risk-profiles",
        ],
        "prediction_endpoints": [
            "/predict/risk",
        ],
    }
