"use client";

import React, { useEffect, useRef, useState } from "react";
import { ClayCard } from "./clay-card";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StatCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
  subtext: string;
  icon?: React.ReactNode;
  variant?: "default" | "raised" | "accent";
}

export function StatCounter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  label,
  subtext,
  icon,
  variant = "default",
}: StatCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          if (animatedRef.current) return;
          animatedRef.current = true;
          gsap.to(obj, {
            val: value,
            duration: 2.0,
            ease: "power3.out",
            onUpdate: () => {
              setDisplayValue(
                decimals > 0
                  ? parseFloat(obj.val.toFixed(decimals))
                  : Math.round(obj.val)
              );
            },
          });
        },
      });
    }, el);

    return () => ctx.revert();
  }, [value, decimals]);

  const formattedNumber =
    decimals > 0
      ? displayValue.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : displayValue.toLocaleString();

  return (
    <div ref={containerRef} className="h-full">
      <ClayCard
        variant={variant === "accent" ? "accent" : "default"}
        interactive
        glow={variant === "accent" ? "terracotta" : "subtle"}
        className="flex h-full flex-col justify-between p-6"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8c93a8]">
            {label}
          </span>
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-[#1a2030] [box-shadow:inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-1px_-1px_2px_rgba(255,255,255,0.05)] text-[#e86034]">
              {icon}
            </div>
          )}
        </div>

        <div className="my-4">
          <div className="font-display text-4xl font-extrabold tracking-tight text-[#f3f5f8] md:text-5xl">
            <span>{prefix}</span>
            <span>{formattedNumber}</span>
            <span className="text-[#e86034]">{suffix}</span>
          </div>
        </div>

        <p className="text-xs font-medium leading-relaxed text-[#8c93a8]">
          {subtext}
        </p>
      </ClayCard>
    </div>
  );
}
