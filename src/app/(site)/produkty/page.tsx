import type { Metadata } from "next";
import ProductEcosystem from "@/components/ProductEcosystem";

export const metadata: Metadata = {
  title: "Produkty | ICAROS Polska",
  description:
    "Urządzenia ICAROS i ekosystem ICAROS Circle: Health, Guardian, I.S.T. Board i Cloud. Poznaj produkty dostępne w Polsce.",
};

export default function ProduktyPage() {
  return <ProductEcosystem />;
}
