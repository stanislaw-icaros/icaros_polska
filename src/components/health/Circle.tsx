"use client";

/**
 * ICAROS Circle. Health nie jest osobnym urządzeniem, tylko jednym etapem
 * ścieżki: od pozycji siedzącej, przez podpór i pion z poręczą, po swobodną
 * pozycję stojącą. Dla placówki to znaczy, że jeden pacjent może przechodzić
 * między urządzeniami bez zmiany systemu i aplikacji.
 */

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Akapit, Ciemna, Licznik, Naglowek, Wejscie } from "./czesci";
import { Znacznik } from "./Scena";
import OknoUrzadzenia from "./OknoUrzadzenia";
import { circle, programyCircle, wynikGuardian } from "@/lib/health/tresc";

/** Minuty z zapisu w rodzaju „30 minut". */
const minuty = (czas: string) => Number.parseInt(czas, 10) || 0;

const NAJDLUZSZY = Math.max(...programyCircle.map((p) => minuty(p.czas)));

/** Pasek długości sesji. Rozsuwa się, kiedy wiersz wjedzie w ekran. */
function Pasek({ udzial }: { udzial: number }) {
  return (
    <div className="h-[6px] w-full rounded-full bg-[#1b1e27]">
      <motion.div
        className="h-full rounded-full bg-h-accent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: udzial }}
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: 0 }}
      />
    </div>
  );
}

export default function Circle() {
  const [otwarte, ustawOtwarte] = useState<string | null>(null);
  const wybrane = circle.find((pozycja) => pozycja.slug === otwarte);

  return (
    <Ciemna id="circle" swiatlo="lewo" powierzchnia="deep">
      <Znacznik wartosc={0.36} />

      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-12">
          <Wejscie className="lg:col-span-5">
            <Naglowek className="max-w-[12ch]">
              Cztery urządzenia systemu
            </Naglowek>
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
          {circle.map((urzadzenie, indeks) => (
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

        {/* Wynik Guardiana. Najpierw sama liczba, duża, odliczająca przy
            wejściu w ekran. Zdanie i przypis dochodzą po niej. */}
        <div className="mt-[clamp(5rem,10vw,9rem)]">
          <div className="grid grid-cols-1 gap-x-12 gap-y-4 lg:grid-cols-12 lg:items-end">
            <Wejscie className="lg:col-span-8">
              <p className="text-[clamp(4.5rem,15vw,12rem)] font-semibold leading-[0.8] tracking-[-0.05em] text-h-accent [font-variant-numeric:tabular-nums]">
                <Licznik wartosc={wynikGuardian.wartosc} />
              </p>
            </Wejscie>
            <Wejscie opoznienie={0.5} className="lg:col-span-4 lg:pb-4">
              <p className="text-[13px] leading-[1.5] text-h-ink-soft">
                {wynikGuardian.zrodlo}
              </p>
            </Wejscie>
          </div>

          <Wejscie opoznienie={0.28}>
            <p className="mt-7 max-w-[26ch] text-pretty text-[clamp(1.5rem,3.4vw,2.6rem)] font-medium leading-[1.12] tracking-[-0.03em] text-h-ink">
              {wynikGuardian.opis}
            </p>
          </Wejscie>
        </div>

        {/* Programy. Pasek pokazuje długość sesji, więc trzy wiersze da się
            porównać okiem, bez czytania minut. */}
        <div className="mt-[clamp(4.5rem,9vw,8rem)]">
          <Wejscie>
            <h3 className="text-[17px] font-semibold text-h-ink">Gotowe programy</h3>
          </Wejscie>

          <dl className="mt-9 space-y-8">
            {programyCircle.map((program, indeks) => (
              <Wejscie key={program.nazwa} opoznienie={indeks * 0.07}>
                <div className="grid grid-cols-1 items-center gap-x-10 gap-y-3 sm:grid-cols-[14rem_1fr_11rem]">
                  <dt className="text-[clamp(1.05rem,1.6vw,1.3rem)] font-semibold tracking-[-0.02em] text-h-ink">
                    {program.nazwa}
                  </dt>
                  <dd className="order-last sm:order-none">
                    <Pasek udzial={minuty(program.czas) / NAJDLUZSZY} />
                  </dd>
                  <dd className="text-[17px] text-h-ink [font-variant-numeric:tabular-nums]">
                    {program.czas}
                    <span className="block text-[14px] text-h-ink-soft">
                      {program.opis}
                    </span>
                  </dd>
                </div>
              </Wejscie>
            ))}
          </dl>

          <Wejscie opoznienie={0.2}>
            <p className="mt-10 text-[17px] leading-[1.6] text-h-ink">
              <Link
                href="/produkty/circle"
                className="text-h-ink underline decoration-h-dark/35 underline-offset-4 transition-colors hover:decoration-h-dark"
              >
                Szczegóły systemu ICAROS Circle
              </Link>
            </p>
          </Wejscie>
        </div>
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
