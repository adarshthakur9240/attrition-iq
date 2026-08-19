import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AttritionIQ — Predictive Workforce Intelligence & Flight-Risk Analytics",
  description:
    "Turn raw HR telemetry into high-precision retention strategies. Machine learning risk scoring, automated factor attribution, and actionable intervention playbooks.",
  keywords: [
    "attrition prediction",
    "workforce analytics",
    "flight risk ML",
    "HR intelligence",
    "employee retention",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${plusJakartaSans.variable} dark`}
    >
      <body className="min-h-screen flex flex-col antialiased bg-[#090a0f] text-[#f3f5f8] selection:bg-[#e86034]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
