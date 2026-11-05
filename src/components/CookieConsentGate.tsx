"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import {
  defaultCookieConsent,
  persistCookieConsent,
  readCookieConsent,
  type CookieConsentPreferences,
} from "@/lib/cookie-consent";
import { czyPotwierdzony } from "@/lib/profesjonalista";

const NECESSARY_ONLY: CookieConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  externalMedia: false,
};

type PreferenceKey = "analytics" | "marketing";

const PREFERENCE_OPTIONS: Array<{
  key: PreferenceKey;
  label: string;
  description: string;
}> = [
  {
    key: "analytics",
    label: "Analityczne",
    description:
      "Google Analytics: liczba wejść na podstrony oraz kliknięć w mapę i kontakt.",
  },
  {
    key: "marketing",
    label: "Marketingowe",
    description:
      "Meta Pixel i Conversions API: pomiar konwersji i skuteczności reklam.",
  },
];

/* Pas zgody jest wspólny dla jasnego serwisu i ciemnego landingu /health,
   dlatego ma własną, ciemną powierzchnię zamiast kolorów strony pod spodem. */
const PAS = "bg-[#141418] text-white";
/** Przyciemnienie wstaje od pasa i gaśnie w górę kadru. */
const ZASLONA =
  "fixed inset-0 z-[119] bg-[linear-gradient(to_top,rgba(7,7,10,0.78)_0%,rgba(7,7,10,0.42)_38%,rgba(7,7,10,0.2)_100%)]"; // taste-skill-ignore: neutralna zasłona pod bramą zgody
const SZEROKOSC = "mx-auto w-full max-w-[1320px] px-5 sm:px-8";

const PRZYCISK =
  "inline-flex min-h-[48px] items-center justify-center whitespace-nowrap px-5 text-[15px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-[#141418] sm:px-6";
const GLOWNY = `${PRZYCISK} bg-brand-orange text-[#0a0a0a] hover:bg-brand-orange-light`;
const DRUGI = `${PRZYCISK} bg-white/10 text-white hover:bg-white/[0.18]`;
const LINK =
  "inline-flex min-h-[48px] items-center text-[15px] text-white/70 underline decoration-white/30 underline-offset-4 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-[#141418]";

/** Kwadrat przełącznika. Prawdziwy checkbox siedzi pod spodem jako `sr-only`,
 *  więc klawiatura i czytniki ekranu dostają zwykłą kontrolkę formularza. */
const KWADRAT =
  "relative mt-[2px] grid h-5 w-5 shrink-0 place-items-center border-[1.5px] border-white/40 transition-colors peer-checked:border-brand-orange peer-checked:bg-brand-orange peer-checked:[&_svg]:opacity-100 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-orange peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#141418] peer-disabled:border-white/25 peer-disabled:bg-white/25";

