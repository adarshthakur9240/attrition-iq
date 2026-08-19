"use client";

import React, { useEffect, useState } from "react";
import { ClayCard, ClayCardVariant } from "@/components/clay/clay-card";
import { motion, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
  subtext?: string;
  icon?: React.ReactNode;
  variant?: ClayCardVariant;
  className?: string;
}

export function KpiCard({
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  trend,
  subtext,
  icon,
  variant = "raised",
  className,
}: KpiCardProps) {
  // Smooth Framer Motion spring count-up on mount
  const springVal = useSpring(0, { stiffness: 60, damping: 20 });
  const [displayNumber, setDisplayNumber] = useState<string>("0");

  useEffect(() => {
    springVal.set(value);
  }, [value, springVal]);

  useEffect(() => {
    const unsubscribe = springVal.on("change", (latest) => {
      if (decimals > 0) {
        setDisplayNumber(latest.toFixed(decimals));
      } else {
        setDisplayNumber(Math.round(latest).toLocaleString());
      }
    });
    return () => unsubscribe();
  }, [springVal, decimals]);

  return (
    <ClayCard
      variant={variant}
      interactive
      glow={variant === "accent" ? "terracotta" : "subtle"}
      className={cn("flex flex-col justify-between p-6", className)}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8c93a8]">
          {label}
        </span>
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-[#0b0d14] [box-shadow:var(--shadow-clay-card-sunken)] text-[#e86034]">
            {icon}
          </div>
        )}
      </div>

      <div className="my-3">
        <div className="font-mono text-3xl font-bold tracking-tight text-[#f3f5f8] md:text-4xl">
          <span className="text-[#8c93a8]">{prefix}</span>
          <span>{displayNumber}</span>
          <span className="text-[#e86034]">{suffix}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.05]">
        {trend && (
          <div
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
              trend.direction === "up" && "bg-[#e86034]/15 text-[#fa7347]",
              trend.direction === "down" && "bg-[#2a9d8f]/15 text-[#2a9d8f]",
              trend.direction === "neutral" && "bg-white/[0.06] text-[#8c93a8]"
            )}
          >
            {trend.direction === "up" && <ArrowUpRight className="h-3 w-3" />}
            {trend.direction === "down" && <ArrowDownRight className="h-3 w-3" />}
            {trend.direction === "neutral" && <Minus className="h-3 w-3" />}
            <span>{trend.value}</span>
            {trend.label && (
              <span className="text-[10px] opacity-80">{trend.label}</span>
            )}
          </div>
        )}
        {subtext && (
          <span className="text-xs text-[#8c93a8]">{subtext}</span>
        )}
      </div>
    </ClayCard>
  );
}
