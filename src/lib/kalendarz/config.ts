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

/** Odstęp doklejany do naszych własnych rozmów, żeby nie szły jedna po drugiej. */
export const ODSTEP_MIN = 10;

/** Najwcześniejszy termin: pełne godziny wyprzedzenia i nie dzisiaj. */
export const MIN_WYPRZEDZENIE_H = 12;
export const NAJWCZESNIEJ_OD_JUTRA = true;

/** Jak daleko w przyszłość pokazujemy terminy. */
export const HORYZONT_DNI = 21;

/** Maksymalna liczba rozmów jednej osoby w jednym dniu. 0 wyłącza limit. */
export const LIMIT_ROZMOW_NA_DZIEN = 6;

/** Ile minut przed rozmową klient dostaje przypomnienie. 0 wyłącza. */
export const PRZYPOMNIENIE_MIN_PRZED = 10;

/**
 * Godziny pracy w czasie lokalnym, dzień tygodnia 1 = poniedziałek.
 * Można podać kilka okien w dniu, np. [["09:00", "12:00"], ["13:00", "16:00"]].
 */
export type OknoPracy = [string, string];
export type GodzinyPracy = Partial<Record<1 | 2 | 3 | 4 | 5 | 6 | 7, OknoPracy[]>>;

// Godziny podane przez Jarka 28 października 2026.
const GODZINY_JAREK: GodzinyPracy = {
  1: [["08:00", "18:00"]],
  2: [["08:00", "18:00"]],
  3: [["08:00", "18:00"]],
  4: [["08:00", "18:00"]],
  5: [["08:00", "18:00"]],
};

// Godziny podane przez Sebastiana 28 października 2026, z sobotą.
const GODZINY_SEBASTIAN: GodzinyPracy = {
  1: [["08:00", "20:00"]],
  2: [["08:00", "20:00"]],
  3: [["08:00", "20:00"]],
  4: [["08:00", "20:00"]],
  5: [["08:00", "20:00"]],
  6: [["08:00", "20:00"]],
};

export type KluczHandlowca = "jarek" | "sebastian";

/**
 * Kto dostaje rozmowę, gdy klient nikogo nie wskazał, a obaj są wolni.
 * `null` oznacza równy podział po liczbie umówionych rozmów. Ustawienie nie
 * przebija ani wyboru klienta, ani opiekuna, który prowadzi go w Pipedrive.
 */
export const PREFEROWANY_HANDLOWIEC: KluczHandlowca | null = "jarek";

/**
 * Czy na stronie pokazujemy listę osób do wyboru. Przy wyłączonej liście
 * klient widzi jeden kalendarz, a osobę można nadal wskazać adresem
 * `/kalendarz?osoba=jarek`, na przykład w SMS-ie do leada.
 */
export const WYBOR_OSOBY_NA_STRONIE = true;

export type Handlowiec = {
  klucz: KluczHandlowca;
  imie: string;
  pelneImie: string;
  /** Adres konta Google, którego kalendarz czytamy i w którym zapisujemy rozmowy. */
  kontoGoogle: string;
  /** Adres służbowy, na który idą powiadomienia o umówionych rozmowach. */
  emailPowiadomien: string;
  /**
   * Ile minut przed cudzym wpisem w kalendarzu i po nim zostaje zablokowane.
   * To czas na dojazd dla kogoś, kto jeździ na spotkania. Wokół naszych
   * własnych rozmów telefonicznych zostaje zwykły ODSTEP_MIN.
   */
  buforMin?: number;
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
    kontoGoogle: process.env.GCAL_KONTO_JAREK?.trim() || "",
    emailPowiadomien: "jaroslaw.lupiezowiec@icaros.com.pl",
    // Jarek dojeżdża na spotkania, więc wokół każdego wpisu zostaje mu godzina.
    buforMin: 60,
    zmiennaTokenu: "GCAL_REFRESH_TOKEN_JAREK",
    zmiennaPipedrive: "PIPEDRIVE_OWNER_A_ID",
    godziny: GODZINY_JAREK,
  },
  {
    klucz: "sebastian",
    imie: "Sebastian",
    pelneImie: "Sebastian Wilk",
    kontoGoogle: process.env.GCAL_KONTO_SEBASTIAN?.trim() || "",
    emailPowiadomien: "sebastian.wilk@icaros.com.pl",
    buforMin: 15,
    zmiennaTokenu: "GCAL_REFRESH_TOKEN_SEBASTIAN",
    zmiennaPipedrive: "PIPEDRIVE_OWNER_B_ID",
    godziny: GODZINY_SEBASTIAN,
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
