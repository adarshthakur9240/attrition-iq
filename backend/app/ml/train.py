"""
app/ml/train.py
───────────────
Model training pipeline for attrition risk prediction.

Usage (from backend/ directory):
    python -m app.ml.train

What it does
────────────
1. Loads the employees table from Postgres (falls back to CSV if DB unreachable)
2. Engineers features via features.py
3. Splits 80/20 stratified on Attrition
4. Trains two models:
     a. RandomForestClassifier  (class_weight='balanced')
     b. LogisticRegression      (class_weight='balanced', strong baseline)
5. Evaluates both on the held-out test set using:
     • Accuracy, Precision, Recall, F1 (macro + per-class)
     • ROC-AUC
     ► Recall on "Yes" (attrition=1) is the primary metric — missing a
       flight-risk employee is costlier than a false alarm.
6. Selects the best model by recall_yes + roc_auc
7. Saves  app/ml/model.pkl  (Pipeline: preprocessor + best estimator)
8. Writes docs/model_metrics.md
"""

from __future__ import annotations
from typing import cast

import logging
import sys
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    classification_report,
    roc_auc_score,
    confusion_matrix,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

# ── Path setup ────────────────────────────────────────────────────────────────
BACKEND_DIR = Path(__file__).resolve().parents[2]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.ml.features import (  # noqa: E402
    FEATURE_COLS,
    TARGET_COL,
    build_preprocessor,
    get_feature_names_out,
)

# ── Constants ─────────────────────────────────────────────────────────────────
MODEL_PATH = Path(__file__).resolve().parent / "model.pkl"
CSV_PATH = BACKEND_DIR / "app" / "sql" / "data" / "WA_Fn-UseC_-HR-Employee-Attrition.csv"
DOCS_PATH = BACKEND_DIR.parent / "backend" / "docs" / "model_metrics.md"
RANDOM_STATE = 42
TEST_SIZE = 0.20

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

# CSV → DB column rename map (same as load_data.py)
CSV_RENAME = {
    "Age": "age", "Attrition": "attrition", "BusinessTravel": "business_travel",
    "DailyRate": "daily_rate", "Department": "department",
    "DistanceFromHome": "distance_from_home", "Education": "education",
    "EducationField": "education_field", "EmployeeCount": "employee_count",
    "EmployeeNumber": "employee_number", "EnvironmentSatisfaction": "environment_satisfaction",
    "Gender": "gender", "HourlyRate": "hourly_rate", "JobInvolvement": "job_involvement",
    "JobLevel": "job_level", "JobRole": "job_role", "JobSatisfaction": "job_satisfaction",
    "MaritalStatus": "marital_status", "MonthlyIncome": "monthly_income",
    "MonthlyRate": "monthly_rate", "NumCompaniesWorked": "num_companies_worked",
    "Over18": "over18", "OverTime": "over_time", "PercentSalaryHike": "percent_salary_hike",
    "PerformanceRating": "performance_rating",
    "RelationshipSatisfaction": "relationship_satisfaction",
    "StandardHours": "standard_hours", "StockOptionLevel": "stock_option_level",
    "TotalWorkingYears": "total_working_years",
    "TrainingTimesLastYear": "training_times_last_year",
    "WorkLifeBalance": "work_life_balance", "YearsAtCompany": "years_at_company",
    "YearsInCurrentRole": "years_in_current_role",
    "YearsSinceLastPromotion": "years_since_last_promotion",
    "YearsWithCurrManager": "years_with_curr_manager",
}


# ── Data loading ──────────────────────────────────────────────────────────────

def load_data() -> pd.DataFrame:
    """Load from Postgres; fall back to CSV if DB is unavailable."""
    try:
        from app.core.db import engine
        log.info("Loading data from Postgres …")
        df = pd.read_sql("SELECT * FROM employees", con=engine)
        log.info("Loaded %d rows from Postgres.", len(df))
        return df
    except Exception as exc:
        log.warning("Postgres unavailable (%s). Falling back to CSV …", exc)
        df = pd.read_csv(CSV_PATH, encoding="utf-8-sig")
        df.rename(columns=CSV_RENAME, inplace=True)
        str_cols = df.select_dtypes(include="str").columns
        df[str_cols] = df[str_cols].apply(lambda c: c.str.strip())
        log.info("Loaded %d rows from CSV.", len(df))
        return df


