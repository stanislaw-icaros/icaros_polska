/**
 * Lista placówek, w których znajduje się sprzęt ICAROS.
 * Źródło prawdy: wewnętrzna lista "LISTA LOKALIZACJI SPRZĘTU".
 * Bazę rozwijamy - dopisuj kolejne obiekty do tablicy `locations`.
 *
 * Jak dodać placówkę:
 *  1. Znajdź współrzędne (lat, lng) np. w Google Maps - prawy klik na pinezce
 *     kopiuje "50.2386, 18.9998". Wklej do `coords` jako [lat, lng].
 *  2. Uzupełnij adres, listę urządzeń, charakter obiektu i flagę dostępności.
 *  3. `publicAccess: true` tylko dla obiektów, które realnie przyjmują osoby
 *     z zewnątrz (można umówić pokaz / test). Eventowe i zamknięte = false.
 */
export type IcarosLocation = {
  id: string;
  /** Pełna nazwa placówki */
  name: string;
  /** Krótka nazwa na liście / pinezce */
  shortName: string;
  /** Kategoria / charakter obiektu, np. "Przychodnia", "Uczelnia wyższa" */
  type: string;
  /** [szerokość, długość] geograficzna */
  coords: [number, number];
  city: string;
  address: string;
  /** Urządzenia ICAROS dostępne w placówce */
  devices: string[];
  /** Czy obiekt jest dostępny publicznie (można umówić pokaz / test) */
  publicAccess: boolean;
  /** Link do strony placówki */
  url?: string;
};

export const locations: IcarosLocation[] = [
  {
    id: "azory-krakow",
    name: "Przychodnia Azory",
    shortName: "Przychodnia Azory",
    type: "Przychodnia",
    coords: [50.08308, 19.91347],
    city: "Kraków",
    address: "Wacława Nałkowskiego 1, 31-308 Kraków",
    devices: ["ICAROS Guardian"],
    publicAccess: true,
    url: "https://azorypoz.pl/",
  },
  {
    id: "vrpoint-wroclaw",
    name: "Vrpoint",
    shortName: "Vrpoint",
    type: "Firma eventowa",
    coords: [51.10173, 17.0457],
    city: "Wrocław",
    address: "Komuny Paryskiej 39/LU1, 50-451 Wrocław",
    devices: ["ICAROS Lightning"],
    publicAccess: false,
    url: "https://www.vrpoint.pl/",
  },
  {
    id: "hurtownia-adrenaliny-zabrze",
    name: "Hurtownia Adrenaliny",
    shortName: "Hurtownia Adrenaliny",
    type: "Firma eventowa",
    coords: [50.28115, 18.78339],
    city: "Zabrze",
    address: "Jagodowa 6a/9, 41-800 Zabrze",
    devices: ["ICAROS Lightning"],
    publicAccess: false,
    url: "https://hurtownia-adrenaliny.pl/",
  },
  {
    id: "lasermed-bydgoszcz",
    name: "Centrum Medyczne LaserMed",
    shortName: "CM LaserMed",
    type: "Centrum medyczne",
    coords: [53.12325, 18.0444],
    city: "Bydgoszcz",
    address: "Polanka 16, 85-085 Bydgoszcz",
    devices: ["ICAROS Lightning", "ICAROS Cloud"],
    publicAccess: true,
    url: "https://laseroterapia.bydgoszcz.pl/",
  },
  {
    id: "wrsport-swilcza",
    name: "Wrsport",
    shortName: "Wrsport",
    type: "Hotel sportowy i SPA",
    coords: [50.0666, 21.92114],
    city: "Świlcza",
    address: "Świlcza 146P, 36-072 Świlcza",
    devices: ["ICAROS Pro"],
    publicAccess: true,
    url: "https://wrsport.eu/",
  },
  {
    id: "milenium-gniezno",
    name: "Gnieźnieńska Szkoła Wyższa Milenium",
    shortName: "GSW Milenium",
    type: "Uczelnia wyższa",
    coords: [52.52039, 17.59438],
    city: "Gniezno",
    address: "Leopolda Okulickiego 3A, 62-200 Gniezno",
    devices: ["ICAROS Health"],
    publicAccess: false,
    url: "https://studia.milenium.edu.pl/",
  },
  {
    id: "avatar-tarnowskie-gory",
    name: 'Ośrodek Rozwoju Kreatywności „AVATAR" (Fundacja Kompleks Zamkowy)',
    shortName: 'ORK „AVATAR"',
    type: "Ośrodek edukacyjny",
    coords: [50.4403, 18.81221],
    city: "Tarnowskie Góry",
    address: "Pyskowicka 39, 42-612 Tarnowskie Góry",
    devices: ["ICAROS Health", "ICAROS Cloud"],
    publicAccess: false,
    url: "https://ork-avatar.pl/",
  },
  {
    id: "awf-katowice",
    name: "Akademia Wychowania Fizycznego im. Jerzego Kukuczki w Katowicach",
    shortName: "AWF Katowice",
    type: "Uczelnia wyższa",
    coords: [50.24976, 19.0033],
    city: "Katowice",
    address: "Mikołowska 72A, 40-065 Katowice",
    devices: ["ICAROS Pro"],
    publicAccess: false,
    url: "https://awf.katowice.pl/",
  },
];

/** Środek i przybliżenie startowe mapy (cała Polska). */
export const MAP_DEFAULT_CENTER: [number, number] = [52.0, 19.3];
export const MAP_DEFAULT_ZOOM = 6;
