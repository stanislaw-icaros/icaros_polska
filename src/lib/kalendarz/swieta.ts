/**
 * Polskie dni wolne od pracy. Kalendarz nie proponuje rozmów w te dni,
 * nawet jeśli wypadają w dzień tygodnia objęty godzinami pracy.
 */

const STALE: [number, number][] = [
  [1, 1], // Nowy Rok
  [1, 6], // Trzech Króli
  [5, 1], // Święto Pracy
  [5, 3], // Święto Konstytucji 3 Maja
  [8, 15], // Wniebowzięcie NMP
  [11, 1], // Wszystkich Świętych
  [11, 11], // Święto Niepodległości
  [12, 25], // Boże Narodzenie
  [12, 26], // drugi dzień Bożego Narodzenia
];

/** Wielkanoc w danym roku, algorytm Meeusa i Jonesa dla kalendarza gregoriańskiego. */
function wielkanoc(rok: number): { miesiac: number; dzien: number } {
  const a = rok % 19;
  const b = Math.floor(rok / 100);
  const c = rok % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const miesiac = Math.floor((h + l - 7 * m + 114) / 31);
  const dzien = ((h + l - 7 * m + 114) % 31) + 1;
  return { miesiac, dzien };
}

function format(rok: number, miesiac: number, dzien: number): string {
  return `${rok}-${String(miesiac).padStart(2, "0")}-${String(dzien).padStart(2, "0")}`;
}

function przesun(rok: number, miesiac: number, dzien: number, dni: number): string {
  const data = new Date(Date.UTC(rok, miesiac - 1, dzien + dni));
  return data.toISOString().slice(0, 10);
}

const pamiec = new Map<number, Set<string>>();

/** Zbiór dni wolnych (YYYY-MM-DD) w danym roku. */
export function dniWolne(rok: number): Set<string> {
  const zapamietane = pamiec.get(rok);
  if (zapamietane) return zapamietane;

  const zbior = new Set(STALE.map(([miesiac, dzien]) => format(rok, miesiac, dzien)));
  const { miesiac, dzien } = wielkanoc(rok);

  zbior.add(przesun(rok, miesiac, dzien, 0)); // Wielkanoc
  zbior.add(przesun(rok, miesiac, dzien, 1)); // Poniedziałek Wielkanocny
  zbior.add(przesun(rok, miesiac, dzien, 49)); // Zielone Świątki
  zbior.add(przesun(rok, miesiac, dzien, 60)); // Boże Ciało

  pamiec.set(rok, zbior);
  return zbior;
}

/** Czy data YYYY-MM-DD jest dniem wolnym od pracy. */
export function jestWolne(data: string): boolean {
  const rok = Number(data.slice(0, 4));
  if (!Number.isFinite(rok)) return false;
  return dniWolne(rok).has(data);
}
