"use client";

/**
 * Brama z potwierdzeniem statusu profesjonalisty.
 *
 * Stoi przed całą domeną i przed pytaniem o pliki cookie: to dwie osobne
 * sprawy, więc i dwa osobne komunikaty. Treść strony jest schowana (robi to
 * skrypt z `layout.tsx` razem z regułą w globals.css), dopóki ktoś nie
 * potwierdzi statusu. Okna nie da się zamknąć, ominąć klawiaturą ani przewinąć
 * strony pod spodem.
 *
 * „Nie jestem profesjonalistą" nie wpuszcza na stronę. Zostaje wyjaśnienie,
 * telefon i mail, oraz powrót do pytania dla kogoś, kto kliknął przez pomyłkę.
 * Potwierdzenie pamiętamy pół roku i obowiązuje na całej domenie, więc po nim
 * przejście ze strefy pacjenta do strefy biznes niczego już nie pyta.
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { COMPANY_EMAIL, COMPANY_PHONE, COMPANY_PHONE_HREF } from "@/lib/legal";
import {
  czyPotwierdzony,
  czyPozaBrama,
  zapiszPotwierdzenie,
  czyHostPozaBrama,
} from "@/lib/profesjonalista";

const PRZYCISK =
  "inline-flex min-h-[52px] items-center justify-center gap-2 px-7 text-[15px] font-semibold outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-white";
const GLOWNY = `${PRZYCISK} text-white hover:opacity-90`;
const DRUGI = `${PRZYCISK} border border-foreground/20 text-foreground hover:bg-foreground/[0.04]`;

export default function BramaProfesjonalisty() {
  const [otwarta, ustawOtwarta] = useState(false);
  const [wyjasnienie, ustawWyjasnienie] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const mniejRuchu = useReducedMotion();
  const sciezka = usePathname();
  const pozaBrama = czyPozaBrama(sciezka ?? "/");

  // Treść strony jest już schowana przez skrypt z layoutu, więc brama nie musi
  // czekać: stawiamy ją w pierwszej wolnej klatce po wejściu. Na ścieżkach
  // poza bramą (landing ICAROS Cloud, patrz src/lib/profesjonalista.ts) nie
  // pytamy w ogóle.
  useEffect(() => {
    if (pozaBrama || czyHostPozaBrama(window.location.hostname)) return;
    const klatka = requestAnimationFrame(() => {
      if (!czyPotwierdzony()) ustawOtwarta(true);
    });
    return () => cancelAnimationFrame(klatka);
  }, [pozaBrama]);

  // Dopóki brama stoi, strona pod spodem się nie przewija, a klawiatura
  // zostaje w oknie.
  useEffect(() => {
    if (!otwarta) return;
    const panel = panelRef.current;
    if (!panel) return;

    const poprzedniOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.focus({ preventScroll: true });

    const naKlawisz = (zdarzenie: KeyboardEvent) => {
      if (zdarzenie.key !== "Tab") return;
      const pola = panel.querySelectorAll<HTMLElement>("a[href], button");
      if (pola.length === 0) return;
      const pierwsze = pola[0];
      const ostatnie = pola[pola.length - 1];
      if (zdarzenie.shiftKey && document.activeElement === pierwsze) {
        zdarzenie.preventDefault();
        ostatnie.focus();
      } else if (!zdarzenie.shiftKey && document.activeElement === ostatnie) {
        zdarzenie.preventDefault();
        pierwsze.focus();
      }
    };

    document.addEventListener("keydown", naKlawisz);
    return () => {
      document.removeEventListener("keydown", naKlawisz);
      document.body.style.overflow = poprzedniOverflow;
    };
  }, [otwarta, wyjasnienie]);

  function potwierdz() {
    zapiszPotwierdzenie();
    ustawOtwarta(false);
  }

  return (
    <AnimatePresence>
      {otwarta ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[140] flex items-center justify-center overflow-y-auto bg-[#07070a] px-5 py-10"
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="brama-naglowek"
            initial={{ opacity: 0, y: mniejRuchu ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: mniejRuchu ? 0 : 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[720px] bg-white px-7 py-9 text-center outline-none sm:px-12 sm:py-12"
          >
            {!wyjasnienie ? (
              <>
                <h2
                  id="brama-naglowek"
                  className="text-[clamp(1.5rem,3.4vw,2.1rem)] font-bold leading-[1.15] tracking-[-0.03em] text-foreground"
                >
                  Potwierdź status profesjonalisty
                </h2>

                <p className="mx-auto mt-6 max-w-[62ch] text-[14.5px] leading-[1.75] text-foreground/70">
                  Zgodnie z ustawą z 7 kwietnia 2022 r. o wyrobach medycznych ta strona
                  i prezentowane na niej treści są przeznaczone wyłącznie dla
                  profesjonalistów w dziedzinie wyrobów medycznych, czyli
                  w szczególności osób wykonujących zawód medyczny lub prowadzących
                  obrót wyrobami medycznymi oraz ich pracowników i współpracowników.
                  Zawierają bowiem komunikaty reklamowe wyrobów przeznaczonych do
                  używania przez użytkowników innych niż laicy.
                </p>

                <p className="mx-auto mt-4 max-w-[62ch] text-[14.5px] leading-[1.75] text-foreground/70">
                  W razie wątpliwości zadzwoń do nas pod numer{" "}
                  <a
                    href={`tel:${COMPANY_PHONE_HREF}`}
                    className="font-semibold text-foreground underline decoration-foreground/25 underline-offset-4 hover:decoration-foreground"
                  >
                    {COMPANY_PHONE}
                  </a>
                  .
                </p>

                <p className="mt-8 text-[15px] font-semibold text-foreground">
                  Aby przejść na stronę, potwierdź status profesjonalisty:
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={potwierdz}
                    className={GLOWNY}
                    style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
                  >
                    Jestem profesjonalistą
                  </button>
                  <button
                    type="button"
                    onClick={() => ustawWyjasnienie(true)}
                    className={DRUGI}
                  >
                    Nie jestem profesjonalistą
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2
                  id="brama-naglowek"
                  className="text-[clamp(1.35rem,3vw,1.8rem)] font-bold leading-[1.2] tracking-[-0.03em] text-foreground"
                >
                  Przepraszamy za ograniczony dostęp
                </h2>

                <p className="mx-auto mt-6 max-w-[58ch] text-[14.5px] leading-[1.75] text-foreground/70">
                  Treści na tej stronie dotyczą wyrobów medycznych przeznaczonych dla
                  profesjonalistów i nie możemy ich pokazać osobom spoza branży.
                  Jeśli szukasz miejsca, w którym można potrenować na ICAROS, albo masz
                  pytania jako pacjent, zadzwoń pod{" "}
                  <a
                    href={`tel:${COMPANY_PHONE_HREF}`}
                    className="font-semibold text-foreground underline decoration-foreground/25 underline-offset-4 hover:decoration-foreground"
                  >
                    {COMPANY_PHONE}
                  </a>{" "}
                  albo napisz na{" "}
                  <a
                    href={`mailto:${COMPANY_EMAIL}`}
                    className="font-semibold text-foreground underline decoration-foreground/25 underline-offset-4 hover:decoration-foreground"
                  >
                    {COMPANY_EMAIL}
                  </a>
                  . Podpowiemy najbliższą placówkę.
                </p>

                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => ustawWyjasnienie(false)}
                    className={DRUGI}
                  >
                    <ArrowLeft aria-hidden className="h-4 w-4" strokeWidth={2} />
                    Wróć do pytania
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
