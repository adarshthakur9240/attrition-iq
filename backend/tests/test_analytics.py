"""
tests/test_analytics.py
────────────────────────
Integration tests for every analytics endpoint.

Uses FastAPI TestClient (backed by httpx) which runs the full ASGI stack
in-process — no real HTTP server needed.  The tests hit the local Postgres
through the normal SQLAlchemy engine, so they require:
  • A running Postgres with the `employees` table populated (run load_data.py)
  • DATABASE_URL set in backend/.env

Run:
    cd backend
    pytest tests/test_analytics.py -v
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app

# One shared client for the whole module (no state between tests)
client = TestClient(app, raise_server_exceptions=True)


# ── helpers ───────────────────────────────────────────────────────────────────

def assert_ok_non_empty(response, *, min_rows: int = 1):
    """Assert 200 status and that the JSON body is a non-empty list."""
    assert response.status_code == 200, (
        f"Expected 200, got {response.status_code}: {response.text}"
    )
    data = response.json()
    assert isinstance(data, list), f"Expected list, got {type(data)}"
    assert len(data) >= min_rows, (
        f"Expected at least {min_rows} row(s), got {len(data)}"
    )
    return data


# ── meta / infra ──────────────────────────────────────────────────────────────

def test_health():
    """GET /health should return 200 with status=ok."""
    resp = client.get("/health")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "ok"
    assert body["db"] == "ok", f"DB not healthy: {body['db']}"


def test_info():
    """GET /info should return API metadata including endpoint list."""
    resp = client.get("/info")
    assert resp.status_code == 200
    body = resp.json()
    assert body["name"] == "AttritionIQ API"
    assert "/analytics/overview" in body["analytics_endpoints"]


# ── analytics endpoints ───────────────────────────────────────────────────────

def test_overview():
    """GET /analytics/overview — single-row KPI summary."""
    data = assert_ok_non_empty(client.get("/analytics/overview"), min_rows=1)
    row = data[0]
    assert "total_employees" in row
    assert "total_left" in row
    assert "attrition_rate_pct" in row
    # Sanity: 1470 employees loaded
    assert row["total_employees"] == 1470
    assert row["total_left"] == 237


def test_by_department():
    """GET /analytics/by-department — one row per department."""
    data = assert_ok_non_empty(client.get("/analytics/by-department"), min_rows=3)
    departments = {r["department"] for r in data}
    assert "Sales" in departments
    assert "Research & Development" in departments
    for row in data:
        assert "attrition_rate_pct" in row
        assert float(row["attrition_rate_pct"]) >= 0


def test_by_salary():
    """GET /analytics/by-salary — four salary bands."""
    data = assert_ok_non_empty(client.get("/analytics/by-salary"), min_rows=4)
    assert len(data) == 4
    bands = [r["salary_band"] for r in data]
    assert any("Low" in b for b in bands)
    assert any("High" in b for b in bands)
    # ordered by band_order ASC
    orders = [r["band_order"] for r in data]
    assert orders == sorted(orders)


def test_by_overtime():
    """GET /analytics/by-overtime — Yes and No rows."""
    data = assert_ok_non_empty(client.get("/analytics/by-overtime"), min_rows=2)
    assert len(data) == 2
    overtime_values = {r["over_time"] for r in data}
    assert overtime_values == {"Yes", "No"}
    # Overtime=Yes should have a higher attrition rate than Overtime=No
    rates = {r["over_time"]: float(r["attrition_rate_pct"]) for r in data}
    assert rates["Yes"] > rates["No"]


def test_by_satisfaction():
    """GET /analytics/by-satisfaction — levels 1–4 with labels."""
    data = assert_ok_non_empty(client.get("/analytics/by-satisfaction"), min_rows=4)
    assert len(data) == 4
    labels = {r["satisfaction_label"] for r in data}
    assert labels == {"Low", "Medium", "High", "Very High"}
    levels = [r["satisfaction_level"] for r in data]
    assert sorted(levels) == [1, 2, 3, 4]


def test_by_worklife_balance():
    """GET /analytics/by-worklife-balance — levels 1–4 with labels."""
    data = assert_ok_non_empty(client.get("/analytics/by-worklife-balance"), min_rows=4)
    assert len(data) == 4
    labels = {r["wlb_label"] for r in data}
    assert labels == {"Bad", "Good", "Better", "Best"}


def test_by_age_group():
    """GET /analytics/by-age-group — four career-stage bands."""
    data = assert_ok_non_empty(client.get("/analytics/by-age-group"), min_rows=4)
    assert len(data) == 4
    groups = {r["age_group"] for r in data}
    assert "Under 25" in groups
    assert "Over 44" in groups
    # Under-25 should have the highest attrition rate in this dataset
    rates = {r["age_group"]: float(r["attrition_rate_pct"]) for r in data}
    assert rates["Under 25"] > rates["Over 44"]


def test_by_promotion_gap():
    """GET /analytics/by-promotion-gap — four promotion-gap bands."""
    data = assert_ok_non_empty(client.get("/analytics/by-promotion-gap"), min_rows=4)
    assert len(data) == 4
    bands = [r["promotion_gap_band"] for r in data]
    assert any("Just promoted" in b for b in bands)
    assert any("6+" in b for b in bands)
    # ordered by band_order ASC
    orders = [r["band_order"] for r in data]
    assert orders == sorted(orders)


def test_high_risk_profiles():
    """GET /analytics/high-risk-profiles — cohorts ≥ 10, ordered by risk."""
    data = assert_ok_non_empty(client.get("/analytics/high-risk-profiles"), min_rows=5)
    for row in data:
        assert row["cohort_size"] >= 10, (
            f"Cohort too small: {row['cohort_size']}"
        )
        assert "department" in row
        assert "job_role" in row
        assert "over_time" in row
    # First row should have the highest attrition rate (DESC order)
    rates = [float(r["attrition_rate_pct"]) for r in data]
    assert rates == sorted(rates, reverse=True)
    # Known top risk: Sales Rep + OT=Yes ~ 66 %
    top = data[0]
    assert float(top["attrition_rate_pct"]) > 50


# ── schema correctness spot-checks ───────────────────────────────────────────

def test_response_fields_are_correct_types():
    """
    Spot-check that numeric fields come back as numbers, not strings.
    (FastAPI should coerce via response_model, but let's be explicit.)
    """
    resp = client.get("/analytics/overview")
    row = resp.json()[0]
    assert isinstance(row["total_employees"], int)
    assert isinstance(row["total_left"], int)
    # attrition_rate_pct may be int or float depending on JSON serialisation
    assert isinstance(row["attrition_rate_pct"], (int, float))
