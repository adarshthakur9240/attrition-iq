"""
app/services/ml_service.py
───────────────────────────
Inference service for the attrition-risk ML model.

The model Pipeline (preprocessor → estimator) is loaded once at module
import time so the first request bears no disk-load overhead.

Public API
──────────
    predict_risk(employee_features: dict) -> dict
        Returns:
          {
            "risk_score": float,          # probability of attrition (0–1)
            "risk_label": str,            # "Low" | "Medium" | "High"
            "top_contributing_factors": [ # top-3 per-instance drivers
              {"feature": str, "importance": float}, ...
            ]
          }
"""

from __future__ import annotations

import logging
from functools import lru_cache
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd

from app.ml.features import FEATURE_COLS, get_feature_names_out

log = logging.getLogger(__name__)

MODEL_PATH = Path(__file__).resolve().parents[1] / "ml" / "model.pkl"

# Risk-label thresholds (tunable without retraining)
LOW_THRESHOLD    = 0.30   # risk_score < 0.30  → "Low"
HIGH_THRESHOLD   = 0.60   # risk_score >= 0.60 → "High"


# ---------------------------------------------------------------------------
# Model loading (cached — loaded once per process lifetime)
# ---------------------------------------------------------------------------

@lru_cache(maxsize=1)
def _load_pipeline():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model file not found at {MODEL_PATH}. "
            "Run `python -m app.ml.train` first."
        )
    pipeline = joblib.load(MODEL_PATH)
    log.info("ML model loaded from %s", MODEL_PATH)
    return pipeline


@lru_cache(maxsize=1)
def _get_feature_names() -> list[str]:
    pipeline = _load_pipeline()
    preprocessor = pipeline.named_steps["preprocessor"]
    return get_feature_names_out(preprocessor)


def _instance_contributions(X_encoded: np.ndarray) -> np.ndarray:
    """
    Compute per-instance feature contributions for a single encoded row.

    - LogisticRegression : contribution_i = coef_i × encoded_value_i
        Captures both the model's weight AND whether this feature is active
        for THIS employee (zero encoded value → zero contribution).
    - RandomForest       : contribution_i = feature_importance_i × |encoded_value_i|
        Approximation: weight the global importance by how active the feature
        is for this employee.

    Returns an array of absolute contributions (length = n_features).
    """
    pipeline  = _load_pipeline()
    estimator = pipeline.named_steps["estimator"]

    if hasattr(estimator, "coef_"):
        # Linear model: signed contribution; rank by magnitude
        contributions = estimator.coef_[0] * X_encoded
    elif hasattr(estimator, "feature_importances_"):
        # Tree model: weight global importance by feature activity
        contributions = estimator.feature_importances_ * np.abs(X_encoded)
    else:
        contributions = np.zeros_like(X_encoded)

    return np.abs(contributions)


# ---------------------------------------------------------------------------
# Risk-label mapping
# ---------------------------------------------------------------------------

def _score_to_label(score: float) -> str:
    if score < LOW_THRESHOLD:
        return "Low"
    if score < HIGH_THRESHOLD:
        return "Medium"
    return "High"


# ---------------------------------------------------------------------------
# Top contributing factors
# ---------------------------------------------------------------------------

def _top_factors(employee_row: pd.DataFrame, n: int = 3) -> list[dict[str, Any]]:
    """
    Return the top-n features by per-instance contribution for this employee.

    Strategy:
      1. Transform the raw input row through the fitted preprocessor to get
         the encoded feature vector actually seen by the estimator.
      2. Compute per-instance contributions (coef × value for LR; importance
         × |value| for RF).
      3. Rank by absolute contribution and return the top-n entries.

    This means a feature encoded as 0 for this employee (e.g. over_time_Yes
    when the employee does NOT work overtime) contributes 0 and will not
    appear in the results.
    """
    pipeline      = _load_pipeline()
    preprocessor  = pipeline.named_steps["preprocessor"]
    feature_names = _get_feature_names()

    # Encode the raw input row exactly as the estimator sees it
    X_encoded = preprocessor.transform(employee_row)
    if hasattr(X_encoded, "toarray"):   # sparse → dense
        X_encoded = X_encoded.toarray()
    encoded_values = X_encoded[0]       # shape (n_features,)

    abs_contribs = _instance_contributions(encoded_values)

    ranked_idx = np.argsort(abs_contribs)[::-1]

    factors = []
    for idx in ranked_idx:
        if len(factors) >= n:
            break
        # Skip features that have zero contribution for this instance
        if abs_contribs[idx] == 0.0:
            break
        factors.append({
            "feature":    feature_names[idx],
            "importance": round(float(abs_contribs[idx]), 4),
        })
    return factors


# ---------------------------------------------------------------------------
# Public predict function
# ---------------------------------------------------------------------------

def predict_risk(employee_features: dict[str, Any]) -> dict[str, Any]:
    """
    Predict attrition risk for a single employee.

    Parameters
    ----------
    employee_features : dict
        Keys are the snake_case column names defined in FEATURE_COLS.
        Missing keys are filled with sensible defaults (dataset medians).

    Returns
    -------
    dict with keys:
        risk_score              – float in [0, 1]
        risk_label              – "Low" | "Medium" | "High"
        top_contributing_factors – list of {"feature": str, "importance": float}
    """
    pipeline = _load_pipeline()

    # Build a single-row DataFrame with all required features
    row = {col: employee_features.get(col) for col in FEATURE_COLS}
    df_input = pd.DataFrame([row])

    # Predict probability of attrition (class = 1)
    risk_score: float = float(pipeline.predict_proba(df_input)[0, 1])
    risk_label: str   = _score_to_label(risk_score)
    factors           = _top_factors(df_input)

    return {
        "risk_score":               round(risk_score, 4),
        "risk_label":               risk_label,
        "top_contributing_factors": factors,
    }
