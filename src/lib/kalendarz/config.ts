/**
 * Konfiguracja kalendarza rozmów.
 *
 * Tu zmienia się godziny pracy, długość rozmowy i wyprzedzenie rezerwacji.
 * Reszta kodu nie ma żadnych zaszytych na sztywno liczb ani nazwisk.
 */

export { STREFA } from "./formaty";

/** Długość rozmowy telefonicznej w minutach. */
export const DLUGOSC_ROZMOWY_MIN = 15;

/** Co ile minut startuje kolejny możliwy termin. */
export const KROK_MIN = 15;

/** Odstęp doklejany do zajętych wpisów, żeby rozmowa nie startowała sekundę po spotkaniu. */
export const ODSTEP_MIN = 10;

/** Najwcześniejszy termin: pełne godziny wyprzedzenia i nie dzisiaj. */
export const MIN_WYPRZEDZENIE_H = 12;
export const NAJWCZESNIEJ_OD_JUTRA = true;

/** Jak daleko w przyszłość pokazujemy terminy. */
export const HORYZONT_DNI = 21;

/** Maksymalna liczba rozmów jednej osoby w jednym dniu. 0 wyłącza limit. */
export const LIMIT_ROZMOW_NA_DZIEN = 6;

/**
 * Godziny pracy w czasie lokalnym, dzień tygodnia 1 = poniedziałek.
 * Można podać kilka okien w dniu, np. [["09:00", "12:00"], ["13:00", "16:00"]].
 */
export type OknoPracy = [string, string];
export type GodzinyPracy = Partial<Record<1 | 2 | 3 | 4 | 5 | 6 | 7, OknoPracy[]>>;

const GODZINY_STANDARDOWE: GodzinyPracy = {
  1: [["09:00", "16:00"]],
  2: [["09:00", "16:00"]],
  3: [["09:00", "16:00"]],
  4: [["09:00", "16:00"]],
  5: [["09:00", "15:00"]],
};

export type KluczHandlowca = "jarek" | "sebastian";

export type Handlowiec = {
  klucz: KluczHandlowca;
  imie: string;
  pelneImie: string;
  rola: string;
  /** Adres konta Google, którego kalendarz czytamy i w którym zapisujemy rozmowy. */
  kontoGoogle: string;
  /** Zmienna środowiskowa z tokenem odświeżania Google dla tej osoby. */
  zmiennaTokenu: string;
  /** Identyfikator użytkownika w Pipedrive. */
  zmiennaPipedrive: string;
  godziny: GodzinyPracy;
};

export const HANDLOWCY: Handlowiec[] = [
  {
    klucz: "jarek",
    imie: "Jarosław",
    pelneImie: "Jarosław Łupieżowiec",
    rola: "Rozwój sprzedaży",
    kontoGoogle: process.env.GCAL_KONTO_JAREK?.trim() || "",
    zmiennaTokenu: "GCAL_REFRESH_TOKEN_JAREK",
    zmiennaPipedrive: "PIPEDRIVE_OWNER_A_ID",
    godziny: GODZINY_STANDARDOWE,
  },
  {
    klucz: "sebastian",
    imie: "Sebastian",
    pelneImie: "Sebastian Wilk",
    rola: "Rozwój sprzedaży",
    kontoGoogle: process.env.GCAL_KONTO_SEBASTIAN?.trim() || "",
    zmiennaTokenu: "GCAL_REFRESH_TOKEN_SEBASTIAN",
    zmiennaPipedrive: "PIPEDRIVE_OWNER_B_ID",
    godziny: GODZINY_STANDARDOWE,
  },
];

export function handlowiec(klucz: string): Handlowiec | undefined {
  return HANDLOWCY.find((osoba) => osoba.klucz === klucz);
}

/** Źródła rezerwacji rozpoznawane w parametrze `zrodlo`. */
export const ZRODLA: Record<string, string> = {
  "formularz-fb": "Formularz Facebook",
  sms: "SMS od handlowca",
  mail: "Mail automatyczny",
  newsletter: "Newsletter",
  strona: "Strona icaros.com.pl",
  stopka: "Stopka maila",
};

export function opisZrodla(zrodlo?: string | null): string {
  if (!zrodlo) return ZRODLA.strona;
  return ZRODLA[zrodlo] || zrodlo;
}
