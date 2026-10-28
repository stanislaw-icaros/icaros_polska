"use client";

/**
 * Efekty treningu zmierzone na samym ICAROS Health. Trzy wyniki, każdy
 * z ośrodkiem i rokiem. Stały wcześniej po trzy w rzędzie, drobne; teraz każdy
 * ma własny wiersz, dużą liczbę odliczającą przy wejściu w ekran i powietrze
 * dookoła. Pełna lista badań dla wszystkich urządzeń jest w src/lib/studies.ts
 * i na stronie z zasobami.
 */

import Link from "next/link";
import { Ciemna, Naglowek, Wejscie, Wynik } from "./czesci";
import { Znacznik } from "./Scena";
import { badania } from "@/lib/health/tresc";

export default function Badania() {
  return (
    <Ciemna id="efekty" swiatlo="prawo" powierzchnia="surface">
      <Znacznik wartosc={0.24} />

      <div className="mx-auto max-w-[1320px]">
        <Wejscie>
          <Naglowek className="max-w-[14ch]">Efekty treningu</Naglowek>
        </Wejscie>

        <div className="mt-[clamp(3.5rem,8vw,7rem)] space-y-[clamp(3.5rem,8vw,7rem)]">
          {badania.map((wynik, indeks) => (
            <Wejscie key={wynik.wartosc} opoznienie={indeks * 0.05}>
              <Wynik
                wartosc={wynik.wartosc}
                opis={wynik.opis}
                zrodlo={wynik.zrodlo}
              />
            </Wejscie>
          ))}
        </div>

        <Wejscie opoznienie={0.1}>
          <p className="mt-[clamp(4rem,8vw,7rem)] max-w-[60ch] text-pretty text-[17px] leading-[1.6] text-h-ink-soft">
            Badania prowadziły między innymi Politechnika w&nbsp;Monachium, Niemiecki
            Uniwersytet Sportowy w&nbsp;Kolonii, Uniwersytet w&nbsp;Heidelbergu
            i&nbsp;AWF w&nbsp;Katowicach.{" "}
            <Link
              href="/efektywnosc"
              className="text-h-ink underline decoration-h-ink/35 underline-offset-4 transition-colors hover:decoration-h-ink"
            >
              Pełna lista publikacji
            </Link>
          </p>
        </Wejscie>
      </div>
    </Ciemna>
  );
}
