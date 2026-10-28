"use client";

/**
 * Akt 1. Otwarcie. Nad tłem (klatki z filmu plus przewijany film) stoi sam
 * tekst. Warstwy jadą z różną prędkością: tło jest przypięte do ekranu,
 * nagłówek wyjeżdża szybciej niż strona, a przyciemnienie u dołu gęstnieje.
 * To stąd bierze się głębia, nie z cienia pod napisem.
 */

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Akcja } from "./czesci";
import { Znacznik } from "./Scena";

/** Zasłona pod tekstem otwarcia: pas u dołu, a od 1024 px róg przy lewej krawędzi. */
const ZASLONA =
  "pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(7,7,10,0.92)_0%,rgba(7,7,10,0.72)_38%,transparent_72%)] lg:bg-[linear-gradient(72deg,rgba(7,7,10,0.94)_0%,rgba(7,7,10,0.74)_34%,transparent_66%)]"; // taste-skill-ignore: neutralny scrim nad zdjęciem, jedyny dopuszczony wyjątek

export default function Horyzont() {
  const sekcjaRef = useRef<HTMLElement | null>(null);
  const mniejRuchu = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sekcjaRef,
    offset: ["start start", "end start"],
  });

  const tekstY = useTransform(scrollYProgress, [0, 1], ["0%", mniejRuchu ? "0%" : "-42%"]);
  const tekstOpacity = useTransform(scrollYProgress, [0, 0.62, 0.85], [1, 1, 0]);
  const zaslona = useTransform(scrollYProgress, [0, 1], [0, 0.45]);

  return (
    <section ref={sekcjaRef} className="relative z-0 h-[185svh]">
      <Znacznik wartosc={0} />

      <div className="sticky top-0 flex h-svh flex-col justify-end overflow-hidden">
        {/* Warstwa przednia: zagęszcza się dopiero przy wyjeździe z sekcji. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-h-void"
          style={{ opacity: zaslona }}
        />

        <div aria-hidden className={ZASLONA} />

        <motion.div
          className="relative z-10 px-5 pb-24 sm:px-8 lg:pb-28 lg:pl-32 lg:pr-32"
          style={{ y: tekstY, opacity: tekstOpacity }}
        >
          {/* Ktoś tu trafia z reklamy i chce najpierw wiedzieć, co ogląda.
              Nazwa, potem jednym zdaniem czym to jest, dopiero potem reszta. */}
          <h1 className="text-[clamp(2.6rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-h-ink">
            ICAROS Circle
          </h1>

          <p className="mt-3 max-w-[22ch] text-balance text-[clamp(1.4rem,3vw,2.25rem)] font-medium leading-[1.1] tracking-[-0.03em] text-h-ink-soft">
            Nowoczesne technologie VR w&nbsp;rehabilitacji
          </p>

          <p className="mt-8 max-w-[50ch] text-pretty text-[17px] leading-[1.6] text-h-ink">
            System czterech urządzeń do&nbsp;rehabilitacji ruchowej. ICAROS
            Health to jedno z&nbsp;nich: wyrób medyczny klasy I do&nbsp;treningu
            stabilności tułowia i&nbsp;równowagi. Pacjent leży w&nbsp;podporze
            i&nbsp;steruje lotem, przechylając ciało.
          </p>

          <Akcja className="mt-9" />
        </motion.div>
      </div>

      {/* Dolna krawędź sekcji: tutaj horyzont stoi już wysoko. */}
      <div className="absolute inset-x-0 bottom-[14svh]">
        <Znacznik wartosc={0.8} />
      </div>
    </section>
  );
}
