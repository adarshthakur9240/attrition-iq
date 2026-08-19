"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export type ClayCardVariant = "default" | "raised" | "sunken" | "accent" | "glass";
export type ClayGlow = "none" | "terracotta" | "subtle";

export interface ClayCardProps extends HTMLMotionProps<"div"> {
  variant?: ClayCardVariant;
  interactive?: boolean;
  glow?: ClayGlow;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<ClayCardVariant, string> = {
  default: "bg-[#131722] text-[#f3f5f8] [box-shadow:var(--shadow-clay-card)] border border-white/[0.06]",
  raised: "bg-[#1a2030] text-[#f3f5f8] [box-shadow:var(--shadow-clay-card-raised)] border border-white/[0.09]",
  sunken: "bg-[#0b0d14] text-[#f3f5f8] [box-shadow:var(--shadow-clay-card-sunken)] border border-black/40",
  accent: "bg-[#e86034] text-white [box-shadow:var(--shadow-clay-btn-primary)] border border-white/25",
  glass: "bg-[#131722]/80 backdrop-blur-xl text-[#f3f5f8] [box-shadow:var(--shadow-clay-card)] border border-white/[0.08]",
};

const glowStyles: Record<ClayGlow, string> = {
  none: "",
  terracotta: "relative before:absolute before:-inset-px before:-z-10 before:rounded-[inherit] before:bg-gradient-to-b before:from-[#e86034]/20 before:to-transparent before:blur-sm",
  subtle: "relative before:absolute before:-inset-px before:-z-10 before:rounded-[inherit] before:bg-gradient-to-b before:from-white/10 before:to-transparent before:blur-sm",
};

export const ClayCard = React.forwardRef<HTMLDivElement, ClayCardProps>(
  (
    {
      variant = "default",
      interactive = false,
      glow = "none",
      className,
      children,
      ...motionProps
    },
    ref
  ) => {
    const isInteractive = interactive || variant === "raised";

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-[24px] p-6 transition-colors duration-200",
          variantStyles[variant],
          glowStyles[glow],
          className
        )}
        whileHover={
          isInteractive
            ? {
                y: -5,
                scale: 1.012,
                boxShadow:
                  variant === "accent"
                    ? "10px 10px 30px rgba(232, 96, 52, 0.5), 14px 14px 32px rgba(0,0,0,0.7), -6px -6px 16px rgba(255,255,255,0.15), inset 1px 1px 2px rgba(255,255,255,0.4)"
                    : "18px 18px 40px rgba(0, 0, 0, 0.8), -10px -10px 26px rgba(255, 255, 255, 0.05), inset 1px 1px 1.5px rgba(255, 255, 255, 0.14), inset -1px -1px 2px rgba(0, 0, 0, 0.5)",
              }
            : undefined
        }
        whileTap={
          isInteractive
            ? {
                y: 1,
                scale: 0.99,
              }
            : undefined
        }
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 28,
        }}
        {...motionProps}
      >
        {/* Subtle Clay Top-Left Rim Light Highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-80"
        />
        {children}
      </motion.div>
    );
  }
);

ClayCard.displayName = "ClayCard";
