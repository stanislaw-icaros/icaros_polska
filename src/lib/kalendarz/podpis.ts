import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Podpisane linki do odwołania terminu.
 *
 * W linku siedzi identyfikator wydarzenia w kalendarzu, więc nie potrzebujemy
 * żadnej bazy rezerwacji. Podpis HMAC pilnuje, żeby nikt nie odwołał cudzej
 * rozmowy ani nie podstawił własnych danych.
 */

export type Bilet = {
  /** Klucz handlowca. */
  o: string;
  /** Identyfikator wydarzenia w kalendarzu Google. */
  w: string;
  /** Początek rozmowy, znacznik czasu w milisekundach. */
  s: number;
  /** Identyfikator sprawy w Pipedrive. */
  d?: number;
};

function base64Url(wartosc: string | Buffer): string {
  const bufor = typeof wartosc === "string" ? Buffer.from(wartosc, "utf8") : wartosc;
  return bufor.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function zBase64Url(wartosc: string): string {
  return Buffer.from(wartosc.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

function sekret(): string | null {
  return (
    process.env.KALENDARZ_SECRET?.trim() ||
    process.env.NEWSLETTER_UNSUBSCRIBE_SECRET?.trim() ||
    process.env.RESEND_API_KEY?.trim() ||
    null
  );
}

function podpisz(dane: string, klucz: string): string {
  return base64Url(createHmac("sha256", klucz).update(dane).digest());
}

/** Zwraca część zapytania `b=...&t=...` albo `null`, gdy brak sekretu. */
export function zbudujBilet(bilet: Bilet): string | null {
  const klucz = sekret();
  if (!klucz) return null;
  const dane = base64Url(JSON.stringify(bilet));
  return `b=${dane}&t=${podpisz(dane, klucz)}`;
}

export function odczytajBilet(
  dane: string | null | undefined,
  podpis: string | null | undefined
): Bilet | null {
  const klucz = sekret();
  if (!klucz || !dane || !podpis) return null;

  const oczekiwany = Buffer.from(podpisz(dane, klucz));
  const otrzymany = Buffer.from(podpis);
  if (oczekiwany.length !== otrzymany.length) return null;
  if (!timingSafeEqual(oczekiwany, otrzymany)) return null;

  try {
    const bilet = JSON.parse(zBase64Url(dane)) as Bilet;
    if (!bilet.o || !bilet.w || !Number.isFinite(bilet.s)) return null;
    return bilet;
  } catch {
    return null;
  }
}

/** Podpisany parametr `state` dla przekierowania OAuth, ważny 30 minut. */
export function zbudujStan(osoba: string): string | null {
  const klucz = sekret();
  if (!klucz) return null;
  const dane = base64Url(JSON.stringify({ o: osoba, c: Date.now() }));
  return `${dane}.${podpisz(dane, klucz)}`;
}

export function odczytajStan(stan: string | null | undefined): string | null {
  const klucz = sekret();
  if (!klucz || !stan) return null;

  const [dane, podpis] = stan.split(".");
  if (!dane || !podpis) return null;

  const oczekiwany = Buffer.from(podpisz(dane, klucz));
  const otrzymany = Buffer.from(podpis);
  if (oczekiwany.length !== otrzymany.length) return null;
  if (!timingSafeEqual(oczekiwany, otrzymany)) return null;

  try {
    const wartosc = JSON.parse(zBase64Url(dane)) as { o?: string; c?: number };
    if (!wartosc.o || !wartosc.c) return null;
    if (Date.now() - wartosc.c > 30 * 60_000) return null;
    return wartosc.o;
  } catch {
    return null;
  }
}
