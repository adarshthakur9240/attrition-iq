"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { ClayPanel } from "@/components/clay/clay-panel";
import { cn } from "@/lib/utils";

export interface AttritionChartDataItem {
  name: string;
  attrition_rate_pct: number;
  total_employees: number;
  total_left: number;
  avg_monthly_income?: number;
  avg_years_since_promotion?: number;
}

export interface AttritionChartProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  data: AttritionChartDataItem[];
  dataKey?: "attrition_rate_pct" | "total_employees" | "total_left";
  barColor?: string;
  highlightHighest?: boolean;
  valueSuffix?: string;
  height?: number;
  className?: string;
  showToggle?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  valueSuffix?: string;
}

function CustomTooltip({ active, payload, label, valueSuffix }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload as AttritionChartDataItem;
    return (
      <div className="rounded-[16px] bg-[#0d1018]/95 p-3.5 text-xs text-[#f3f5f8] shadow-2xl border border-white/10 backdrop-blur-md">
        <div className="font-bold text-[#f3f5f8] mb-1.5 border-b border-white/[0.08] pb-1">
          {label}
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#8c93a8]">Attrition Rate:</span>
            <span className="font-mono font-bold text-[#e86034]">
              {item.attrition_rate_pct.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#8c93a8]">Headcount / Left:</span>
            <span className="font-mono text-[#f3f5f8]">
              {item.total_employees} / {item.total_left}
            </span>
          </div>
          {item.avg_monthly_income !== undefined && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#8c93a8]">Avg Monthly Income:</span>
              <span className="font-mono text-[#2a9d8f]">
                ${Math.round(item.avg_monthly_income).toLocaleString()}
              </span>
            </div>
          )}
          {item.avg_years_since_promotion !== undefined && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#8c93a8]">Avg Promotion Gap:</span>
              <span className="font-mono text-[#f3f5f8]">
                {item.avg_years_since_promotion.toFixed(1)} yrs
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}

export function AttritionChart({
  title,
  subtitle,
  badge,
  data,
  dataKey: initialDataKey = "attrition_rate_pct",
  barColor = "#e86034",
  highlightHighest = true,
  valueSuffix = "%",
  height = 280,
  className,
  showToggle = true,
}: AttritionChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<
    "attrition_rate_pct" | "total_employees"
  >(initialDataKey === "total_employees" ? "total_employees" : "attrition_rate_pct");

  // Find max index to highlight highest risk bar
  let maxIndex = -1;
  let maxVal = -1;
  data.forEach((d, i) => {
    const v = d[selectedMetric] || 0;
    if (v > maxVal) {
      maxVal = v;
      maxIndex = i;
    }
  });

  const headerControls = showToggle ? (
    <div className="flex rounded-[12px] bg-[#0b0d14] p-1 border border-white/[0.05]">
      <button
        type="button"
        onClick={() => setSelectedMetric("attrition_rate_pct")}
        className={cn(
          "rounded-[8px] px-2.5 py-1 text-xs font-semibold transition-colors",
          selectedMetric === "attrition_rate_pct"
            ? "bg-[#e86034] text-white"
            : "text-[#8c93a8] hover:text-white"
        )}
      >
        Attrition %
      </button>
      <button
        type="button"
        onClick={() => setSelectedMetric("total_employees")}
        className={cn(
          "rounded-[8px] px-2.5 py-1 text-xs font-semibold transition-colors",
          selectedMetric === "total_employees"
            ? "bg-[#1f2434] text-white"
            : "text-[#8c93a8] hover:text-white"
        )}
      >
        Headcount
      </button>
    </div>
  ) : undefined;

  return (
    <ClayPanel
      title={title}
      subtitle={subtitle}
      badge={badge}
      headerAction={headerControls}
      className={className}
    >
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 24 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#545b70"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }}
              interval={0}
              angle={data.length > 4 ? -15 : 0}
              textAnchor={data.length > 4 ? "end" : "middle"}
            />
            <YAxis
              stroke="#545b70"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }}
              tickFormatter={(val) =>
                selectedMetric === "attrition_rate_pct" ? `${val}%` : `${val}`
              }
            />
            <Tooltip
              content={<CustomTooltip valueSuffix={valueSuffix} />}
              cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
            />
            <Bar
              dataKey={selectedMetric}
              radius={[6, 6, 0, 0]}
              animationDuration={800}
            >
              {data.map((entry, index) => {
                const isHighlight =
                  highlightHighest &&
                  index === maxIndex &&
                  selectedMetric === "attrition_rate_pct";
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isHighlight ? "#fa7347" : barColor}
                    fillOpacity={
                      selectedMetric === "total_employees"
                        ? 0.75
                        : isHighlight
                        ? 1
                        : 0.85
                    }
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ClayPanel>
  );
}
