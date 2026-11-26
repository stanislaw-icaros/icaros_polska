"use client";

import { useEffect } from "react";
import { hasCookieConsent } from "@/lib/cookie-consent";

/**
 * Meta Pixel - ładowany dopiero po zgodzie marketingowej (RODO).
 * Ustaw NEXT_PUBLIC_FB_PIXEL_ID w env, aby aktywować. Bez tej zmiennej
 * komponent nic nie robi - strona jest gotowa na podpięcie pixela później.
 *
 * Z maszyny lokalnej nic nie wysyłamy. W listopadzie 2026 ok. 16% zdarzeń
 * PageView w produkcyjnym pikselu pochodziło z testów na localhost, co psuje
 * i raporty, i uczenie się kampanii.
 */
const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

/** Adresy, z których zdarzenia nie mają trafiać do produkcyjnego piksela. */
function ruchLokalny(): boolean {
  if (typeof window === "undefined") return true;
  const host = window.location.hostname;
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host.endsWith(".local") ||
    host.endsWith(".localhost")
  );
}

export default function MetaPixel() {
  useEffect(() => {
    const pixelId = PIXEL_ID?.trim();
    if (!pixelId || !/^\d+$/.test(pixelId)) return;
    if (ruchLokalny()) return;

    let injected = false;

    function injectPixel() {
      if (injected || document.getElementById("meta-pixel-base")) return;
      if (!hasCookieConsent("marketing")) return;
      injected = true;

      const script = document.createElement("script");
      script.id = "meta-pixel-base";
      script.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`;
      document.head.appendChild(script);
    }

    injectPixel();
    window.addEventListener("cookie-consent-updated", injectPixel);
    return () => window.removeEventListener("cookie-consent-updated", injectPixel);
  }, []);

  return null;
}
