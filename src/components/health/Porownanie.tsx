"use client";

/**
 * To samo ćwiczenie, inne warunki.
 *
 * Sekcja przeszła cztery przebudowy. Najpierw była tu scenka o pięciu minutach
 * na macie, po której nie było wiadomo, o co chodzi. Potem zestawienie
 * „z matą", które stawiało urządzenie za sto tysięcy obok maty za kilkanaście
 * złotych i brzmiało dziwnie. Potem trzy kolumny na jednej płycie, rozdzielone
 * włosem linii, których i tak nikt nie przeczytał.
 *
 * Czwarta przebudowa, po uwagach z 5 listopada 2026, zaczyna od pytania, czym
 * ta sekcja w ogóle jest. Nie jest o wynikach: wszystkie trzy twarde liczby,
 * które tu stały, mają niżej własne sekcje („efekty treningu", „zaangażowanie")
 * i są tam podane wielkim stopniem przez `Licznik`. Jest o warunkach, w jakich
 * pacjent wykonuje jedno konkretne ćwiczenie.
 *
 * Stąd układ. Strona ICAROS leży na białej płycie, która wychodzi ponad resztę
 * zestawienia: na czarnym tle nie da się jej przeoczyć ani pomylić stron, także
 * w ósmym wierszu, kiedy nagłówek kolumn dawno zjechał z ekranu. Wiersze
 * rozdziela krok tonu, nie linia; włos linii na tym kontraście był niewidoczny.
 * Na telefonie zestawienie nie chowa się już za przyciskiem, tylko stoi otwarte
 * wierszami, a każdy wiersz nazywa obie strony sam z siebie.
 */

import { Akapit, Ciemna, Naglowek, Wejscie, Zrodlo } from "./czesci";
import { Znacznik } from "./Scena";
import { porownanie } from "@/lib/health/tresc";

const BEZ = "Bez sprzętu";
/** Twarda spacja, żeby nazwa marki nie łamała się na dwie linie. */
const NA_ICAROS = "Na ICAROS Health";

/** Kolumna ICAROS zajmuje pięć z dwunastu łamów, więc płyta pod nią tyle samo. */
const SZEROKOSC_PLYTY = "41.6667%";

export default function Porownanie() {
  return (
    <Ciemna id="porownanie" swiatlo="prawo" powierzchnia="void">
      <Znacznik wartosc={0.06} />

      <div className="mx-auto max-w-[1320px]">
        <Wejscie>
          <Naglowek className="max-w-[20ch]">To samo ćwiczenie, inne warunki</Naglowek>
          <Akapit className="mt-6 max-w-[62ch]">
            Stabilność tułowia ćwiczy się też bez sprzętu, w&nbsp;podporze na
            przedramionach. ICAROS nie zastępuje tego ćwiczenia, tylko zmienia
            warunki, w&nbsp;jakich pacjent je wykonuje, i&nbsp;to, ile z&nbsp;niego
            zostaje.
          </Akapit>
        </Wejscie>

        <Wejscie opoznienie={0.1}>
          {/* Górne wcięcie to miejsce, o które biała płyta wystaje ponad
              zestawienie. Bez niego nie widać, że jedna strona jest tą, o którą
              chodzi. */}
          <div className="relative mt-[clamp(2rem,4vw,3.25rem)] lg:pt-8">
            {/* Dwa pola stykające się bez szczeliny. Ciemne zaczyna się niżej,
                więc białe widać ponad nim i wiadomo, które jest tym jednym. */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 top-8 hidden rounded-lg bg-h-deep lg:block"
            />
            <div
              aria-hidden
              className="absolute bottom-0 right-0 top-0 hidden rounded-lg bg-h-paper lg:block"
              style={{ width: SZEROKOSC_PLYTY }}
            />

            <div className="relative">
              {/* Nazwy stron. Na telefonie znikają, bo tam nazywa je każdy
                  wiersz osobno. */}
              <div className="hidden grid-cols-12 lg:grid">
                <p className="col-span-3" />
                <p className="col-span-4 px-6 pb-6 text-[15px] text-h-ink-soft">{BEZ}</p>
                <p className="col-span-5 px-8 pb-6 text-[15px] font-semibold text-h-dark">
                  {NA_ICAROS}
                </p>
              </div>

              <dl>
                {porownanie.map((wiersz, i) => {
                  // Co drugi wiersz o krok ciemniejszy, żeby oko przeszło w bok
                  // przez całą szerokość. Pierwszy wiersz tak, ostatni nie:
                  // dzięki temu dolne rogi białej płyty zostają czyste.
                  const krok = i % 2 === 0;
                  return (
                    <div
                      key={wiersz.cecha}
                      className="mb-4 overflow-hidden rounded-lg lg:mb-0 lg:grid lg:grid-cols-12 lg:items-stretch lg:overflow-visible lg:rounded-none"
                    >
                      <dt
                        className={`bg-h-deep px-5 pb-3 pt-5 text-[15px] font-semibold leading-[1.4] text-h-ink lg:col-span-3 lg:bg-transparent lg:px-7 lg:py-8 lg:text-[14px] lg:font-normal lg:text-h-ink-soft ${
                          krok ? "lg:bg-white/[0.03]" : ""
                        }`}
                      >
                        {wiersz.cecha}
                      </dt>

                      <dd
                        className={`bg-h-deep px-5 pb-6 text-[16px] leading-[1.5] text-h-ink-soft lg:col-span-4 lg:px-6 lg:py-8 lg:text-[17px] ${
                          krok ? "lg:bg-white/[0.03]" : "lg:bg-transparent"
                        }`}
                      >
                        <span className="mb-1 block text-[13px] text-h-ink-soft lg:sr-only">
                          {BEZ}
                        </span>
                        {wiersz.bez}
                      </dd>

                      <dd
                        className={`bg-h-paper px-5 py-5 lg:col-span-5 lg:px-8 lg:py-8 ${
                          krok ? "lg:bg-black/[0.04]" : "lg:bg-transparent"
                        }`}
                      >
                        <span className="mb-1 block text-[13px] font-semibold text-h-dark lg:sr-only">
                          {NA_ICAROS}
                        </span>
                        <span className="text-pretty text-[clamp(1.0625rem,1.5vw,1.3125rem)] font-medium leading-[1.4] tracking-[-0.015em] text-h-dark">
                          {wiersz.icaros}
                        </span>
                        {wiersz.zrodlo ? <Zrodlo tekst={wiersz.zrodlo} jasno /> : null}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>
        </Wejscie>
      </div>
    </Ciemna>
  );
}