# ── Preprocessing ─────────────────────────────────────────────────────────────

def prepare_xy(df: pd.DataFrame):
    """Extract feature matrix X and binary target y."""
    df = df.copy()
    # Encode target: Yes → 1, No → 0
    df[TARGET_COL] = (df[TARGET_COL].str.strip().str.lower() == "yes").astype(int)
    X = df[FEATURE_COLS].copy()
    y = df[TARGET_COL]
    log.info(
        "Target distribution — Attrition=Yes: %d (%.1f%%), No: %d (%.1f%%)",
        y.sum(), 100 * y.mean(), (y == 0).sum(), 100 * (1 - y.mean()),
    )
    return X, y


# ── Model evaluation helper ───────────────────────────────────────────────────

def evaluate(name: str, pipeline: Pipeline, X_test, y_test) -> dict:
    """Return a dict of metrics for one model."""
    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]

    report = cast(dict, classification_report(y_test, y_pred, target_names=["No", "Yes"], output_dict=True))
    roc_auc = roc_auc_score(y_test, y_prob)
    cm = confusion_matrix(y_test, y_pred)

    metrics = {
        "name":          name,
        "accuracy":      report["accuracy"],
        "precision_yes": report["Yes"]["precision"],
        "recall_yes":    report["Yes"]["recall"],    # PRIMARY METRIC
        "f1_yes":        report["Yes"]["f1-score"],
        "roc_auc":       roc_auc,
        "cm":            cm,
        "report":        report,
        "pipeline":      pipeline,
    }

    log.info(
        "%-30s  Acc=%.3f  Prec(Yes)=%.3f  Recall(Yes)=%.3f  F1(Yes)=%.3f  AUC=%.3f",
        name, metrics["accuracy"], metrics["precision_yes"],
        metrics["recall_yes"], metrics["f1_yes"], metrics["roc_auc"],
    )
    return metrics


# ── Training ──────────────────────────────────────────────────────────────────

def build_models() -> list[tuple[str, object]]:
    return [
        (
            "RandomForest (balanced)",
            RandomForestClassifier(
                n_estimators=300,
                max_depth=None,
                min_samples_leaf=2,
                class_weight="balanced",
                random_state=RANDOM_STATE,
                n_jobs=-1,
            ),
        ),
        (
            "LogisticRegression (balanced)",
            LogisticRegression(
                C=0.5,
                class_weight="balanced",
                max_iter=1000,
                random_state=RANDOM_STATE,
                solver="lbfgs",
            ),
        ),
    ]


# ── Docs ──────────────────────────────────────────────────────────────────────

