"use client";

import React from "react";
import { ClayCard } from "./clay-card";
import { ClayPanel } from "./clay-panel";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DashboardSkeletonProps {
  isSlowLoad?: boolean;
}

export function DashboardSkeleton({ isSlowLoad = false }: DashboardSkeletonProps) {
  return (
    <div className="space-y-10">
      {/* Cold Start Banner Alert */}
      {isSlowLoad && (
        <div className="flex items-center gap-3.5 rounded-[20px] border border-amber-500/30 bg-amber-500/10 px-6 py-4 text-amber-200 shadow-[0_8px_32px_rgba(245,158,11,0.15)] backdrop-blur-md animate-in fade-in duration-300">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400 animate-pulse" />
          <p className="text-sm font-medium leading-relaxed">
            <span className="font-semibold text-amber-300">Waking up the server...</span> Note: This project uses a free backend tier. The first load might take up to 50 seconds to spin up. Hang tight!
          </p>
        </div>
      )}

      {/* KPI Skeletons */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
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
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 animate-pulse">
        <div className="lg:col-span-7">
          <ClayPanel title="Loading Department Analytics..." className="h-[380px]">
            <div className="flex flex-col h-64 items-center justify-center gap-4">
              <div className="h-44 w-44 rounded-full border-8 border-white/5 border-t-[#e86034]/40 animate-spin" />
              {isSlowLoad && (
                <div className="flex items-center gap-2 text-xs text-amber-300/90 font-medium">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400" />
                  <span>Spinning up free tier instance...</span>
                </div>
              )}
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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
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
      <ClayPanel title="Loading High-Risk Cohort Registry..." className="h-96 animate-pulse">
        <div className="space-y-3 pt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-full rounded-[14px] bg-white/5" />
          ))}
        </div>
      </ClayPanel>
    </div>
  );
}
