"use client";

import React, { useState, useMemo } from "react";
import { ClayPanel } from "@/components/clay/clay-panel";
import { HighRiskProfile } from "@/lib/api";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  ShieldAlert,
  Clock,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface RiskTableProps {
  data: HighRiskProfile[];
  className?: string;
}

type SortKey =
  | "attrition_rate_pct"
  | "cohort_size"
  | "total_left"
  | "avg_monthly_income"
  | "avg_years_since_promotion"
  | "job_role";

export function RiskTable({ data, className }: RiskTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("attrition_rate_pct");
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterDepartment, setFilterDepartment] = useState<string>("ALL");
  const [filterOvertime, setFilterOvertime] = useState<string>("ALL");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false); // default descending for metrics
    }
  };

  const departments = useMemo(() => {
    const set = new Set(data.map((d) => d.department));
    return ["ALL", ...Array.from(set)];
  }, [data]);

  const filteredAndSortedData = useMemo(() => {
    return data
      .filter((row) => {
        const matchesSearch =
          row.job_role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.department.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept =
          filterDepartment === "ALL" || row.department === filterDepartment;
        const matchesOT =
          filterOvertime === "ALL" || row.over_time === filterOvertime;
        return matchesSearch && matchesDept && matchesOT;
      })
      .sort((a, b) => {
        let valA: any = a[sortKey];
        let valB: any = b[sortKey];

        if (typeof valA === "string") {
          return sortAsc
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        return sortAsc ? valA - valB : valB - valA;
      });
  }, [data, searchQuery, filterDepartment, filterOvertime, sortKey, sortAsc]);

  return (
    <ClayPanel
      title="High-Risk Workforce Cohorts"
      subtitle="Groups by Department × Job Role × Overtime (Cohorts ≥ 10 staff) ranked by attrition vulnerability"
      badge={
        <div className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-[#e86034]/20 text-[#e86034]">
          <ShieldAlert className="h-4 w-4" />
        </div>
      }
      headerAction={
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-[#8c93a8]" />
            <input
              type="text"
              placeholder="Filter roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 rounded-[12px] bg-[#0b0d14] pl-8 pr-3 text-xs text-[#f3f5f8] placeholder-[#545b70] border border-white/10 outline-none focus:border-[#e86034]/50"
            />
          </div>

          {/* Department Filter */}
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="h-8 rounded-[12px] bg-[#0b0d14] px-2.5 text-xs text-[#8c93a8] border border-white/10 outline-none focus:border-[#e86034]/50 cursor-pointer"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept} className="bg-[#131722] text-[#f3f5f8]">
                {dept === "ALL" ? "All Departments" : dept}
              </option>
            ))}
          </select>

          {/* Overtime Filter */}
          <select
            value={filterOvertime}
            onChange={(e) => setFilterOvertime(e.target.value)}
            className="h-8 rounded-[12px] bg-[#0b0d14] px-2.5 text-xs text-[#8c93a8] border border-white/10 outline-none focus:border-[#e86034]/50 cursor-pointer"
          >
            <option value="ALL" className="bg-[#131722] text-[#f3f5f8]">All Overtime</option>
            <option value="Yes" className="bg-[#131722] text-[#f3f5f8]">Overtime: Yes</option>
            <option value="No" className="bg-[#131722] text-[#f3f5f8]">Overtime: No</option>
          </select>
        </div>
      }
      className={className}
    >
      {/* Horizontally scrollable table container with soft overflow indicator */}
      <div className="relative -mx-8 overflow-x-auto px-8">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/[0.08] text-[#8c93a8]">
              <th className="py-3 px-3 font-semibold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => handleSort("job_role")}
                  className="flex items-center gap-1.5 hover:text-[#f3f5f8]"
                >
                  Cohort Profile
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3 px-3 font-semibold uppercase tracking-wider">
                Overtime
              </th>
              <th className="py-3 px-3 font-semibold uppercase tracking-wider text-right">
                <button
                  type="button"
                  onClick={() => handleSort("cohort_size")}
                  className="inline-flex items-center gap-1.5 hover:text-[#f3f5f8]"
                >
                  Cohort
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3 px-3 font-semibold uppercase tracking-wider text-right">
                <button
                  type="button"
                  onClick={() => handleSort("total_left")}
                  className="inline-flex items-center gap-1.5 hover:text-[#f3f5f8]"
                >
                  Left
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3 px-3 font-semibold uppercase tracking-wider text-right">
                <button
                  type="button"
                  onClick={() => handleSort("attrition_rate_pct")}
                  className="inline-flex items-center gap-1.5 font-bold text-[#e86034] hover:text-[#fa7347]"
                >
                  Attrition %
                  {sortKey === "attrition_rate_pct" ? (
                    sortAsc ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  ) : (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </button>
              </th>
              <th className="py-3 px-3 font-semibold uppercase tracking-wider text-right">
                <button
                  type="button"
                  onClick={() => handleSort("avg_monthly_income")}
                  className="inline-flex items-center gap-1.5 hover:text-[#f3f5f8]"
                >
                  Avg Salary
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3 px-3 font-semibold uppercase tracking-wider text-right">
                <button
                  type="button"
                  onClick={() => handleSort("avg_years_since_promotion")}
                  className="inline-flex items-center gap-1.5 hover:text-[#f3f5f8]"
                >
                  Prom. Gap
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3 px-3 font-semibold uppercase tracking-wider text-center">
                Risk Tier
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredAndSortedData.map((row, index) => {
              const isCrit = row.attrition_rate_pct >= 40;
              const isHigh = row.attrition_rate_pct >= 25 && row.attrition_rate_pct < 40;
              const isMed = row.attrition_rate_pct >= 15 && row.attrition_rate_pct < 25;

              return (
                <tr
                  key={`${row.department}-${row.job_role}-${row.over_time}-${index}`}
                  className="transition-colors hover:bg-white/[0.03]"
                >
                  {/* Cohort Profile */}
                  <td className="py-3 px-3">
                    <div className="font-semibold text-[#f3f5f8]">
                      {row.job_role}
                    </div>
                    <div className="text-[11px] text-[#8c93a8]">
                      {row.department}
                    </div>
                  </td>

                  {/* Overtime */}
                  <td className="py-3 px-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                        row.over_time === "Yes"
                          ? "bg-[#e86034]/20 text-[#fa7347] border border-[#e86034]/30"
                          : "bg-white/[0.05] text-[#8c93a8]"
                      )}
                    >
                      <Clock className="h-2.5 w-2.5" />
                      {row.over_time === "Yes" ? "OT: Yes" : "OT: No"}
                    </span>
                  </td>

                  {/* Cohort Size */}
                  <td className="py-3 px-3 text-right font-mono text-[#f3f5f8]">
                    {row.cohort_size}
                  </td>

                  {/* Total Left */}
                  <td className="py-3 px-3 text-right font-mono text-[#8c93a8]">
                    {row.total_left}
                  </td>

                  {/* Attrition % */}
                  <td className="py-3 px-3 text-right">
                    <span className="font-mono font-bold text-sm text-[#e86034]">
                      {row.attrition_rate_pct.toFixed(1)}%
                    </span>
                  </td>

                  {/* Avg Monthly Salary */}
                  <td className="py-3 px-3 text-right font-mono text-[#2a9d8f]">
                    ${Math.round(row.avg_monthly_income).toLocaleString()}
                  </td>

                  {/* Avg Years Since Promotion */}
                  <td className="py-3 px-3 text-right font-mono text-[#f3f5f8]">
                    {row.avg_years_since_promotion.toFixed(1)}y
                  </td>

                  {/* Risk Tier Badge */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={cn(
                        "inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide",
                        isCrit && "bg-[#e86034] text-white [box-shadow:0_0_10px_rgba(232,96,52,0.4)]",
                        isHigh && "bg-[#fa7347]/20 text-[#fa7347] border border-[#fa7347]/30",
                        isMed && "bg-[#eab308]/20 text-[#eab308] border border-[#eab308]/30",
                        !isCrit && !isHigh && !isMed && "bg-[#2a9d8f]/20 text-[#2a9d8f] border border-[#2a9d8f]/30"
                      )}
                    >
                      {isCrit ? "CRITICAL" : isHigh ? "HIGH" : isMed ? "MODERATE" : "LOW"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredAndSortedData.length === 0 && (
        <div className="py-8 text-center text-xs text-[#8c93a8]">
          No workforce cohorts match the specified filter.
        </div>
      )}
    </ClayPanel>
  );
}
