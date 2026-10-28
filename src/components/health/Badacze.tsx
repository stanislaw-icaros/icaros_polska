"use client";

/**
 * Opinie badaczy. Wcześniej oba cytaty stały w tej samej sekcji co cztery
 * liczby zaangażowania i jedno z drugim się tłoczyło. Tutaj mają własne
 * miejsce: dwa cytaty obok siebie, każdy ze znakiem cudzysłowu nad nim.
 */

import { Ciemna, Cytat, Naglowek, Wejscie } from "./czesci";
import { Znacznik } from "./Scena";
import { glosy } from "@/lib/health/tresc";

export default function Badacze() {
  return (
    <Ciemna id="badacze" swiatlo="lewo" powierzchnia="deep">
      <Znacznik wartosc={0.32} />

      <div className="mx-auto max-w-[1320px]">
        <Wejscie>
          <Naglowek className="max-w-[12ch]">Opinie badaczy</Naglowek>
        </Wejscie>

        <div className="mt-[clamp(3.5rem,8vw,6.5rem)] grid grid-cols-1 gap-x-16 gap-y-[clamp(3.5rem,8vw,6rem)] lg:grid-cols-2">
          <Wejscie>
            <Cytat
              cytat={glosy.badaczka.cytat}
              autor={glosy.badaczka.autor}
              rola={glosy.badaczka.rola}
              zrodlo={glosy.badaczka.zrodlo}
            />
          </Wejscie>
          <Wejscie opoznienie={0.08}>
            <Cytat
              cytat={glosy.lekarz.cytat}
              autor={glosy.lekarz.autor}
              rola={glosy.lekarz.rola}
              zrodlo={glosy.lekarz.zrodlo}
            />
          </Wejscie>
        </div>
      </div>
    </Ciemna>
  );
}
