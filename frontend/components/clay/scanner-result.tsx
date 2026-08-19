"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { ClayCard } from "./clay-card";
import { ClayPanel } from "./clay-panel";
import { ClayButton } from "./clay-button";
import { PredictionResponse } from "@/lib/api";
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Zap,
  Briefcase,
  Sliders,
  DollarSign,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Feature Name Beautifier ────────────────────────────────────────────────

function formatFeatureName(feature: string): { title: string; hint: string } {
  if (feature.includes("over_time_Yes")) {
    return {
      title: "Mandatory Overtime",
      hint: "Continuous overtime is the #1 predictor of workforce exhaustion.",
    };
  }
  if (feature.includes("business_travel_Travel_Frequently")) {
    return {
      title: "Frequent Business Travel",
      hint: "Frequent travel significantly degrades work-life balance.",
    };
  }
  if (feature.includes("job_role_Sales Representative")) {
    return {
      title: "Role: Sales Representative",
      hint: "Entry sales positions experience high market turnover and commission volatility.",
    };
  }
  if (feature.includes("job_role_Laboratory Technician")) {
    return {
      title: "Role: Laboratory Technician",
      hint: "Lab tech roles face salary compression and limited immediate promotion paths.",
    };
  }
  if (feature.includes("job_role_Research Director")) {
    return {
      title: "Role: Research Director",
      hint: "Executive tenure correlates strongly with company loyalty.",
    };
  }
  if (feature.includes("marital_status_Single")) {
    return {
      title: "Marital Status: Single",
      hint: "Unmarried cohorts exhibit higher geographic and career mobility.",
    };
  }
  if (feature.includes("years_since_last_promotion")) {
    return {
      title: "Promotion Stagnation",
      hint: "3+ years without title elevation strongly inflates flight probability.",
    };
  }
  if (feature.includes("monthly_income")) {
    return {
      title: "Monthly Compensation",
      hint: "Base pay below competitive market tier drives external search.",
    };
  }
  if (feature.includes("total_working_years")) {
    return {
      title: "Career Experience Level",
      hint: "Total accumulated industry experience and seniority.",
    };
  }
  if (feature.includes("department_Research & Development")) {
    return {
      title: "Department: R&D",
      hint: "R&D team baseline attrition dynamics.",
    };
  }

  // Fallback cleanup
  const cleaned = feature
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  return { title: cleaned, hint: "Statistically weighted inference variable." };
}

// ── Scanning State Animation ───────────────────────────────────────────────

