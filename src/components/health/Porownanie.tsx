"use client";

/**
 * Co zmienia trening na ICAROS Health.
 *
 * Sekcja przeszła trzy przebudowy. Najpierw była tu scenka o pięciu minutach
 * na macie, po której nie było wiadomo, o co chodzi. Potem zestawienie
 * „z matą", które stawiało urządzenie za sto tysięcy obok maty za kilkanaście
 * złotych i brzmiało dziwnie. Punktem odniesienia jest teraz samo ćwiczenie:
 * podpór na przedramionach, czyli standardowy sposób trenowania stabilności
 * tułowia bez sprzętu. Porównujemy warunki, w jakich pacjent je wykonuje,
 * i to, co z tego wychodzi.
 *
 * Trzecia przebudowa, po uwagach z 4 listopada 2026, dotyczy czytelności.
 * Nagłówek i zdanie wprowadzające szły wcześniej obok siebie w dwóch łamach,
 * więc wzrok trafiał najpierw na nagłówek, potem na prawy górny róg, a dopiero
 * potem na tabelę; teraz jedno stoi pod drugim. Sama tabela rozpadała się na
 * osobną etykietę i dwie płyty obok niej. Teraz wszystkie trzy kolumny leżą na
 * jednej płycie, rozjaśnianej w prawo, a wiersze rozdziela włos linii: widać
 * jedną tabelę, a nie trzy listy obok siebie.
 */

import { Akapit, Ciemna, Naglowek, Wejscie, Zrodlo } from "./czesci";
import { Znacznik } from "./Scena";
import { porownanie } from "@/lib/health/tresc";

const PLYTA_CECHA = "bg-[#0b0c11]";
const PLYTA_BEZ = "bg-[#11131a]";
const PLYTA_ICAROS = "bg-[#1a1d27]";

/** Włos linii między wierszami. Nie rysuje się nad pierwszym wierszem. */
const LINIA = "md:border-t md:border-white/[0.06]";

export default function Porownanie() {
  const tabela = (
    <div className="md:overflow-hidden md:rounded-lg">
      {/* Nagłówek zestawienia. Na wąskim ekranie znika, bo tam każdy wiersz
          i tak nazywa obie strony. */}
      <div className="hidden grid-cols-12 md:grid">
        <p className={`col-span-3 px-6 pb-4 pt-5 text-[14px] font-semibold text-h-ink-soft ${PLYTA_CECHA}`}>
          Cecha
        </p>
        <p className={`col-span-4 px-6 pb-4 pt-5 text-[14px] font-semibold text-h-ink-soft ${PLYTA_BEZ}`}>
          Bez sprzętu
        </p>
        <p className={`col-span-5 px-7 pb-4 pt-5 text-[14px] font-semibold text-h-accent ${PLYTA_ICAROS}`}>
          Na ICAROS Health
        </p>
      </div>

      <dl>
        {porownanie.map((wiersz) => (
          <div
            key={wiersz.cecha}
            className="mb-3 grid grid-cols-1 overflow-hidden rounded-lg md:mb-0 md:grid-cols-12 md:items-stretch md:rounded-none"
          >
            <dt
              className={`px-6 pb-2 pt-6 text-[14px] font-semibold leading-[1.45] text-h-ink md:col-span-3 md:py-7 md:text-[14px] md:font-medium md:text-h-ink-soft ${PLYTA_CECHA} ${LINIA}`}
            >
              {wiersz.cecha}
            </dt>
            <dd
              className={`px-6 py-4 text-[16px] leading-[1.5] text-h-ink-soft md:col-span-4 md:py-7 ${PLYTA_BEZ} ${LINIA}`}
            >
              <span className="md:hidden">Bez sprzętu: </span>
              {wiersz.bez}
            </dd>
            <dd
              className={`px-6 py-5 md:col-span-5 md:px-7 md:py-7 ${PLYTA_ICAROS} ${LINIA}`}
            >
              <span className="text-[17px] leading-[1.5] text-h-ink">
                <span className="md:hidden">ICAROS: </span>
                {wiersz.icaros}
              </span>
              {wiersz.zrodlo ? <Zrodlo tekst={wiersz.zrodlo} /> : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );

  return (
    <Ciemna id="porownanie" swiatlo="prawo" powierzchnia="void">
      <Znacznik wartosc={0.06} />

      <div className="mx-auto max-w-[1320px]">
        <Wejscie>
          <Naglowek className="max-w-[20ch]">Co zmienia trening na ICAROS Health</Naglowek>
          <Akapit className="mt-6 max-w-[62ch]">
            Stabilność tułowia ćwiczy się też bez sprzętu, w&nbsp;podporze na
            przedramionach. ICAROS nie zastępuje tego ćwiczenia, tylko zmienia
            warunki, w&nbsp;jakich pacjent je wykonuje, i&nbsp;to, ile z&nbsp;niego
            zostaje.
          </Akapit>
        </Wejscie>

        <Wejscie opoznienie={0.1}>
          <div className="mt-[clamp(2.5rem,5vw,4rem)]">
            {/* Na telefonie zestawienie jest długie i bez wstępu nie wiadomo,
                po co się je przewija, więc chowa się za przyciskiem. Zwykły
                <details>, czyli działa też bez skryptu. Na dużym ekranie
                tabela stoi otwarta, bez przycisku. */}
            <details className="group lg:hidden">
              <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-6 rounded-lg bg-h-night px-6 py-4 text-[17px] font-semibold text-h-ink outline-none transition-colors duration-200 hover:text-h-accent focus-visible:ring-2 focus-visible:ring-h-accent focus-visible:ring-offset-4 focus-visible:ring-offset-h-void [&::-webkit-details-marker]:hidden">
                Zobacz porównanie
                <span aria-hidden className="relative block h-4 w-4 shrink-0 text-h-accent">
                  <span className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 bg-current" />
                  <span className="absolute left-1/2 top-0 h-4 w-[2px] -translate-x-1/2 bg-current transition-transform duration-200 group-open:rotate-90 group-open:opacity-0" />
                </span>
              </summary>
              <div className="mt-6">{tabela}</div>
            </details>

            <div className="hidden lg:block">{tabela}</div>
          </div>
        </Wejscie>
      </div>
    </Ciemna>
  );
}
