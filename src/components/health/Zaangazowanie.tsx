"use client";

/**
 * Zaangażowanie pacjentów. To jest sedno argumentu za grywalizacją w terapii.
 *
 * Wcześniej sekcja niosła naraz dwa cytaty badaczy i cztery liczby ustawione
 * po cztery w rzędzie. Było tego za dużo na jeden ekran. Cytaty wyprowadziły
 * się do własnej sekcji, a każda liczba ma teraz swój wiersz, odlicza przy
 * wejściu w ekran i ma dookoła powietrze.
 *
 * Każda liczba ma przy sobie ośrodek, rok i urządzenie, bo nie wszystkie
 * pochodzą z badań nad samym Healthem.
 */

import { Akapit, Ciemna, Naglowek, Wejscie, Wynik } from "./czesci";
import { Znacznik } from "./Scena";
import { zaangazowanie } from "@/lib/health/tresc";

export default function Zaangazowanie() {
  return (
    <Ciemna id="zaangazowanie" swiatlo="prawo" powierzchnia="surface">
      <Znacznik wartosc={0.3} />

      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-12">
          <Wejscie className="lg:col-span-5">
            <Naglowek className="max-w-[14ch]">Zaangażowanie pacjentów</Naglowek>
          </Wejscie>

          <Wejscie opoznienie={0.06} className="lg:col-span-6 lg:col-start-7">
            <Akapit>
              O&nbsp;skuteczności terapii decyduje nie tylko dobór ćwiczenia, ale
              też to, czy pacjent wraca na kolejne sesje. Grywalizacja jest
              w&nbsp;ICAROS po&nbsp;to, żeby wracał.
            </Akapit>
          </Wejscie>
        </div>

        <div className="mt-[clamp(4rem,9vw,8rem)] space-y-[clamp(3.5rem,8vw,7rem)]">
          {zaangazowanie.map((wynik, indeks) => (
            <Wejscie key={wynik.wartosc} opoznienie={indeks * 0.05}>
              <Wynik
                wartosc={wynik.wartosc}
                opis={wynik.opis}
                zrodlo={wynik.zrodlo}
              />
            </Wejscie>
          ))}
        </div>
      </div>
    </Ciemna>
  );
}
