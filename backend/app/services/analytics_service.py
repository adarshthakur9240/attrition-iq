"""
app/services/analytics_service.py
──────────────────────────────────
Service layer for the attrition analytics views.

Each public function:
  • Opens a short-lived SQLAlchemy session via `get_session()`
  • Runs `SELECT * FROM <view_name>` against the pre-built Postgres view
  • Returns results as a list of plain dicts (JSON-serialisable)

The functions never construct ad-hoc SQL beyond the simple SELECT — all
aggregation logic lives in 03_analytics_views.sql.
"""


from __future__ import annotations

from typing import Any

from sqlalchemy import text

from app.core.db import get_session

# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _query_view(view_name: str) -> list[dict[str, Any]]:
    """Execute `SELECT * FROM <view_name>` and return rows as dicts."""
    with get_session() as session:
        result = session.execute(text(f"SELECT * FROM {view_name}"))
        keys = list(result.keys())
        return [dict(zip(keys, row)) for row in result.fetchall()]


# ---------------------------------------------------------------------------
# 1. Overall KPI headline
# ---------------------------------------------------------------------------

def get_attrition_overview() -> list[dict[str, Any]]:
    """
    Returns a single-row summary:
      total_employees | total_left | attrition_rate_pct

    Powers the top-level KPI card on the dashboard.
    """
    return _query_view("v_attrition_overview")


# ---------------------------------------------------------------------------
# 2. Attrition by department
# ---------------------------------------------------------------------------

def get_attrition_by_department() -> list[dict[str, Any]]:
    """
    Returns one row per department:
      department | total_employees | total_left | attrition_rate_pct

    Sorted by attrition_rate_pct DESC — departments with the worst
    retention appear first.
    """
    return _query_view("v_attrition_by_department")


# ---------------------------------------------------------------------------
# 3. Attrition by salary band
# ---------------------------------------------------------------------------

def get_attrition_by_salary_band() -> list[dict[str, Any]]:
    """
    Returns one row per income band (Low / Mid / Upper-Mid / High):
      salary_band | band_order | total_employees | total_left
      | attrition_rate_pct | avg_monthly_income

    Sorted by band_order ASC (lowest salary first).
    """
    return _query_view("v_attrition_by_salary_band")


# ---------------------------------------------------------------------------
# 4. Attrition by overtime
# ---------------------------------------------------------------------------

def get_attrition_by_overtime() -> list[dict[str, Any]]:
    """
    Returns two rows (Yes / No):
      over_time | total_employees | total_left | attrition_rate_pct

    Quantifies the overtime penalty on retention.
    """
    return _query_view("v_attrition_by_overtime")


# ---------------------------------------------------------------------------
# 5. Attrition by job satisfaction
# ---------------------------------------------------------------------------

def get_attrition_by_satisfaction() -> list[dict[str, Any]]:
    """
    Returns four rows (levels 1–4):
      satisfaction_level | satisfaction_label | total_employees
      | total_left | attrition_rate_pct

    Shows whether low-satisfaction employees exit at higher rates.
    """
    return _query_view("v_attrition_by_satisfaction")


# ---------------------------------------------------------------------------
# 6. Attrition by work-life balance
# ---------------------------------------------------------------------------

def get_attrition_by_worklife_balance() -> list[dict[str, Any]]:
    """
    Returns four rows (levels 1–4):
      wlb_level | wlb_label | total_employees | total_left | attrition_rate_pct

    Measures the impact of work-life balance on voluntary turnover.
    """
    return _query_view("v_attrition_by_worklife_balance")


# ---------------------------------------------------------------------------
# 7. Attrition by age group
# ---------------------------------------------------------------------------

def get_attrition_by_age_group() -> list[dict[str, Any]]:
    """
    Returns four rows (Under 25 / 25–34 / 35–44 / Over 44):
      age_group | group_order | total_employees | total_left
      | attrition_rate_pct | avg_monthly_income

    Identifies which career stage loses the most people and whether
    compensation gaps explain the pattern.
    """
    return _query_view("v_attrition_by_age_group")


# ---------------------------------------------------------------------------
# 8. Attrition by promotion gap
# ---------------------------------------------------------------------------

def get_attrition_by_promotion_gap() -> list[dict[str, Any]]:
    """
    Returns four rows bucketed by years since last promotion:
      promotion_gap_band | band_order | total_employees | total_left
      | attrition_rate_pct | avg_years_since_promotion

    Highlights the cost of stalled career progression.
    """
    return _query_view("v_attrition_by_promotion_gap")


# ---------------------------------------------------------------------------
# 9. High-risk cohort profiles
# ---------------------------------------------------------------------------

def get_high_risk_profiles() -> list[dict[str, Any]]:
    """
    Returns cohorts (Department × JobRole × OverTime) with ≥10 members:
      department | job_role | over_time | cohort_size | total_left
      | attrition_rate_pct | avg_monthly_income
      | avg_years_since_promotion | avg_job_satisfaction
      | avg_work_life_balance

    Sorted by attrition_rate_pct DESC — the top rows are the highest-risk
    pockets of the workforce and the primary retention intervention targets.
    """
    return _query_view("v_high_risk_profile")


# ---------------------------------------------------------------------------
# Convenience: fetch all analytics in one call (e.g. for report generation)
# ---------------------------------------------------------------------------

def get_all_analytics() -> dict[str, list[dict[str, Any]]]:
    """
    Returns every analytics view in a single dict.
    Useful for generating full-page reports or seeding a front-end store.
    """
    return {
        "overview":           get_attrition_overview(),
        "by_department":      get_attrition_by_department(),
        "by_salary_band":     get_attrition_by_salary_band(),
        "by_overtime":        get_attrition_by_overtime(),
        "by_satisfaction":    get_attrition_by_satisfaction(),
        "by_worklife_balance": get_attrition_by_worklife_balance(),
        "by_age_group":       get_attrition_by_age_group(),
        "by_promotion_gap":   get_attrition_by_promotion_gap(),
        "high_risk_profiles": get_high_risk_profiles(),
    }
