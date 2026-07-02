import type { Metadata } from "next";
import ProductEcosystem from "@/components/ProductEcosystem";

export const metadata: Metadata = {
  title: "Urządzenia ICAROS | ICAROS Biznes",
  description:
    "Ekosystem ICAROS Circle: cztery urządzenia do rehabilitacji i treningu - Health, I.S.T. Board, Guardian i Cloud. Pełna ścieżka terapeutyczna dla placówki.",
  alternates: { canonical: "/produkty" },
};

export default function UrzadzeniaBiznesPage() {
  return <ProductEcosystem basePath="/urzadzenia" />;
}
