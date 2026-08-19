"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ClayCard } from "./clay-card";
import { ClayButton } from "./clay-button";
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  Plane,
  Award,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export function InteractiveDemo() {
  const [overtime, setOvertime] = useState<boolean>(true);
  const [travel, setTravel] = useState<"Non-Travel" | "Travel_Rarely" | "Travel_Frequently">("Travel_Frequently");
  const [promotionYears, setPromotionYears] = useState<number>(4);
  const [satisfaction, setSatisfaction] = useState<number>(1);

  // Compute a realistic mock risk probability based on actual logistic model weights
  let baseScore = 0.16; // Baseline attrition rate ~16.1%
  if (overtime) baseScore += 0.34;
  if (travel === "Travel_Frequently") baseScore += 0.22;
  else if (travel === "Travel_Rarely") baseScore += 0.08;
  if (promotionYears >= 4) baseScore += 0.18;
  else if (promotionYears >= 2) baseScore += 0.07;
  if (satisfaction === 1) baseScore += 0.19;
  else if (satisfaction === 2) baseScore += 0.09;
  else if (satisfaction === 4) baseScore -= 0.12;

  const scorePct = Math.min(Math.max(Math.round(baseScore * 100), 6), 94);
  const isHighRisk = scorePct >= 50;
  const isMedRisk = scorePct >= 30 && scorePct < 50;

  const riskTier = isHighRisk ? "Critical Flight Risk" : isMedRisk ? "Moderate Risk" : "Stable Retention";
  const tierColor = isHighRisk ? "#e86034" : isMedRisk ? "#eab308" : "#2a9d8f";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left: Interactive Input Controls */}
      <div className="space-y-5 lg:col-span-6">
        <ClayCard variant="raised" className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <h4 className="flex items-center gap-2 text-base font-bold text-[#f3f5f8]">
              <Sparkles className="h-4 w-4 text-[#e86034]" />
              Telemetry Simulator
            </h4>
            <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-[#8c93a8]">
              Live ML Model Weights
            </span>
          </div>

          <div className="space-y-4">
            {/* Overtime Toggle */}
            <div className="flex items-center justify-between rounded-[18px] bg-[#0b0d14] p-3.5 [box-shadow:var(--shadow-clay-card-sunken)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#1a2030] text-[#e86034]">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#f3f5f8]">
                    Mandatory Overtime
                  </div>
                  <div className="text-xs text-[#8c93a8]">
                    #1 Top Predictor in IBM Dataset (+9.1% rank)
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOvertime(!overtime)}
                className={`relative inline-flex h-7 w-13 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                  overtime ? "bg-[#e86034]" : "bg-[#1f2536]"
                } p-1 [box-shadow:inset_2px_2px_4px_rgba(0,0,0,0.5)]`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                    overtime ? "translate-x-6" : "translate-x-0"
                  } [box-shadow:2px_2px_5px_rgba(0,0,0,0.4)]`}
                />
              </button>
            </div>

            {/* Travel Frequency */}
            <div className="rounded-[18px] bg-[#0b0d14] p-3.5 [box-shadow:var(--shadow-clay-card-sunken)]">
              <div className="mb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#f3f5f8]">
                  <Plane className="h-4 w-4 text-[#e86034]" />
                  Business Travel
                </div>
                <span className="text-xs text-[#8c93a8]">
                  {travel.replace("_", " ")}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["Non-Travel", "Travel_Rarely", "Travel_Frequently"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTravel(t)}
                    className={`rounded-[12px] py-1.5 text-xs font-semibold transition-all ${
                      travel === t
                        ? "bg-[#e86034] text-white [box-shadow:var(--shadow-clay-btn-primary)]"
                        : "bg-[#161a26] text-[#8c93a8] hover:text-white"
                    }`}
                  >
                    {t === "Travel_Frequently" ? "Frequent" : t === "Travel_Rarely" ? "Rare" : "None"}
                  </button>
                ))}
              </div>
            </div>

            {/* Years Since Promotion */}
            <div className="rounded-[18px] bg-[#0b0d14] p-3.5 [box-shadow:var(--shadow-clay-card-sunken)]">
              <div className="mb-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-semibold text-[#f3f5f8]">
                  <Award className="h-4 w-4 text-[#e86034]" />
                  Years Since Promotion
                </div>
                <span className="font-bold text-[#e86034]">
                  {promotionYears} {promotionYears === 1 ? "year" : "years"}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={promotionYears}
                onChange={(e) => setPromotionYears(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#1a2030] accent-[#e86034]"
              />
              <div className="mt-1 flex justify-between text-[10px] text-[#545b70]">
                <span>Recent (0y)</span>
                <span>Moderate (3y)</span>
                <span>Stagnant (6y+)</span>
              </div>
            </div>
          </div>
        </ClayCard>
      </div>

      {/* Right: Instant Clay Risk Gauge Card */}
      <div className="lg:col-span-6">
        <ClayCard
          variant="raised"
          glow="terracotta"
          className="flex h-full flex-col justify-between p-6"
        >
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full animate-ping"
                  style={{ backgroundColor: tierColor }}
                />
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: tierColor }}
                >
                  {riskTier}
                </span>
              </div>
              <span className="text-xs text-[#8c93a8]">ID: EMP-1470</span>
            </div>

            {/* Dial & Score */}
            <div className="my-3 flex items-center justify-center">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-[#0b0d14] [box-shadow:var(--shadow-clay-card-sunken)]">
                <svg className="h-32 w-32 -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    className="stroke-[#1a2030]"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke={tierColor}
                    strokeWidth="10"
                    strokeDasharray={339.292}
                    strokeDashoffset={339.292 * (1 - scorePct / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <motion.span
                    key={scorePct}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-display text-3xl font-extrabold text-[#f3f5f8]"
                  >
                    {scorePct}%
                  </motion.span>
                  <span className="text-[10px] font-semibold text-[#8c93a8]">
                    CHURN RISK
                  </span>
                </div>
              </div>
            </div>

            {/* Explainable Attribution Pills */}
            <div className="mt-4 space-y-2">
              <div className="text-xs font-semibold text-[#8c93a8]">
                Top Attributed Factors:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {overtime && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#e86034]/15 px-2.5 py-1 text-[11px] font-semibold text-[#fa7347] border border-[#e86034]/20">
                    <AlertTriangle className="h-3 w-3" /> OverTime: Yes (+34%)
                  </span>
                )}
                {travel === "Travel_Frequently" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#e86034]/15 px-2.5 py-1 text-[11px] font-semibold text-[#fa7347] border border-[#e86034]/20">
                    <AlertTriangle className="h-3 w-3" /> Frequent Travel (+22%)
                  </span>
                )}
                {promotionYears >= 4 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#eab308]/15 px-2.5 py-1 text-[11px] font-semibold text-[#eab308] border border-[#eab308]/20">
                    <TrendingUp className="h-3 w-3" /> Promotion Gap ({promotionYears}y)
                  </span>
                )}
                {!overtime && travel === "Non-Travel" && promotionYears === 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#2a9d8f]/15 px-2.5 py-1 text-[11px] font-semibold text-[#2a9d8f] border border-[#2a9d8f]/20">
                    <CheckCircle2 className="h-3 w-3" /> Healthy Work-Life Baseline
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06]">
            <ClayButton
              variant="primary"
              size="sm"
              href="/dashboard"
              className="w-full justify-between"
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Open Full Cohort Explorer
            </ClayButton>
          </div>
        </ClayCard>
      </div>
    </div>
  );
}
