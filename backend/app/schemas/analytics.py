"""
app/schemas/analytics.py
─────────────────────────
Pydantic response models for every analytics endpoint.

Each model mirrors exactly the columns returned by its corresponding
Postgres view, with the same snake_case names that SQLAlchemy hands back.
Using explicit models (rather than generic dicts) gives:
  • automatic OpenAPI / Swagger documentation
  • response validation on the way out
  • clear contract for frontend consumers
"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict


# Shared config: allow ORM-style attribute access and coerce numbers cleanly
_cfg = ConfigDict(from_attributes=True)


# ── 1. Overview ───────────────────────────────────────────────────────────────

class AttritionOverview(BaseModel):
    model_config = _cfg

    total_employees: int
    total_left: int
    attrition_rate_pct: float


# ── 2. By department ──────────────────────────────────────────────────────────

class AttritionByDepartment(BaseModel):
    model_config = _cfg

    department: str
    total_employees: int
    total_left: int
    attrition_rate_pct: float


# ── 3. By salary band ─────────────────────────────────────────────────────────

class AttritionBySalaryBand(BaseModel):
    model_config = _cfg

    salary_band: str
    band_order: int
    total_employees: int
    total_left: int
    attrition_rate_pct: float
    avg_monthly_income: float


# ── 4. By overtime ────────────────────────────────────────────────────────────

class AttritionByOvertime(BaseModel):
    model_config = _cfg

    over_time: str
    total_employees: int
    total_left: int
    attrition_rate_pct: float


# ── 5. By job satisfaction ────────────────────────────────────────────────────

class AttritionBySatisfaction(BaseModel):
    model_config = _cfg

    satisfaction_level: int
    satisfaction_label: str
    total_employees: int
    total_left: int
    attrition_rate_pct: float


# ── 6. By work-life balance ───────────────────────────────────────────────────

class AttritionByWorklifeBalance(BaseModel):
    model_config = _cfg

    wlb_level: int
    wlb_label: str
    total_employees: int
    total_left: int
    attrition_rate_pct: float


# ── 7. By age group ───────────────────────────────────────────────────────────

class AttritionByAgeGroup(BaseModel):
    model_config = _cfg

    age_group: str
    group_order: int
    total_employees: int
    total_left: int
    attrition_rate_pct: float
    avg_monthly_income: float


# ── 8. By promotion gap ───────────────────────────────────────────────────────

class AttritionByPromotionGap(BaseModel):
    model_config = _cfg

    promotion_gap_band: str
    band_order: int
    total_employees: int
    total_left: int
    attrition_rate_pct: float
    avg_years_since_promotion: float


# ── 9. High-risk profiles ─────────────────────────────────────────────────────

class HighRiskProfile(BaseModel):
    model_config = _cfg

    department: str
    job_role: str
    over_time: str
    cohort_size: int
    total_left: int
    attrition_rate_pct: float
    avg_monthly_income: float
    avg_years_since_promotion: float
    avg_job_satisfaction: float
    avg_work_life_balance: float
