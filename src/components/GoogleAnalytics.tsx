"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { hasCookieConsent } from "@/lib/cookie-consent";
import { GA_MEASUREMENT_ID, isValidGaId, trackPageView } from "@/lib/analytics/track";

/**
 * Google Analytics 4 - ładowany dopiero po zgodzie analitycznej (RODO),
 * tak samo jak Meta Pixel. Ustaw NEXT_PUBLIC_GA_ID (G-XXXXXXXXXX), żeby
 * aktywować; bez tej zmiennej komponent nic nie robi.
 *
 * Automatyczne zliczanie odsłon jest wyłączone (`send_page_view: false`),
 * bo przy nawigacji klientem w App Routerze zliczyłoby tylko pierwsze
 * wejście. Każdą podstronę wysyłamy sami, przy zmianie ścieżki.
 */
export default function GoogleAnalytics() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!isValidGaId(GA_MEASUREMENT_ID)) return;

    function ensureLoaded() {
      if (!hasCookieConsent("analytics")) return false;
      if (document.getElementById("ga4-base")) return true;

      const loader = document.createElement("script");
      loader.async = true;
      loader.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(loader);

      const config = document.createElement("script");
      config.id = "ga4-base";
      config.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}',{send_page_view:false});`;
      document.head.appendChild(config);
      return true;
    }

    function send() {
      if (!ensureLoaded()) return;
      if (lastPath.current === pathname) return;
      lastPath.current = pathname;
      trackPageView(pathname);
    }

    send();
    window.addEventListener("cookie-consent-updated", send);
    return () => window.removeEventListener("cookie-consent-updated", send);
  }, [pathname]);

  return null;
}
