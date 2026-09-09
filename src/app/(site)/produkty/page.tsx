import type { Metadata } from "next";
import ProductEcosystem from "@/components/ProductEcosystem";
import ProductVideos from "@/components/ProductVideos";
import NewsletterStrip from "@/components/NewsletterStrip";

export const metadata: Metadata = {
  title: "Produkty | ICAROS Polska",
  description:
    "Urządzenia ICAROS: Circle, Health, I.S.T. Board, Guardian i Cloud. Poznaj pełny ekosystem treningowy i rehabilitacyjny dostępny w Polsce.",
};

export default function ProduktyPage() {
  return (
    <>
      <ProductEcosystem />
      <ProductVideos basePath="/produkty" />
      <NewsletterStrip
        title="Nowe urządzenia i funkcje bez szukania"
        description="Kiedy coś wchodzi do oferty w Polsce albo oprogramowanie dostaje aktualizację, piszemy o tym na listę. Kilka wiadomości w roku."
      />
    </>
  );
}
