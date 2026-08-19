"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ── Clay Input ─────────────────────────────────────────────────────────────

export interface ClayInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  prefixIcon?: React.ReactNode;
  suffixText?: string;
}

export const ClayInput = React.forwardRef<HTMLInputElement, ClayInputProps>(
  ({ label, helperText, prefixIcon, suffixText, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-[#8c93a8]">
          {label}
        </label>
        <div className="relative flex items-center">
          {prefixIcon && (
            <div className="pointer-events-none absolute left-3.5 flex items-center text-[#8c93a8]">
              {prefixIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "h-11 w-full rounded-[16px] bg-[#0b0d14] px-4 text-sm font-medium text-[#f3f5f8] [box-shadow:var(--shadow-clay-card-sunken)] border border-white/[0.05] outline-none transition-all placeholder:text-[#545b70] focus:border-[#e86034]/50 focus:ring-1 focus:ring-[#e86034]/50",
              prefixIcon && "pl-10",
              suffixText && "pr-12",
              className
            )}
            {...props}
          />
          {suffixText && (
            <div className="pointer-events-none absolute right-3.5 text-xs font-semibold text-[#8c93a8]">
              {suffixText}
            </div>
          )}
        </div>
        {helperText && (
          <p className="text-[11px] text-[#545b70]">{helperText}</p>
        )}
      </div>
    );
  }
);
ClayInput.displayName = "ClayInput";

// ── Clay Select ────────────────────────────────────────────────────────────

export interface ClaySelectOption {
  value: string;
  label: string;
}

export interface ClaySelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: ClaySelectOption[];
  helperText?: string;
}

export const ClaySelect = React.forwardRef<HTMLSelectElement, ClaySelectProps>(
  ({ label, options, helperText, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-[#8c93a8]">
          {label}
        </label>
        <select
          ref={ref}
          className={cn(
            "h-11 w-full rounded-[16px] bg-[#0b0d14] px-4 text-sm font-medium text-[#f3f5f8] [box-shadow:var(--shadow-clay-card-sunken)] border border-white/[0.05] outline-none transition-all focus:border-[#e86034]/50 focus:ring-1 focus:ring-[#e86034]/50 cursor-pointer",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-[#131722] text-[#f3f5f8]"
            >
              {opt.label}
            </option>
          ))}
        </select>
        {helperText && (
          <p className="text-[11px] text-[#545b70]">{helperText}</p>
        )}
      </div>
    );
  }
);
ClaySelect.displayName = "ClaySelect";

// ── Clay Slider ────────────────────────────────────────────────────────────

export interface ClaySliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  helperText?: string;
  minLabel?: string;
  maxLabel?: string;
  onChange: (val: number) => void;
}

export function ClaySlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  helperText,
  minLabel,
  maxLabel,
  onChange,
}: ClaySliderProps) {
  return (
    <div className="space-y-2 rounded-[18px] bg-[#0b0d14] p-4 [box-shadow:var(--shadow-clay-card-sunken)] border border-white/[0.04]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#8c93a8]">{label}</span>
        <span className="font-mono text-xs font-bold text-[#e86034]">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#1a2030] accent-[#e86034]"
      />
      {(minLabel || maxLabel || helperText) && (
        <div className="flex items-center justify-between text-[10px] text-[#545b70]">
          <span>{minLabel || `${min} ${unit}`}</span>
          {helperText && <span className="text-[#8c93a8]">{helperText}</span>}
          <span>{maxLabel || `${max} ${unit}`}</span>
        </div>
      )}
    </div>
  );
}

// ── Clay Segmented Buttons ─────────────────────────────────────────────────

export interface ClaySegmentedProps<T extends string> {
  label: string;
  options: { value: T; label: string; icon?: React.ReactNode }[];
  value: T;
  onChange: (val: T) => void;
  helperText?: string;
}

export function ClaySegmented<T extends string>({
  label,
  options,
  value,
  onChange,
  helperText,
}: ClaySegmentedProps<T>) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-[#8c93a8]">
        {label}
      </label>
      <div className="flex rounded-[16px] bg-[#0b0d14] p-1.5 [box-shadow:var(--shadow-clay-card-sunken)] border border-white/[0.04] gap-1.5">
        {options.map((opt) => {
          const isActive = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 rounded-[12px] py-2 text-xs font-semibold transition-all select-none cursor-pointer",
                isActive
                  ? "bg-[#e86034] text-white [box-shadow:var(--shadow-clay-btn-primary)]"
                  : "text-[#8c93a8] hover:text-[#f3f5f8] hover:bg-white/[0.03]"
              )}
            >
              {opt.icon && <span className="shrink-0">{opt.icon}</span>}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
      {helperText && (
        <p className="text-[11px] text-[#545b70]">{helperText}</p>
      )}
    </div>
  );
}
