import type { Metadata } from "next";
import { Suspense } from "react";
import RaportLanding from "./RaportLanding";

export const metadata: Metadata = {
  title: "Bezpłatny raport: VR w rehabilitacji | ICAROS Polska",
  description:
    "Pobierz bezpłatny raport o technologii VR w rehabilitacji - dane finansowe, badania kliniczne i doświadczenia 100+ klinik w Europie.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function RaportLandingPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-foreground" />}>
      <RaportLanding />
    </Suspense>
  );
}
