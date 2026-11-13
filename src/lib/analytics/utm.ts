/**
 * Parametry UTM z reklamy, zapamiętane na czas wizyty.
 *
 * Reklama prowadzi np. na /health?utm_source=facebook..., a rezerwacja dzieje
 * się dopiero na /kalendarz, gdzie w adresie nie ma już UTM. Zapisujemy więc
 * UTM i pierwszą odwiedzoną stronę w sessionStorage przy wejściu, a formularze
 * czytają je stamtąd, gdy w bieżącym adresie ich nie ma.
 */

const KLUCZ = "icaros-utm";

export const POLA_UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;

export type Utm = Partial<Record<(typeof POLA_UTM)[number], string>>;

type Zapis = { utm: Utm; wejscie?: string };

function utmZAdresu(): Utm {
  const parametry = new URLSearchParams(window.location.search);
  const utm: Utm = {};
  for (const pole of POLA_UTM) {
    const wartosc = parametry.get(pole)?.trim();
    if (wartosc) utm[pole] = wartosc;
  }
  return utm;
}

function odczytajZapis(): Zapis | null {
  try {
    const surowy = window.sessionStorage.getItem(KLUCZ);
    return surowy ? (JSON.parse(surowy) as Zapis) : null;
  } catch {
    return null;
  }
}

/** Wywoływane raz przy wejściu na stronę. Nowe UTM w adresie nadpisują stare. */
export function zapamietajUtm(): void {
  if (typeof window === "undefined") return;
  const utm = utmZAdresu();
  const poprzedni = odczytajZapis();
  if (Object.keys(utm).length === 0 && poprzedni) return;
  try {
    window.sessionStorage.setItem(
      KLUCZ,
      JSON.stringify({
        utm: Object.keys(utm).length ? utm : poprzedni?.utm ?? {},
        wejscie: window.location.pathname,
      } satisfies Zapis)
    );
  } catch {
    // Prywatne okno albo zablokowane dane strony: zostaje UTM z adresu.
  }
}

/** UTM z bieżącego adresu, a gdy ich nie ma, z początku wizyty. */
export function odczytajUtm(): { utm: Utm; wejscie?: string } {
  if (typeof window === "undefined") return { utm: {} };
  const zapis = odczytajZapis();
  const zAdresu = utmZAdresu();
  return {
    utm: Object.keys(zAdresu).length ? zAdresu : zapis?.utm ?? {},
    wejscie: zapis?.wejscie,
  };
}
