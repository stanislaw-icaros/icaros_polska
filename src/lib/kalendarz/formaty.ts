/**
 * Strefa czasowa i opisy terminów po polsku.
 *
 * Ten moduł nie dotyka niczego z serwera, więc korzysta z niego zarówno kod
 * po stronie serwera, jak i komponent kalendarza w przeglądarce. Dzięki temu
 * osoba odwiedzająca stronę z innej strefy czasowej widzi godziny polskie,
 * a nie przeliczone na własny zegar.
 */

export const STREFA = "Europe/Warsaw";

const FORMAT_DNIA = new Intl.DateTimeFormat("pl-PL", {
  timeZone: STREFA,
  weekday: "long",
  day: "numeric",
  month: "long",
});

const FORMAT_KROTKI = new Intl.DateTimeFormat("pl-PL", {
  timeZone: STREFA,
  weekday: "short",
  day: "numeric",
  month: "short",
});

const FORMAT_GODZINY = new Intl.DateTimeFormat("pl-PL", {
  timeZone: STREFA,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const FORMAT_NUMERU_DNIA = new Intl.DateTimeFormat("pl-PL", {
  timeZone: STREFA,
  day: "numeric",
});

const FORMAT_MIESIACA = new Intl.DateTimeFormat("pl-PL", {
  timeZone: STREFA,
  month: "short",
});

const FORMAT_DNIA_TYGODNIA = new Intl.DateTimeFormat("pl-PL", {
  timeZone: STREFA,
  weekday: "short",
});

/** „środa, 28 października”. */
export function etykietaDnia(chwila: Date): string {
  return FORMAT_DNIA.format(chwila);
}

/** „śr., 28 paź”. */
export function etykietaKrotka(chwila: Date): string {
  return FORMAT_KROTKI.format(chwila);
}

/** „14:30”. */
export function etykietaGodziny(chwila: Date): string {
  return FORMAT_GODZINY.format(chwila);
}

/** „środa, 28 października, 14:30”. */
export function etykietaPelna(chwila: Date): string {
  return `${etykietaDnia(chwila)}, ${etykietaGodziny(chwila)}`;
}

/** „28”. */
export function numerDnia(chwila: Date): string {
  return FORMAT_NUMERU_DNIA.format(chwila);
}

/** „paź”. */
export function skrotMiesiaca(chwila: Date): string {
  return FORMAT_MIESIACA.format(chwila).replace(/\.$/, "");
}

/** „śr.”. */
export function skrotDniaTygodnia(chwila: Date): string {
  return FORMAT_DNIA_TYGODNIA.format(chwila).replace(/\.$/, "");
}

/** Godzina rozpoczęcia w liczbach, w czasie polskim. */
export function godzinaLokalna(chwila: Date): number {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: STREFA,
      hour: "2-digit",
      hour12: false,
    }).format(chwila)
  ) % 24;
}
