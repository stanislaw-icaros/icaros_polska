import type { Metadata } from "next";
import MapaClient from "./MapaClient";

export const metadata: Metadata = {
  title: "Mapa wdrożeń ICAROS | ICAROS Polska",
  description:
    "Interaktywna mapa placówek, w których możesz zobaczyć i przetestować urządzenia ICAROS w Polsce.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function MapaPage() {
  return <MapaClient />;
}
