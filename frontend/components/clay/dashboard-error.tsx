"use client";

import React from "react";
import { ClayPanel } from "./clay-panel";
import { ClayButton } from "./clay-button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface DashboardErrorProps {
  message?: string;
  onRetry: () => void;
}

export function DashboardError({ message, onRetry }: DashboardErrorProps) {
  return (
    <div className="mx-auto max-w-2xl py-12">
      <ClayPanel
        title="Unable to Load Workforce Telemetry"
        subtitle="Could not connect to the backend analytics services"
        badge={
          <div className="flex h-8 w-8 items-center justify-center rounded-[12px] bg-[#e86034]/20 text-[#e86034]">
            <AlertTriangle className="h-5 w-5" />
          </div>
        }
        className="p-8 text-center"
      >
        <div className="my-6 rounded-[20px] bg-[#0b0d14] p-5 [box-shadow:var(--shadow-clay-card-sunken)] border border-white/[0.05]">
          <p className="text-sm text-[#8c93a8]">
            {message ||
              "Please verify that the backend API server is running on http://localhost:8000 and the PostgreSQL database has loaded the analytics views."}
          </p>
        </div>

        <div className="flex justify-center">
          <ClayButton
            variant="primary"
            size="md"
            onClick={onRetry}
            icon={<RefreshCw className="h-4 w-4" />}
          >
            Retry Connection
          </ClayButton>
        </div>
      </ClayPanel>
    </div>
  );
}
