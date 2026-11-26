"use client";

import { useId, useState } from "react";
import { PrzelacznikTrybu, useTryb } from "@/components/cloud/Tryb";
import { CENY, KALKULATOR, zl } from "@/lib/cloud/tresc";

function odmien(liczba: number, jeden: string, kilka: string, wiele: string) {
  const dziesiatki = liczba % 100;
  const jednosci = liczba % 10;
  if (liczba === 1) return jeden;
  if (jednosci >= 2 && jednosci <= 4 && (dziesiatki < 12 || dziesiatki > 14)) return kilka;
  return wiele;
}

function Suwak({
  ustawienia,
  wartosc,
  zmien,
  pokaz,
}: {
  ustawienia: { etykieta: string; min: number; max: number; krok: number };
  wartosc: number;
  zmien: (wartosc: number) => void;
  pokaz: string;
}) {
  const id = useId();
  const wypelnienie = ((wartosc - ustawienia.min) / (ustawienia.max - ustawienia.min)) * 100;
  return (
    <div className="cl-suwak">
      <div className="cl-suwak__glowa">
        <label htmlFor={id}>{ustawienia.etykieta}</label>
        <output htmlFor={id}>{pokaz}</output>
      </div>
      <input
        id={id}
        type="range"
        min={ustawienia.min}
        max={ustawienia.max}
        step={ustawienia.krok}
        value={wartosc}
        onChange={(e) => zmien(Number(e.target.value))}
        aria-valuetext={pokaz}
        style={{ "--wyp": `${wypelnienie}%` } as React.CSSProperties}
      />
    </div>
  );
}

/**
 * Po ilu sesjach pakiet się zwraca. Prosty rachunek: cena pakietu podzielona
 * przez cenę sesji, zaokrąglona w górę. Nie udaje biznesplanu.
 */
export default function Kalkulator() {
  const { tryb } = useTryb();
  const [cenaSesji, ustawCeneSesji] = useState<number>(KALKULATOR.cenaSesji.start);
  const [sesjeTydzien, ustawSesje] = useState<number>(KALKULATOR.sesjeTydzien.start);

  const cenaPakietu = tryb === "netto" ? CENY.pakietNetto : CENY.pakietBrutto;
  const sesje = Math.ceil(cenaPakietu / cenaSesji);
  const tygodnie = Math.ceil(sesje / sesjeTydzien);

  return (
    <section className="cl-kalk" aria-labelledby="cl-kalkulator">
      <div className="cl-w">
        <h2 className="cl-h2" id="cl-kalkulator">
          {KALKULATOR.naglowek}
        </h2>

        <div className="cl-kalk__uklad">
          <div>
            <Suwak
              ustawienia={KALKULATOR.cenaSesji}
              wartosc={cenaSesji}
              zmien={ustawCeneSesji}
              pokaz={zl(cenaSesji)}
            />
            <Suwak
              ustawienia={KALKULATOR.sesjeTydzien}
              wartosc={sesjeTydzien}
              zmien={ustawSesje}
              pokaz={String(sesjeTydzien)}
            />
            <div className="cl-kalk__tryb">
              <span>
                Cena pakietu: {zl(cenaPakietu)} {tryb}
              </span>
              <PrzelacznikTrybu etykieta="Licz od ceny netto albo brutto" />
            </div>
          </div>

          <p className="cl-kalk__wynik" aria-live="polite">
            <span className="cl-kalk__liczba">
              {sesje}
              <small>{odmien(sesje, "sesja", "sesje", "sesji")}</small>
            </span>
            <span className="cl-kalk__opis" style={{ display: "block" }}>
              <span>Przy {sesjeTydzien} {odmien(sesjeTydzien, "sesji", "sesjach", "sesjach")} w tygodniu to</span>{" "}
              {tygodnie} {odmien(tygodnie, "tydzień", "tygodnie", "tygodni")}.
            </span>
          </p>
        </div>

        <p className="cl-maly cl-kalk__uwaga">{KALKULATOR.uwaga}</p>
      </div>
    </section>
  );
}
