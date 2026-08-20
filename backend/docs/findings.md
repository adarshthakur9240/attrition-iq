# AttritionIQ: Key Business Findings & Telemetry Insights

Based on our analysis of the 1,470 employee records using the PostgreSQL analytics engine and the machine learning inference model, here are the core findings:

### 1. Overall attrition rate and how OverTime employees compare
The baseline company-wide attrition rate stands at **16.12%** (237 departures out of 1,470 employees). However, working overtime acts as a massive multiplier for burnout. Employees who consistently work overtime exhibit an attrition rate of nearly **30.5%**, compared to just ~10.4% for those who do not. Overtime is statistically one of the strongest singular indicators of flight risk.

### 2. Which department has highest attrition and why
The **Sales division** experiences the highest turnover at **20.63%** (92 departures out of 446 staff), significantly above the company average. By cross-referencing this with role-specific telemetry, the high churn is primarily driven by "Sales Representatives." This cohort suffers from a toxic combination of high travel frequency, lower baseline Work-Life Balance scores, and lower median base salaries compared to established R&D technical roles. 

### 3. Salary band vs attrition — is money the biggest driver or not?
Money is a critical retention threshold, but not the absolute biggest driver once basic needs are met. Employees in the lowest salary band (entry-level, typically `< $3,000/month`) exhibit the highest flight risk (exceeding 30% attrition). However, beyond the middle-income brackets, financial incentives diminish in impact. At higher salary bands, cultural factors—specifically OverTime expectations, Distance from Home, and Environment Satisfaction—heavily outweigh purely financial motives. 

### 4. Promotion gap effect — do employees who go 3+ years without promotion leave more?
Yes, career stagnation is a clear catalyst. Employees who go **3 or more years without a promotion** show a marked increase in departure rates. The data reveals a critical "flight window" where talent that feels stagnant begins actively seeking external growth opportunities, highlighting a gap in the organization's internal mobility pipeline.

### 5. Model's precision/recall — how good is it at catching real flight risks?
The classification model was specifically optimized for **Recall**, achieving **~85% recall** on the minority class (at-risk employees) with an overall **ROC-AUC of 0.84**. In a business context, this means the model successfully flags 85 out of 100 employees who are actually going to quit. We prioritized recall over precision because the business cost of a false positive (giving a happy employee an unnecessary retention check-in) is vastly lower than the cost of a false negative (losing top talent unexpectedly).

### 6. The single highest-risk employee profile from `v_high_risk_profile`
Based on our live ML inference API and SQL views, the ultimate high-risk profile yields a staggering **99.01% Flight Probability**. The anatomy of this profile looks like this:
*   **Demographics:** 28-year-old, Single.
*   **Role:** Sales Representative earning $3,200/month.
*   **Behaviors:** Works OverTime, Travels Frequently, 15 miles commute.
*   **Sentiment:** Job Satisfaction: 1 (Low), Work-Life Balance: 1 (Bad).
*   **XAI (Explainable AI) Drivers:** The model's feature-importance weights mathematically isolate `Over_Time_Yes` (+1.59 impact) and `Travel_Frequently` (+1.42 impact) as the absolute primary catalysts pushing this employee out the door.