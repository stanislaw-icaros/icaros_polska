import type { Metadata } from "next";
import MapView from "@/components/map/MapView";
import { getLocations } from "@/lib/mapa/getLocations";

export const metadata: Metadata = {
  title: "Mapa wdrożeń ICAROS | ICAROS Polska",
  description:
    "Interaktywna mapa placówek, w których możesz zobaczyć i przetestować urządzenia ICAROS w Polsce.",
  alternates: { canonical: "/mapa" },
};

export default async function MapaPage() {
  const locations = await getLocations();
  return <MapView locations={locations} theme="light" />;
}
