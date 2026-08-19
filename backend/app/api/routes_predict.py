"""
app/api/routes_predict.py
──────────────────────────
POST /predict/risk  — attrition risk prediction endpoint.

Accepts a PredictionRequest (all employee fields, all optional with defaults),
calls ml_service.predict_risk(), and returns a PredictionResponse with:
  • risk_score  — model probability of attrition
  • risk_label  — Low / Medium / High
  • top_contributing_factors — top-3 feature importances from the trained RF
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.ml_service import predict_risk

router = APIRouter(prefix="/predict", tags=["Prediction"])


@router.post(
    "/risk",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict employee attrition risk",
    description="""
Submit employee attributes and receive an attrition risk prediction.

**Risk labels:**
- `Low`    — probability < 30 %  
- `Medium` — probability 30 – 60 %  
- `High`   — probability ≥ 60 %  

All request fields are optional; missing fields are filled with dataset
median / mode defaults so partial profiles are fully supported.

The response also includes the **top 3 model features** that drive the
prediction (derived from `feature_importances_` for tree-based models or
normalised `abs(coef_)` for linear models).
    """.strip(),
)
def predict_attrition_risk(payload: PredictionRequest) -> PredictionResponse:
    """
    Run attrition-risk inference for a single employee profile.

    Raises 503 if the model file has not been trained yet.
    """
    try:
        result = predict_risk(payload.model_dump())
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction error: {exc}",
        ) from exc

    return PredictionResponse(**result)
