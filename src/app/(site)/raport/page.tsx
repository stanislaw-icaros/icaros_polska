import type { Metadata } from "next";
import { Suspense } from "react";
import RaportOffer from "./RaportOffer";

export const metadata: Metadata = {
  title: "Bezpłatny raport: VR w rehabilitacji | ICAROS Polska",
  description:
    "Pobierz bezpłatny raport o technologii VR w rehabilitacji - realne dane finansowe, wyniki 9 badań klinicznych i doświadczenia 100+ klinik w Europie.",
};

export default function RaportPage() {
  return (
    <Suspense fallback={<section className="min-h-[60vh] bg-foreground" />}>
      <RaportOffer />
    </Suspense>
  );
}
