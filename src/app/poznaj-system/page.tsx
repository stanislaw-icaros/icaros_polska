import type { Metadata } from "next";
import { Suspense } from "react";
import PoznajSystem from "./PoznajSystem";

export const metadata: Metadata = {
  title: "Poznaj system ICAROS | ICAROS Polska",
  description:
    "Wszystko, co warto wiedzieć o systemie ICAROS przed rozmową: urządzenia, technologia VR, badania kliniczne, program testów 14-dniowych i katalog produktowy.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function PoznajSystemPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-foreground" />}>
      <PoznajSystem />
    </Suspense>
  );
}
