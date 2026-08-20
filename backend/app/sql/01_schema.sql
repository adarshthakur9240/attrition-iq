-- =============================================================================
-- 01_schema.sql
-- IBM HR Employee Attrition dataset – Postgres schema
-- =============================================================================

-- Drop and recreate for idempotent runs
DROP TABLE IF EXISTS employees CASCADE;

CREATE TABLE employees (
    -- Surrogate PK (original dataset has no single natural key)
    id                        SERIAL PRIMARY KEY,

    -- ── Demographics ──────────────────────────────────────────────────────────
    age                       SMALLINT        NOT NULL CHECK (age BETWEEN 18 AND 100),
    gender                    VARCHAR(10)     NOT NULL,
    marital_status            VARCHAR(20)     NOT NULL,
    over18                    VARCHAR(5)      NOT NULL DEFAULT 'Y',   -- constant in IBM dataset

    -- ── Attrition (target variable) ───────────────────────────────────────────
    attrition                 VARCHAR(3)      NOT NULL CHECK (attrition IN ('Yes', 'No')),

    -- ── Job details ───────────────────────────────────────────────────────────
    department                VARCHAR(60)     NOT NULL,
    job_role                  VARCHAR(60)     NOT NULL,
    job_level                 SMALLINT        NOT NULL CHECK (job_level BETWEEN 1 AND 5),
    job_involvement           SMALLINT        NOT NULL CHECK (job_involvement BETWEEN 1 AND 4),

    -- ── Travel & location ─────────────────────────────────────────────────────
    business_travel           VARCHAR(30)     NOT NULL,
    distance_from_home        SMALLINT        NOT NULL CHECK (distance_from_home >= 0),

    -- ── Education ─────────────────────────────────────────────────────────────
    education                 SMALLINT        NOT NULL CHECK (education BETWEEN 1 AND 5),
    -- 1=Below College, 2=College, 3=Bachelor, 4=Master, 5=Doctor
    education_field           VARCHAR(40)     NOT NULL,

    -- ── Compensation ──────────────────────────────────────────────────────────
    daily_rate                INTEGER         NOT NULL CHECK (daily_rate > 0),
    hourly_rate               INTEGER         NOT NULL CHECK (hourly_rate > 0),
    monthly_rate              INTEGER         NOT NULL CHECK (monthly_rate > 0),
    monthly_income            INTEGER         NOT NULL CHECK (monthly_income > 0),
    percent_salary_hike       SMALLINT        NOT NULL CHECK (percent_salary_hike BETWEEN 0 AND 100),
    stock_option_level        SMALLINT        NOT NULL CHECK (stock_option_level BETWEEN 0 AND 3),

    -- ── Work history ──────────────────────────────────────────────────────────
    num_companies_worked      SMALLINT        NOT NULL CHECK (num_companies_worked >= 0),
    total_working_years       SMALLINT        NOT NULL CHECK (total_working_years >= 0),
    years_at_company          SMALLINT        NOT NULL CHECK (years_at_company >= 0),
    years_in_current_role     SMALLINT        NOT NULL CHECK (years_in_current_role >= 0),
    years_since_last_promotion SMALLINT       NOT NULL CHECK (years_since_last_promotion >= 0),
    years_with_curr_manager   SMALLINT        NOT NULL CHECK (years_with_curr_manager >= 0),

    -- ── Overtime ──────────────────────────────────────────────────────────────
    over_time                 VARCHAR(3)      NOT NULL CHECK (over_time IN ('Yes', 'No')),
    standard_hours            SMALLINT        NOT NULL DEFAULT 80,    -- constant in IBM dataset

    -- ── Ratings / satisfaction (all 1–4 scale) ────────────────────────────────
    environment_satisfaction  SMALLINT        NOT NULL CHECK (environment_satisfaction BETWEEN 1 AND 4),
    job_satisfaction          SMALLINT        NOT NULL CHECK (job_satisfaction BETWEEN 1 AND 4),
    relationship_satisfaction SMALLINT        NOT NULL CHECK (relationship_satisfaction BETWEEN 1 AND 4),
    work_life_balance         SMALLINT        NOT NULL CHECK (work_life_balance BETWEEN 1 AND 4),
    performance_rating        SMALLINT        NOT NULL CHECK (performance_rating BETWEEN 1 AND 4),
    training_times_last_year  SMALLINT        NOT NULL CHECK (training_times_last_year >= 0),

    -- ── Employee identifiers (from original IBM data) ─────────────────────────
    employee_number           INTEGER         UNIQUE NOT NULL,
    employee_count            SMALLINT        NOT NULL DEFAULT 1,     -- constant in IBM dataset

    -- ── Audit ─────────────────────────────────────────────────────────────────
    loaded_at                 TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Useful indexes for analytical queries
CREATE INDEX idx_employees_attrition       ON employees (attrition);
CREATE INDEX idx_employees_department      ON employees (department);
CREATE INDEX idx_employees_job_role        ON employees (job_role);
CREATE INDEX idx_employees_age             ON employees (age);
CREATE INDEX idx_employees_monthly_income  ON employees (monthly_income);
