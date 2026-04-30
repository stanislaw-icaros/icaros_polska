import type { Metadata } from "next";
import { Suspense } from "react";
import KalkulatorPageClient from "./components/KalkulatorPageClient";

export const metadata: Metadata = {
  title: "Kalkulator ROI ICAROS Circle | ICAROS Polska",
  description:
    "Sprawdź szacowany dodatkowy przychód dla Twojej placówki: scenariusz ICAROS Circle z orientacyjną ratą leasingu (48 mies., 10% wpłaty, 1% wykupu, netto).",
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

