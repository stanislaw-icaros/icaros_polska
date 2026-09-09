import type { Metadata } from "next";
import ProductEcosystem from "@/components/ProductEcosystem";
import ProductVideos from "@/components/ProductVideos";
import NewsletterStrip from "@/components/NewsletterStrip";

export const metadata: Metadata = {
  title: "Urządzenia ICAROS | ICAROS Biznes",
  description:
    "Urządzenia ICAROS do rehabilitacji i treningu: Circle, Health, I.S.T. Board, Guardian i Cloud. Pełna ścieżka terapeutyczna dla placówki.",
  alternates: { canonical: "/produkty" },
};

export default function UrzadzeniaBiznesPage() {
  return (
    <>
      <ProductEcosystem basePath="/urzadzenia" />
      <ProductVideos basePath="/urzadzenia" />
      <NewsletterStrip variant="dark" />
    </>
  );
}
