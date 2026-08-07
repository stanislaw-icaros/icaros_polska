import type { Metadata } from "next";
import WorldReferences from "@/components/WorldReferences";

export const metadata: Metadata = {
  title: "ICAROS na świecie | ICAROS Biznes",
  description:
    "Wybrane referencyjne wdrożenia ICAROS poza Polską: centra urazowe, kliniki rehabilitacyjne, ośrodki przygotowania motorycznego i medical spa. Wersja dla partnerów biznesowych.",
  alternates: { canonical: "/icaros-na-swiecie" },
};

export default function IcarosNaSwiecieBiznesPage() {
  return <WorldReferences theme="dark" mapHref="/lokalizacje" />;
}
