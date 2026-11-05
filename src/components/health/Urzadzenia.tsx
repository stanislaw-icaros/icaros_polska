"use client";

/**
 * Cztery urządzenia systemu ICAROS. Health nie jest osobnym urządzeniem, tylko
 * jednym etapem ścieżki: od pozycji siedzącej, przez podpór i pion z poręczą,
 * po swobodną pozycję stojącą. Dla placówki to znaczy, że jeden pacjent może
 * przechodzić między urządzeniami bez zmiany systemu i aplikacji.
 *
 * Sekcja stoi na samym dole, pod pytaniami o Healtha: cała strona mówi
 * o Healcie, a to jest dopiero propozycja „może zainteresuje Cię też". Wynik
 * badania Guardiana i gotowe programy całego zestawu z niej wypadły, bo
 * ciągnęły rozmowę w stronę, której ta strona nie prowadzi.
 */

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Akapit, Ciemna, Naglowek, Wejscie } from "./czesci";
import { Znacznik } from "./Scena";
import OknoUrzadzenia from "./OknoUrzadzenia";
import { urzadzeniaSystemu } from "@/lib/health/tresc";

export default function Urzadzenia() {
  const [otwarte, ustawOtwarte] = useState<string | null>(null);
  const wybrane = urzadzeniaSystemu.find((pozycja) => pozycja.slug === otwarte);

  return (
    <Ciemna id="urzadzenia" swiatlo="lewo" powierzchnia="deep">
      <Znacznik wartosc={0.36} />

      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-12">
          <Wejscie className="lg:col-span-5">
            <Naglowek className="max-w-[14ch]">Cztery urządzenia systemu ICAROS</Naglowek>
          </Wejscie>
          <Wejscie opoznienie={0.06} className="lg:col-span-6 lg:col-start-7">
            <Akapit>
              Health jest jednym z&nbsp;czterech urządzeń systemu. Razem prowadzą
              pacjenta od pozycji siedzącej, przez podpór i&nbsp;pion z&nbsp;poręczą,
              po swobodną pozycję stojącą. Wszystkie korzystają z&nbsp;tej samej
              aplikacji, więc historia treningu zostaje przy pacjencie, a&nbsp;nie
              przy urządzeniu.
            </Akapit>
          </Wejscie>
        </div>

        <ol className="mt-[clamp(3rem,6vw,5rem)] grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {urzadzeniaSystemu.map((urzadzenie, indeks) => (
            <Wejscie key={urzadzenie.nazwa} opoznienie={indeks * 0.06}>
              {/* Cały kafelek otwiera okno ze skrótem o urządzeniu. Najechanie
                  rozjaśnia kadr i podnosi nazwę na akcent, żeby było widać,
                  że to coś więcej niż obrazek. */}
              <li>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => ustawOtwarte(urzadzenie.slug)}
                  className="group block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-h-accent focus-visible:ring-offset-4 focus-visible:ring-offset-h-deep"
                >
                  <Image
                    src={urzadzenie.obraz}
                    alt={urzadzenie.obrazAlt}
                    width={1200}
                    height={900}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 24vw"
                    className="aspect-[4/3] w-full rounded-sm object-cover brightness-[0.92] transition duration-300 group-hover:scale-[1.01] group-hover:brightness-110"
                  />
                  <h3 className="mt-5 text-[clamp(1.1rem,1.8vw,1.5rem)] font-semibold tracking-[-0.02em] text-h-ink transition-colors duration-300 group-hover:text-h-accent">
                    {urzadzenie.nazwa}
                  </h3>
                  <p className="mt-3 text-pretty text-[17px] leading-[1.55] text-h-ink">
                    {urzadzenie.opis}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-[15px] font-semibold text-h-ink-soft transition-colors duration-300 group-hover:text-h-accent">
                    Zobacz szczegóły
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </span>
                </button>
              </li>
            </Wejscie>
          ))}
        </ol>
      </div>

      <AnimatePresence>
        {wybrane ? (
          <OknoUrzadzenia
            key={wybrane.slug}
            slug={wybrane.slug}
            obraz={wybrane.obraz}
            obrazAlt={wybrane.obrazAlt}
            naZamkniecie={() => ustawOtwarte(null)}
          />
        ) : null}
      </AnimatePresence>
    </Ciemna>
  );
}
