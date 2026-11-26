import { hasCookieConsent } from "@/lib/cookie-consent";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export type MetaEventName =
  | "ViewContent"
  | "Contact"
  | "CompleteRegistration"
  | "Schedule"
  /** Zgłoszenie ze strony: formularz zamówienia ICAROS Cloud. */
  | "Lead";

/**
 * Wysyła zdarzenie Meta jednocześnie przez Pixel (client-side) oraz Conversions
 * API (server-side, /api/meta-events). Wspólny event_id pozwala Meta
 * deduplikować oba sygnały. Bez zgody marketingowej nic nie jest wysyłane.
 */
export function trackMetaEvent(
  eventName: MetaEventName,
  identity?: { email?: string; phone?: string }
): void {
  if (typeof window === "undefined") return;
  if (!hasCookieConsent("marketing")) return;
  // To samo zabezpieczenie co w MetaPixel: testy z localhost nie zaśmiecają
  // produkcyjnego piksela ani Conversions API.
  const host = window.location.hostname;
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host.endsWith(".local") ||
    host.endsWith(".localhost")
  ) {
    return;
  }

  const eventId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const sourceUrl = window.location.href;

  // Client-side Pixel - eventID powiązuje to zdarzenie ze zdarzeniem CAPI.
  if (typeof window.fbq === "function") {
    window.fbq("track", eventName, {}, { eventID: eventId });
  }

  // Server-side Conversions API - fire-and-forget, nie może blokować UX.
  void fetch("/api/meta-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName,
      eventId,
      sourceUrl,
      email: identity?.email,
      phone: identity?.phone,
    }),
    keepalive: true,
  }).catch(() => {
    // Błąd trackingu nie może wpływać na działanie formularza.
  });
}
