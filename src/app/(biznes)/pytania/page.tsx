import type { Metadata } from "next";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
  title: "FAQ / Pytania | ICAROS Biznes",
  description:
    "Najczęstsze pytania o ICAROS dla placówek - technologia, terapia, wdrożenie, wsparcie i koszty. Wersja dla biznesu.",
  alternates: { canonical: "/faq" },
};

export default function PytaniaBiznesPage() {
  return <FAQ variant="dark" audience="business" />;
}