def write_metrics_report(results: list[dict], best: dict, feature_names: list[str]) -> None:
    """Write a markdown report to docs/model_metrics.md."""
    DOCS_PATH.parent.mkdir(parents=True, exist_ok=True)

    lines = [
        "# AttritionIQ — Model Training Metrics",
        "",
        "> **Primary metric:** Recall on `Attrition=Yes`  ",
        "> Missing a flight-risk employee is more costly than a false alarm.",
        "",
        "## Dataset",
        "",
        "| Item | Value |",
        "|------|-------|",
        "| Source | IBM HR Employee Attrition (Kaggle) |",
        "| Total rows | 1 470 |",
        "| Train / Test split | 80 % / 20 % (stratified) |",
        "| Class imbalance handling | `class_weight='balanced'` |",
        "",
        "## Model Comparison",
        "",
        "| Model | Accuracy | Precision (Yes) | **Recall (Yes)** | F1 (Yes) | ROC-AUC |",
        "|-------|----------|-----------------|------------------|----------|---------|",
    ]

    for r in results:
        lines.append(
            f"| {r['name']} | {r['accuracy']:.3f} | {r['precision_yes']:.3f} "
            f"| **{r['recall_yes']:.3f}** | {r['f1_yes']:.3f} | {r['roc_auc']:.3f} |"
        )

    lines += [
        "",
        f"## Best Model: `{best['name']}`",
        "",
        "Selected by: highest `recall_yes + roc_auc` composite score.",
        "",
        "### Confusion Matrix (test set)",
        "",
        "```",
        "             Predicted No   Predicted Yes",
        f"Actual No       {best['cm'][0][0]:5d}         {best['cm'][0][1]:5d}",
        f"Actual Yes      {best['cm'][1][0]:5d}         {best['cm'][1][1]:5d}",
        "```",
        "",
        "### Classification Report",
        "",
        "```",
        f"{'':20s} {'precision':>10s} {'recall':>10s} {'f1-score':>10s} {'support':>10s}",
    ]

    for cls in ["No", "Yes"]:
        r_cls = best["report"][cls]
        lines.append(
            f"{cls:20s} {r_cls['precision']:>10.3f} {r_cls['recall']:>10.3f} "
            f"{r_cls['f1-score']:>10.3f} {int(r_cls['support']):>10d}"
        )
    lines += [
        f"{'accuracy':20s} {'':>10s} {'':>10s} {best['accuracy']:>10.3f} "
        f"{int(best['report']['macro avg']['support']):>10d}",
        "```",
        "",
        "### Top 20 Feature Importances",
        "",
        "| Rank | Feature | Importance |",
        "|------|---------|------------|",
    ]

    # Support both tree-based models (feature_importances_) and linear models (coef_)
    estimator = best["pipeline"].named_steps["estimator"]
    if hasattr(estimator, "feature_importances_"):
        importances = estimator.feature_importances_
    elif hasattr(estimator, "coef_"):
        coef = np.abs(estimator.coef_[0])
        importances = coef / coef.sum()  # normalise to sum=1, same as ml_service.py
    else:
        importances = np.array([])

    if importances.size > 0:
        top_idx = np.argsort(importances)[::-1][:20]
        for rank, idx in enumerate(top_idx, 1):
            lines.append(f"| {rank} | `{feature_names[idx]}` | {importances[idx]:.4f} |")

    lines += ["", "---", "_Generated automatically by `app/ml/train.py`_", ""]
    DOCS_PATH.write_text("\n".join(lines), encoding="utf-8")
    log.info("Metrics report written to %s", DOCS_PATH)


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    # 1. Data
    df = load_data()
    X, y = prepare_xy(df)

    # 2. Train / test split (stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=TEST_SIZE,
        stratify=y,
        random_state=RANDOM_STATE,
    )
    log.info("Train: %d rows | Test: %d rows", len(X_train), len(X_test))

    # 3. Train all models
    results: list[dict] = []
    for model_name, estimator in build_models():
        log.info("Training %s …", model_name)
        preprocessor = build_preprocessor()
        pipeline = Pipeline([
            ("preprocessor", preprocessor),
            ("estimator",    estimator),
        ])
        pipeline.fit(X_train, y_train)
        metrics = evaluate(model_name, pipeline, X_test, y_test)
        results.append(metrics)

    # 4. Select best by recall_yes + roc_auc composite
    best = max(results, key=lambda r: r["recall_yes"] + r["roc_auc"])
    log.info("Best model: %s  (recall_yes=%.3f, roc_auc=%.3f)",
             best["name"], best["recall_yes"], best["roc_auc"])

    # 5. Get feature names (after fitting the preprocessor inside the pipeline)
    fitted_preprocessor = best["pipeline"].named_steps["preprocessor"]
    feature_names = get_feature_names_out(fitted_preprocessor)

    # 6. Save model
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(best["pipeline"], MODEL_PATH)
    log.info("Model saved → %s", MODEL_PATH)

    # 7. Write metrics report
    write_metrics_report(results, best, feature_names)

    # 8. Summary
    log.info("=" * 60)
    log.info("FINAL METRICS  (%s)", best["name"])
    log.info("  Accuracy         : %.3f", best["accuracy"])
    log.info("  Precision (Yes)  : %.3f", best["precision_yes"])
    log.info("  Recall    (Yes)  : %.3f  ◀ primary metric", best["recall_yes"])
    log.info("  F1        (Yes)  : %.3f", best["f1_yes"])
    log.info("  ROC-AUC          : %.3f", best["roc_auc"])
    log.info("=" * 60)


if __name__ == "__main__":
    main()
