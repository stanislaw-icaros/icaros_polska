/**
 * Lista placówek, w których dostępny jest ICAROS.
 * Bazę rozwijamy - dopisuj kolejne obiekty do tablicy `locations`.
 *
 * Jak dodać placówkę:
 *  1. Znajdź współrzędne (lat, lng) np. w Google Maps - prawy klik na pinezce
 *     kopiuje "50.2386, 18.9998". Wklej do `coords` jako [lat, lng].
 *  2. Uzupełnij adres, listę urządzeń i (opcjonalnie) opis oraz link.
 *
 * UWAGA: dane poniżej (AWF Katowice) to przykład - współrzędne i szczegóły
 * potwierdź przed publikacją.
 */
export type IcarosLocation = {
  id: string;
  /** Pełna nazwa placówki */
  name: string;
  /** Krótka nazwa na liście / pinezce */
  shortName: string;
  /** Kategoria, np. "Uczelnia", "Klinika", "Centrum rehabilitacji" */
  type: string;
  /** [szerokość, długość] geograficzna */
  coords: [number, number];
  city: string;
  address: string;
  /** Budynek / sala / pracownia */
  building?: string;
  /** Urządzenia ICAROS dostępne w placówce */
  devices: string[];
  /** Krótki opis - co i gdzie stoi, dla kogo dostępne */
  description?: string;
  /** Link do strony placówki */
  url?: string;
};

export const locations: IcarosLocation[] = [
  {
    id: "awf-katowice",
    name: "Akademia Wychowania Fizycznego im. Jerzego Kukuczki w Katowicach",
    shortName: "AWF Katowice",
    type: "Uczelnia",
    coords: [50.2386, 18.9998],
    city: "Katowice",
    address: "ul. Mikołowska 72A, 40-065 Katowice",
    building: "Budynek główny - pracownia treningu funkcjonalnego",
    devices: ["ICAROS Health", "ICAROS Cloud"],
    description:
      "Stanowisko demonstracyjne ICAROS dostępne dla studentów i kadry naukowej. Możliwość umówienia pokazu i testu urządzeń.",
    url: "https://www.awf.katowice.pl",
  },
];

/** Środek i przybliżenie startowe mapy (cała Polska). */
export const MAP_DEFAULT_CENTER: [number, number] = [52.0, 19.3];
export const MAP_DEFAULT_ZOOM = 6;
