import type { Metadata } from "next";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
  title: "FAQ / Pytania | ICAROS Polska",
  description:
    "Najczęściej zadawane pytania o ICAROS - technologia, terapia, wdrożenie, wsparcie i koszty.",
};

export default function FaqPage() {
  return <FAQ />;
}
