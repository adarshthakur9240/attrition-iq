/**
 * lib/api.ts
 * Typed client API functions for all AttritionIQ backend endpoints.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Types ──────────────────────────────────────────────────────────────────

export interface AttritionOverview {
  total_employees: number;
  total_left: number;
  attrition_rate_pct: number;
}

export interface AttritionByDepartment {
  department: string;
  total_employees: number;
  total_left: number;
  attrition_rate_pct: number;
}

export interface AttritionBySalaryBand {
  salary_band: string;
  band_order: number;
  total_employees: number;
  total_left: number;
  attrition_rate_pct: number;
  avg_monthly_income: number;
}

export interface AttritionByOvertime {
  over_time: string;
  total_employees: number;
  total_left: number;
  attrition_rate_pct: number;
}

export interface AttritionBySatisfaction {
  satisfaction_level: number;
  satisfaction_label: string;
  total_employees: number;
  total_left: number;
  attrition_rate_pct: number;
}

export interface AttritionByWorklifeBalance {
  wlb_level: number;
  wlb_label: string;
  total_employees: number;
  total_left: number;
  attrition_rate_pct: number;
}

export interface AttritionByAgeGroup {
  age_group: string;
  group_order: number;
  total_employees: number;
  total_left: number;
  attrition_rate_pct: number;
  avg_monthly_income: number;
}

export interface AttritionByPromotionGap {
  promotion_gap_band: string;
  band_order: number;
  total_employees: number;
  total_left: number;
  attrition_rate_pct: number;
  avg_years_since_promotion: number;
}

export interface HighRiskProfile {
  department: string;
  job_role: string;
  over_time: string;
  cohort_size: number;
  total_left: number;
  attrition_rate_pct: number;
  avg_monthly_income: number;
  avg_years_since_promotion: number;
  avg_job_satisfaction: number;
  avg_work_life_balance: number;
}

export interface PredictionRequest {
  age?: number;
  gender?: string;
  department?: string;
  job_role?: string;
  job_level?: number;
  job_involvement?: number;
  job_satisfaction?: number;
  business_travel?: string;
  distance_from_home?: number;
  education?: number;
  education_field?: string;
  daily_rate?: number;
  hourly_rate?: number;
  monthly_rate?: number;
  monthly_income?: number;
  percent_salary_hike?: number;
  stock_option_level?: number;
  environment_satisfaction?: number;
  relationship_satisfaction?: number;
  work_life_balance?: number;
  performance_rating?: number;
  num_companies_worked?: number;
  total_working_years?: number;
  years_at_company?: number;
  years_in_current_role?: number;
  years_since_last_promotion?: number;
  years_with_curr_manager?: number;
  training_times_last_year?: number;
  over_time?: string;
  marital_status?: string;
}

export interface ContributingFactor {
  feature: string;
  importance: number;
}

export interface PredictionResponse {
  risk_score: number;
  risk_label: "Low" | "Medium" | "High";
  top_contributing_factors: ContributingFactor[];
}

export interface FullAnalyticsData {
  overview: AttritionOverview;
  byDepartment: AttritionByDepartment[];
  bySalary: AttritionBySalaryBand[];
  byOvertime: AttritionByOvertime[];
  bySatisfaction: AttritionBySatisfaction[];
  byWorklifeBalance: AttritionByWorklifeBalance[];
  byAgeGroup: AttritionByAgeGroup[];
  byPromotionGap: AttritionByPromotionGap[];
  highRiskProfiles: HighRiskProfile[];
}

// ── Generic Fetch Helper ───────────────────────────────────────────────────

async function getJson<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(`API error ${res.status} on ${endpoint}: ${errorText}`);
  }

  return res.json();
}

// ── Endpoint Functions ─────────────────────────────────────────────────────

export async function fetchOverview(): Promise<AttritionOverview[]> {
  return getJson<AttritionOverview[]>("/analytics/overview");
}

export async function fetchByDepartment(): Promise<AttritionByDepartment[]> {
  return getJson<AttritionByDepartment[]>("/analytics/by-department");
}

export async function fetchBySalary(): Promise<AttritionBySalaryBand[]> {
  return getJson<AttritionBySalaryBand[]>("/analytics/by-salary");
}

export async function fetchByOvertime(): Promise<AttritionByOvertime[]> {
  return getJson<AttritionByOvertime[]>("/analytics/by-overtime");
}

export async function fetchBySatisfaction(): Promise<AttritionBySatisfaction[]> {
  return getJson<AttritionBySatisfaction[]>("/analytics/by-satisfaction");
}

export async function fetchByWorklifeBalance(): Promise<AttritionByWorklifeBalance[]> {
  return getJson<AttritionByWorklifeBalance[]>("/analytics/by-worklife-balance");
}

export async function fetchByAgeGroup(): Promise<AttritionByAgeGroup[]> {
  return getJson<AttritionByAgeGroup[]>("/analytics/by-age-group");
}

export async function fetchByPromotionGap(): Promise<AttritionByPromotionGap[]> {
  return getJson<AttritionByPromotionGap[]>("/analytics/by-promotion-gap");
}

export async function fetchHighRiskProfiles(): Promise<HighRiskProfile[]> {
  return getJson<HighRiskProfile[]>("/analytics/high-risk-profiles");
}

export async function predictRisk(
  payload: PredictionRequest
): Promise<PredictionResponse> {
  const url = `${API_BASE_URL}/predict/risk`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(`API error ${res.status} on /predict/risk: ${errorText}`);
  }

  return res.json();
}

/**
 * Fetch all 9 analytics views concurrently.
 */
export async function fetchAllAnalytics(): Promise<FullAnalyticsData> {
  const [
    overviewList,
    byDepartment,
    bySalary,
    byOvertime,
    bySatisfaction,
    byWorklifeBalance,
    byAgeGroup,
    byPromotionGap,
    highRiskProfiles,
  ] = await Promise.all([
    fetchOverview(),
    fetchByDepartment(),
    fetchBySalary(),
    fetchByOvertime(),
    fetchBySatisfaction(),
    fetchByWorklifeBalance(),
    fetchByAgeGroup(),
    fetchByPromotionGap(),
    fetchHighRiskProfiles(),
  ]);

  const overview = overviewList[0] || {
    total_employees: 1470,
    total_left: 237,
    attrition_rate_pct: 16.12,
  };

  return {
    overview,
    byDepartment,
    bySalary,
    byOvertime,
    bySatisfaction,
    byWorklifeBalance,
    byAgeGroup,
    byPromotionGap,
    highRiskProfiles,
  };
}
