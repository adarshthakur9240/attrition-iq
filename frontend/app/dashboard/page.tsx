"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  fetchAllAnalytics,
  FullAnalyticsData,
} from "@/lib/api";
import { KpiCard } from "@/components/kpi-card";
import { AttritionChart, AttritionChartDataItem } from "@/components/attrition-chart";
import { DepartmentBreakdown } from "@/components/department-breakdown";
import { RiskTable } from "@/components/risk-table";
import { DashboardSkeleton } from "@/components/clay/dashboard-skeleton";
import { DashboardError } from "@/components/clay/dashboard-error";
import { ClayButton } from "@/components/clay/clay-button";
import {
  Users,
  TrendingDown,
  Percent,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Clock,
  DollarSign,
  Heart,
  Calendar,
  Smile,
  ShieldCheck,
  ChevronRight,
  Radar,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function DashboardPage() {
  const [data, setData] = useState<FullAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const chartsSectionRef = useRef<HTMLDivElement>(null);
  const secondaryGridRef = useRef<HTMLDivElement>(null);
  const tableSectionRef = useRef<HTMLDivElement>(null);

  const loadData = async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const analytics = await fetchAllAnalytics();
      setData(analytics);
    } catch (err: any) {
      console.error("Error loading analytics:", err);
      setError(err.message || "Failed to fetch analytics from backend.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // GSAP ScrollTrigger setup once data is loaded
  useEffect(() => {
    if (!data || loading) return;

    const ctx = gsap.context(() => {
      // Reveal primary chart section
      if (chartsSectionRef.current) {
        gsap.fromTo(
          chartsSectionRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: chartsSectionRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Reveal secondary chart grid
      if (secondaryGridRef.current) {
        gsap.fromTo(
          secondaryGridRef.current.children,
          { opacity: 0, y: 40, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: secondaryGridRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Reveal risk table section
      if (tableSectionRef.current) {
        gsap.fromTo(
          tableSectionRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: tableSectionRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [data, loading]);

  // Format data for Recharts components
  const departmentChartData: AttritionChartDataItem[] =
    data?.byDepartment.map((d) => ({
      name: d.department,
      attrition_rate_pct: d.attrition_rate_pct,
      total_employees: d.total_employees,
      total_left: d.total_left,
    })) || [];

  const salaryChartData: AttritionChartDataItem[] =
    data?.bySalary.map((d) => ({
      name: d.salary_band,
      attrition_rate_pct: d.attrition_rate_pct,
      total_employees: d.total_employees,
      total_left: d.total_left,
      avg_monthly_income: d.avg_monthly_income,
    })) || [];

  const overtimeChartData: AttritionChartDataItem[] =
    data?.byOvertime.map((d) => ({
      name: d.over_time === "Yes" ? "Overtime (Yes)" : "No Overtime",
      attrition_rate_pct: d.attrition_rate_pct,
      total_employees: d.total_employees,
      total_left: d.total_left,
    })) || [];

  const satisfactionChartData: AttritionChartDataItem[] =
    data?.bySatisfaction.map((d) => ({
      name: d.satisfaction_label,
      attrition_rate_pct: d.attrition_rate_pct,
      total_employees: d.total_employees,
      total_left: d.total_left,
    })) || [];

  const worklifeChartData: AttritionChartDataItem[] =
    data?.byWorklifeBalance.map((d) => ({
      name: d.wlb_label,
      attrition_rate_pct: d.attrition_rate_pct,
      total_employees: d.total_employees,
      total_left: d.total_left,
    })) || [];

  const ageChartData: AttritionChartDataItem[] =
    data?.byAgeGroup.map((d) => ({
      name: d.age_group,
      attrition_rate_pct: d.attrition_rate_pct,
      total_employees: d.total_employees,
      total_left: d.total_left,
      avg_monthly_income: d.avg_monthly_income,
    })) || [];

  const promotionChartData: AttritionChartDataItem[] =
    data?.byPromotionGap.map((d) => ({
      name: d.promotion_gap_band,
      attrition_rate_pct: d.attrition_rate_pct,
      total_employees: d.total_employees,
      total_left: d.total_left,
      avg_years_since_promotion: d.avg_years_since_promotion,
    })) || [];

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#090a0f] text-[#f3f5f8] px-4 py-8 sm:px-8 sm:py-10"
    >
      {/* Ambient background lights */}
      <div className="clay-ambient-glow glow-terracotta -left-40 top-10 h-[500px] w-[500px]" />
      <div className="clay-ambient-glow glow-slate right-0 top-[400px] h-[550px] w-[550px]" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-10">
        {/* TOP BAR / DASHBOARD HEADER */}
        <div className="flex flex-col justify-between gap-4 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8c93a8]">
              <Link
                href="/"
                className="inline-flex items-center gap-1 transition hover:text-[#f3f5f8]"
              >
                <ArrowLeft className="h-3 w-3" />
                Landing Page
              </Link>
              <ChevronRight className="h-3 w-3 text-[#545b70]" />
              <span className="text-[#e86034]">Analytics Suite</span>
            </div>
            <h1 className="font-display text-2xl font-extrabold text-[#f3f5f8] sm:text-3xl">
              Workforce Intelligence Dashboard
            </h1>
            <p className="text-xs text-[#8c93a8]">
              Live analytical telemetry across 9 PostgreSQL views and machine learning risk scoring
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-[#131722] px-3.5 py-1.5 [box-shadow:var(--shadow-clay-pill)] border border-white/[0.08] text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2a9d8f] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2a9d8f]" />
              </span>
              <span className="font-medium text-[#f3f5f8]">
                PostgreSQL Connected
              </span>
            </div>

            <ClayButton
              variant="outline"
              size="sm"
              href="/predict"
              icon={<Radar className="h-3.5 w-3.5 text-[#e86034]" />}
              iconPosition="left"
            >
              Risk Scanner
            </ClayButton>

            <ClayButton
              variant="secondary"
              size="sm"
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              icon={
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#e86034]" : ""}`}
                />
              }
            >
              {isRefreshing ? "Syncing..." : "Refresh Views"}
            </ClayButton>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && <DashboardSkeleton />}

        {/* ERROR STATE */}
        {error && !loading && (
          <DashboardError message={error} onRetry={() => loadData()} />
        )}

        {/* LOADED DASHBOARD CONTENT */}
        {data && !loading && !error && (
          <div className="space-y-10">
            {/* 1. TOP KPI ROW WITH FRAMER MOTION STAGGER */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08 },
                },
              }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {/* Total Headcount */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
              >
                <KpiCard
                  label="Total Headcount"
                  value={data.overview.total_employees}
                  icon={<Users className="h-4 w-4" />}
                  subtext="1,470 active employee profiles"
                  trend={{
                    value: "100%",
                    direction: "neutral",
                    label: "coverage",
                  }}
                />
              </motion.div>

              {/* Total Leavers */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
              >
                <KpiCard
                  label="Total Departures"
                  value={data.overview.total_left}
                  icon={<TrendingDown className="h-4 w-4" />}
                  subtext="237 historical leavers recorded"
                  trend={{
                    value: "237 cases",
                    direction: "up",
                    label: "leaver pool",
                  }}
                />
              </motion.div>

              {/* Attrition Rate % */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
              >
                <KpiCard
                  label="Baseline Attrition Rate"
                  value={data.overview.attrition_rate_pct}
                  suffix="%"
                  decimals={1}
                  variant="accent"
                  icon={<Percent className="h-4 w-4 text-white" />}
                  subtext="16.12% company-wide turnover"
                  trend={{
                    value: "16.1%",
                    direction: "up",
                    label: "historical rate",
                  }}
                />
              </motion.div>

              {/* Highest Attrition Dept */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
              >
                <KpiCard
                  label="Highest Attrition Unit"
                  value={20.6}
                  suffix="%"
                  decimals={1}
                  icon={<AlertTriangle className="h-4 w-4 text-[#e86034]" />}
                  subtext="Sales division (92 / 446 leavers)"
                  trend={{
                    value: "+4.5%",
                    direction: "up",
                    label: "vs avg",
                  }}
                />
              </motion.div>
            </motion.div>

            {/* 2. PRIMARY ANALYTICS ROW: DEPARTMENT BAR + DONUT BREAKDOWN */}
            <div
              ref={chartsSectionRef}
              className="grid grid-cols-1 gap-8 lg:grid-cols-12"
            >
              <div className="lg:col-span-7">
                <AttritionChart
                  title="Attrition Rate by Department"
                  subtitle="Comparison of talent turnover vs total headcount per division"
                  data={departmentChartData}
                  barColor="#e86034"
                  height={290}
                />
              </div>

              <div className="lg:col-span-5">
                <DepartmentBreakdown data={data.byDepartment} />
              </div>
            </div>

            {/* 3. SECONDARY ANALYTICS GRID: MULTI-DIMENSIONAL COHORTS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#e86034]" />
                <h2 className="font-display text-xl font-bold text-[#f3f5f8]">
                  Deep Cohort Telemetry
                </h2>
                <span className="text-xs text-[#8c93a8]">
                  (Salary, Overtime, Satisfaction, Work-Life, Age, Promotion)
                </span>
              </div>

              <div
                ref={secondaryGridRef}
                className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                {/* 1. Attrition by Salary Band */}
                <AttritionChart
                  title="By Salary Band"
                  subtitle="Low (<$3k) sees nearly 30% turnover"
                  data={salaryChartData}
                  barColor="#e86034"
                  badge={<DollarSign className="h-4 w-4 text-[#2a9d8f]" />}
                  height={220}
                />

                {/* 2. Attrition by Overtime */}
                <AttritionChart
                  title="By Mandatory Overtime"
                  subtitle="Overtime triples flight risk (30.5% vs 10.4%)"
                  data={overtimeChartData}
                  barColor="#fa7347"
                  badge={<Clock className="h-4 w-4 text-[#fa7347]" />}
                  height={220}
                />

                {/* 3. Attrition by Job Satisfaction */}
                <AttritionChart
                  title="By Job Satisfaction"
                  subtitle="Low satisfaction correlates with 22.8% churn"
                  data={satisfactionChartData}
                  barColor="#eab308"
                  badge={<Smile className="h-4 w-4 text-[#eab308]" />}
                  height={220}
                />

                {/* 4. Attrition by Work-Life Balance */}
                <AttritionChart
                  title="By Work-Life Balance"
                  subtitle="'Bad' rating drives 31.2% turnover"
                  data={worklifeChartData}
                  barColor="#2a9d8f"
                  badge={<Heart className="h-4 w-4 text-[#2a9d8f]" />}
                  height={220}
                />

                {/* 5. Attrition by Age / Career Stage */}
                <AttritionChart
                  title="By Age Group"
                  subtitle="Under 25 turnover peaks at 39.5%"
                  data={ageChartData}
                  barColor="#e86034"
                  badge={<Users className="h-4 w-4 text-[#e86034]" />}
                  height={220}
                />

                {/* 6. Attrition by Promotion Gap */}
                <AttritionChart
                  title="By Time Since Promotion"
                  subtitle="Stagnation (6+ yrs) spikes risk to 21.4%"
                  data={promotionChartData}
                  barColor="#fa7347"
                  badge={<Calendar className="h-4 w-4 text-[#fa7347]" />}
                  height={220}
                />
              </div>
            </div>

            {/* 4. HIGH-RISK PROFILES REGISTRY TABLE */}
            <div ref={tableSectionRef}>
              <RiskTable data={data.highRiskProfiles} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
