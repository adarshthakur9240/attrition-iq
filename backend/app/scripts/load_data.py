#!/usr/bin/env python3
"""
app/scripts/load_data.py
────────────────────────
One-off script: read the IBM HR Attrition CSV and bulk-load it into
the `employees` Postgres table.

Usage (from the backend/ directory):
    python -m app.scripts.load_data
  or:
    python app/scripts/load_data.py

The script is idempotent: it TRUNCATEs the table before loading so it
can be re-run safely after schema changes.
"""

import logging
import sys
from pathlib import Path

import pandas as pd
from sqlalchemy import text

# ---------------------------------------------------------------------------
# Ensure the project root is importable when running as a top-level script
# ---------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parents[3]  # attrition-iq/
BACKEND_DIR = ROOT / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.core.db import engine  # noqa: E402  (import after sys.path fix)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
CSV_PATH = Path(__file__).resolve().parents[1] / "sql" / "data" / "WA_Fn-UseC_-HR-Employee-Attrition.csv"
TABLE_NAME = "employees"
CHUNK_SIZE = 500          # rows per INSERT batch
EXPECTED_ROWS = 1470

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Column rename map  CSV column → DB column
# ---------------------------------------------------------------------------
RENAME = {
    "Age":                       "age",
    "Attrition":                 "attrition",
    "BusinessTravel":            "business_travel",
    "DailyRate":                 "daily_rate",
    "Department":                "department",
    "DistanceFromHome":          "distance_from_home",
    "Education":                 "education",
    "EducationField":            "education_field",
    "EmployeeCount":             "employee_count",
    "EmployeeNumber":            "employee_number",
    "EnvironmentSatisfaction":   "environment_satisfaction",
    "Gender":                    "gender",
    "HourlyRate":                "hourly_rate",
    "JobInvolvement":            "job_involvement",
    "JobLevel":                  "job_level",
    "JobRole":                   "job_role",
    "JobSatisfaction":           "job_satisfaction",
    "MaritalStatus":             "marital_status",
    "MonthlyIncome":             "monthly_income",
    "MonthlyRate":               "monthly_rate",
    "NumCompaniesWorked":        "num_companies_worked",
    "Over18":                    "over18",
    "OverTime":                  "over_time",
    "PercentSalaryHike":         "percent_salary_hike",
    "PerformanceRating":         "performance_rating",
    "RelationshipSatisfaction":  "relationship_satisfaction",
    "StandardHours":             "standard_hours",
    "StockOptionLevel":          "stock_option_level",
    "TotalWorkingYears":         "total_working_years",
    "TrainingTimesLastYear":     "training_times_last_year",
    "WorkLifeBalance":           "work_life_balance",
    "YearsAtCompany":            "years_at_company",
    "YearsInCurrentRole":        "years_in_current_role",
    "YearsSinceLastPromotion":   "years_since_last_promotion",
    "YearsWithCurrManager":      "years_with_curr_manager",
}


def load_csv() -> pd.DataFrame:
    """Read and lightly clean the raw CSV."""
    log.info("Reading CSV from %s", CSV_PATH)
    df = pd.read_csv(CSV_PATH, encoding="utf-8-sig")   # utf-8-sig strips the BOM

    # Rename columns to snake_case DB names
    df.rename(columns=RENAME, inplace=True)

    # Basic whitespace trim on string columns
    str_cols = df.select_dtypes(include="str").columns
    df[str_cols] = df[str_cols].apply(lambda col: col.str.strip())

    log.info("Loaded %d rows, %d columns from CSV.", len(df), len(df.columns))
    return df


def run_schema(conn) -> None:
    """Apply 01_schema.sql (creates / recreates the table)."""
    schema_path = Path(__file__).resolve().parents[1] / "sql" / "01_schema.sql"
    sql = schema_path.read_text()
    log.info("Applying schema from %s …", schema_path.name)
    conn.execute(text(sql))
    log.info("Schema applied.")


def bulk_load(df: pd.DataFrame, conn) -> None:
    """TRUNCATE + chunked INSERT via pandas .to_sql()."""
    log.info("Truncating table '%s' …", TABLE_NAME)
    conn.execute(text(f"TRUNCATE TABLE {TABLE_NAME} RESTART IDENTITY"))

    log.info("Bulk-loading %d rows in chunks of %d …", len(df), CHUNK_SIZE)
    df.to_sql(
        name=TABLE_NAME,
        con=conn,
        if_exists="append",         # table already exists from schema step
        index=False,
        chunksize=CHUNK_SIZE,
        method="multi",             # single multi-row INSERT per chunk
    )
    log.info("Bulk-load complete.")


def verify_row_count(conn) -> int:
    result = conn.execute(text(f"SELECT COUNT(*) FROM {TABLE_NAME}"))
    return result.scalar()


def main() -> None:
    # 1. Read CSV
    df = load_csv()

    # 2. Create / recreate schema (DDL — its own transaction)
    with engine.begin() as conn:
        run_schema(conn)

    # 3. Load data + verify (DML — single transaction)
    with engine.begin() as conn:
        bulk_load(df, conn)
        actual = verify_row_count(conn)

    log.info("─" * 60)
    if actual == EXPECTED_ROWS:
        log.info("✅  Row count VERIFIED: %d rows in `%s`.", actual, TABLE_NAME)
    else:
        log.error(
            "❌  Row count MISMATCH: expected %d, found %d.",
            EXPECTED_ROWS,
            actual,
        )
        sys.exit(1)
    log.info("─" * 60)


if __name__ == "__main__":
    main()
