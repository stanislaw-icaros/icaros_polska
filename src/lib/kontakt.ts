/**
 * Dokąd prowadzą przyciski na stronie.
 *
 * Każda strefa ma jeden główny krok i są to dwa różne kroki.
 *
 * Strefa biznes: umówienie rozmowy telefonicznej. Wszystkie przyciski celują
 * w kotwicę przy kalendarzu w zakładce kontaktu dla partnerów.
 *
 * Strefa pacjenta: zobaczyć, jak wygląda trening. Mniejsze przyciski prowadzą
 * na landing `/health`, a nie do kalendarza. Pacjent ma też mapę placówek
 * w głównym przycisku na stronie startowej. Kalendarz stoi w zakładce
 * kontaktu i jest dla tych, którzy sami chcą porozmawiać.
 *
 * Formularza kontaktowego nie ma nigdzie.
 *
 * Stałe leżą poza komponentem klienckim, żeby mogły z nich korzystać też
 * komponenty serwerowe.
 */

/** Kalendarz w zakładce kontaktu dla partnerów: główny krok w strefie biznes. */
export const CEL_KONTAKTU = "/kontakt-partner#kalendarz";

/** Landing o urządzeniu: główny krok w strefie pacjenta. */
export const CEL_PACJENTA = "/health";

/** Zakładka kontaktu dla pacjenta: dane, mapka, a niżej kalendarz. */
export const KONTAKT_PACJENTA = "/kontakt";
