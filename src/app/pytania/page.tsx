import type { Metadata } from "next";
import PytaniaClient from "./PytaniaClient";

export const metadata: Metadata = {
  title: "Pytania i odpowiedzi | ICAROS Polska",
  description:
    "Baza wiedzy ICAROS - najczęstsze pytania o technologię, wdrożenie, obsługę i inwestycję.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function PytaniaPage() {
  return <PytaniaClient />;
}
