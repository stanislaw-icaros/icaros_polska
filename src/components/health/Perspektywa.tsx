"use client";

/**
 * Widok pacjenta. Dwa stany tego samego momentu sesji: sala i lot.
 *
 * Zdanie wprowadzające opisuje zjawisko, a nie układ strony. Wcześniej tłumaczyło
 * czytelnikowi, co ma gdzie patrzeć, zamiast powiedzieć, o co w tym chodzi.
 *
 * Wcześniej zmieniało się to przeciąganiem pomarańczowej linii. Linia myliła:
 * wyglądała jak ozdoba, a napisy Sala i Lot wyglądały jak przyciski, którymi
 * nie były, więc kliknięcie przesuwało linię zamiast przełączyć widok. Teraz
 * widok zmienia przewijanie, a obok stoją dwa zwykłe przyciski. Są delikatnie
 * podświetlone, żeby było widać, że da się w nie kliknąć.
 */

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Naglowek, Przelacznik, Wejscie } from "./czesci";
import { Znacznik, useScena } from "./Scena";

/** Zasłona pod tekstem, po tej stronie, po której tekst stoi. */
const ZASLONA =
  "pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(7,7,10,0.93)_0%,rgba(7,7,10,0.62)_38%,transparent_72%)] lg:bg-[linear-gradient(72deg,rgba(7,7,10,0.94)_0%,rgba(7,7,10,0.7)_34%,transparent_64%)]"; // taste-skill-ignore: neutralny scrim nad zdjęciem

/** Dwa stany tego samego momentu sesji. Po jednym zdaniu, nie po liście:
 *  zmiana ma być widoczna od razu, a nie do wyłowienia z trzech punktów. */
const STANY = {
  sala: {
    nazwa: "Sala",
    zdanie: "Pacjent leży w podporze. Pracują mięśnie głębokie i tułów.",
  },
  lot: {
    nazwa: "Lot",
    zdanie: "Pacjent widzi Dolomity. Kierunek nadaje praca tułowia.",
  },
} as const;

export default function Perspektywa() {
  const { horyzont, recznie, ustawRecznie } = useScena();
  const sekcjaRef = useRef<HTMLElement | null>(null);
  const [wLocie, ustawWLocie] = useState(false);
  const mniejRuchu = useReducedMotion();

  useMotionValueEvent(horyzont, "change", (v) => {
    const nowy = v >= 0.5;
    ustawWLocie((poprzedni) => (poprzedni === nowy ? poprzedni : nowy));
  });

  // Animacja przejścia po kliknięciu. Kiedy scena oddaje sterowanie scrollowi,
  // trzeba ją zatrzymać, inaczej obie strony pisałyby po tej samej wartości.
  const przejscieRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    if (!recznie) {
      przejscieRef.current?.stop();
      przejscieRef.current = null;
    }
  }, [recznie]);

  useEffect(() => () => przejscieRef.current?.stop(), []);

  const przelacz = (naLot: boolean) => {
    ustawRecznie(true);
    const cel = naLot ? 1 : 0;
    if (mniejRuchu) {
      horyzont.set(cel);
      return;
    }
    przejscieRef.current?.stop();
    przejscieRef.current = animate(horyzont, cel, {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    });
  };

  const { scrollYProgress } = useScroll({
    target: sekcjaRef,
    offset: ["start start", "end start"],
  });
  const zanik = useTransform(scrollYProgress, [0, 0.74, 0.9], [1, 1, 0]);
  const widocznosc = useTransform(zanik, (v) => (v < 0.02 ? "hidden" : "visible"));

  const stan = wLocie ? STANY.lot : STANY.sala;

  return (
    <section ref={sekcjaRef} id="widok-pacjenta" className="relative z-0 h-[230svh]">
      <Znacznik wartosc={0.22} />

      <div className="sticky top-0 h-svh overflow-hidden">
        <div aria-hidden className={ZASLONA} />

        <motion.div
          className="relative z-20 flex h-full flex-col justify-end px-5 pb-20 sm:px-8 lg:pb-24 lg:pl-32 lg:pr-32"
          style={{ opacity: zanik, visibility: widocznosc }}
        >
          <Wejscie>
            <Naglowek className="max-w-[14ch]">Widok pacjenta</Naglowek>
          </Wejscie>

          <div className="mt-6 grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-12">
            <p className="max-w-[40ch] text-pretty text-[clamp(1.15rem,2vw,1.6rem)] font-medium leading-[1.3] tracking-[-0.02em] text-h-ink lg:col-span-6">
              Pacjent ćwiczy w&nbsp;gabinecie i&nbsp;w&nbsp;tym samym czasie
              przenosi się do wirtualnej rzeczywistości.
            </p>

            <div className="lg:col-span-5 lg:col-start-8">
              <Przelacznik
                etykieta="Widok"
                pozycje={[
                  { klucz: "sala", nazwa: STANY.sala.nazwa },
                  { klucz: "lot", nazwa: STANY.lot.nazwa },
                ]}
                aktywny={wLocie ? "lot" : "sala"}
                naZmiane={(klucz) => przelacz(klucz === "lot")}
              />

              <div className="relative mt-6 min-h-[4.5rem]" aria-live="polite">
                <AnimatePresence initial={false} mode="wait">
                  <motion.p
                    key={stan.nazwa}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                    className="max-w-[34ch] text-pretty text-[clamp(1.1rem,1.8vw,1.5rem)] font-medium leading-[1.35] tracking-[-0.02em] text-h-ink"
                  >
                    {stan.zdanie}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
