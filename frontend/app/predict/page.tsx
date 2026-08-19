"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ClayPanel } from "@/components/clay/clay-panel";
import { ClayCard } from "@/components/clay/clay-card";
import { ClayButton } from "@/components/clay/clay-button";
import {
  ClayInput,
  ClaySelect,
  ClaySlider,
  ClaySegmented,
} from "@/components/clay/clay-form-controls";
import {
  ScannerLoading,
  ScannerResult,
} from "@/components/clay/scanner-result";
import { DashboardError } from "@/components/clay/dashboard-error";
import { predictRisk, PredictionRequest, PredictionResponse } from "@/lib/api";
import {
  Radar,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Briefcase,
  Clock,
  DollarSign,
  Heart,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from "lucide-react";

// Default median values
const DEFAULT_FORM_VALUES: PredictionRequest = {
  age: 36,
  gender: "Male",
  department: "Research & Development",
  job_role: "Research Scientist",
  job_level: 2,
  job_involvement: 3,
  job_satisfaction: 3,
  business_travel: "Travel_Rarely",
  distance_from_home: 7,
  education: 3,
  education_field: "Life Sciences",
  daily_rate: 802,
  hourly_rate: 66,
  monthly_rate: 14236,
  monthly_income: 5000,
  percent_salary_hike: 14,
  stock_option_level: 1,
  environment_satisfaction: 3,
  relationship_satisfaction: 3,
  work_life_balance: 3,
  performance_rating: 3,
  num_companies_worked: 2,
  total_working_years: 10,
  years_at_company: 7,
  years_in_current_role: 4,
  years_since_last_promotion: 2,
  years_with_curr_manager: 4,
  training_times_last_year: 3,
  over_time: "No",
  marital_status: "Married",
};

// Preset Profiles for instant high/low risk testing
const PRESET_HIGH_RISK: Partial<PredictionRequest> = {
  department: "Sales",
  job_role: "Sales Representative",
  over_time: "Yes",
  monthly_income: 2400,
  business_travel: "Travel_Frequently",
  years_since_last_promotion: 4,
  job_satisfaction: 1,
  work_life_balance: 1,
  environment_satisfaction: 1,
  marital_status: "Single",
  total_working_years: 3,
  years_at_company: 2,
  distance_from_home: 18,
};

const PRESET_LOW_RISK: Partial<PredictionRequest> = {
  department: "Research & Development",
  job_role: "Research Director",
  over_time: "No",
  monthly_income: 16500,
  business_travel: "Non-Travel",
  years_since_last_promotion: 0,
  job_satisfaction: 4,
  work_life_balance: 3,
  environment_satisfaction: 4,
  marital_status: "Married",
  total_working_years: 22,
  years_at_company: 15,
  distance_from_home: 3,
};

const PRESET_MODERATE_RISK: Partial<PredictionRequest> = {
  department: "Research & Development",
  job_role: "Laboratory Technician",
  over_time: "Yes",
  monthly_income: 3300,
  business_travel: "Travel_Rarely",
  years_since_last_promotion: 2,
  job_satisfaction: 2,
  work_life_balance: 2,
  marital_status: "Single",
  total_working_years: 6,
  years_at_company: 4,
  distance_from_home: 9,
};

export default function PredictPage() {
  const [formData, setFormData] = useState<PredictionRequest>(DEFAULT_FORM_VALUES);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const applyPreset = (name: string, preset: Partial<PredictionRequest>) => {
    setActivePreset(name);
    setFormData((prev) => ({
      ...prev,
      ...preset,
    }));
  };

  const handleReset = () => {
    setActivePreset(null);
    setFormData(DEFAULT_FORM_VALUES);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Keep scanning animation visible for at least 700ms for a satisfying tactile experience
    const startTime = Date.now();

    try {
      const response = await predictRisk(formData);
      const elapsed = Date.now() - startTime;
      const delayNeeded = Math.max(0, 750 - elapsed);

      setTimeout(() => {
        setResult(response);
        setLoading(false);
      }, delayNeeded);
    } catch (err: any) {
      console.error("Prediction error:", err);
      setError(err.message || "Failed to execute risk inference.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f3f5f8] px-4 py-8 sm:px-8 sm:py-10">
      {/* Background ambient lighting */}
      <div className="clay-ambient-glow glow-terracotta -left-40 top-10 h-[550px] w-[550px]" />
      <div className="clay-ambient-glow glow-slate right-0 top-[350px] h-[500px] w-[500px]" />

      <div className="relative z-10 mx-auto max-w-6xl space-y-10">
        {/* TOP BREADCRUMB & HEADER */}
        <div className="flex flex-col justify-between gap-4 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8c93a8]">
              <Link
                href="/"
                className="inline-flex items-center gap-1 transition hover:text-[#f3f5f8]"
              >
                <ArrowLeft className="h-3 w-3" />
                Landing
              </Link>
              <ChevronRight className="h-3 w-3 text-[#545b70]" />
              <Link
                href="/dashboard"
                className="transition hover:text-[#f3f5f8]"
              >
                Dashboard
              </Link>
              <ChevronRight className="h-3 w-3 text-[#545b70]" />
              <span className="text-[#e86034]">Risk Scanner</span>
            </div>
            <h1 className="font-display text-2xl font-extrabold text-[#f3f5f8] sm:text-3xl">
              Real-Time Flight Risk Scanner
            </h1>
            <p className="text-xs text-[#8c93a8]">
              Evaluate individual employee profiles using the trained class-balanced logistic model
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-[16px] bg-[#131722] px-4 py-2 text-xs font-semibold text-[#f3f5f8] [box-shadow:var(--shadow-clay-card)] border border-white/[0.08] hover:bg-[#1a2030] transition"
            >
              <Layers className="h-3.5 w-3.5 text-[#2a9d8f]" />
              Company Analytics
            </Link>
          </div>
        </div>

        {/* SCANNER VIEW LOGIC */}
        <AnimatePresence mode="wait">
          {/* 1. LOADING RADAR STATE */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <ScannerLoading />
            </motion.div>
          )}

          {/* 2. ERROR STATE */}
          {error && !loading && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <DashboardError message={error} onRetry={handleSubmit as any} />
            </motion.div>
          )}

          {/* 3. RESULT VIEW */}
          {result && !loading && !error && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ScannerResult result={result} onReset={handleReset} />
            </motion.div>
          )}

          {/* 4. INTERACTIVE FORM VIEW */}
          {!result && !loading && !error && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-8"
            >
              {/* Quick Sample Presets Strip */}
              <ClayCard variant="default" className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8c93a8]">
                    <Sparkles className="h-4 w-4 text-[#e86034]" />
                    Quick Telemetry Presets:
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => applyPreset("high", PRESET_HIGH_RISK)}
                      className={`inline-flex items-center gap-1.5 rounded-[12px] px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                        activePreset === "high"
                          ? "bg-[#e86034] text-white [box-shadow:var(--shadow-clay-btn-primary)]"
                          : "bg-[#1a2030] text-[#fa7347] hover:bg-[#252c42] border border-[#e86034]/20"
                      }`}
                    >
                      <AlertTriangle className="h-3 w-3" />
                      Critical Flight Risk Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => applyPreset("low", PRESET_LOW_RISK)}
                      className={`inline-flex items-center gap-1.5 rounded-[12px] px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                        activePreset === "low"
                          ? "bg-[#2a9d8f] text-white [box-shadow:var(--shadow-clay-btn-primary)]"
                          : "bg-[#1a2030] text-[#2a9d8f] hover:bg-[#252c42] border border-[#2a9d8f]/20"
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Retained Senior Leader
                    </button>

                    <button
                      type="button"
                      onClick={() => applyPreset("moderate", PRESET_MODERATE_RISK)}
                      className={`inline-flex items-center gap-1.5 rounded-[12px] px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                        activePreset === "moderate"
                          ? "bg-[#eab308] text-black font-bold [box-shadow:var(--shadow-clay-btn-primary)]"
                          : "bg-[#1a2030] text-[#eab308] hover:bg-[#252c42] border border-[#eab308]/20"
                      }`}
                    >
                      <ShieldAlert className="h-3 w-3" />
                      Moderate Transition Case
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1 rounded-[12px] bg-white/[0.05] px-2.5 py-1.5 text-xs font-medium text-[#8c93a8] hover:text-white transition cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reset
                    </button>
                  </div>
                </div>
              </ClayCard>

              {/* Multi-Section Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* SECTION 1: ROLE & DEPARTMENT */}
                <ClayPanel
                  title="1. Role & Organizational Placement"
                  subtitle="Primary department alignment and job hierarchy"
                  badge={
                    <div className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-[#1a2030] text-[#e86034]">
                      <Briefcase className="h-4 w-4" />
                    </div>
                  }
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <ClaySelect
                      label="Department"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      options={[
                        { value: "Sales", label: "Sales (20.6% Attrition)" },
                        {
                          value: "Research & Development",
                          label: "Research & Development (13.8%)",
                        },
                        {
                          value: "Human Resources",
                          label: "Human Resources (19.1%)",
                        },
                      ]}
                    />

                    <ClaySelect
                      label="Job Role"
                      value={formData.job_role}
                      onChange={(e) =>
                        setFormData({ ...formData, job_role: e.target.value })
                      }
                      options={[
                        {
                          value: "Sales Representative",
                          label: "Sales Representative (High Risk)",
                        },
                        {
                          value: "Laboratory Technician",
                          label: "Laboratory Technician (High Risk)",
                        },
                        {
                          value: "Research Scientist",
                          label: "Research Scientist",
                        },
                        {
                          value: "Sales Executive",
                          label: "Sales Executive",
                        },
                        {
                          value: "Healthcare Representative",
                          label: "Healthcare Representative",
                        },
                        {
                          value: "Manufacturing Director",
                          label: "Manufacturing Director",
                        },
                        { value: "Manager", label: "Manager" },
                        {
                          value: "Research Director",
                          label: "Research Director (Stable)",
                        },
                        {
                          value: "Human Resources",
                          label: "Human Resources",
                        },
                      ]}
                    />

                    <ClaySelect
                      label="Marital Status"
                      value={formData.marital_status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          marital_status: e.target.value,
                        })
                      }
                      options={[
                        { value: "Single", label: "Single (Higher Mobility)" },
                        { value: "Married", label: "Married" },
                        { value: "Divorced", label: "Divorced" },
                      ]}
                    />

                    <div className="sm:col-span-2 lg:col-span-3">
                      <ClaySlider
                        label="Employee Age"
                        value={formData.age || 36}
                        min={18}
                        max={65}
                        unit="yrs"
                        minLabel="18 yrs (Early Career)"
                        maxLabel="65 yrs"
                        onChange={(val) =>
                          setFormData({ ...formData, age: val })
                        }
                      />
                    </div>
                  </div>
                </ClayPanel>

                {/* SECTION 2: WORKLOAD, TRAVEL & PROMOTION */}
                <ClayPanel
                  title="2. Workload, Travel & Promotion Dynamics"
                  subtitle="High-coefficient friction predictors: overtime and travel frequency"
                  badge={
                    <div className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-[#1a2030] text-[#e86034]">
                      <Clock className="h-4 w-4" />
                    </div>
                  }
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <ClaySegmented
                      label="Mandatory Overtime (#1 Predictor)"
                      value={formData.over_time || "No"}
                      onChange={(val) =>
                        setFormData({ ...formData, over_time: val })
                      }
                      options={[
                        { value: "Yes", label: "Overtime: Yes (30.5% Rate)" },
                        { value: "No", label: "Overtime: No (10.4% Rate)" },
                      ]}
                      helperText="Overtime accounts for +9.1% of global model feature importance"
                    />

                    <ClaySegmented
                      label="Business Travel Frequency"
                      value={formData.business_travel || "Travel_Rarely"}
                      onChange={(val) =>
                        setFormData({ ...formData, business_travel: val })
                      }
                      options={[
                        { value: "Non-Travel", label: "None" },
                        { value: "Travel_Rarely", label: "Rare" },
                        { value: "Travel_Frequently", label: "Frequent" },
                      ]}
                      helperText="Frequent travel doubles flight probability"
                    />

                    <ClaySlider
                      label="Years Since Last Promotion"
                      value={formData.years_since_last_promotion || 0}
                      min={0}
                      max={12}
                      unit="yrs"
                      minLabel="0y (Recent)"
                      maxLabel="12y (Stalled)"
                      helperText="Promotion gaps &gt;3 years increase churn by 35%"
                      onChange={(val) =>
                        setFormData({
                          ...formData,
                          years_since_last_promotion: val,
                        })
                      }
                    />

                    <ClaySlider
                      label="Commute Distance From Home"
                      value={formData.distance_from_home || 7}
                      min={1}
                      max={30}
                      unit="miles"
                      minLabel="1 mi (Local)"
                      maxLabel="30 mi"
                      onChange={(val) =>
                        setFormData({
                          ...formData,
                          distance_from_home: val,
                        })
                      }
                    />
                  </div>
                </ClayPanel>

                {/* SECTION 3: COMPENSATION & TENURE */}
                <ClayPanel
                  title="3. Compensation & Career Experience"
                  subtitle="Base salary bands and tenure indicators"
                  badge={
                    <div className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-[#1a2030] text-[#2a9d8f]">
                      <DollarSign className="h-4 w-4" />
                    </div>
                  }
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <ClaySlider
                      label="Monthly Income"
                      value={formData.monthly_income || 5000}
                      min={1500}
                      max={20000}
                      step={250}
                      unit="USD"
                      minLabel="$1.5k (<$3k high risk)"
                      maxLabel="$20k"
                      onChange={(val) =>
                        setFormData({ ...formData, monthly_income: val })
                      }
                    />

                    <ClaySlider
                      label="Total Working Years"
                      value={formData.total_working_years || 10}
                      min={0}
                      max={40}
                      unit="yrs"
                      minLabel="0 yrs"
                      maxLabel="40 yrs"
                      onChange={(val) =>
                        setFormData({
                          ...formData,
                          total_working_years: val,
                        })
                      }
                    />

                    <ClaySlider
                      label="Years at Current Company"
                      value={formData.years_at_company || 7}
                      min={0}
                      max={30}
                      unit="yrs"
                      minLabel="0 yrs"
                      maxLabel="30 yrs"
                      onChange={(val) =>
                        setFormData({
                          ...formData,
                          years_at_company: val,
                        })
                      }
                    />

                    <ClaySlider
                      label="Years With Current Manager"
                      value={formData.years_with_curr_manager || 4}
                      min={0}
                      max={20}
                      unit="yrs"
                      minLabel="0 yrs (New Manager)"
                      maxLabel="20 yrs"
                      onChange={(val) =>
                        setFormData({
                          ...formData,
                          years_with_curr_manager: val,
                        })
                      }
                    />
                  </div>
                </ClayPanel>

                {/* SECTION 4: SATISFACTION & WORK-LIFE BALANCE */}
                <ClayPanel
                  title="4. Satisfaction & Balance Ratings"
                  subtitle="Subjective workforce sentiment scores (1 to 4 scale)"
                  badge={
                    <div className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-[#1a2030] text-[#eab308]">
                      <Heart className="h-4 w-4" />
                    </div>
                  }
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <ClaySegmented
                      label="Job Satisfaction"
                      value={String(formData.job_satisfaction || 3)}
                      onChange={(val) =>
                        setFormData({
                          ...formData,
                          job_satisfaction: Number(val),
                        })
                      }
                      options={[
                        { value: "1", label: "1: Low" },
                        { value: "2", label: "2: Med" },
                        { value: "3", label: "3: High" },
                        { value: "4", label: "4: Very High" },
                      ]}
                    />

                    <ClaySegmented
                      label="Work-Life Balance"
                      value={String(formData.work_life_balance || 3)}
                      onChange={(val) =>
                        setFormData({
                          ...formData,
                          work_life_balance: Number(val),
                        })
                      }
                      options={[
                        { value: "1", label: "1: Bad" },
                        { value: "2", label: "2: Good" },
                        { value: "3", label: "3: Better" },
                        { value: "4", label: "4: Best" },
                      ]}
                    />

                    <ClaySegmented
                      label="Environment Satisfaction"
                      value={String(formData.environment_satisfaction || 3)}
                      onChange={(val) =>
                        setFormData({
                          ...formData,
                          environment_satisfaction: Number(val),
                        })
                      }
                      options={[
                        { value: "1", label: "1: Low" },
                        { value: "2", label: "2: Med" },
                        { value: "3", label: "3: High" },
                        { value: "4", label: "4: Very High" },
                      ]}
                    />

                    <ClaySegmented
                      label="Job Involvement"
                      value={String(formData.job_involvement || 3)}
                      onChange={(val) =>
                        setFormData({
                          ...formData,
                          job_involvement: Number(val),
                        })
                      }
                      options={[
                        { value: "1", label: "1: Low" },
                        { value: "2", label: "2: Med" },
                        { value: "3", label: "3: High" },
                        { value: "4", label: "4: Very High" },
                      ]}
                    />
                  </div>
                </ClayPanel>

                {/* SUBMIT BUTTON BAR */}
                <div className="sticky bottom-6 z-40 rounded-[24px] bg-[#131722]/90 p-4 backdrop-blur-xl [box-shadow:var(--shadow-clay-card-raised)] border border-white/[0.1] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-[#8c93a8]">
                    <Sparkles className="h-4 w-4 text-[#e86034]" />
                    <span>Ready for Logistic Model Inference</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="rounded-[16px] px-4 py-2 text-xs font-semibold text-[#8c93a8] hover:text-white transition cursor-pointer"
                    >
                      Reset Form
                    </button>

                    <ClayButton
                      variant="primary"
                      size="lg"
                      type="submit"
                      icon={<Radar className="h-5 w-5" />}
                    >
                      Execute Flight Risk Scan
                    </ClayButton>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
