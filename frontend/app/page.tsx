"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ClayCard } from "@/components/clay/clay-card";
import { ClayButton } from "@/components/clay/clay-button";
import { ClayPanel } from "@/components/clay/clay-panel";
import { StatCounter } from "@/components/clay/stat-counter";
import { InteractiveDemo } from "@/components/clay/interactive-demo";
import {
  BrainCircuit,
  Sliders,
  ShieldAlert,
  Database,
  ArrowRight,
  Sparkles,
  BarChart3,
  Users,
  Activity,
  Layers,
  ChevronRight,
  TrendingDown,
  CheckCircle,
  Radar,
} from "lucide-react";

// Safe dynamic client-only import for Three.js 3D Hero Scene
const HeroScene = dynamic(() => import("@/components/three/hero-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-40 w-40 animate-pulse rounded-full bg-[#e86034]/20 blur-3xl" />
    </div>
  ),
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroBadgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const sceneWrapperRef = useRef<HTMLDivElement>(null);
  const featureSectionRef = useRef<HTMLElement>(null);
  const featureCardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Hero Entrance Animation Timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        heroBadgeRef.current,
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.1 }
      )
        .fromTo(
          headlineRef.current?.querySelectorAll(".word-reveal") || [],
          { opacity: 0, y: 35, rotateX: 25 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.9,
            stagger: 0.08,
          },
          "-=0.5"
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.6"
        )
        .fromTo(
          ctaGroupRef.current,
          { opacity: 0, y: 25, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(
          sceneWrapperRef.current,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" },
          "-=1.0"
        );

      // 2. Features ScrollTrigger Reveal with Stagger & Subtle Tilt
      if (featureCardsRef.current) {
        const cards = featureCardsRef.current.children;
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 60,
            rotation: -2,
            scale: 0.94,
          },
          {
            opacity: 1,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.16,
            ease: "power3.out",
            scrollTrigger: {
              trigger: featureSectionRef.current,
              start: "top 78%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-x-hidden bg-[#090a0f] text-[#f3f5f8]"
    >
      {/* Background Ambient Clay Glows */}
      <div className="clay-ambient-glow glow-terracotta -left-40 top-20 h-[600px] w-[600px]" />
      <div className="clay-ambient-glow glow-slate right-0 top-[600px] h-[550px] w-[550px]" />
      <div className="clay-ambient-glow glow-terracotta -left-20 bottom-40 h-[500px] w-[500px]" />

      {/* Top Clay Navigation Bar */}
      <header className="sticky top-0 z-50 w-full px-4 pt-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[24px] bg-[#131722]/80 px-6 py-3.5 backdrop-blur-xl [box-shadow:var(--shadow-clay-card)] border border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#e86034] [box-shadow:var(--shadow-clay-btn-primary)] text-white font-bold text-lg font-display">
              A
            </div>
            <div>
              <span className="font-display text-lg font-bold tracking-tight text-[#f3f5f8]">
                Attrition<span className="text-[#e86034]">IQ</span>
              </span>
              <span className="hidden sm:inline-block ml-2 rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold text-[#8c93a8]">
                v1.0 ML Engine
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#8c93a8]">
            <a href="#features" className="transition-colors hover:text-[#f3f5f8]">
              Features
            </a>
            <Link href="/dashboard" className="transition-colors hover:text-[#f3f5f8]">
              Dashboard
            </Link>
            <Link href="/predict" className="transition-colors hover:text-[#f3f5f8]">
              Risk Scanner
            </Link>
            <a href="#simulator" className="transition-colors hover:text-[#f3f5f8]">
              Simulator
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ClayButton
              variant="outline"
              size="sm"
              href="/predict"
              icon={<Radar className="h-3.5 w-3.5 text-[#e86034]" />}
              iconPosition="left"
            >
              Scan Risk
            </ClayButton>
            <ClayButton
              variant="primary"
              size="sm"
              href="/dashboard"
              icon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Suite
            </ClayButton>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative flex min-h-[calc(100vh-80px)] flex-col justify-center px-4 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12">
            {/* Left Content */}
            <div className="space-y-8 lg:col-span-7">
              {/* Badge */}
              <div ref={heroBadgeRef} className="inline-block">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#161a26] px-4 py-1.5 [box-shadow:var(--shadow-clay-pill)] border border-white/[0.08]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e86034] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e86034]" />
                  </span>
                  <span className="text-xs font-semibold tracking-wide text-[#f3f5f8]">
                    Workforce Intelligence &amp; Retention AI
                  </span>
                </div>
              </div>

              {/* Staggered GSAP Headline */}
              <h1
                ref={headlineRef}
                className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-[#f3f5f8] sm:text-5xl md:text-6xl lg:text-7xl"
              >
                <span className="word-reveal inline-block">Predict</span>{" "}
                <span className="word-reveal inline-block">Employee</span>{" "}
                <span className="word-reveal inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#fa7347] via-[#e86034] to-[#f59e0b]">
                  Churn
                </span>{" "}
                <span className="word-reveal inline-block">Before</span>{" "}
                <span className="word-reveal inline-block">It</span>{" "}
                <span className="word-reveal inline-block">Happens.</span>
              </h1>

              {/* Subtitle */}
              <p
                ref={subtitleRef}
                className="max-w-xl text-base font-normal leading-relaxed text-[#8c93a8] sm:text-lg"
              >
                Transform raw HR telemetry into high-precision retention strategies.
                Trained on 1,470 workforce records with explainable risk decomposition
                and actionable mitigation playbooks.
              </p>

              {/* CTA Group */}
              <div
                ref={ctaGroupRef}
                className="flex flex-col gap-4 sm:flex-row sm:items-center"
              >
                <ClayButton
                  variant="primary"
                  size="lg"
                  href="/dashboard"
                  icon={<ArrowRight className="h-4 w-4" />}
                >
                  Enter Analytics Suite
                </ClayButton>
                <ClayButton
                  variant="outline"
                  size="lg"
                  href="#features"
                >
                  Explore Capabilities
                </ClayButton>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-[#8c93a8]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#2a9d8f]" />
                  <span>80.1% ROC-AUC Precision</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#2a9d8f]" />
                  <span>9 SQL Analytical Views</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#2a9d8f]" />
                  <span>Per-Instance Attribution</span>
                </div>
              </div>
            </div>

            {/* Right: Three.js 3D Hero Scene */}
            <div
              ref={sceneWrapperRef}
              className="relative h-[380px] w-full sm:h-[480px] lg:col-span-5 lg:h-[580px]"
            >
              <HeroScene />
            </div>
          </div>
        </section>

        {/* STATS STRIP SECTION */}
        <section id="metrics" className="px-4 py-12 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCounter
                value={1470}
                label="Total Headcount"
                subtext="Complete benchmark workforce cohort analyzed in backend pipeline"
                icon={<Users className="h-5 w-5" />}
              />
              <StatCounter
                value={9}
                label="SQL Analytical Views"
                subtext="Engineered aggregation views across departments, salary & satisfaction"
                icon={<Database className="h-5 w-5" />}
              />
              <StatCounter
                value={80.1}
                suffix="%"
                decimals={1}
                label="Model ROC-AUC"
                subtext="Balanced classifier with 68.1% flight-risk recall on holdout test set"
                icon={<BrainCircuit className="h-5 w-5" />}
                variant="accent"
              />
              <StatCounter
                value={237}
                label="Departures Analyzed"
                subtext="16.1% baseline historical attrition rate with deep root cause tracking"
                icon={<TrendingDown className="h-5 w-5" />}
              />
            </div>
          </div>
        </section>

        {/* PLATFORM FEATURES SECTION */}
        <section
          id="features"
          ref={featureSectionRef}
          className="px-4 py-20 sm:px-8 lg:py-28"
        >
          <div className="mx-auto max-w-7xl">
            {/* Section Header */}
            <div className="mb-16 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#161a26] px-4 py-1.5 [box-shadow:var(--shadow-clay-pill)] border border-white/[0.08] mb-4">
                <Sparkles className="h-3.5 w-3.5 text-[#e86034]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8c93a8]">
                  Core Capabilities
                </span>
              </div>
              <h2 className="font-display text-3xl font-extrabold text-[#f3f5f8] sm:text-4xl lg:text-5xl">
                Engineered for High-Precision Retention
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-[#8c93a8]">
                Every component is built on rigorous statistical modeling, direct SQL
                aggregation layers, and explainable machine learning predictions.
              </p>
            </div>

            {/* 4 Clay Feature Cards with GSAP Scroll Trigger */}
            <div
              ref={featureCardsRef}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8"
            >
              {/* Feature 1 */}
              <ClayCard
                variant="raised"
                interactive
                glow="terracotta"
                className="flex flex-col justify-between p-8"
              >
                <div>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#e86034] text-white [box-shadow:var(--shadow-clay-btn-primary)]">
                    <BrainCircuit className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#f3f5f8]">
                    Predictive Churn Engine
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#8c93a8]">
                    Real-time flight risk probability scoring powered by class-balanced
                    machine learning. Specifically optimized for recall on flight-risk
                    cases, catching departures before notice is given.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 pt-4 border-t border-white/[0.05] text-xs font-semibold text-[#e86034]">
                  <span>68.1% Leaver Recall • Balanced Weights</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </ClayCard>

              {/* Feature 2 */}
              <ClayCard
                variant="raised"
                interactive
                glow="subtle"
                className="flex flex-col justify-between p-8"
              >
                <div>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#1a2030] text-[#e86034] [box-shadow:var(--shadow-clay-card)] border border-white/10">
                    <Sliders className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#f3f5f8]">
                    Explainable Risk Factors
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#8c93a8]">
                    Instant per-instance attribution revealing whether overtime, travel
                    demands, or promotion stagnation drives flight probability. No black
                    box obscurity—transparent, inspectable coefficients.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 pt-4 border-t border-white/[0.05] text-xs font-semibold text-[#8c93a8]">
                  <span>Top Signals: OverTime, Frequent Travel, Stagnation</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </ClayCard>

              {/* Feature 3 */}
              <ClayCard
                variant="raised"
                interactive
                glow="subtle"
                className="flex flex-col justify-between p-8"
              >
                <div>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#1a2030] text-[#2a9d8f] [box-shadow:var(--shadow-clay-card)] border border-white/10">
                    <ShieldAlert className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#f3f5f8]">
                    Proactive Intervention Levers
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#8c93a8]">
                    Translates diagnostic risk scores into actionable manager playbooks.
                    Identify specific levers—such as workload rebalancing, promotion
                    evaluations, or role lateral moves—to retain critical talent.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 pt-4 border-t border-white/[0.05] text-xs font-semibold text-[#8c93a8]">
                  <span>Targeted Retention Playbooks</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </ClayCard>

              {/* Feature 4 */}
              <ClayCard
                variant="raised"
                interactive
                glow="subtle"
                className="flex flex-col justify-between p-8"
              >
                <div>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#1a2030] text-[#fa7347] [box-shadow:var(--shadow-clay-card)] border border-white/10">
                    <Database className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#f3f5f8]">
                    Workforce Analytics Views
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#8c93a8]">
                    9 pre-built SQL aggregation views tracking workforce cohorts across
                    department, salary bands, promotion gaps, and work-life balance
                    indices directly from the analytics store.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 pt-4 border-t border-white/[0.05] text-xs font-semibold text-[#8c93a8]">
                  <span>Instant Department &amp; Salary Aggregation</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </ClayCard>
            </div>
          </div>
        </section>

        {/* INTERACTIVE SIMULATOR SECTION */}
        <section id="simulator" className="px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <ClayPanel
              title="Interactive Telemetry Simulator"
              subtitle="Test real model sensitivities by adjusting workload, travel, and tenure parameters."
              badge={
                <span className="rounded-full bg-[#e86034]/20 px-3 py-1 text-xs font-bold text-[#e86034]">
                  LIVE DEMO
                </span>
              }
              headerAction={
                <ClayButton variant="outline" size="sm" href="/dashboard">
                  View All Employees
                </ClayButton>
              }
            >
              <InteractiveDemo />
            </ClayPanel>
          </div>
        </section>

        {/* ARCHITECTURE & TELEMETRY SECTION */}
        <section id="architecture" className="px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#161a26] px-4 py-1.5 [box-shadow:var(--shadow-clay-pill)] border border-white/[0.08]">
                  <Layers className="h-3.5 w-3.5 text-[#e86034]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8c93a8]">
                    System Pipeline
                  </span>
                </div>
                <h2 className="font-display text-3xl font-extrabold text-[#f3f5f8] sm:text-4xl">
                  From Raw HR Records to Actionable Retention
                </h2>
                <p className="text-sm leading-relaxed text-[#8c93a8]">
                  AttritionIQ orchestrates a multi-stage pipeline combining PostgreSQL
                  analytical views, scikit-learn classification models, and real-time
                  factor attribution.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-4 rounded-[20px] bg-[#141824] p-4 [box-shadow:var(--shadow-clay-card)] border border-white/[0.06]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#e86034] text-white">
                      1
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#f3f5f8]">
                        SQL Cohort Aggregation
                      </h4>
                      <p className="text-xs text-[#8c93a8]">
                        9 dedicated views extract key telemetry across departments,
                        overtime, and salary bands.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-[20px] bg-[#141824] p-4 [box-shadow:var(--shadow-clay-card)] border border-white/[0.06]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#1a2030] text-[#e86034]">
                      2
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#f3f5f8]">
                        Stratified ML Classification
                      </h4>
                      <p className="text-xs text-[#8c93a8]">
                        Trained on 1,470 records with class-balanced weighting to maximize
                        flight-risk recall (0.681).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-[20px] bg-[#141824] p-4 [box-shadow:var(--shadow-clay-card)] border border-white/[0.06]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#1a2030] text-[#2a9d8f]">
                      3
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#f3f5f8]">
                        Explainability &amp; Intervention
                      </h4>
                      <p className="text-xs text-[#8c93a8]">
                        Per-employee feature ranking and targeted compensation &amp; role
                        playbooks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Architecture Clay Card */}
              <div className="lg:col-span-7">
                <ClayCard
                  variant="raised"
                  glow="terracotta"
                  className="p-8 space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-[#e86034]" />
                      <span className="font-bold text-[#f3f5f8]">
                        Model Benchmarks &amp; Confusion Matrix
                      </span>
                    </div>
                    <span className="rounded-full bg-[#2a9d8f]/20 px-2.5 py-0.5 text-xs font-semibold text-[#2a9d8f]">
                      Test Set N=294
                    </span>
                  </div>

                  {/* Confusion Matrix Clay Display */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-[18px] bg-[#0b0d14] p-4 [box-shadow:var(--shadow-clay-card-sunken)] border border-black/50">
                      <div className="text-xs font-semibold text-[#8c93a8]">
                        True Negatives (Stayed)
                      </div>
                      <div className="font-display text-2xl font-extrabold text-[#f3f5f8] mt-1">
                        192 <span className="text-xs text-[#2a9d8f]">/ 247</span>
                      </div>
                      <div className="text-[11px] text-[#8c93a8] mt-1">
                        Correctly identified as stable
                      </div>
                    </div>

                    <div className="rounded-[18px] bg-[#0b0d14] p-4 [box-shadow:var(--shadow-clay-card-sunken)] border border-black/50">
                      <div className="text-xs font-semibold text-[#e86034]">
                        True Positives (Leavers)
                      </div>
                      <div className="font-display text-2xl font-extrabold text-[#e86034] mt-1">
                        32 <span className="text-xs text-[#fa7347]">/ 47</span>
                      </div>
                      <div className="text-[11px] text-[#8c93a8] mt-1">
                        68.1% Flight-Risk Recall
                      </div>
                    </div>
                  </div>

                  {/* Top Predictor Bar Chart Clay Representation */}
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#8c93a8]">
                      Top Ranked Predictor Coefficients
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs font-medium text-[#f3f5f8] mb-1">
                          <span>OverTime: Yes</span>
                          <span className="text-[#e86034]">0.0915</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[#1a2030] overflow-hidden">
                          <div className="h-full rounded-full bg-[#e86034] w-[91%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-medium text-[#f3f5f8] mb-1">
                          <span>Frequent Business Travel</span>
                          <span className="text-[#e86034]">0.0818</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[#1a2030] overflow-hidden">
                          <div className="h-full rounded-full bg-[#e86034] w-[82%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-medium text-[#f3f5f8] mb-1">
                          <span>Role: Laboratory Technician</span>
                          <span className="text-[#e86034]">0.0748</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[#1a2030] overflow-hidden">
                          <div className="h-full rounded-full bg-[#fa7347] w-[75%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-medium text-[#f3f5f8] mb-1">
                          <span>Marital Status: Single</span>
                          <span className="text-[#e86034]">0.0414</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[#1a2030] overflow-hidden">
                          <div className="h-full rounded-full bg-[#2a9d8f] w-[41%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </ClayCard>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA CALLOUT */}
        <section className="px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <ClayCard
              variant="raised"
              glow="terracotta"
              className="relative overflow-hidden p-10 text-center sm:p-14"
            >
              <div className="clay-ambient-glow glow-terracotta left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64" />
              
              <div className="relative z-10 mx-auto max-w-2xl space-y-6">
                <h2 className="font-display text-3xl font-extrabold text-[#f3f5f8] sm:text-4xl lg:text-5xl">
                  Ready to Mitigate Workforce Flight-Risk?
                </h2>
                <p className="text-base text-[#8c93a8]">
                  Explore the full analytics dashboard, query department breakdown
                  views, and inspect individual risk scores for all 1,470 employee
                  profiles.
                </p>
                <div className="pt-4">
                  <ClayButton
                    variant="primary"
                    size="xl"
                    href="/dashboard"
                    icon={<ArrowRight className="h-5 w-5" />}
                  >
                    Open Intelligence Dashboard
                  </ClayButton>
                </div>
              </div>
            </ClayCard>
          </div>
        </section>
      </main>

      {/* TACTILE CLAY FOOTER */}
      <footer className="border-t border-white/[0.06] bg-[#0b0d14] px-4 py-12 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#e86034] text-white font-bold font-display text-sm">
              A
            </div>
            <span className="font-display text-base font-bold text-[#f3f5f8]">
              Attrition<span className="text-[#e86034]">IQ</span>
            </span>
          </div>

          <p className="text-xs text-[#545b70]">
            AttritionIQ • Built for HR Analytics &amp; Machine Learning Flight-Risk Prediction.
          </p>

          <div className="flex items-center gap-6 text-xs text-[#8c93a8]">
            <Link href="/dashboard" className="transition hover:text-[#f3f5f8]">
              Dashboard
            </Link>
            <Link href="/predict" className="transition hover:text-[#f3f5f8]">
              Risk Scanner
            </Link>
            <a href="#features" className="transition hover:text-[#f3f5f8]">
              Features
            </a>
            <a href="#simulator" className="transition hover:text-[#f3f5f8]">
              Simulator
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
