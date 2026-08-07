import type { Metadata } from "next";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
  title: "FAQ / Pytania | ICAROS Polska",
  description:
    "Najczęstsze pytania o trening ICAROS - jak działa, komu pomaga, czy jest bezpieczny i gdzie w Polsce możesz z niego skorzystać.",
};

export default function FaqPage() {
  return <FAQ audience="patient" />;
}