export default function CookieConsentGate() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] =
    useState<CookieConsentPreferences>(defaultCookieConsent);
  const mniejRuchu = useReducedMotion();

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (readCookieConsent()) {
      document.documentElement.dataset.cookieConsent = "granted";
      return;
    }

    let licznik = 0;
    // Pierwszy ekran dostaje chwilę dla siebie. Pas wjeżdża zaraz po nim,
    // zamiast witać odwiedzającego oknem zanim cokolwiek zobaczy.
    const odlicz = () => {
      licznik = window.setTimeout(() => setIsOpen(true), 1100);
    };

    // Najpierw pytamy o status profesjonalisty, dopiero potem o cookies.
    // Dwa okna naraz na dole ekranu to jedno okno za dużo.
    if (czyPotwierdzony()) {
      odlicz();
      return () => window.clearTimeout(licznik);
    }

    window.addEventListener("status-profesjonalisty", odlicz, { once: true });
    return () => {
      window.removeEventListener("status-profesjonalisty", odlicz);
      window.clearTimeout(licznik);
    };
  }, []);

  // Dopóki brama stoi, klawiatura zostaje w środku. Tak zachowuje się okno
  // modalne i tylko wtedy ma prawo zasłaniać stronę.
  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    if (!panel) return;
    const poprzedni = document.activeElement as HTMLElement | null;
    panel.focus({ preventScroll: true });

    const naKlawisz = (zdarzenie: KeyboardEvent) => {
      if (zdarzenie.key !== "Tab") return;
      const ogniskowalne = panel.querySelectorAll<HTMLElement>(
        "a[href], button, input:not([disabled])"
      );
      if (ogniskowalne.length === 0) return;
      const pierwszy = ogniskowalne[0];
      const ostatni = ogniskowalne[ogniskowalne.length - 1];
      if (zdarzenie.shiftKey && document.activeElement === pierwszy) {
        zdarzenie.preventDefault();
        ostatni.focus();
      } else if (!zdarzenie.shiftKey && document.activeElement === ostatni) {
        zdarzenie.preventDefault();
        pierwszy.focus();
      }
    };

    document.addEventListener("keydown", naKlawisz);
    return () => {
      document.removeEventListener("keydown", naKlawisz);
      poprzedni?.focus?.();
    };
  }, [isOpen, showDetails]);

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
        <>
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={ZASLONA}
        />
        <motion.div
          ref={panelRef}
          tabIndex={-1}
          initial={{ opacity: 0, y: mniejRuchu ? 0 : 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: mniejRuchu ? 0 : 40 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={`fixed inset-x-0 bottom-0 z-[120] outline-none ${PAS}`}
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="zgoda-naglowek"
        >
          <div className={`${SZEROKOSC} max-h-[82svh] overflow-y-auto py-5 sm:py-7`}>
            {!showDetails ? (
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
                <div className="max-w-[58ch]">
                  <p
                    id="zgoda-naglowek"
                    className="text-balance text-[clamp(1.05rem,1.5vw,1.3rem)] font-semibold leading-[1.3] tracking-[-0.02em]"
                  >
                    Zbieramy statystyki odwiedzin i&nbsp;mierzymy skuteczność reklam.
                  </p>
                  <p className="mt-2 text-[15px] leading-[1.55] text-white/70">
                    Tylko za Twoją zgodą. Google Analytics oraz Meta Pixel.{" "}
                    <Link href="/polityka-cookies" className="text-white underline decoration-white/35 underline-offset-4 hover:decoration-white">
                      Polityka cookies
                    </Link>
                  </p>
                </div>

                <div className="grid shrink-0 grid-cols-[1fr_auto] gap-x-4 gap-y-3 sm:flex sm:items-center">
                  <button
                    type="button"
                    onClick={() => save(defaultCookieConsent)}
                    className={`${GLOWNY} col-span-2 sm:order-3 sm:col-auto`}
                  >
                    Akceptuję
                  </button>
                  <button
                    type="button"
                    onClick={() => save(NECESSARY_ONLY)}
                    className={`${DRUGI} sm:order-2`}
                  >
                    Tylko niezbędne
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDetails(true)}
                    className={`${LINK} justify-center sm:order-1 sm:mr-3`}
                  >
                    Ustawienia
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p
                  id="zgoda-naglowek"
                  className="text-[clamp(1.05rem,1.5vw,1.3rem)] font-semibold leading-[1.3] tracking-[-0.02em]"
                >
                  Zdecyduj, co zbieramy.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" checked disabled readOnly className="peer sr-only" />
                    <span className={KWADRAT} aria-hidden>
                      <Check className="h-3.5 w-3.5 text-[#0a0a0a] opacity-0" strokeWidth={3} />
                    </span>
                    <span>
                      <span className="block text-[15px] font-semibold">Niezbędne</span>
                      <span className="mt-1 block text-[14px] leading-[1.5] text-white/70">
                        Działanie serwisu i&nbsp;zapamiętanie tej zgody. Zawsze aktywne.
                      </span>
                    </span>
                  </div>

                  {PREFERENCE_OPTIONS.map((option) => (
                    <label key={option.key} className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={preferences[option.key]}
                        onChange={(event) => updatePreference(option.key, event.target.checked)}
                        className="peer sr-only"
                      />
                      <span className={KWADRAT} aria-hidden>
                        <Check className="h-3.5 w-3.5 text-[#0a0a0a] opacity-0" strokeWidth={3} />
                      </span>
                      <span>
                        <span className="block text-[15px] font-semibold">{option.label}</span>
                        <span className="mt-1 block text-[14px] leading-[1.5] text-white/70">
                          {option.description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-7 sm:flex sm:items-center">
                  <button
                    type="button"
                    onClick={() => save(preferences)}
                    className={`${GLOWNY} col-span-2 sm:order-4 sm:col-auto`}
                  >
                    Zapisz wybór
                  </button>
                  <button
                    type="button"
                    onClick={() => save(NECESSARY_ONLY)}
                    className={`${DRUGI} col-span-2 sm:order-3 sm:col-auto`}
                  >
                    Tylko niezbędne
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDetails(false)}
                    className={`${LINK} justify-center gap-2 sm:order-1 sm:mr-auto`}
                  >
                    <ArrowLeft aria-hidden className="h-4 w-4" strokeWidth={2} />
                    Wstecz
                  </button>
                  <Link
                    href="/polityka-prywatnosci"
                    className={`${LINK} justify-center sm:order-2 sm:mr-3`}
                  >
                    Polityka prywatności
                  </Link>
                </div>
              </div>
            )}
          </div>
        </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
