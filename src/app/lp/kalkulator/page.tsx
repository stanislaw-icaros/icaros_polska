import type { Metadata } from "next";
import { Suspense } from "react";
import KalkulatorPageClient from "./components/KalkulatorPageClient";

export const metadata: Metadata = {
  title: "Kalkulator ROI ICAROS Circle | ICAROS Polska",
  description:
    "Sprawdź szacowany dodatkowy przychód dla Twojej placówki dzięki wdrożeniu ICAROS Circle.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function KalkulatorLandingPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-surface" />}>
      <KalkulatorPageClient />
    </Suspense>
  );
}

