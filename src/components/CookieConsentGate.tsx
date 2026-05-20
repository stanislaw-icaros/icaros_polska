"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  defaultCookieConsent,
  persistCookieConsent,
  readCookieConsent,
  type CookieConsentPreferences,
} from "@/lib/cookie-consent";

const NECESSARY_ONLY: CookieConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  externalMedia: false,
};

type PreferenceKey = "marketing" | "externalMedia";

const PREFERENCE_OPTIONS: Array<{
  key: PreferenceKey;
  label: string;
  description: string;
}> = [
  {
    key: "marketing",
    label: "Marketingowe",
    description:
      "Meta Pixel i Conversions API - pomiar konwersji i skuteczności reklam.",
  },
  {
    key: "externalMedia",
    label: "Treści zewnętrzne",
    description: "Osadzone filmy z YouTube na stronie.",
  },
];

export default function CookieConsentGate() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] =
    useState<CookieConsentPreferences>(defaultCookieConsent);

  useEffect(() => {
    const saved = readCookieConsent();
    if (saved) {
      document.documentElement.dataset.cookieConsent = "granted";
      setIsOpen(false);
      return;
    }
    setIsOpen(true);
  }, []);

  function updatePreference(key: PreferenceKey, value: boolean) {
    setPreferences((current) => ({ ...current, [key]: value }));
  }

  function save(toSave: CookieConsentPreferences) {
    persistCookieConsent(toSave);
    setIsOpen(false);
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-[120] sm:inset-auto sm:bottom-5 sm:right-5 sm:max-w-[440px]"
          role="region"
          aria-label="Zgoda na cookies"
        >
          <div className="border border-white/12 bg-[#0b0b0b]/96 text-white shadow-[0_24px_70px_-22px_rgba(0,0,0,0.65)] backdrop-blur-xl">
            <div
              className="h-[2px] w-full"
              style={{ background: "linear-gradient(90deg,#ff6600,#ff7b1f)" }}
            />
            <div className="p-5 sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-orange">
                Cookies
              </p>

              {!showDetails ? (
                <>
                  <p className="mt-2 text-[13px] leading-[1.55] text-white/80">
                    Używamy cookies do pomiaru reklam (Meta Pixel) i osadzonych
                    filmów z YouTube.{" "}
                    <Link
                      href="/polityka-cookies"
                      className="text-white/65 underline decoration-white/25 underline-offset-2 transition-colors hover:text-white"
                    >
                      Polityka cookies
                    </Link>
                  </p>
                  <p className="mt-1.5 text-[10.5px] leading-[1.5] text-white/40">
                    Część prezentowanych wyrobów to certyfikowane wyroby medyczne
                    kierowane do podmiotów profesjonalnych.
                  </p>
                  <div className="mt-3.5 grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setShowDetails(true)}
                      className="col-span-2 order-3 text-center text-[12px] text-white/55 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white sm:col-auto sm:order-none sm:mr-auto sm:text-left"
                    >
                      Ustawienia
                    </button>
                    <button
                      type="button"
                      onClick={() => save(NECESSARY_ONLY)}
                      className="order-1 px-4 py-2.5 text-[12.5px] font-semibold text-white/85 border border-white/15 transition-colors hover:bg-white/[0.04] hover:text-white sm:order-none"
                    >
                      Odrzuć opcjonalne
                    </button>
                    <button
                      type="button"
                      onClick={() => save(defaultCookieConsent)}
                      className="order-2 px-5 py-2.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 sm:order-none"
                      style={{
                        background: "linear-gradient(135deg, #ff6600, #ff7b1f)",
                      }}
                    >
                      Akceptuję wszystkie
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-2.5 text-[13.5px] leading-[1.6] text-white/85">
                    Dostosuj zgody. Niezbędne cookies są zawsze aktywne.
                  </p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-start gap-3 border border-white/10 bg-white/[0.03] p-3">
                      <input
                        type="checkbox"
                        checked
                        disabled
                        className="mt-1 accent-brand-orange"
                      />
                      <span>
                        <span className="block text-[13px] font-semibold">
                          Niezbędne
                        </span>
                        <span className="mt-0.5 block text-[11.5px] leading-[1.55] text-white/65">
                          Działanie serwisu, bezpieczeństwo, zapamiętanie zgody.
                        </span>
                      </span>
                    </div>
                    {PREFERENCE_OPTIONS.map((option) => (
                      <label
                        key={option.key}
                        className="flex cursor-pointer items-start gap-3 border border-white/10 bg-white/[0.03] p-3 transition-colors hover:bg-white/[0.05]"
                      >
                        <input
                          type="checkbox"
                          checked={preferences[option.key]}
                          onChange={(event) =>
                            updatePreference(option.key, event.target.checked)
                          }
                          className="mt-1 accent-brand-orange"
                        />
                        <span>
                          <span className="block text-[13px] font-semibold">
                            {option.label}
                          </span>
                          <span className="mt-0.5 block text-[11.5px] leading-[1.55] text-white/65">
                            {option.description}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-3 text-[11.5px] leading-[1.55] text-white/55">
                    Serwis prezentuje wyroby medyczne kierowane do podmiotów
                    profesjonalnych.{" "}
                    <Link
                      href="/polityka-cookies"
                      className="text-white/75 underline decoration-white/25 underline-offset-2 transition-colors hover:text-white"
                    >
                      Polityka cookies
                    </Link>{" "}
                    ·{" "}
                    <Link
                      href="/polityka-prywatnosci"
                      className="text-white/75 underline decoration-white/25 underline-offset-2 transition-colors hover:text-white"
                    >
                      Polityka prywatności
                    </Link>
                  </p>
                  <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={() => setShowDetails(false)}
                      className="text-[12px] text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white sm:mr-auto"
                    >
                      ← Wstecz
                    </button>
                    <button
                      type="button"
                      onClick={() => save(NECESSARY_ONLY)}
                      className="px-4 py-2.5 text-[12.5px] font-semibold text-white/85 border border-white/15 transition-colors hover:bg-white/[0.04] hover:text-white"
                    >
                      Tylko niezbędne
                    </button>
                    <button
                      type="button"
                      onClick={() => save(preferences)}
                      className="px-5 py-2.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90"
                      style={{
                        background: "linear-gradient(135deg, #ff6600, #ff7b1f)",
                      }}
                    >
                      Zapisz wybór
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
