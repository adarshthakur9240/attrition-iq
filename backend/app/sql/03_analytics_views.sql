-- =============================================================================
-- 03_analytics_views.sql
-- Analytics layer for the IBM HR Attrition dataset.
-- All objects are CREATE OR REPLACE so this file is safe to re-run at any time.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. v_attrition_overview
-- Business question: What is the headline attrition situation?
--   Returns a single-row KPI card with total headcount, total leavers and the
--   overall attrition rate — the first number every executive asks for.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_attrition_overview AS
SELECT
    COUNT(*)                                                        AS total_employees,
    SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END)             AS total_left,
    ROUND(
        100.0 * SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END)
              / COUNT(*),
        2
    )                                                               AS attrition_rate_pct
FROM employees;


-- -----------------------------------------------------------------------------
-- 2. v_attrition_by_department
-- Business question: Which department bleeds talent the most?
--   Shows headcount, leavers and attrition % for each department, sorted by
--   attrition rate descending so problem departments surface immediately.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_attrition_by_department AS
SELECT
    department,
    COUNT(*)                                                        AS total_employees,
    SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END)             AS total_left,
    ROUND(
        100.0 * SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END)
              / COUNT(*),
        2
    )                                                               AS attrition_rate_pct
FROM employees
GROUP BY department
ORDER BY attrition_rate_pct DESC;


-- -----------------------------------------------------------------------------
-- 3. v_attrition_by_salary_band
-- Business question: Are lower-paid employees more likely to quit?
--   Buckets MonthlyIncome into four intuitive bands and computes attrition %
--   per band, with avg salary included for context.
--   Band thresholds (USD/month): Low <3k | Mid 3k-6k | Upper-Mid 6k-10k | High ≥10k
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_attrition_by_salary_band AS
SELECT
    CASE
        WHEN monthly_income <  3000  THEN 'Low (<$3k)'
        WHEN monthly_income <  6000  THEN 'Mid ($3k–$6k)'
        WHEN monthly_income < 10000  THEN 'Upper-Mid ($6k–$10k)'
        ELSE                              'High (≥$10k)'
    END                                                             AS salary_band,
    CASE
        WHEN monthly_income <  3000  THEN 1
        WHEN monthly_income <  6000  THEN 2
        WHEN monthly_income < 10000  THEN 3
        ELSE                              4
    END                                                             AS band_order,
    COUNT(*)                                                        AS total_employees,
    SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END)             AS total_left,
    ROUND(
        100.0 * SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END)
              / COUNT(*),
        2
    )                                                               AS attrition_rate_pct,
    ROUND(AVG(monthly_income), 0)                                   AS avg_monthly_income
FROM employees
GROUP BY salary_band, band_order
ORDER BY band_order;


-- -----------------------------------------------------------------------------
-- 4. v_attrition_by_overtime
-- Business question: Does working overtime drive people to quit?
--   A simple two-row comparison of attrition % for employees who do/don't
--   work overtime — one of the strongest predictors in the IBM dataset.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_attrition_by_overtime AS
SELECT
    over_time,
    COUNT(*)                                                        AS total_employees,
    SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END)             AS total_left,
    ROUND(
        100.0 * SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END)
              / COUNT(*),
        2
    )                                                               AS attrition_rate_pct
FROM employees
GROUP BY over_time
ORDER BY over_time DESC;   -- 'Yes' first


-- -----------------------------------------------------------------------------
-- 5. v_attrition_by_satisfaction
-- Business question: How does job satisfaction level correlate with attrition?
--   Maps numeric satisfaction codes (1–4) to human-readable labels and shows
--   the attrition rate at each level — reveals whether disengaged employees quit.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_attrition_by_satisfaction AS
SELECT
    job_satisfaction                                                AS satisfaction_level,
    CASE job_satisfaction
        WHEN 1 THEN 'Low'
        WHEN 2 THEN 'Medium'
        WHEN 3 THEN 'High'
        WHEN 4 THEN 'Very High'
    END                                                             AS satisfaction_label,
    COUNT(*)                                                        AS total_employees,
    SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END)             AS total_left,
    ROUND(
        100.0 * SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END)
              / COUNT(*),
        2
    )                                                               AS attrition_rate_pct
FROM employees
GROUP BY job_satisfaction
ORDER BY job_satisfaction;


