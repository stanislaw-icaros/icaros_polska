"use client";

/**
 * Co zmienia trening na urządzeniu.
 *
 * Sekcja przeszła dwie przebudowy. Najpierw była tu scenka o pięciu minutach
 * na macie, po której nie było wiadomo, o co chodzi. Potem zestawienie
 * „z matą", które stawiało urządzenie za sto tysięcy obok maty za kilkanaście
 * złotych i brzmiało dziwnie. Teraz punktem odniesienia jest samo ćwiczenie:
 * podpór na przedramionach, czyli standardowy sposób trenowania stabilności
 * tułowia bez sprzętu. Porównujemy warunki, w jakich pacjent je wykonuje,
 * i to, co z tego wychodzi.
 *
 * Trzy kolumny mają trzy role i są pokazane trzema różnymi sposobami. Pierwsza
 * nazywa cechę, więc jest mała i przygaszona jak podpis. Druga i trzecia to
 * dwie zestawiane strony, więc każda leży na własnej płycie; płyta ICAROS jest
 * jaśniejsza, bo to ona jest tematem strony.
 */

import { Akapit, Ciemna, Naglowek, Wejscie, Zrodlo } from "./czesci";
import { Znacznik } from "./Scena";
import { porownanie } from "@/lib/health/tresc";

const PLYTA_BEZ = "bg-[#0e1016]";
const PLYTA_ICAROS = "bg-[#1a1d27]";

export default function Porownanie() {
  const ostatni = porownanie.length - 1;

  const tabela = (
    <>
          {/* Nagłówek zestawienia. Na wąskim ekranie znika, bo tam każdy
              wiersz i tak nazywa obie strony. */}
          <div className="hidden grid-cols-12 gap-x-6 md:grid">
            <p className="col-span-3 pb-4 text-[13px] text-h-ink-soft">Cecha</p>
            <p
              className={`col-span-4 rounded-t-lg px-6 pb-4 pt-5 text-[14px] font-semibold text-h-ink-soft ${PLYTA_BEZ}`}
            >
              Bez sprzętu
            </p>
            <p
              className={`col-span-5 rounded-t-lg px-7 pb-4 pt-5 text-[14px] font-semibold text-h-accent ${PLYTA_ICAROS}`}
            >
              Na ICAROS Health
            </p>
          </div>

          <dl>
            {porownanie.map((wiersz, indeks) => {
              const pierwszy = indeks === 0 ? "rounded-t-lg md:rounded-t-none" : "";
              const koncowy = indeks === ostatni ? "rounded-b-lg" : "";
              return (
                <div
                  key={wiersz.cecha}
                  className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-12 md:items-start"
                >
                  <dt className="pt-6 text-[13px] leading-[1.45] text-h-ink-soft md:col-span-3 md:py-7">
                    {wiersz.cecha}
                  </dt>
                  <dd
                    className={`px-6 py-5 text-[16px] leading-[1.5] text-h-ink-soft md:col-span-4 md:py-7 ${PLYTA_BEZ} ${pierwszy} ${koncowy}`}
                  >
                    <span className="md:hidden">Bez sprzętu: </span>
                    {wiersz.bez}
                  </dd>
                  <dd
                    className={`px-6 py-5 md:col-span-5 md:px-7 md:py-7 ${PLYTA_ICAROS} ${pierwszy} ${koncowy}`}
                  >
                    <span className="text-[17px] leading-[1.5] text-h-ink">
                      <span className="md:hidden">ICAROS: </span>
                      {wiersz.icaros}
                    </span>
                    {wiersz.zrodlo ? <Zrodlo tekst={wiersz.zrodlo} /> : null}
                  </dd>
                </div>
              );
            })}
          </dl>
    </>
  );

  return (
    <Ciemna id="porownanie" swiatlo="prawo" powierzchnia="void">
      <Znacznik wartosc={0.06} />

      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-12">
          <Wejscie className="lg:col-span-5">
            <Naglowek className="max-w-[16ch]">Co zmienia trening na ICAROS</Naglowek>
          </Wejscie>
          <Wejscie opoznienie={0.06} className="lg:col-span-6 lg:col-start-7">
            <Akapit>
              Stabilność tułowia ćwiczy się też bez sprzętu, w&nbsp;podporze na
              przedramionach. ICAROS nie zastępuje tego ćwiczenia, tylko zmienia
              warunki, w&nbsp;jakich pacjent je wykonuje, i&nbsp;to, ile z&nbsp;niego
              zostaje.
            </Akapit>
          </Wejscie>
        </div>

        <Wejscie opoznienie={0.1}>
          <div className="mt-[clamp(3rem,6vw,5rem)]">
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
