"use client";

/**
 * Pytania. Wcześniej dzieliły sekcję z listą danych technicznych i obie rzeczy
 * ściskały się w dwóch łamach. Dane wypadły, bo przy tej rozmowie nic nie
 * wnosiły, a pytania dostały całą sekcję: jeden łam, duże wiersze, odpowiedzi
 * schowane w zwykłych elementach <details>, czyli z klawiaturą i czytnikiem
 * ekranu, bez skryptu.
 */

import { Ciemna, Naglowek, Wejscie } from "./czesci";
import { Znacznik } from "./Scena";
import { pytania } from "@/lib/health/tresc";

export default function Pytania() {
  return (
    <Ciemna id="pytania" swiatlo="lewo" powierzchnia="void">
      <Znacznik wartosc={0.26} />

      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-x-16 gap-y-[clamp(2.5rem,5vw,4rem)] lg:grid-cols-12">
        <Wejscie className="lg:col-span-4">
          <Naglowek className="max-w-[8ch]">Pytania</Naglowek>
        </Wejscie>

        <div className="lg:col-span-8">
          {pytania.map((pozycja, indeks) => (
            <Wejscie key={pozycja.pytanie} opoznienie={indeks * 0.04}>
              <details className="group mb-3 bg-h-night px-6 transition-colors duration-200 hover:bg-[#15171f] sm:px-8">
                <summary className="flex min-h-[88px] cursor-pointer list-none items-center justify-between gap-8 py-5 text-[clamp(1.15rem,2vw,1.6rem)] font-semibold leading-[1.3] tracking-[-0.02em] text-h-ink outline-none transition-colors duration-200 hover:text-h-accent focus-visible:ring-2 focus-visible:ring-h-accent focus-visible:ring-offset-4 focus-visible:ring-offset-h-void [&::-webkit-details-marker]:hidden">
                  {pozycja.pytanie}
                  {/* Znak rozwinięcia rysowany dwoma kreskami, bez biblioteki ikon. */}
                  <span
                    aria-hidden
                    className="relative block h-5 w-5 shrink-0 text-h-accent"
                  >
                    <span className="absolute left-0 top-1/2 h-[2px] w-5 -translate-y-1/2 bg-current" />
                    <span className="absolute left-1/2 top-0 h-5 w-[2px] -translate-x-1/2 bg-current transition-transform duration-200 group-open:rotate-90 group-open:opacity-0" />
                  </span>
                </summary>
                <p className="max-w-[56ch] text-pretty pb-8 text-[17px] leading-[1.7] text-h-ink-soft">
                  {pozycja.odpowiedz}
                </p>
              </details>
            </Wejscie>
          ))}
        </div>

        <Wejscie opoznienie={0.1} className="lg:col-span-8 lg:col-start-5">
          <p className="text-[14px] leading-[1.5] text-h-ink-soft">
            Wyrób medyczny klasy I, produkcja w&nbsp;Niemczech.
          </p>
        </Wejscie>
      </div>
    </Ciemna>
  );
}
