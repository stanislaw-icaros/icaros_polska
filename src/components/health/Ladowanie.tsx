"use client";

/**
 * Zamknięcie. Suwak dojeżdża do końca i tam zostaje: z całej strony zostaje
 * świat, a jedynym przedmiotem w nim jest przycisk.
 *
 * Sekcja jest o tyle wyższa od ekranu, żeby tekst zdążył wejść, i ani metra
 * więcej: wcześniejsza wersja miała zapas, przez który po ostatnim ekranie
 * przewijało się przez pustą czerń.
 */

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Akcja, Wejscie } from "./czesci";
import { Znacznik } from "./Scena";

/** Zasłona pod tekstem finału: pas u dołu, a na szerokim ekranie prawy róg. */
const ZASLONA =
  "pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(7,7,10,0.93)_0%,rgba(7,7,10,0.66)_40%,transparent_74%)] lg:bg-[linear-gradient(288deg,rgba(7,7,10,0.94)_0%,rgba(7,7,10,0.72)_34%,transparent_66%)]"; // taste-skill-ignore: neutralny scrim nad zdjęciem

export default function Ladowanie() {
  const sekcjaRef = useRef<HTMLElement | null>(null);
  // Treść gaśnie, zanim stopka zacznie na nią wjeżdżać. Bez tego ostatni ekran
  // nakładał się na stopkę i wyglądał jak podwójna ekspozycja.
  const { scrollYProgress } = useScroll({
    target: sekcjaRef,
    offset: ["start start", "end start"],
  });
  const zanik = useTransform(scrollYProgress, [0, 0.72, 0.95], [1, 1, 0]);
  const widocznosc = useTransform(zanik, (v) => (v < 0.02 ? "hidden" : "visible"));

  return (
    <section ref={sekcjaRef} id="kontakt" className="relative z-0 h-[118svh]">
      <Znacznik wartosc={0.92} />

      <motion.div
        className="sticky top-0 flex h-svh items-end overflow-hidden"
        style={{ opacity: zanik, visibility: widocznosc }}
      >
        <div aria-hidden className={ZASLONA} />

        <div className="relative z-10 flex w-full justify-start px-5 pb-28 sm:px-8 lg:justify-end lg:pb-24 lg:pl-32 lg:pr-32">
          <Wejscie className="max-w-[40ch] text-left lg:text-right">
            <h2 className="text-balance text-[clamp(2.3rem,5.5vw,4.4rem)] font-semibold leading-[1] tracking-[-0.04em] text-h-ink">
              Kontakt
            </h2>
            <p className="mt-6 text-pretty text-[17px] leading-[1.65] text-h-ink">
              Proponujemy krótką rozmowę telefoniczną. Ustalamy na niej potrzeby
              placówki, odpowiadamy na pytania o&nbsp;kwalifikację pacjentów,
              miejsce i&nbsp;obsługę, a&nbsp;następnie umawiamy pokaz albo testy
              na miejscu.
            </p>
            <Akcja className="mt-9" />
          </Wejscie>
        </div>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0">
        <Znacznik wartosc={1} />
      </div>
    </section>
  );
}

/** Zamknięcie strony: odnośniki i drobne sprawy, bez wielkiej nazwy nad nimi. */
export function Stopka() {
  return (
    <footer className="relative z-10 bg-h-void px-5 pb-10 pt-16 text-h-ink sm:px-8 lg:pl-32 lg:pr-32">
      <div className="flex flex-col gap-5 text-[14px] text-h-ink-soft sm:flex-row sm:items-center sm:justify-between">
        <nav className="flex flex-wrap gap-x-7 gap-y-2">
          <Link href="/" className="hover:text-h-ink">
            Strona główna
          </Link>
          <Link href="/produkty/health" className="hover:text-h-ink">
            ICAROS Health
          </Link>
          <Link href="/efektywnosc" className="hover:text-h-ink">
            Badania
          </Link>
          <Link href="/kalendarz" className="hover:text-h-ink">
            Umów rozmowę
          </Link>
          <Link href="/polityka-prywatnosci" className="hover:text-h-ink">
            Prywatność
          </Link>
        </nav>
        <p className="max-w-[46ch]">
          Kadry z&nbsp;filmu i&nbsp;zdjęcia urządzeń: ICAROS. Ujęcia sesji,
          urządzeń na czarnym tle i&nbsp;widoki tras powstały na podstawie
          materiałów producenta i&nbsp;są ilustracyjne.
        </p>
      </div>
    </footer>
  );
}
