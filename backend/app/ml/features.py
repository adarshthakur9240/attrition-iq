"""
app/ml/features.py
──────────────────
Feature engineering pipeline for the IBM HR Attrition dataset.

Responsibilities:
  • Define the canonical feature set (FEATURE_COLS)
  • Build a sklearn ColumnTransformer that one-hot-encodes categoricals and
    passes numerics through unchanged
  • Expose `build_preprocessor()` so both train.py and ml_service.py use
    exactly the same transformation logic

Design decisions
────────────────
• One-hot encoding for all categoricals (drop='first' removes one dummy to
  avoid perfect multicollinearity with tree-based models it doesn't matter,
  but it keeps the feature-importance index clean).
• Constant columns in the IBM dataset (EmployeeCount, StandardHours, Over18)
  are excluded — they add noise with zero signal.
• EmployeeNumber is an arbitrary ID with no predictive value — excluded.
"""

from __future__ import annotations

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

# ---------------------------------------------------------------------------
# Feature sets
# ---------------------------------------------------------------------------

# Numeric predictors
NUMERIC_COLS: list[str] = [
    "age",
    "daily_rate",
    "distance_from_home",
    "education",
    "environment_satisfaction",
    "hourly_rate",
    "job_involvement",
    "job_level",
    "job_satisfaction",
    "monthly_income",
    "monthly_rate",
    "num_companies_worked",
    "percent_salary_hike",
    "performance_rating",
    "relationship_satisfaction",
    "stock_option_level",
    "total_working_years",
    "training_times_last_year",
    "work_life_balance",
    "years_at_company",
    "years_in_current_role",
    "years_since_last_promotion",
    "years_with_curr_manager",
]

# Categorical predictors to one-hot encode
CATEGORICAL_COLS: list[str] = [
    "business_travel",
    "department",
    "education_field",
    "gender",
    "job_role",
    "marital_status",
    "over_time",
]

# Combined ordered list (numeric first, then categorical)
FEATURE_COLS: list[str] = NUMERIC_COLS + CATEGORICAL_COLS

# Target column
TARGET_COL: str = "attrition"


# ---------------------------------------------------------------------------
# Preprocessor factory
# ---------------------------------------------------------------------------

def build_preprocessor() -> ColumnTransformer:
    """
    Return a fitted-ready ColumnTransformer:
      • Numeric columns  → StandardScaler  (helps LogisticRegression; no-op for RF)
      • Categorical cols → OneHotEncoder   (handle_unknown='ignore' for safe inference)
    """
    numeric_transformer = StandardScaler()

    categorical_transformer = OneHotEncoder(
        drop="first",            # avoid dummy-variable trap
        handle_unknown="ignore", # unknown categories at inference → all zeros
        sparse_output=False,     # return dense array for compatibility
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, NUMERIC_COLS),
            ("cat", categorical_transformer, CATEGORICAL_COLS),
        ],
        remainder="drop",        # silently discard any extra columns
    )
    return preprocessor


def get_feature_names_out(preprocessor: ColumnTransformer) -> list[str]:
    """
    Return the final list of feature names after transformation.
    Numeric names are unchanged; OHE names are <col>_<category>.
    """
    ohe: OneHotEncoder = preprocessor.named_transformers_["cat"]
    cat_feature_names: list[str] = list(
        ohe.get_feature_names_out(CATEGORICAL_COLS)
    )
    return NUMERIC_COLS + cat_feature_names
