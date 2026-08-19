"""
app/api/routes_analytics.py
────────────────────────────
One GET endpoint per analytics view.

Each handler:
  1. Calls the matching function in analytics_service.py
  2. Returns the result validated against the Pydantic response model
     (FastAPI serialises the list of dicts transparently via response_model)
"""

from __future__ import annotations

from fastapi import APIRouter

from app.schemas.analytics import (
    AttritionByAgeGroup,
    AttritionByDepartment,
    AttritionByOvertime,
    AttritionByPromotionGap,
    AttritionBySalaryBand,
    AttritionBySatisfaction,
    AttritionByWorklifeBalance,
    AttritionOverview,
    HighRiskProfile,
)
from app.services.analytics_service import (
    get_attrition_by_age_group,
    get_attrition_by_department,
    get_attrition_by_overtime,
    get_attrition_by_promotion_gap,
    get_attrition_by_salary_band,
    get_attrition_by_satisfaction,
    get_attrition_by_worklife_balance,
    get_attrition_overview,
    get_high_risk_profiles,
)

router = APIRouter(prefix="/analytics", tags=["Analytics"])


# ── 1. Overview ───────────────────────────────────────────────────────────────

@router.get(
    "/overview",
    response_model=list[AttritionOverview],
    summary="Overall attrition KPIs",
    description=(
        "Returns a single-row summary with total headcount, total leavers "
        "and the overall attrition rate. Powers the top-level KPI card."
    ),
)
def overview():
    return get_attrition_overview()


# ── 2. By department ──────────────────────────────────────────────────────────

@router.get(
    "/by-department",
    response_model=list[AttritionByDepartment],
    summary="Attrition breakdown by department",
    description=(
        "Attrition % per department, sorted highest-to-lowest. "
        "Identifies which teams bleed talent the most."
    ),
)
def by_department():
    return get_attrition_by_department()


# ── 3. By salary band ─────────────────────────────────────────────────────────

@router.get(
    "/by-salary",
    response_model=list[AttritionBySalaryBand],
    summary="Attrition breakdown by salary band",
    description=(
        "Buckets MonthlyIncome into Low / Mid / Upper-Mid / High and shows "
        "attrition rate per band. Reveals whether pay drives turnover."
    ),
)
def by_salary():
    return get_attrition_by_salary_band()


# ── 4. By overtime ────────────────────────────────────────────────────────────

@router.get(
    "/by-overtime",
    response_model=list[AttritionByOvertime],
    summary="Attrition split by overtime",
    description=(
        "Two-row comparison of attrition % for employees who do/don't work "
        "overtime — one of the strongest predictors in the dataset."
    ),
)
def by_overtime():
    return get_attrition_by_overtime()


# ── 5. By job satisfaction ────────────────────────────────────────────────────

@router.get(
    "/by-satisfaction",
    response_model=list[AttritionBySatisfaction],
    summary="Attrition by job satisfaction level",
    description=(
        "Shows attrition rate at each of the four satisfaction levels "
        "(Low / Medium / High / Very High)."
    ),
)
def by_satisfaction():
    return get_attrition_by_satisfaction()


# ── 6. By work-life balance ───────────────────────────────────────────────────

@router.get(
    "/by-worklife-balance",
    response_model=list[AttritionByWorklifeBalance],
    summary="Attrition by work-life balance level",
    description=(
        "Attrition rate at each of the four work-life balance levels "
        "(Bad / Good / Better / Best)."
    ),
)
def by_worklife_balance():
    return get_attrition_by_worklife_balance()


# ── 7. By age group ───────────────────────────────────────────────────────────

@router.get(
    "/by-age-group",
    response_model=list[AttritionByAgeGroup],
    summary="Attrition by age / career stage",
    description=(
        "Buckets employees into Under 25 / 25–34 / 35–44 / Over 44 and shows "
        "attrition rate and avg salary per group."
    ),
)
def by_age_group():
    return get_attrition_by_age_group()


# ── 8. By promotion gap ───────────────────────────────────────────────────────

@router.get(
    "/by-promotion-gap",
    response_model=list[AttritionByPromotionGap],
    summary="Attrition by time since last promotion",
    description=(
        "Buckets YearsSinceLastPromotion (0 / 1-2 / 3-5 / 6+) and shows "
        "attrition rate per bucket. Quantifies the cost of stalled careers."
    ),
)
def by_promotion_gap():
    return get_attrition_by_promotion_gap()


# ── 9. High-risk cohort profiles ──────────────────────────────────────────────

@router.get(
    "/high-risk-profiles",
    response_model=list[HighRiskProfile],
    summary="High-risk workforce cohorts",
    description=(
        "Groups employees by Department × JobRole × OverTime (cohorts ≥ 10). "
        "Sorted by attrition rate DESC — the top rows are the highest-risk "
        "pockets of the workforce and primary retention-intervention targets."
    ),
)
def high_risk_profiles():
    return get_high_risk_profiles()