-- -----------------------------------------------------------------------------
-- 6. v_attrition_by_worklife_balance
-- Business question: Does poor work-life balance predict turnover?
--   Mirrors the satisfaction view but for the WorkLifeBalance dimension (1–4),
--   helping HR identify whether balance improvement programmes are warranted.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_attrition_by_worklife_balance AS
SELECT
    work_life_balance                                               AS wlb_level,
    CASE work_life_balance
        WHEN 1 THEN 'Bad'
        WHEN 2 THEN 'Good'
        WHEN 3 THEN 'Better'
        WHEN 4 THEN 'Best'
    END                                                             AS wlb_label,
    COUNT(*)                                                        AS total_employees,
    SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END)             AS total_left,
    ROUND(
        100.0 * SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END)
              / COUNT(*),
        2
    )                                                               AS attrition_rate_pct
FROM employees
GROUP BY work_life_balance
ORDER BY work_life_balance;


-- -----------------------------------------------------------------------------
-- 7. v_attrition_by_age_group
-- Business question: Which career stage sees the most departures, and are
--   younger employees leaving for higher salaries elsewhere?
--   Buckets age into four career-stage bands and adds avg salary per band so
--   compensation gaps across generations are immediately visible.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_attrition_by_age_group AS
SELECT
    CASE
        WHEN age < 25              THEN 'Under 25'
        WHEN age BETWEEN 25 AND 34 THEN '25–34'
        WHEN age BETWEEN 35 AND 44 THEN '35–44'
        ELSE                            'Over 44'
    END                                                             AS age_group,
    CASE
        WHEN age < 25              THEN 1
        WHEN age BETWEEN 25 AND 34 THEN 2
        WHEN age BETWEEN 35 AND 44 THEN 3
        ELSE                            4
    END                                                             AS group_order,
    COUNT(*)                                                        AS total_employees,
    SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END)             AS total_left,
    ROUND(
        100.0 * SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END)
              / COUNT(*),
        2
    )                                                               AS attrition_rate_pct,
    ROUND(AVG(monthly_income), 0)                                   AS avg_monthly_income
FROM employees
GROUP BY age_group, group_order
ORDER BY group_order;


-- -----------------------------------------------------------------------------
-- 8. v_attrition_by_promotion_gap
-- Business question: Are employees who feel "stuck" (no recent promotion) more
--   likely to leave?
--   Buckets YearsSinceLastPromotion into 0 / 1-2 / 3-5 / 6+ years and shows
--   attrition rate per bucket, highlighting the cost of stalled career growth.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_attrition_by_promotion_gap AS
SELECT
    CASE
        WHEN years_since_last_promotion = 0             THEN 'Just promoted (0 yrs)'
        WHEN years_since_last_promotion BETWEEN 1 AND 2 THEN '1–2 years'
        WHEN years_since_last_promotion BETWEEN 3 AND 5 THEN '3–5 years'
        ELSE                                                 '6+ years'
    END                                                             AS promotion_gap_band,
    CASE
        WHEN years_since_last_promotion = 0             THEN 1
        WHEN years_since_last_promotion BETWEEN 1 AND 2 THEN 2
        WHEN years_since_last_promotion BETWEEN 3 AND 5 THEN 3
        ELSE                                                 4
    END                                                             AS band_order,
    COUNT(*)                                                        AS total_employees,
    SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END)             AS total_left,
    ROUND(
        100.0 * SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END)
              / COUNT(*),
        2
    )                                                               AS attrition_rate_pct,
    ROUND(AVG(years_since_last_promotion), 1)                       AS avg_years_since_promotion
FROM employees
GROUP BY promotion_gap_band, band_order
ORDER BY band_order;


-- -----------------------------------------------------------------------------
-- 9. v_high_risk_profile
-- Business question: Which specific role × department × overtime combinations
--   are haemorrhaging staff — and what does their profile look like?
--   Groups by Department + JobRole + OverTime (cohorts of ≥10 employees) and
--   surfaces attrition %, avg salary and avg promotion gap so HR can target
--   retention programmes at the highest-risk pockets of the workforce.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_high_risk_profile AS
SELECT
    department,
    job_role,
    over_time,
    COUNT(*)                                                        AS cohort_size,
    SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END)             AS total_left,
    ROUND(
        100.0 * SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END)
              / COUNT(*),
        2
    )                                                               AS attrition_rate_pct,
    ROUND(AVG(monthly_income), 0)                                   AS avg_monthly_income,
    ROUND(AVG(years_since_last_promotion), 1)                       AS avg_years_since_promotion,
    ROUND(AVG(job_satisfaction), 2)                                 AS avg_job_satisfaction,
    ROUND(AVG(work_life_balance), 2)                                AS avg_work_life_balance
FROM employees
GROUP BY department, job_role, over_time
HAVING COUNT(*) >= 10
ORDER BY attrition_rate_pct DESC;
