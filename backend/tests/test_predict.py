"""
tests/test_predict.py
──────────────────────
Integration tests for the /predict/risk endpoint.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app, raise_server_exceptions=True)


def test_predict_risk_high():
    """POST /predict/risk with high-risk attributes returns High risk label."""
    payload = {
        "department": "Sales",
        "job_role": "Sales Representative",
        "over_time": "Yes",
        "monthly_income": 2400,
        "business_travel": "Travel_Frequently",
        "years_since_last_promotion": 4,
        "job_satisfaction": 1,
        "work_life_balance": 1,
    }
    resp = client.post("/predict/risk", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "risk_score" in data
    assert "risk_label" in data
    assert "top_contributing_factors" in data
    assert data["risk_label"] == "High"
    assert data["risk_score"] >= 0.60
    assert len(data["top_contributing_factors"]) == 3


def test_predict_risk_low():
    """POST /predict/risk with low-risk attributes returns Low risk label."""
    payload = {
        "department": "Research & Development",
        "job_role": "Research Director",
        "over_time": "No",
        "monthly_income": 16500,
        "business_travel": "Non-Travel",
        "years_since_last_promotion": 0,
        "job_satisfaction": 4,
        "work_life_balance": 3,
    }
    resp = client.post("/predict/risk", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["risk_label"] == "Low"
    assert data["risk_score"] < 0.30
    assert len(data["top_contributing_factors"]) == 3


def test_predict_risk_empty_payload_defaults():
    """POST /predict/risk with empty payload succeeds using defaults."""
    resp = client.post("/predict/risk", json={})
    assert resp.status_code == 200
    data = resp.json()
    assert 0.0 <= data["risk_score"] <= 1.0
    assert data["risk_label"] in ["Low", "Medium", "High"]
