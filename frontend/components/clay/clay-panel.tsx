"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ClayPanelProps extends HTMLMotionProps<"div"> {
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  sunkenContent?: boolean;
}

export const ClayPanel = React.forwardRef<HTMLDivElement, ClayPanelProps>(
  (
    {
      title,
      subtitle,
      badge,
      headerAction,
      children,
      className,
      sunkenContent = false,
      ...motionProps
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-[30px] bg-[#141824] p-8 [box-shadow:var(--shadow-clay-card-raised)] border border-white/[0.08]",
          className
        )}
        {...motionProps}
      >
        {/* Soft top-left directional highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />

        {(title || badge || headerAction) && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.05] pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                {badge && <span>{badge}</span>}
                {title && (
                  <h3 className="text-xl font-bold tracking-tight text-[#f3f5f8]">
                    {title}
                  </h3>
                )}
              </div>
              {subtitle && (
                <p className="text-sm text-[#8c93a8]">{subtitle}</p>
              )}
            </div>
            {headerAction && <div className="shrink-0">{headerAction}</div>}
          </div>
        )}

        <div
          className={cn(
            sunkenContent &&
              "rounded-[20px] bg-[#0b0d14] p-5 [box-shadow:var(--shadow-clay-card-sunken)] border border-black/40"
          )}
        >
          {children}
        </div>
      </motion.div>
    );
  }
);

ClayPanel.displayName = "ClayPanel";
