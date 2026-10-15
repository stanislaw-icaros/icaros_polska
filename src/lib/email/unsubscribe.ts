import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Podpisane linki do wypisania się z listy.
 *
 * Broadcasty w Resend mają własny placeholder `{{{RESEND_UNSUBSCRIBE_URL}}}`,
 * ale w wiadomościach transakcyjnych (emails.send) nikt go nie podmienia,
 * dlatego link do rezygnacji budujemy sami: adres w URL-u jest zakodowany,
 * a podpis HMAC pilnuje, że nikt nie wypisze cudzego adresu.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.icaros.com.pl"
).replace(/\/+$/, "");

/** Strona, na której potwierdza się wypisanie. */
export const UNSUBSCRIBE_PAGE_PATH = "/newsletter/wypisz";

/** Endpoint dla przycisku „Wypisz się” w Gmailu i Apple Mail (RFC 8058). */
export const UNSUBSCRIBE_API_PATH = "/api/newsletter/unsubscribe";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function encodeBase64Url(value: string | Buffer): string {
  const buffer = typeof value === "string" ? Buffer.from(value, "utf8") : value;
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodeBase64Url(value: string): string {
  return Buffer.from(value.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(
    "utf8"
  );
}

/**
 * Sekret podpisu. Dedykowany `NEWSLETTER_UNSUBSCRIBE_SECRET` jest lepszy:
 * rotacja klucza API Resend nie unieważnia wtedy linków w wysłanych już
 * wiadomościach. Bez żadnego z tych kluczy linku nie da się podpisać.
 */
function getSecret(): string | null {
  return (
    process.env.NEWSLETTER_UNSUBSCRIBE_SECRET?.trim() ||
    process.env.RESEND_API_KEY?.trim() ||
    null
  );
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function sign(email: string, secret: string): string {
  return encodeBase64Url(createHmac("sha256", secret).update(email).digest());
}

export type UnsubscribeLinks = {
  /** Link dla człowieka: strona z przyciskiem potwierdzenia. */
  page: string;
  /** Link dla klienta pocztowego: POST wypisuje od razu. */
  oneClick: string;
};

/** Zwraca `null`, jeśli brakuje sekretu - wtedy maila wysyłamy bez linku. */
export function buildUnsubscribeLinks(email: string): UnsubscribeLinks | null {
  const secret = getSecret();
  const normalized = normalizeEmail(email);
  if (!secret || !EMAIL_PATTERN.test(normalized)) return null;

  const query = `e=${encodeBase64Url(normalized)}&t=${sign(normalized, secret)}`;
  return {
    page: `${SITE_URL}${UNSUBSCRIBE_PAGE_PATH}?${query}`,
    oneClick: `${SITE_URL}${UNSUBSCRIBE_API_PATH}?${query}`,
  };
}

/** Zwraca adres z poprawnie podpisanego linku albo `null`. */
export function verifyUnsubscribeToken(
  encodedEmail: string | null | undefined,
  token: string | null | undefined
): string | null {
  const secret = getSecret();
  if (!secret || !encodedEmail || !token) return null;

  let email: string;
  try {
    email = normalizeEmail(decodeBase64Url(encodedEmail));
  } catch {
    return null;
  }
  if (!EMAIL_PATTERN.test(email)) return null;

  const expected = Buffer.from(sign(email, secret));
  const received = Buffer.from(token);
  if (expected.length !== received.length) return null;
  return timingSafeEqual(expected, received) ? email : null;
}
