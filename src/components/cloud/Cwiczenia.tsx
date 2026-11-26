"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CWICZENIA } from "@/lib/cloud/tresc";

const CO_ILE_MS = 4200;

/**
 * Ćwiczenia: lista pozycji po lewej, jedno duże ujęcie po prawej.
 *
 * Wybór pozycji podmienia zdjęcie. Dopóki nikt nie wybierze, pozycje zmieniają
 * się same co kilka sekund, a pasek pod aktywną pokazuje, ile zostało do
 * następnej. Pierwsze najechanie, kliknięcie albo fokus zatrzymuje to na stałe.
 * Przy wyłączonych animacjach nic nie przełącza się samo.
 */
export default function Cwiczenia() {
  const [aktywne, ustawAktywne] = useState(0);
  const [samo, ustawSamo] = useState(false);
  const sekcja = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sekcja.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let zatrzymane = false;
    const stop = () => {
      zatrzymane = true;
      ustawSamo(false);
    };

    const obserwator = new IntersectionObserver(
      ([wpis]) => {
        if (!zatrzymane) ustawSamo(wpis.isIntersecting);
      },
      { threshold: 0.35 }
    );
    obserwator.observe(el);

    const lista = el.querySelector(".cl-cw__lista");
    lista?.addEventListener("pointerenter", stop, { once: true });
    lista?.addEventListener("focusin", stop, { once: true });
    lista?.addEventListener("click", stop, { once: true });

    return () => {
      obserwator.disconnect();
      lista?.removeEventListener("pointerenter", stop);
      lista?.removeEventListener("focusin", stop);
      lista?.removeEventListener("click", stop);
    };
  }, []);

  useEffect(() => {
    if (!samo) return;
    const zegar = window.setTimeout(
      () => ustawAktywne((i) => (i + 1) % CWICZENIA.pozycje.length),
      CO_ILE_MS
    );
    return () => window.clearTimeout(zegar);
  }, [samo, aktywne]);

  return (
    <section className="cl-sek" aria-labelledby="cl-cwiczenia" ref={sekcja}>
      <div className="cl-w cl-cw">
        <div className="cl-cw__tekst">
          <h2 className="cl-h2" id="cl-cwiczenia">
            {CWICZENIA.naglowek}
          </h2>
          <p className="cl-lead">{CWICZENIA.tekst}</p>

          <ul className="cl-cw__lista" data-samo={samo} style={{ "--cl-cw-czas": `${CO_ILE_MS}ms` } as React.CSSProperties}>
            {CWICZENIA.pozycje.map((pozycja, i) => (
              <li key={pozycja.src}>
                <button
                  type="button"
                  aria-pressed={i === aktywne}
                  onClick={() => ustawAktywne(i)}
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") ustawAktywne(i);
                  }}
                >
                  {pozycja.nazwa}
                </button>
              </li>
            ))}
          </ul>
          <p className="cl-maly cl-cw__przypis">{CWICZENIA.przypis}</p>
        </div>

        <div className="cl-cw__scena">
          {CWICZENIA.pozycje.map((pozycja, i) => (
            <Image
              key={pozycja.src}
              src={pozycja.src}
              alt={pozycja.alt}
              width={pozycja.szer}
              height={pozycja.wys}
              sizes="(max-width: 900px) 100vw, 56vw"
              data-aktywne={i === aktywne}
              aria-hidden={i !== aktywne}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
