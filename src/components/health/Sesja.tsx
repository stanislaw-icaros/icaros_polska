"use client";

/**
 * Przebieg sesji. Cztery kroki, które czytelnik przełącza sam: zmienia się
 * opis, zdjęcie i trzy parametry obok. To nie jest ozdoba, tylko najkrótszy
 * sposób pokazania, co dokładnie dzieje się przy urządzeniu.
 *
 * Kroki to zwykłe zakładki (role="tablist"), więc działają z klawiatury
 * i czyta je czytnik ekranu.
 */

import { useRef, useState } from "react";
import Image from "next/image";
import PanelTerapeuty from "./PanelTerapeuty";
import { Akapit, Ciemna, Naglowek, Podpowiedz, Wejscie } from "./czesci";
import { Znacznik } from "./Scena";
import { sesja } from "@/lib/health/tresc";

export default function Sesja() {
  const [aktywny, ustawAktywny] = useState(0);
  const zakladkiRef = useRef<Array<HTMLButtonElement | null>>([]);
  const krok = sesja[aktywny];

  const klawisz = (zdarzenie: React.KeyboardEvent) => {
    const ruch =
      zdarzenie.key === "ArrowRight" || zdarzenie.key === "ArrowDown"
        ? 1
        : zdarzenie.key === "ArrowLeft" || zdarzenie.key === "ArrowUp"
          ? -1
          : 0;
    if (ruch === 0) return;
    zdarzenie.preventDefault();
    const nastepny = (aktywny + ruch + sesja.length) % sesja.length;
    ustawAktywny(nastepny);
    zakladkiRef.current[nastepny]?.focus();
  };

  return (
    <Ciemna id="sesja" swiatlo="gora" powierzchnia="void">
      <Znacznik wartosc={0.18} />

      <div className="mx-auto max-w-[1320px]">
        <Wejscie>
          <Naglowek className="max-w-[16ch]">Przebieg sesji</Naglowek>
          <Akapit className="mt-6">
            Sesja trwa od kilku do kilkunastu minut i prowadzi ją terapeuta
            z&nbsp;tabletu. Poniżej jej cztery etapy.
          </Akapit>
        </Wejscie>

        <Wejscie opoznienie={0.06}>
          <Podpowiedz className="mt-[clamp(2.5rem,5vw,4rem)] block lg:inline-block">
          <div
            role="tablist"
            aria-label="Etapy sesji"
            onKeyDown={klawisz}
            className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-wrap lg:gap-x-10 lg:gap-y-2 lg:overflow-visible lg:px-0"
          >
            {sesja.map((pozycja, indeks) => (
              <button
                key={pozycja.nazwa}
                ref={(element) => {
                  zakladkiRef.current[indeks] = element;
                }}
                role="tab"
                type="button"
                aria-selected={indeks === aktywny}
                tabIndex={indeks === aktywny ? 0 : -1}
                onClick={() => ustawAktywny(indeks)}
                onMouseEnter={() => ustawAktywny(indeks)}
                className={`relative min-h-[44px] shrink-0 rounded-full px-3.5 text-[15px] font-semibold tracking-[-0.02em] outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-h-accent focus-visible:ring-offset-4 focus-visible:ring-offset-h-void lg:rounded-none lg:px-0 lg:text-[clamp(1.1rem,1.8vw,1.5rem)] ${
                  indeks === aktywny
                    ? "bg-h-accent text-h-void lg:bg-transparent lg:text-h-accent"
                    : "bg-h-ink/10 text-h-ink hover:text-h-accent lg:bg-transparent"
                }`}
              >
                {pozycja.nazwa}
              </button>
            ))}
          </div>
          </Podpowiedz>
        </Wejscie>

        <div className="mt-[clamp(2rem,4vw,3.25rem)] grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-12 lg:gap-y-10">
          <div className="order-2 lg:order-none lg:col-span-5 lg:col-start-1 lg:row-start-1">
            <p
              role="tabpanel"
              aria-live="polite"
              className="max-w-[46ch] text-pretty text-[17px] leading-[1.68] text-h-ink"
            >
              {krok.opis}
            </p>

            <dl className="mt-9 space-y-4">
              {krok.parametry.map((parametr) => (
                <div
                  key={parametr.etykieta}
                  className="grid grid-cols-1 gap-1 sm:grid-cols-[10rem_1fr] sm:gap-6"
                >
                  <dt className="text-[14px] font-semibold text-h-ink-soft">
                    {parametr.etykieta}
                  </dt>
                  <dd className="text-[17px] leading-[1.5] text-h-ink [font-variant-numeric:tabular-nums]">
                    {parametr.wartosc}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="order-1 lg:order-none lg:col-span-7 lg:col-start-6 lg:row-start-1">
            {krok.panel ? (
              <PanelTerapeuty />
            ) : (
              <Image
                key={krok.obraz}
                src={krok.obraz}
                alt={krok.obrazAlt}
                width={1286}
                height={804}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="aspect-[16/10] w-full animate-[fade-up_0.45s_ease-out] bg-h-night object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </Ciemna>
  );
}