export function ScannerLoading() {
  const [tickerIndex, setTickerIndex] = useState(0);
  const tickers = [
    "Ingesting 42 employee telemetry signals...",
    "Evaluating stratified logistic regression matrix...",
    "Calculating individual coefficient risk attribution...",
    "Synthesizing personalized retention playbooks...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickers.length);
    }, 600);
    return () => clearInterval(interval);
  }, [tickers.length]);

  return (
    <ClayPanel
      title="Executing Neural Workforce Telemetry Scan..."
      className="p-12 text-center"
    >
      <div className="relative my-10 flex h-60 items-center justify-center">
        {/* Pulsing Concentric Radar Rings */}
        <motion.div
          animate={{ scale: [0.8, 1.6], opacity: [0.8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
          className="absolute h-44 w-44 rounded-full border-2 border-[#e86034]/40"
        />
        <motion.div
          animate={{ scale: [0.8, 2.2], opacity: [0.6, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, delay: 0.4, ease: "easeOut" }}
          className="absolute h-44 w-44 rounded-full border-2 border-[#e86034]/30"
        />
        <motion.div
          animate={{ scale: [0.8, 2.8], opacity: [0.4, 0] }}
          transition={{ repeat: Infinity, duration: 2.6, delay: 0.8, ease: "easeOut" }}
          className="absolute h-44 w-44 rounded-full border border-[#e86034]/20"
        />

        {/* Center Scanner Core */}
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[#161a26] [box-shadow:var(--shadow-clay-card-raised)] border border-white/20">
          <Sparkles className="h-10 w-10 text-[#e86034] animate-spin" />
        </div>
      </div>

      <div className="mx-auto max-w-md space-y-2">
        <motion.div
          key={tickerIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-xs font-semibold text-[#fa7347]"
        >
          {tickers[tickerIndex]}
        </motion.div>
        <p className="text-[11px] text-[#8c93a8]">
          Cross-referencing against 1,470 benchmark records
        </p>
      </div>
    </ClayPanel>
  );
}

// ── Scanner Result View ────────────────────────────────────────────────────

export interface ScannerResultProps {
  result: PredictionResponse;
  onReset: () => void;
}

export function ScannerResult({ result, onReset }: ScannerResultProps) {
  const scorePct = Math.round(result.risk_score * 100);
  const isHigh = result.risk_label === "High" || scorePct >= 60;
  const isMed = result.risk_label === "Medium" || (scorePct >= 30 && scorePct < 60);

  const themeColor = isHigh ? "#e86034" : isMed ? "#eab308" : "#2a9d8f";
  const glowType = isHigh ? "terracotta" : "subtle";

  // Animated Count-Up for Probability
  const springVal = useSpring(0, { stiffness: 50, damping: 15 });
  const [displayScore, setDisplayScore] = useState<number>(0);

  useEffect(() => {
    springVal.set(scorePct);
    const unsub = springVal.on("change", (v) => {
      setDisplayScore(Math.round(v));
    });
    return () => unsub();
  }, [scorePct, springVal]);

  // SVG Gauge Calculations
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (scorePct / 100) * circumference;

  // Compute total importance for relative factor % bars
  const totalFactorWeight = result.top_contributing_factors.reduce(
    (acc, f) => acc + f.importance,
    0
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Radial Risk Gauge Card */}
        <div className="lg:col-span-5">
          <ClayCard
            variant="raised"
            glow={glowType}
            className="flex h-full flex-col justify-between p-8 text-center"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8c93a8]">
                  Scan Inference Output
                </span>
                <span className="font-mono text-xs text-[#8c93a8]">
                  Balanced Logistic Model
                </span>
              </div>

              {/* Animated Radial Dial */}
              <div className="relative my-8 flex items-center justify-center">
                <svg className="h-48 w-48 -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="96"
                    cy="96"
                    r={radius}
                    className="stroke-[#0b0d14]"
                    strokeWidth="14"
                    fill="transparent"
                  />
                  {/* Animated Progress Arc */}
                  <motion.circle
                    cx="96"
                    cy="96"
                    r={radius}
                    stroke={themeColor}
                    strokeWidth="14"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: strokeOffset }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center">
                  <div className="font-mono text-5xl font-extrabold text-[#f3f5f8]">
                    {displayScore}%
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c93a8] mt-1">
                    Flight Probability
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 [box-shadow:var(--shadow-clay-pill)] border border-white/10"
                style={{ backgroundColor: `${themeColor}18` }}
              >
                <div
                  className="h-2.5 w-2.5 rounded-full animate-ping"
                  style={{ backgroundColor: themeColor }}
                />
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: themeColor }}
                >
                  {result.risk_label} Attrition Risk
                </span>
              </div>
            </div>

            <p className="mt-6 text-xs text-[#8c93a8] leading-relaxed">
              {isHigh
                ? "This employee profile exhibits multiple high-leverage flight risks that warrant immediate proactive retention intervention."
                : isMed
                ? "Moderate churn indicators detected. Monitoring and targeted workload or promotion adjustments recommended."
                : "Profile shows strong organizational alignment and low flight vulnerability under current conditions."}
            </p>
          </ClayCard>
        </div>

        {/* Right Column: Top Contributing Factors & Attribution */}
        <div className="space-y-6 lg:col-span-7">
          <ClayPanel
            title="Explainable Risk Factor Decomposition"
            subtitle="Top mathematical drivers derived from individual model feature weights"
            badge={
              <div className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-[#1a2030] text-[#e86034]">
                <Sliders className="h-4 w-4" />
              </div>
            }
          >
            <div className="space-y-4">
              {result.top_contributing_factors.map((factor, index) => {
                const info = formatFeatureName(factor.feature);
                const relPct = totalFactorWeight > 0
                  ? Math.round((factor.importance / totalFactorWeight) * 100)
                  : 33;

                return (
                  <motion.div
                    key={factor.feature}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 + 0.2, duration: 0.6 }}
                    className="rounded-[18px] bg-[#0b0d14] p-4 [box-shadow:var(--shadow-clay-card-sunken)] border border-white/[0.04]"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1a2030] text-[10px] font-bold text-[#e86034]">
                          #{index + 1}
                        </span>
                        <span className="text-sm font-bold text-[#f3f5f8]">
                          {info.title}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-[#e86034]">
                          {relPct}% Impact
                        </span>
                        <span className="text-[10px] text-[#545b70] block">
                          (weight: {factor.importance.toFixed(2)})
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#8c93a8] mb-2.5">{info.hint}</p>

                    {/* Impact Bar */}
                    <div className="h-2 w-full rounded-full bg-[#161a26] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${relPct}%` }}
                        transition={{ delay: index * 0.15 + 0.4, duration: 0.8 }}
                        className="h-full rounded-full"
                        style={{
                          backgroundColor:
                            index === 0
                              ? "#e86034"
                              : index === 1
                              ? "#fa7347"
                              : "#2a9d8f",
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ClayPanel>

          {/* Retention Mitigation Recommendations */}
          <ClayCard variant="raised" className="p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-[#f3f5f8] mb-3">
              <Zap className="h-4 w-4 text-[#e86034]" />
              Recommended Retention Playbook
            </div>
            <ul className="space-y-2 text-xs text-[#8c93a8]">
              {isHigh && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-[#e86034] font-bold">•</span>
                    <span>
                      <strong className="text-white">Overtime Relief:</strong> Transition critical projects to distribute non-essential hours and rebalance workload.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#e86034] font-bold">•</span>
                    <span>
                      <strong className="text-white">Compensation Benchmark:</strong> Review monthly pay against cohort market percentiles ($2.5k–$4k range for high-risk roles).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#e86034] font-bold">•</span>
                    <span>
                      <strong className="text-white">Promotion &amp; Career Trajectory:</strong> Initiate structured 6-month growth review if promotion has stalled &gt;2 years.
                    </span>
                  </li>
                </>
              )}
              {isMed && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-[#eab308] font-bold">•</span>
                    <span>
                      <strong className="text-white">Manager Check-in:</strong> Schedule proactive 1-on-1 engagement conversation regarding work-life balance and project autonomy.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#eab308] font-bold">•</span>
                    <span>
                      <strong className="text-white">Role Development:</strong> Offer lateral skill progression or professional development opportunities.
                    </span>
                  </li>
                </>
              )}
              {!isHigh && !isMed && (
                <li className="flex items-start gap-2">
                  <span className="text-[#2a9d8f] font-bold">•</span>
                  <span>
                    <strong className="text-white">Maintain Current Baseline:</strong> Current role satisfaction, compensation, and travel balance support high organizational retention.
                  </span>
                </li>
              )}
            </ul>
          </ClayCard>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-6">
        <ClayButton
          variant="secondary"
          size="md"
          onClick={onReset}
          icon={<RefreshCw className="h-4 w-4" />}
        >
          Scan Another Employee Profile
        </ClayButton>

        <ClayButton
          variant="primary"
          size="md"
          href="/dashboard"
          icon={<ArrowRight className="h-4 w-4" />}
        >
          View Full Company Dashboard
        </ClayButton>
      </div>
    </div>
  );
}
