"use client";

import { useEffect, useState } from "react";
import LegalLinks from "@/components/LegalLinks";
import {
  defaultCookieConsent,
  persistCookieConsent,
  readCookieConsent,
  type CookieConsentPreferences,
} from "@/lib/cookie-consent";

export default function CookieConsentGate() {
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookieConsentPreferences>(defaultCookieConsent);

  useEffect(() => {
    const saved = readCookieConsent();
    if (saved) {
      document.documentElement.dataset.cookieConsent = "granted";
      setIsOpen(false);
      return;
    }

    document.documentElement.dataset.cookieConsent = "pending";
    setPreferences(defaultCookieConsent);
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  function updatePreference<K extends keyof CookieConsentPreferences>(key: K, value: CookieConsentPreferences[K]) {
    setPreferences((current) => ({ ...current, [key]: value }));
  }

  function save(preferencesToSave: CookieConsentPreferences) {
    persistCookieConsent(preferencesToSave);
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/32 backdrop-blur-[2px] p-4 sm:items-center sm:p-6">
      <div className="w-full max-w-[680px] border border-white/12 bg-[#0b0b0b]/96 text-white shadow-[0_20px_80px_-32px_rgba(0,0,0,0.75)]">
        <div className="border-b border-white/10 px-5 py-4 sm:px-6 sm:py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">Prywatność i cookies</p>
          <h2 className="mt-2.5 text-[clamp(1.25rem,2.5vw,1.9rem)] font-bold tracking-[-0.03em] leading-[1.1]">
            Zanim wejdziesz dalej, wybierz zgodę na cookies
          </h2>
          <p className="mt-3 max-w-2xl text-[13px] leading-[1.7] text-white/62">
            Korzystamy z cookies niezbędnych do działania serwisu oraz z narzędzi analitycznych, marketingowych i
            zewnętrznych treści, takich jak Google Analytics, Meta Pixel, Vercel Analytics czy osadzone wideo YouTube.
            Domyślnie zaznaczyliśmy pełną zgodę, ale możesz ją dostosować przed wejściem do serwisu.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-2 sm:px-6 sm:py-5">
          <label className="flex items-start gap-3 border border-white/10 bg-white/[0.03] p-3.5">
            <input type="checkbox" checked disabled className="mt-1 accent-brand-orange" />
            <span>
              <span className="block text-[13px] font-semibold">Niezbędne</span>
              <span className="mt-1 block text-[12px] leading-[1.6] text-white/55">
                Zawsze aktywne. Odpowiadają za bezpieczeństwo, działanie strony i zapamiętanie ustawień zgody.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 border border-white/10 bg-white/[0.03] p-3.5">
            <input
              type="checkbox"
              checked={preferences.analytics}
              onChange={(event) => updatePreference("analytics", event.target.checked)}
              className="mt-1 accent-brand-orange"
            />
            <span>
              <span className="block text-[13px] font-semibold">Analityczne</span>
              <span className="mt-1 block text-[12px] leading-[1.6] text-white/55">
                Pomiar ruchu, wydajności serwisu i zachowań użytkowników, m.in. przez Google Analytics i Vercel
                Analytics.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 border border-white/10 bg-white/[0.03] p-3.5">
            <input
              type="checkbox"
              checked={preferences.marketing}
              onChange={(event) => updatePreference("marketing", event.target.checked)}
              className="mt-1 accent-brand-orange"
            />
            <span>
              <span className="block text-[13px] font-semibold">Marketingowe</span>
              <span className="mt-1 block text-[12px] leading-[1.6] text-white/55">
                Pomiar skuteczności kampanii, konwersji i remarketingu, w tym Meta Pixel, gdy będzie aktywny.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 border border-white/10 bg-white/[0.03] p-3.5">
            <input
              type="checkbox"
              checked={preferences.externalMedia}
              onChange={(event) => updatePreference("externalMedia", event.target.checked)}
              className="mt-1 accent-brand-orange"
            />
            <span>
              <span className="block text-[13px] font-semibold">Treści zewnętrzne</span>
              <span className="mt-1 block text-[12px] leading-[1.6] text-white/55">
                Materiały osadzane z usług zewnętrznych, np. filmy YouTube, które mogą ustawiać własne cookies.
              </span>
            </span>
          </label>
        </div>

        <div className="border-t border-white/10 px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <LegalLinks
              className="flex flex-wrap items-center gap-5"
              linkClassName="text-[12px] text-white/50 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => save(preferences)}
                className="px-5 py-3 text-[13px] font-semibold text-white/85 transition-colors hover:text-white"
              >
                Zapisz zaznaczone
              </button>
              <button
                type="button"
                onClick={() => save(defaultCookieConsent)}
                className="px-6 py-3 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
              >
                Akceptuję wszystko
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
