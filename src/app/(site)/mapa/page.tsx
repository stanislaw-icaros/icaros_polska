import type { Metadata } from "next";
import MapView from "@/components/map/MapView";
import NewsletterStrip from "@/components/NewsletterStrip";
import { getLocations } from "@/lib/mapa/getLocations";

export const metadata: Metadata = {
  title: "Mapa wdrożeń ICAROS | ICAROS Polska",
  description:
    "Interaktywna mapa placówek, w których możesz zobaczyć i przetestować urządzenia ICAROS w Polsce.",
  alternates: { canonical: "/mapa" },
};

export default async function MapaPage() {
  const locations = await getLocations();
  return (
    <>
      <MapView locations={locations} theme="light" worldHref="/icaros-na-swiecie" />
      <NewsletterStrip
        title="Dni otwarte i nowe placówki na mapie"
        description="O terminach testów w konkretnym mieście informujemy najpierw osoby z listy. Kilka wiadomości w roku."
      />
    </>
  );
}
