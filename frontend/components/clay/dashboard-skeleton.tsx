"use client";

import React from "react";
import { ClayCard } from "./clay-card";
import { ClayPanel } from "./clay-panel";

export function DashboardSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      {/* KPI Skeletons */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <ClayCard key={i} variant="raised" className="p-6 h-36 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 rounded-full bg-white/10" />
              <div className="h-8 w-8 rounded-[12px] bg-white/5" />
            </div>
            <div className="h-8 w-32 rounded-lg bg-white/15" />
            <div className="h-3 w-40 rounded-full bg-white/5" />
          </ClayCard>
        ))}
      </div>

      {/* Main Charts Row Skeletons */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ClayPanel title="Loading Department Analytics..." className="h-[380px]">
            <div className="flex h-64 items-center justify-center">
              <div className="h-44 w-44 rounded-full border-8 border-white/5 border-t-[#e86034]/40 animate-spin" />
            </div>
          </ClayPanel>
        </div>
        <div className="lg:col-span-5">
          <ClayPanel title="Loading Cohort Distribution..." className="h-[380px]">
            <div className="space-y-4 pt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 rounded-[14px] bg-white/5" />
              ))}
            </div>
          </ClayPanel>
        </div>
      </div>

      {/* Grid of Secondary Charts Skeletons */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <ClayPanel key={i} title="Loading Metric View..." className="h-[320px]">
            <div className="flex h-48 items-end gap-3 px-4 pb-4">
              <div className="h-24 w-full rounded-t-lg bg-white/5" />
              <div className="h-40 w-full rounded-t-lg bg-[#e86034]/20" />
              <div className="h-16 w-full rounded-t-lg bg-white/5" />
              <div className="h-28 w-full rounded-t-lg bg-white/5" />
            </div>
          </ClayPanel>
        ))}
      </div>

      {/* Table Skeleton */}
      <ClayPanel title="Loading High-Risk Cohort Registry..." className="h-96">
        <div className="space-y-3 pt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-full rounded-[14px] bg-white/5" />
          ))}
        </div>
      </ClayPanel>
    </div>
  );
}
