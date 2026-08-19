"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { ClayPanel } from "@/components/clay/clay-panel";
import { AttritionByDepartment } from "@/lib/api";
import { Building2, Users } from "lucide-react";

export interface DepartmentBreakdownProps {
  data: AttritionByDepartment[];
  className?: string;
}

const DEPARTMENT_COLORS: Record<string, string> = {
  "Sales": "#e86034", // Warm Terracotta (Highest Attrition 20.6%)
  "Human Resources": "#eab308", // Amber/Gold (19.05%)
  "Research & Development": "#2a9d8f", // Slate Teal (13.84%)
};

const DEFAULT_COLORS = ["#e86034", "#eab308", "#2a9d8f", "#8c93a8"];

export function DepartmentBreakdown({ data, className }: DepartmentBreakdownProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const totalEmployees = data.reduce((acc, curr) => acc + curr.total_employees, 0);
  const totalLeft = data.reduce((acc, curr) => acc + curr.total_left, 0);

  const pieData = data.map((dept, index) => ({
    name: dept.department,
    value: dept.total_employees,
    total_left: dept.total_left,
    attrition_rate_pct: dept.attrition_rate_pct,
    color: DEPARTMENT_COLORS[dept.department] || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }));

  const activeDept = activeIndex !== null ? pieData[activeIndex] : null;

  return (
    <ClayPanel
      title="Department Distribution"
      subtitle="Headcount share and attrition intensity across divisions"
      badge={
        <div className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-[#1a2030] text-[#e86034]">
          <Building2 className="h-4 w-4" />
        </div>
      }
      className={className}
    >
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
        {/* Left: Donut Chart with Center KPI */}
        <div className="relative h-64 w-full md:col-span-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                animationDuration={900}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth={2}
                    className="transition-all duration-200 cursor-pointer"
                    style={{
                      filter: activeIndex === index ? "brightness(1.15)" : "none",
                      transform: activeIndex === index ? "scale(1.03)" : "scale(1)",
                      transformOrigin: "center",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="rounded-[14px] bg-[#0d1018]/95 p-3 text-xs text-[#f3f5f8] shadow-xl border border-white/10 backdrop-blur-md">
                        <div className="font-bold mb-1" style={{ color: item.color }}>
                          {item.name}
                        </div>
                        <div className="text-[#8c93a8]">
                          Headcount: <span className="font-mono text-white">{item.value}</span>
                        </div>
                        <div className="text-[#8c93a8]">
                          Leavers: <span className="font-mono text-white">{item.total_left}</span>
                        </div>
                        <div className="text-[#8c93a8]">
                          Attrition: <span className="font-mono text-[#e86034] font-bold">{item.attrition_rate_pct}%</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Donut Center Display */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8c93a8]">
              {activeDept ? activeDept.name.split(" ")[0] : "Total"}
            </span>
            <span className="font-display text-2xl font-extrabold text-[#f3f5f8]">
              {activeDept ? activeDept.value : totalEmployees}
            </span>
            <span className="text-[10px] text-[#8c93a8]">
              {activeDept ? `${activeDept.attrition_rate_pct}% churn` : `${totalLeft} departures`}
            </span>
          </div>
        </div>

        {/* Right: Legend Breakdown List */}
        <div className="space-y-3 md:col-span-6">
          {pieData.map((item, idx) => {
            const pctShare = ((item.value / totalEmployees) * 100).toFixed(1);
            return (
              <div
                key={item.name}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`flex items-center justify-between rounded-[16px] p-3 transition-colors cursor-pointer ${
                  activeIndex === idx
                    ? "bg-[#1f2434] border border-white/10"
                    : "bg-[#0b0d14] border border-white/[0.04] hover:bg-[#161a26]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <div className="text-xs font-bold text-[#f3f5f8]">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-[#8c93a8]">
                      {item.value} staff ({pctShare}%)
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-[#e86034]">
                    {item.attrition_rate_pct}%
                  </div>
                  <div className="text-[10px] text-[#8c93a8]">
                    {item.total_left} left
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ClayPanel>
  );
}
