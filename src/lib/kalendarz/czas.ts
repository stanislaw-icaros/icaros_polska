import { STREFA } from "./formaty";

/**
 * Czas w jednej strefie, bez dodatkowej biblioteki.
 *
 * Wszystkie obliczenia dostępności robimy w czasie lokalnym Polski, a na zewnątrz
 * (Google, maile, baza) wychodzi już zwykły znacznik UTC. Zmiana czasu z letniego
 * na zimowy jest obsłużona przez odczyt faktycznego przesunięcia strefy dla
 * konkretnej chwili, a nie przez stałą liczbę godzin.
 */

const FORMAT_CZESCI = new Intl.DateTimeFormat("en-GB", {
  timeZone: STREFA,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  weekday: "short",
  hour12: false,
});

const FORMAT_PRZESUNIECIA = new Intl.DateTimeFormat("en-US", {
  timeZone: STREFA,
  timeZoneName: "longOffset",
});

const DNI_SKROT: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

export type CzesciDaty = {
  rok: number;
  miesiac: number;
  dzien: number;
  godzina: number;
  minuta: number;
  /** 1 = poniedziałek, 7 = niedziela. */
  dzienTygodnia: number;
  /** Data w formacie YYYY-MM-DD w czasie lokalnym. */
  data: string;
};

/** Rozkłada chwilę na części w czasie lokalnym Polski. */
export function czesci(chwila: Date): CzesciDaty {
  const parts = FORMAT_CZESCI.formatToParts(chwila);
  const wartosc = (typ: string) => parts.find((part) => part.type === typ)?.value || "";

  const rok = Number(wartosc("year"));
  const miesiac = Number(wartosc("month"));
  const dzien = Number(wartosc("day"));
  const godzina = Number(wartosc("hour")) % 24;

  return {
    rok,
    miesiac,
    dzien,
    godzina,
    minuta: Number(wartosc("minute")),
    dzienTygodnia: DNI_SKROT[wartosc("weekday")] || 1,
    data: `${rok}-${String(miesiac).padStart(2, "0")}-${String(dzien).padStart(2, "0")}`,
  };
}

/** Przesunięcie strefy w minutach dla danej chwili (np. 120 dla czasu letniego). */
function przesuniecieMin(chwila: Date): number {
  const nazwa =
    FORMAT_PRZESUNIECIA.formatToParts(chwila).find((part) => part.type === "timeZoneName")
      ?.value || "GMT+00:00";
  const dopasowanie = /GMT([+-])(\d{1,2}):?(\d{2})?/.exec(nazwa);
  if (!dopasowanie) return 0;
  const znak = dopasowanie[1] === "-" ? -1 : 1;
  const godziny = Number(dopasowanie[2] || "0");
  const minuty = Number(dopasowanie[3] || "0");
  return znak * (godziny * 60 + minuty);
}

/**
 * Buduje chwilę z lokalnego zegara ściennego.
 * Przy zmianie czasu przesunięcie sprawdzamy dwa razy, bo pierwsze trafienie
 * może wypaść jeszcze po starej stronie granicy.
 */
export function zLokalnego(
  rok: number,
  miesiac: number,
  dzien: number,
  godzina = 0,
  minuta = 0
): Date {
  const zalozenie = Date.UTC(rok, miesiac - 1, dzien, godzina, minuta);
  const pierwsze = przesuniecieMin(new Date(zalozenie));
  let wynik = zalozenie - pierwsze * 60_000;
  const drugie = przesuniecieMin(new Date(wynik));
  if (drugie !== pierwsze) wynik = zalozenie - drugie * 60_000;
  return new Date(wynik);
}

/** Chwila z daty YYYY-MM-DD i godziny HH:MM w czasie lokalnym. */
export function zDatyIGodziny(data: string, godzina: string): Date {
  const [rok, miesiac, dzien] = data.split("-").map(Number);
  const [h, m] = godzina.split(":").map(Number);
  return zLokalnego(rok, miesiac, dzien, h, m);
}

/** Data YYYY-MM-DD przesunięta o podaną liczbę dni. */
export function dodajDni(data: string, dni: number): string {
  const [rok, miesiac, dzien] = data.split("-").map(Number);
  const przesunieta = new Date(Date.UTC(rok, miesiac - 1, dzien + dni));
  return przesunieta.toISOString().slice(0, 10);
}

export {
  etykietaDnia,
  etykietaGodziny,
  etykietaKrotka,
  etykietaPelna,
  godzinaLokalna,
  numerDnia,
  skrotDniaTygodnia,
  skrotMiesiaca,
  STREFA,
} from "./formaty";

/** Nazwa strefy dla człowieka. */
export function etykietaStrefy(chwila: Date): string {
  return przesuniecieMin(chwila) === 120 ? "czas polski (letni)" : "czas polski";
}
