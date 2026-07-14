/**
 * Warstwa antyspamowa współdzielona przez wszystkie endpointy zbierające leady.
 * Bez zewnętrznych usług i bez CAPTCHA - łączy kilka tanich sygnałów:
 *  - honeypot (ukryte pole, które wypełniają tylko boty),
 *  - czas wypełnienia formularza (boty wysyłają natychmiast),
 *  - heurystyki treści (linki w polach tożsamości, cyrylica + link, powtórzenia, gibberish),
 *  - blokada jednorazowych domen e-mail,
 *  - limit zapytań na IP (best-effort, w pamięci instancji).
 *
 * Zgłoszenia oznaczone jako spam obsługujemy "cicho" (zwracamy sukces, ale nie tworzymy leada),
 * żeby nie podpowiadać botom, co je zdradziło.
 */

export type SpamSignals = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  note?: string;
  /** Ukryte pole-pułapka - u człowieka zawsze puste. */
  honeypot?: string;
  /** Milisekundy między wyrenderowaniem formularza a wysłaniem (z klienta). */
  elapsedMs?: number;
};

export type SpamVerdict = { spam: boolean; reason?: string };

/** Poniżej tego czasu (ms) od wyrenderowania formularza to prawie na pewno bot. */
const MIN_ELAPSED_MS = 1800;

/** Linki i gołe domeny - w polu imienia/telefonu/firmy nie mają czego szukać. */
const URL_RE =
  /(https?:\/\/|www\.|\b[a-z0-9-]{2,}\.(?:com|net|org|ru|su|xyz|top|info|biz|online|site|club|shop|link|click|buzz|cn|tk|ml|ga|cf|gq|website|space|store|live|icu)\b)/i;

const CYRILLIC_RE = /[Ѐ-ӿ]/;
const REPEAT_RE = /(.)\1{6,}/; // 7+ razy ten sam znak z rzędu
const HTML_RE = /<\s*(a|script|iframe|img|div)\b|\[url[=\]]/i;

/** Popularne domeny jednorazowe / tymczasowe. */
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.info",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "yopmail.com",
  "trashmail.com",
  "sharklasers.com",
  "getnada.com",
  "maildrop.cc",
  "dispostable.com",
  "fakeinbox.com",
  "throwawaymail.com",
  "mailnesia.com",
  "mohmal.com",
  "emailondeck.com",
  "spam4.me",
  "grr.la",
  "mailcatch.com",
  "moakt.com",
  "tempinbox.com",
  "discard.email",
  "mytemp.email",
  "tempmailo.com",
  "1secmail.com",
  "inboxbear.com",
  "harakirimail.com",
  "byom.de",
  "nowmymail.com",
]);

/**
 * Konserwatywny wykrywacz "przypadkowych ciągów znaków".
 * Celowo wymaga długiego ciągu i niemal zerowej liczby samogłosek, żeby nie
 * odrzucać polskich nazw i skrótów placówek (SPZOZ, NZOZ itp.).
 */
function looksGibberish(value: string): boolean {
  const s = value.trim().toLowerCase();
  const letters = s.replace(/[^a-ząćęłńóśźżü]/g, "");
  if (letters.length < 10) return false;
  const vowels = (letters.match(/[aeiouyąęóü]/g) || []).length;
  if (vowels / letters.length < 0.1) return true; // praktycznie brak samogłosek
  if (/[bcdfghjklmnpqrstvwxzżźćń]{7,}/.test(letters)) return true; // 7+ spółgłosek z rzędu
  return false;
}

export function evaluateSubmission(sig: SpamSignals): SpamVerdict {
  // 1. Honeypot - jeśli wypełnione, to bot.
  if (sig.honeypot && sig.honeypot.trim().length > 0) {
    return { spam: true, reason: "honeypot" };
  }

  // 2. Czas wypełnienia (sprawdzamy tylko, gdy klient go przysłał).
  if (
    typeof sig.elapsedMs === "number" &&
    Number.isFinite(sig.elapsedMs) &&
    sig.elapsedMs >= 0 &&
    sig.elapsedMs < MIN_ELAPSED_MS
  ) {
    return { spam: true, reason: "too_fast" };
  }

  // 3. Linki / HTML w polach tożsamości.
  const identity = [
    ["name", sig.name],
    ["phone", sig.phone],
    ["company", sig.company],
  ] as const;
  for (const [field, value] of identity) {
    if (value && (URL_RE.test(value) || HTML_RE.test(value))) {
      return { spam: true, reason: `url_in_${field}` };
    }
  }

  // 4. Klasyczny spam: treść z linkiem (kontakt na demo nie wymaga linków).
  const freeText = [sig.message, sig.note].filter(Boolean).join(" ");
  if (freeText && (URL_RE.test(freeText) || HTML_RE.test(freeText))) {
    return { spam: true, reason: "url_in_message" };
  }

  // 5. Cyrylica razem z linkiem gdziekolwiek - typowy wzorzec botów.
  const all = [sig.name, sig.company, sig.message, sig.note].filter(Boolean).join(" ");
  if (CYRILLIC_RE.test(all) && URL_RE.test(all)) {
    return { spam: true, reason: "cyrillic_with_link" };
  }

  // 6. Długie serie tego samego znaku (np. "aaaaaaaa").
  if (REPEAT_RE.test(all)) {
    return { spam: true, reason: "repeat_chars" };
  }

  // 7. Gibberish w imieniu.
  if (sig.name && looksGibberish(sig.name)) {
    return { spam: true, reason: "gibberish_name" };
  }

  // 8. Jednorazowa domena e-mail.
  const domain = sig.email?.split("@")[1]?.trim().toLowerCase();
  if (domain && DISPOSABLE_DOMAINS.has(domain)) {
    return { spam: true, reason: "disposable_email" };
  }

  return { spam: false };
}

/** Odczyt IP klienta z nagłówków (proxy/Vercel). */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

/**
 * Prosty limiter w pamięci instancji (best-effort). W środowisku serverless
 * pamięć bywa współdzielona tylko w obrębie ciepłej instancji, ale i tak ucina
 * gwałtowne serie zgłoszeń z jednego IP.
 */
const hits = new Map<string, number[]>();

export function isRateLimited(
  ip: string,
  { max = 6, windowMs = 10 * 60 * 1000 }: { max?: number; windowMs?: number } = {},
): boolean {
  if (ip === "unknown") return false;
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);

  // Sprzątanie, żeby mapa nie rosła w nieskończoność.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(key);
    }
  }

  return recent.length > max;
}
