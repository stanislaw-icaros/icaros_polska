export type CookieConsentPreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  externalMedia: boolean;
};

export const COOKIE_CONSENT_KEY = "icaros_cookie_preferences";
export const COOKIE_CONSENT_COOKIE = "icaros_cookie_preferences";

export const defaultCookieConsent: CookieConsentPreferences = {
  necessary: true,
  analytics: true,
  marketing: true,
  externalMedia: true,
};

function parsePreferences(raw: string | null): CookieConsentPreferences | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsentPreferences>;
    return {
      necessary: true,
      analytics: parsed.analytics !== false,
      marketing: parsed.marketing !== false,
      externalMedia: parsed.externalMedia !== false,
    };
  } catch {
    return null;
  }
}

function getCookieValue(name: string) {
  if (typeof document === "undefined") return null;

  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function readCookieConsent(): CookieConsentPreferences | null {
  if (typeof window === "undefined") return null;

  const fromStorage = parsePreferences(window.localStorage.getItem(COOKIE_CONSENT_KEY));
  if (fromStorage) return fromStorage;

  return parsePreferences(getCookieValue(COOKIE_CONSENT_COOKIE));
}

export function hasCookieConsent(category: keyof CookieConsentPreferences) {
  if (category === "necessary") return true;
  const preferences = readCookieConsent();
  return preferences ? preferences[category] : false;
}

export function persistCookieConsent(preferences: CookieConsentPreferences) {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const serialized = JSON.stringify(preferences);
  window.localStorage.setItem(COOKIE_CONSENT_KEY, serialized);

  const maxAge = 60 * 60 * 24 * 180;
  document.cookie = `${COOKIE_CONSENT_COOKIE}=${encodeURIComponent(serialized)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  document.documentElement.dataset.cookieConsent = "granted";
  window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: preferences }));
}
