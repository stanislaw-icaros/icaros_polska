"use client";

/**
 * „Umów rozmowę" w prawym dolnym rogu.
 *
 * Na otwarciu przycisk stoi pod nagłówkiem, czyli tam, gdzie wzrok i tak go
 * szuka. Dopiero kiedy tamten zniknie z ekranu, ten sam przycisk wraca jako
 * krążek w rogu i jedzie już ze stroną do końca. Dzięki temu na pierwszym
 * ekranie nie ma dwóch takich samych przycisków naraz.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/** Identyfikator przycisku z otwarcia, który ten tutaj obserwuje. */
export const AKCJA_OTWARCIA = "akcja-otwarcia";

export default function PrzyciskWRogu() {
  const [widoczny, ustawWidoczny] = useState(false);
  const mniejRuchu = useReducedMotion();

  useEffect(() => {
    const cel = document.getElementById(AKCJA_OTWARCIA);

    // Bez przycisku z otwarcia (np. gdyby sekcja zniknęła) zostaje prosty próg.
    if (!cel) {
      const sprawdz = () => ustawWidoczny(window.scrollY > window.innerHeight * 0.8);
      sprawdz();
      window.addEventListener("scroll", sprawdz, { passive: true });
      return () => window.removeEventListener("scroll", sprawdz);
    }

    const obserwator = new IntersectionObserver(
      ([wpis]) => ustawWidoczny(!wpis.isIntersecting),
      { threshold: 0 }
    );
    obserwator.observe(cel);
    return () => obserwator.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {widoczny ? (
        <motion.div
          initial={{ opacity: 0, y: mniejRuchu ? 0 : 16, scale: mniejRuchu ? 1 : 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: mniejRuchu ? 0 : 16, scale: mniejRuchu ? 1 : 0.94 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-5 z-[90] sm:bottom-8 sm:right-8"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          <Link
            href="/kalendarz"
            className="group inline-flex min-h-[56px] items-center gap-3 rounded-full bg-h-accent px-7 text-[16px] font-semibold tracking-[0.01em] text-h-void shadow-[0_14px_40px_-12px_rgba(0,0,0,0.75)] outline-none transition-colors duration-200 hover:bg-[#ff7b1f] focus-visible:ring-2 focus-visible:ring-h-accent focus-visible:ring-offset-4 focus-visible:ring-offset-h-void"
          >
            Umów rozmowę
            <ArrowRight
              aria-hidden
              className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2}
            />
          </Link>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
