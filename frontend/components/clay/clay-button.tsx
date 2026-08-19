"use client";

import React from "react";
import Link from "next/link";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export type ClayButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ClayButtonSize = "sm" | "md" | "lg" | "xl";

export interface ClayButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: ClayButtonVariant;
  size?: ClayButtonSize;
  href?: string;
  external?: boolean;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const variantStyles: Record<ClayButtonVariant, string> = {
  primary:
    "bg-[#e86034] text-white [box-shadow:var(--shadow-clay-btn-primary)] hover:bg-[#fa7347] border border-white/25 active:[box-shadow:inset_3px_3px_8px_rgba(0,0,0,0.5),inset_-2px_-2px_6px_rgba(255,255,255,0.2)]",
  secondary:
    "bg-[#1a2030] text-[#f3f5f8] [box-shadow:var(--shadow-clay-btn-secondary)] hover:bg-[#222a3e] border border-white/10 active:[box-shadow:inset_3px_3px_8px_rgba(0,0,0,0.6),inset_-2px_-2px_6px_rgba(255,255,255,0.03)]",
  outline:
    "bg-[#131722]/60 backdrop-blur-md text-[#f3f5f8] border border-white/15 hover:border-[#e86034]/50 hover:bg-[#1a2030]/80 [box-shadow:6px_6px_16px_rgba(0,0,0,0.4),-4px_-4px_12px_rgba(255,255,255,0.02)]",
  ghost:
    "bg-transparent text-[#8c93a8] hover:text-[#f3f5f8] hover:bg-white/[0.04] border border-transparent",
};

const sizeStyles: Record<ClayButtonSize, string> = {
  sm: "px-4 py-2 text-xs font-semibold rounded-[16px] gap-1.5",
  md: "px-5 py-2.5 text-sm font-semibold rounded-[18px] gap-2",
  lg: "px-7 py-3.5 text-base font-bold rounded-[22px] gap-2.5 tracking-wide",
  xl: "px-9 py-4 text-lg font-bold rounded-[26px] gap-3 tracking-wide",
};

export const ClayButton = React.forwardRef<HTMLButtonElement, ClayButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      href,
      external = false,
      children,
      className,
      icon,
      iconPosition = "right",
      ...props
    },
    ref
  ) => {
    const content = (
      <>
        {/* Soft top-edge bevel rim light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
        {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
      </>
    );

    const baseClass = cn(
      "relative inline-flex items-center justify-center select-none font-medium cursor-pointer transition-colors duration-150 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[#e86034]/60",
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    if (href) {
      if (external) {
        return (
          <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={baseClass}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ y: 2, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
          >
            {content}
          </motion.a>
        );
      }

      return (
        <Link href={href} legacyBehavior passHref>
          <motion.a
            className={baseClass}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ y: 2, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
          >
            {content}
          </motion.a>
        </Link>
      );
    }

    return (
      <motion.button
        ref={ref}
        type="button"
        className={baseClass}
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ y: 2, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);

ClayButton.displayName = "ClayButton";
