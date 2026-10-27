import type { Handlowiec } from "./config";

/**
 * Tokeny odświeżania Google dla handlowców.
 *
 * Domyślnie siedzą w zmiennych środowiskowych i nic więcej nie jest potrzebne.
 * Jeśli projekt ma podłączony Redis (Upstash albo Vercel), zapis trafia tam,
 * dzięki czemu ponowne podłączenie kalendarza nie wymaga wdrożenia na nowo.
 */

type Rest = { url: string; token: string };

function rest(): Rest | null {
  const url = (
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.REDIS_REST_URL ||
    ""
  ).trim();
  const token = (
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.REDIS_REST_TOKEN ||
    ""
  ).trim();
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ""), token };
}

async function polecenie<T>(komenda: string[]): Promise<T | null> {
  const klient = rest();
  if (!klient) return null;

  try {
    const odpowiedz = await fetch(klient.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${klient.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(komenda),
      cache: "no-store",
    });
    if (!odpowiedz.ok) return null;
    const dane = (await odpowiedz.json()) as { result?: T };
    return dane.result ?? null;
  } catch {
    return null;
  }
}

function klucz(osoba: Handlowiec): string {
  return `kalendarz:token:${osoba.klucz}`;
}

/** Token odświeżania: najpierw Redis, potem zmienna środowiskowa. */
export async function pobierzToken(osoba: Handlowiec): Promise<string | null> {
  const zRedisa = await polecenie<string>(["GET", klucz(osoba)]);
  if (zRedisa) return zRedisa;
  return process.env[osoba.zmiennaTokenu]?.trim() || null;
}

export type WynikZapisu = "redis" | "recznie";

/**
 * Zapisuje token. Bez Redisa zwraca „recznie”, co dla wywołującego znaczy:
 * pokaż wartość i poproś o wklejenie jej do zmiennych środowiskowych.
 */
export async function zapiszToken(
  osoba: Handlowiec,
  token: string
): Promise<WynikZapisu> {
  const zapisany = await polecenie<string>(["SET", klucz(osoba), token]);
  return zapisany ? "redis" : "recznie";
}

export function magazynTrwaly(): boolean {
  return rest() !== null;
}
