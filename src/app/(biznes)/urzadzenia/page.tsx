import type { Metadata } from "next";
import ProductEcosystem from "@/components/ProductEcosystem";

export const metadata: Metadata = {
  title: "Urządzenia ICAROS | ICAROS Biznes",
  description:
    "Urządzenia ICAROS do rehabilitacji i treningu: Circle, Health, I.S.T. Board, Guardian, Lightning i Cloud. Pełna ścieżka terapeutyczna dla placówki.",
  alternates: { canonical: "/produkty" },
};

export default function UrzadzeniaBiznesPage() {
  return <ProductEcosystem basePath="/urzadzenia" />;
}
