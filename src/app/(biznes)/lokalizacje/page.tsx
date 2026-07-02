import type { Metadata } from "next";
import MapView from "@/components/map/MapView";
import { getLocations } from "@/lib/mapa/getLocations";

export const metadata: Metadata = {
  title: "Lokalizacje ICAROS dla partnerów | ICAROS Polska",
  description:
    "Mapa placówek korzystających z urządzeń ICAROS w Polsce - referencyjne wdrożenia dla partnerów biznesowych.",
  alternates: { canonical: "/lokalizacje" },
};

export default async function LokalizacjePage() {
  const locations = await getLocations();
  return <MapView locations={locations} theme="dark" />;
}
