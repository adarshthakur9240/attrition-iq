-- =============================================================================
-- 02_cleaning.sql
-- Post-load data quality checks and standardisation for the employees table.
-- Run AFTER load_data.py has populated the table.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. NULL / missing value audit
-- ---------------------------------------------------------------------------
DO $$
DECLARE
    null_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO null_count
    FROM employees
    WHERE
        age                        IS NULL OR
        attrition                  IS NULL OR
        business_travel            IS NULL OR
        daily_rate                 IS NULL OR
        department                 IS NULL OR
        distance_from_home         IS NULL OR
        education                  IS NULL OR
        education_field            IS NULL OR
        employee_count             IS NULL OR
        employee_number            IS NULL OR
        environment_satisfaction   IS NULL OR
        gender                     IS NULL OR
        hourly_rate                IS NULL OR
        job_involvement            IS NULL OR
        job_level                  IS NULL OR
        job_role                   IS NULL OR
        job_satisfaction           IS NULL OR
        marital_status             IS NULL OR
        monthly_income             IS NULL OR
        monthly_rate               IS NULL OR
        num_companies_worked       IS NULL OR
        over18                     IS NULL OR
        over_time                  IS NULL OR
        percent_salary_hike        IS NULL OR
        performance_rating         IS NULL OR
        relationship_satisfaction  IS NULL OR
        standard_hours             IS NULL OR
        stock_option_level         IS NULL OR
        total_working_years        IS NULL OR
        training_times_last_year   IS NULL OR
        work_life_balance          IS NULL OR
        years_at_company           IS NULL OR
        years_in_current_role      IS NULL OR
        years_since_last_promotion IS NULL OR
        years_with_curr_manager    IS NULL;

    IF null_count > 0 THEN
        RAISE WARNING 'NULL audit: % row(s) contain at least one NULL in a critical column.', null_count;
    ELSE
        RAISE NOTICE 'NULL audit: PASSED – no NULLs found in critical columns.';
    END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 2. Standardise categorical labels (trim whitespace, normalise casing)
-- ---------------------------------------------------------------------------

-- BusinessTravel variants → canonical form
UPDATE employees
SET business_travel = CASE
    WHEN LOWER(TRIM(business_travel)) IN ('non-travel', 'no travel', 'nontravel') THEN 'Non-Travel'
    WHEN LOWER(TRIM(business_travel)) LIKE 'travel_rarely%'  OR LOWER(TRIM(business_travel)) = 'rarely'  THEN 'Travel_Rarely'
    WHEN LOWER(TRIM(business_travel)) LIKE 'travel_frequent%' OR LOWER(TRIM(business_travel)) = 'frequently' THEN 'Travel_Frequently'
    ELSE business_travel   -- already canonical – leave unchanged
END
WHERE business_travel <> CASE
    WHEN LOWER(TRIM(business_travel)) IN ('non-travel', 'no travel', 'nontravel') THEN 'Non-Travel'
    WHEN LOWER(TRIM(business_travel)) LIKE 'travel_rarely%'  OR LOWER(TRIM(business_travel)) = 'rarely'  THEN 'Travel_Rarely'
    WHEN LOWER(TRIM(business_travel)) LIKE 'travel_frequent%' OR LOWER(TRIM(business_travel)) = 'frequently' THEN 'Travel_Frequently'
    ELSE business_travel
END;

-- Gender: title-case
UPDATE employees
SET gender = INITCAP(TRIM(gender))
WHERE gender <> INITCAP(TRIM(gender));

-- MaritalStatus: title-case
UPDATE employees
SET marital_status = INITCAP(TRIM(marital_status))
WHERE marital_status <> INITCAP(TRIM(marital_status));

-- Attrition / OverTime: ensure exact 'Yes'/'No' (trim + title-case)
UPDATE employees SET attrition = INITCAP(TRIM(attrition)) WHERE attrition <> INITCAP(TRIM(attrition));
UPDATE employees SET over_time  = INITCAP(TRIM(over_time))  WHERE over_time  <> INITCAP(TRIM(over_time));

-- ---------------------------------------------------------------------------
-- 3. Categorical distribution checks (informational)
-- ---------------------------------------------------------------------------
\echo '=== Attrition distribution ==='
SELECT attrition, COUNT(*) AS n, ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct
FROM employees
GROUP BY attrition
ORDER BY attrition;

\echo '=== Department distribution ==='
SELECT department, COUNT(*) AS n
FROM employees
GROUP BY department
ORDER BY department;

\echo '=== BusinessTravel distribution ==='
SELECT business_travel, COUNT(*) AS n
FROM employees
GROUP BY business_travel
ORDER BY business_travel;

\echo '=== Gender distribution ==='
SELECT gender, COUNT(*) AS n
FROM employees
GROUP BY gender
ORDER BY gender;

\echo '=== MaritalStatus distribution ==='
SELECT marital_status, COUNT(*) AS n
FROM employees
GROUP BY marital_status
ORDER BY marital_status;

-- ---------------------------------------------------------------------------
-- 4. Numeric sanity checks
-- ---------------------------------------------------------------------------
\echo '=== Numeric range summary ==='
SELECT
    MIN(age)                        AS min_age,
    MAX(age)                        AS max_age,
    MIN(monthly_income)             AS min_income,
    MAX(monthly_income)             AS max_income,
    MIN(years_at_company)           AS min_tenure,
    MAX(years_at_company)           AS max_tenure,
    MIN(total_working_years)        AS min_exp,
    MAX(total_working_years)        AS max_exp
FROM employees;

-- Flag rows where YearsAtCompany > TotalWorkingYears (data quality check)
\echo '=== Rows where years_at_company > total_working_years ==='
SELECT COUNT(*) AS suspicious_rows
FROM employees
WHERE years_at_company > total_working_years;

-- ---------------------------------------------------------------------------
-- 5. Constant-column verification (IBM dataset artefacts)
-- ---------------------------------------------------------------------------
\echo '=== Constant columns (should each show exactly 1 distinct value) ==='
SELECT
    COUNT(DISTINCT employee_count) AS distinct_employee_count,   -- expected: 1
    COUNT(DISTINCT standard_hours) AS distinct_standard_hours,   -- expected: 1
    COUNT(DISTINCT over18)         AS distinct_over18            -- expected: 1
FROM employees;
