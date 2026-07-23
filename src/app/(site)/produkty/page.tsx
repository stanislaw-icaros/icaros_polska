import type { Metadata } from "next";
import ProductEcosystem from "@/components/ProductEcosystem";

export const metadata: Metadata = {
  title: "Produkty | ICAROS Polska",
  description:
    "Urządzenia ICAROS: Circle, Health, I.S.T. Board, Guardian i Cloud. Poznaj pełny ekosystem treningowy i rehabilitacyjny dostępny w Polsce.",
};

export default function ProduktyPage() {
  return <ProductEcosystem />;
}
