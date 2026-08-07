import type { Metadata } from "next";
import WorldReferences from "@/components/WorldReferences";

export const metadata: Metadata = {
  title: "ICAROS na świecie | ICAROS Polska",
  description:
    "Wybrane kliniki, szpitale i ośrodki longevity, które pracują na urządzeniach ICAROS: od BG Klinikum Murnau i cereneo po SHA Wellness Clinic, Palazzo Fiuggi i Red Bull Athlete Performance Center.",
  alternates: { canonical: "/icaros-na-swiecie" },
};

export default function IcarosNaSwieciePage() {
  return <WorldReferences theme="light" mapHref="/mapa" />;
}
