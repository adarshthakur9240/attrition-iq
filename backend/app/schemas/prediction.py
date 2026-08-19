"""
app/schemas/prediction.py
──────────────────────────
Pydantic models for the POST /predict/risk endpoint.

PredictionRequest  — all employee fields the model needs (all optional with
                     defaults so callers can send a partial profile)
ContributingFactor — a single feature + its global importance
PredictionResponse — risk_score, risk_label, top_contributing_factors
"""

from __future__ import annotations

from typing import Literal, Optional
from pydantic import BaseModel, Field, ConfigDict


# ---------------------------------------------------------------------------
# Request schema
# ---------------------------------------------------------------------------

class PredictionRequest(BaseModel):
    """
    Employee feature payload for risk prediction.

    All fields are optional and default to representative dataset values
    so the API is callable with partial information during prototyping.
    Numeric defaults are dataset medians; categorical defaults are the most
    common class.
    """
    model_config = ConfigDict(extra="ignore")

    # ── Demographics ───────────────────────────────────────────────────────
    age: Optional[int]   = Field(default=36,  ge=18, le=100,  description="Employee age")
    gender: Optional[str] = Field(default="Male",              description="Male | Female")

    # ── Job ────────────────────────────────────────────────────────────────
    department:    Optional[str] = Field(default="Research & Development")
    job_role:      Optional[str] = Field(default="Research Scientist")
    job_level:     Optional[int] = Field(default=2, ge=1, le=5)
    job_involvement: Optional[int] = Field(default=3, ge=1, le=4)
    job_satisfaction: Optional[int] = Field(default=3, ge=1, le=4)

    # ── Travel & location ──────────────────────────────────────────────────
    business_travel:    Optional[str] = Field(default="Travel_Rarely")
    distance_from_home: Optional[int] = Field(default=7, ge=0)

    # ── Education ──────────────────────────────────────────────────────────
    education:       Optional[int] = Field(default=3, ge=1, le=5)
    education_field: Optional[str] = Field(default="Life Sciences")

    # ── Compensation ───────────────────────────────────────────────────────
    daily_rate:           Optional[int] = Field(default=802,  gt=0)
    hourly_rate:          Optional[int] = Field(default=66,   gt=0)
    monthly_rate:         Optional[int] = Field(default=14236, gt=0)
    monthly_income:       Optional[int] = Field(default=5000, gt=0)
    percent_salary_hike:  Optional[int] = Field(default=14, ge=0, le=100)
    stock_option_level:   Optional[int] = Field(default=1, ge=0, le=3)

    # ── Satisfaction / ratings ─────────────────────────────────────────────
    environment_satisfaction:  Optional[int] = Field(default=3, ge=1, le=4)
    relationship_satisfaction: Optional[int] = Field(default=3, ge=1, le=4)
    work_life_balance:         Optional[int] = Field(default=3, ge=1, le=4)
    performance_rating:        Optional[int] = Field(default=3, ge=1, le=4)

    # ── Work history ───────────────────────────────────────────────────────
    num_companies_worked:        Optional[int] = Field(default=2, ge=0)
    total_working_years:         Optional[int] = Field(default=10, ge=0)
    years_at_company:            Optional[int] = Field(default=7,  ge=0)
    years_in_current_role:       Optional[int] = Field(default=4,  ge=0)
    years_since_last_promotion:  Optional[int] = Field(default=2,  ge=0)
    years_with_curr_manager:     Optional[int] = Field(default=4,  ge=0)
    training_times_last_year:    Optional[int] = Field(default=3,  ge=0)

    # ── Overtime & marital status ──────────────────────────────────────────
    over_time:      Optional[str] = Field(default="No",      description="Yes | No")
    marital_status: Optional[str] = Field(default="Married", description="Single | Married | Divorced")


# ---------------------------------------------------------------------------
# Response sub-models
# ---------------------------------------------------------------------------

class ContributingFactor(BaseModel):
    """A single feature and its global importance score."""
    feature:    str
    importance: float


class PredictionResponse(BaseModel):
    """Attrition risk prediction result."""
    risk_score: float = Field(
        description="Probability of attrition [0–1]",
        ge=0.0, le=1.0,
    )
    risk_label: Literal["Low", "Medium", "High"] = Field(
        description="Low (<30%), Medium (30–60%), High (≥60%)"
    )
    top_contributing_factors: list[ContributingFactor] = Field(
        description="Top-3 model features driving risk for this employee",
    )
