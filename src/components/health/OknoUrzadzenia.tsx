"use client";

/**
 * Okno ze skrótem o jednym urządzeniu Circle.
 *
 * Kafelki na dole strony pokazują cztery urządzenia jednym zdaniem. Kto chce
 * wiedzieć więcej, klika kafelek i dostaje tu krótki opis: czym to jest, co
 * daje, dla kogo i jakie ma wymiary. Treść idzie z `products.ts`, czyli z tego
 * samego źródła co podstrony produktów, więc nic się nie rozjedzie.
 *
 * Okno jest zwykłym dialogiem: Escape zamyka, klawiatura nie wychodzi poza nie,
 * a po zamknięciu wraca na kafelek, z którego wyszło.
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { products } from "@/lib/products";

const DOTYKALNE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function OknoUrzadzenia({
  slug,
  obraz,
  obrazAlt,
  naZamkniecie,
}: {
  slug: string;
  obraz: string;
  obrazAlt: string;
  naZamkniecie: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const produkt = products.find((pozycja) => pozycja.slug === slug);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const poprzedni = document.activeElement as HTMLElement | null;
    const zablokowane = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.querySelector<HTMLElement>(DOTYKALNE)?.focus();

    const klawisz = (zdarzenie: KeyboardEvent) => {
      if (zdarzenie.key === "Escape") {
        naZamkniecie();
        return;
      }
      if (zdarzenie.key !== "Tab") return;
      const pola = [...panel.querySelectorAll<HTMLElement>(DOTYKALNE)];
      if (pola.length === 0) return;
      const pierwsze = pola[0];
      const ostatnie = pola[pola.length - 1];
      if (zdarzenie.shiftKey && document.activeElement === pierwsze) {
        zdarzenie.preventDefault();
        ostatnie.focus();
      } else if (!zdarzenie.shiftKey && document.activeElement === ostatnie) {
        zdarzenie.preventDefault();
        pierwsze.focus();
      }
    };

    document.addEventListener("keydown", klawisz);
    return () => {
      document.removeEventListener("keydown", klawisz);
      document.body.style.overflow = zablokowane;
      poprzedni?.focus();
    };
  }, [naZamkniecie]);

  if (!produkt) return null;

  const tytulId = `okno-${slug}`;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Zamknij"
        onClick={naZamkniecie}
        className="absolute inset-0 cursor-default bg-h-void/85"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tytulId}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-h-[92svh] w-full max-w-[52rem] overflow-y-auto rounded-t-2xl bg-h-night sm:rounded-2xl"
      >
        <div className="relative">
          <Image
            src={obraz}
            alt={obrazAlt}
            width={1200}
            height={900}
            sizes="(max-width: 840px) 100vw, 52rem"
            className="aspect-[2/1] w-full object-cover"
          />
          <button
            type="button"
            onClick={naZamkniecie}
            aria-label="Zamknij okno"
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-h-void/70 text-h-ink outline-none transition-colors duration-200 hover:bg-h-accent hover:text-h-void focus-visible:ring-2 focus-visible:ring-h-accent"
          >
            <span aria-hidden className="relative block h-4 w-4">
              <span className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <div className="px-6 py-7 sm:px-10 sm:py-9">
          <h2
            id={tytulId}
            className="text-[clamp(1.5rem,3vw,2.1rem)] font-semibold tracking-[-0.03em] text-h-ink"
          >
            {produkt.name}
          </h2>
          <p className="mt-2 text-[17px] leading-[1.5] text-h-accent">
            {produkt.tagline}
          </p>

          <p className="mt-6 max-w-[56ch] text-pretty text-[17px] leading-[1.65] text-h-ink">
            {produkt.longDesc[0]}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
            <div>
              <h3 className="text-[13px] font-semibold text-h-ink-soft">
                Co daje pacjentowi
              </h3>
              <ul className="mt-3 space-y-2">
                {produkt.outcomes.slice(0, 4).map((pozycja) => (
                  <li
                    key={pozycja}
                    className="text-[16px] leading-[1.45] text-h-ink"
                  >
                    {pozycja}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[13px] font-semibold text-h-ink-soft">
                Dane
              </h3>
              <dl className="mt-3 space-y-2 text-[16px] leading-[1.45]">
                <div>
                  <dt className="inline text-h-ink-soft">Wymiary: </dt>
                  <dd className="inline text-h-ink">{produkt.specs.dimensions}</dd>
                </div>
                <div>
                  <dt className="inline text-h-ink-soft">Masa: </dt>
                  <dd className="inline text-h-ink">{produkt.specs.weight}</dd>
                </div>
                <div>
                  <dt className="inline text-h-ink-soft">Użytkownik: </dt>
                  <dd className="inline text-h-ink">
                    {produkt.specs.userHeight}, {produkt.specs.userWeight}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <p className="mt-9 text-[17px] leading-[1.6]">
            <a
              href={`/produkty/${produkt.slug}`}
              target="_blank"
              rel="noopener"
              className="text-h-ink underline decoration-h-dark/35 underline-offset-4 transition-colors hover:decoration-h-dark"
            >
              Pełny opis urządzenia
              <span className="sr-only"> (otwiera się w nowej karcie)</span>
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
