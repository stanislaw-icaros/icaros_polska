"use client";

/**
 * Film. Pas przez całą szerokość strony.
 *
 * Trzy rzeczy, które tu naprawiono po testach: przycisk odtwarzania jest teraz
 * dużym, wyśrodkowanym elementem (poprzedni ginął w rogu), po kliknięciu widać
 * stan ładowania do momentu, aż odtwarzacz zgłosi gotowość (wcześniej przez
 * kilka sekund nie działo się nic), a odtwarzacz dostaje podpowiedź jakości.
 *
 * YouTube wczytuje się dopiero po kliknięciu, więc przed decyzją użytkownika
 * nic się do niego nie łączy i nic go nie śledzi.
 */

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";
import { Naglowek, Wejscie } from "./czesci";
import { Znacznik } from "./Scena";
import { FILM_DLUGOSC, FILM_TYTUL, FILM_YOUTUBE_ID } from "@/lib/health/tresc";

/** Przyciemnienie dolnej części kadru, pod podpisem. */
const ZASLONA =
  "pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(7,7,10,0.88)_0%,rgba(7,7,10,0.3)_45%,rgba(7,7,10,0.5)_100%)]"; // taste-skill-ignore: neutralny scrim nad zdjęciem

export default function Film() {
  const [gra, ustawGra] = useState(false);
  const [gotowy, ustawGotowy] = useState(false);
  const mniejRuchu = useReducedMotion();

  return (
    <section id="film" className="relative z-10 bg-h-void text-h-ink">
      <Znacznik wartosc={0.7} />

      <div className="px-5 pb-[clamp(2.5rem,5vw,4rem)] pt-[clamp(5rem,11vw,9.5rem)] sm:px-8 lg:pl-32 lg:pr-32">
        <Wejscie>
          <Naglowek className="max-w-[18ch]">Film</Naglowek>
          <p className="mt-6 max-w-[52ch] text-pretty text-[17px] leading-[1.68] text-h-ink">
            Wolisz oglądać? Zobacz, jak wygląda ICAROS na filmie.
          </p>
        </Wejscie>
      </div>

      <div className="relative aspect-[16/10] w-full overflow-hidden bg-h-void sm:aspect-[16/9] lg:aspect-auto lg:h-[88svh]">
        {gra ? (
          <>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${FILM_YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1&vq=hd1080`}
              title={FILM_TYTUL}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => ustawGotowy(true)}
              className="absolute inset-0 h-full w-full"
            />
            {/* Dopóki odtwarzacz nie zgłosi gotowości, widać, że coś się dzieje. */}
            {!gotowy ? (
              <div
                role="status"
                className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5 bg-h-void"
              >
                <span
                  aria-hidden
                  className="block h-9 w-9 animate-spin rounded-full border-2 border-h-ink/25 border-t-h-accent motion-reduce:animate-none"
                />
                <span className="text-[15px] text-h-ink-soft">Wczytywanie filmu</span>
              </div>
            ) : null}
          </>
        ) : (
          <>
            {mniejRuchu ? (
              <div
                aria-hidden
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url(/health/film-poster.webp)" }}
              />
            ) : (
              <video
                src="/health/film-petla.mp4"
                poster="/health/film-poster.webp"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div aria-hidden className={ZASLONA} />

            {/* Duży, wyśrodkowany przycisk. Poprzedni, mały i w rogu, ginął. */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={() => ustawGra(true)}
                className="group flex flex-col items-center gap-5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-h-accent focus-visible:ring-offset-8 focus-visible:ring-offset-h-void"
              >
                <span className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-h-accent text-h-void transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 lg:h-[112px] lg:w-[112px]">
                  <Play
                    aria-hidden
                    className="h-8 w-8 translate-x-[3px] fill-current lg:h-10 lg:w-10"
                    strokeWidth={0}
                  />
                </span>
                <span className="text-[16px] font-semibold text-h-ink">
                  Odtwórz film
                </span>
              </button>
            </div>

            <div className="absolute inset-x-0 bottom-0 px-5 pb-8 sm:px-8 lg:pb-10 lg:pl-32 lg:pr-32">
              <p className="text-[clamp(1.45rem,2.8vw,2.15rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-h-ink">
                {FILM_TYTUL}
              </p>
              <p className="mt-2 text-[14px] text-h-ink-soft">{FILM_DLUGOSC}</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
