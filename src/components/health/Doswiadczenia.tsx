"use client";

/**
 * Trasy i gry z katalogu aplikacji ICAROS. Nazwy są oficjalne (icaros.com),
 * a widoki ilustracyjne: pokazują miejsce, nad którym leci pacjent, nie zrzut
 * ekranu z oprogramowania.
 *
 * Lista steruje dużym kadrem. To ta sama mechanika co w przebiegu sesji, więc
 * czytelnik zna ją już z wcześniejszej sekcji.
 */

import { useRef, useState } from "react";
import Image from "next/image";
import { Akapit, Ciemna, Naglowek, Podpowiedz, Wejscie } from "./czesci";
import { Znacznik } from "./Scena";
import { doswiadczenia } from "@/lib/health/tresc";

export default function Doswiadczenia() {
  const [aktywne, ustawAktywne] = useState(0);
  const pozycjeRef = useRef<Array<HTMLButtonElement | null>>([]);
  const wybrane = doswiadczenia[aktywne];

  const klawisz = (zdarzenie: React.KeyboardEvent) => {
    const ruch =
      zdarzenie.key === "ArrowDown" || zdarzenie.key === "ArrowRight"
        ? 1
        : zdarzenie.key === "ArrowUp" || zdarzenie.key === "ArrowLeft"
          ? -1
          : 0;
    if (ruch === 0) return;
    zdarzenie.preventDefault();
    const nastepne = (aktywne + ruch + doswiadczenia.length) % doswiadczenia.length;
    ustawAktywne(nastepne);
    pozycjeRef.current[nastepne]?.focus();
  };

  return (
    <Ciemna id="trasy" swiatlo="lewo" powierzchnia="deep">
      <Znacznik wartosc={0.78} />

      <div className="mx-auto max-w-[1320px]">
        <Wejscie>
          <Naglowek className="max-w-[16ch]">Trasy i gry</Naglowek>
          <Akapit className="mt-6">
            Oprogramowanie obejmuje loty nad prawdziwym terenem, zwiedzanie miast
            i&nbsp;tryby zadaniowe. Pacjent wybiera trasę, terapeuta poziom trudności.
          </Akapit>
        </Wejscie>

        <div className="mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-12">
          <Wejscie opoznienie={0.06} className="lg:col-span-4">
            <Podpowiedz>
            <ul role="tablist" aria-label="Trasy i gry" onKeyDown={klawisz}>
              {doswiadczenia.map((pozycja, indeks) => (
                <li key={pozycja.nazwa}>
                  <button
                    ref={(element) => {
                      pozycjeRef.current[indeks] = element;
                    }}
                    role="tab"
                    type="button"
                    aria-selected={indeks === aktywne}
                    tabIndex={indeks === aktywne ? 0 : -1}
                    onClick={() => ustawAktywne(indeks)}
                    onMouseEnter={() => ustawAktywne(indeks)}
                    className={`flex min-h-[52px] w-full flex-col items-start gap-0.5 py-2 text-left outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-h-accent focus-visible:ring-offset-4 focus-visible:ring-offset-h-void ${
                      indeks === aktywne ? "text-h-accent" : "text-h-ink hover:text-h-accent"
                    }`}
                  >
                    <span className="text-[clamp(1.1rem,1.8vw,1.5rem)] font-semibold tracking-[-0.02em]">
                      {pozycja.nazwa}
                    </span>
                    <span className="text-[14px] text-h-ink-soft">{pozycja.miejsce}</span>
                  </button>
                </li>
              ))}
            </ul>
            </Podpowiedz>
          </Wejscie>

          <div className="lg:col-span-8">
            <Image
              key={wybrane.obraz}
              src={wybrane.obraz}
              alt={wybrane.obrazAlt}
              width={1800}
              height={1013}
              sizes="(max-width: 1024px) 100vw, 64vw"
              className="aspect-[16/9] w-full animate-[fade-up_0.45s_ease-out] bg-h-night object-cover"
            />
            <p
              role="tabpanel"
              aria-live="polite"
              className="mt-5 max-w-[56ch] text-pretty text-[17px] leading-[1.6] text-h-ink"
            >
              {wybrane.opis}
            </p>
          </div>
        </div>
      </div>
    </Ciemna>
  );
}
