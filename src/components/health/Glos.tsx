"use client";

/**
 * Głos pacjentki. Sandra jest bohaterką katalogu ICAROS 2026, nie filmu:
 * film opowiada o Walterze. To rozdzielenie jest celowe, żeby strona i nagranie
 * nie mówiły tego samego.
 *
 * Wcześniej był tu sam tekst na czerni i sekcja wyglądała na pustą. Teraz cytat
 * leży na pełnym kadrze trasy, nad którą pacjent lata podczas sesji, bo o tym
 * właśnie mówi zdanie Sandry.
 *
 * Nagłówek zostaje w strukturze, ale go nie widać: nad cytatem czytałby się
 * jako mała etykieta, a cytat ma tu być pierwszy.
 */

import Image from "next/image";
import { Cytat, STYK_DOL, STYK_GORA, Wejscie } from "./czesci";
import { Znacznik } from "./Scena";
import { glosy } from "@/lib/health/tresc";

/** Zasłona pod tekstem. Kadr jest jasny, cytat musi się na nim obronić. */
const ZASLONA =
  "pointer-events-none absolute inset-0 bg-[linear-gradient(95deg,rgba(7,7,10,0.95)_0%,rgba(7,7,10,0.8)_44%,rgba(7,7,10,0.35)_100%)]"; // taste-skill-ignore: scrim nad zdjęciem

export default function Glos() {
  return (
    <section
      id="opinia"
      className="relative z-10 isolate flex min-h-[88svh] items-center overflow-hidden bg-[#07070a] px-5 py-[clamp(5rem,11vw,9.5rem)] sm:px-8 lg:pl-32 lg:pr-32"
    >
      <Znacznik wartosc={0.2} />

      <Image
        src="/health/vr-engadyna.webp"
        alt="Widok z lotu nad doliną w Engadynie, jedna z tras w aplikacji ICAROS"
        fill
        sizes="100vw"
        className="-z-10 object-cover brightness-[0.62]"
      />
      <div aria-hidden className={ZASLONA} />
      <div aria-hidden className={STYK_GORA} />
      <div aria-hidden className={STYK_DOL} />

      <div className="relative mx-auto w-full max-w-[1320px]">
        <h2 className="sr-only">Opinia pacjentki</h2>

        <Wejscie>
          <Cytat
            cytat={glosy.pacjentka.cytat}
            autor={glosy.pacjentka.autor}
            rola={glosy.pacjentka.rola}
            zrodlo={glosy.pacjentka.zrodlo}
          />
        </Wejscie>
      </div>
    </section>
  );
}
