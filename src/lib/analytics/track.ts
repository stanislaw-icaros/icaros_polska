/**
 * Google Analytics 4 - jedno miejsce, przez które wysyłamy zdarzenia.
 *
 * Skrypt GA ładuje komponent `GoogleAnalytics` i robi to dopiero po zgodzie
 * analitycznej (RODO). Dopóki skryptu nie ma, `window.gtag` nie istnieje
 * i wywołania poniżej po prostu nic nie robią, więc można ich używać
 * wszędzie bez sprawdzania zgody.
 *
 * Usługę aktywuje zmienna NEXT_PUBLIC_GA_ID (format G-XXXXXXXXXX). Bez niej
 * nie ładujemy żadnego skryptu Google.
 */

/** ID pomiaru GA4 z konta ICAROS Polska. */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() ?? "";

export function isValidGaId(id: string): boolean {
  return /^G-[A-Z0-9]{6,}$/i.test(id);
}

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Zdarzenie GA4. Bez wczytanego gtag nic się nie dzieje. */
export function trackEvent(name: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}

/**
 * Odsłona podstrony. Wysyłamy ją ręcznie, bo przy nawigacji klientem
 * w App Routerze GA nie przeładowuje skryptu i samo nic by nie zliczyło.
 */
export function trackPageView(path: string) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/**
 * Kliknięcie prowadzące na mapę placówek. `place` mówi, z którego miejsca
 * serwisu przyszło kliknięcie, np. "hero" albo "menu".
 */
export function trackMapClick(place: string) {
  trackEvent("map_open", { place });
}

/** Kliknięcie w konkretną placówkę na mapie lub na liście pod mapą. */
export function trackMapLocationClick(locationName: string, city?: string) {
  trackEvent("map_location_click", { location_name: locationName, city });
}

/**
 * Kliknięcie w rezerwację rozmowy. Dziś prowadzi do formularza kontaktowego,
 * po podpięciu kalendarza wystarczy wywołać to samo z `place` kalendarza.
 */
export function trackBookingClick(place: string) {
  trackEvent("booking_click", { place });
}

/** Kliknięcie w kontakt po stronie pacjenta (bez rezerwacji rozmowy). */
export function trackContactClick(place: string) {
  trackEvent("contact_click", { place });
}

/** Kliknięcie w zapis na newsletter (pasek, stopka, landing). */
export function trackNewsletterClick(place: string) {
  trackEvent("newsletter_click", { place });
}
