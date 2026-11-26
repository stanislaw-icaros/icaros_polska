"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { zl } from "@/lib/cloud/tresc";

export type TrybCeny = "netto" | "brutto";

type Stan = { tryb: TrybCeny; ustawTryb: (tryb: TrybCeny) => void };

const Kontekst = createContext<Stan>({ tryb: "netto", ustawTryb: () => {} });

/**
 * Jeden przełącznik netto/brutto dla całej strony.
 *
 * Większość fizjoterapeutów jest zwolniona z VAT i płaci kwotę brutto, a studia
 * i siłownie liczą netto. Kto raz przełączy, widzi swoją kwotę w doku, przy
 * pakiecie, w kalkulatorze i na przycisku formularza.
 */
export function TrybProvider({ children }: { children: React.ReactNode }) {
  const [tryb, ustawTryb] = useState<TrybCeny>("netto");
  const stan = useMemo(() => ({ tryb, ustawTryb }), [tryb]);
  return <Kontekst.Provider value={stan}>{children}</Kontekst.Provider>;
}

export function useTryb() {
  return useContext(Kontekst);
}

export function PrzelacznikTrybu({ etykieta = "Cena" }: { etykieta?: string }) {
  const { tryb, ustawTryb } = useTryb();
  return (
    <div className="cl-tryb" role="group" aria-label={etykieta}>
      {(["netto", "brutto"] as const).map((opcja) => (
        <button
          key={opcja}
          type="button"
          aria-pressed={tryb === opcja}
          onClick={() => ustawTryb(opcja)}
        >
          {opcja === "netto" ? "Netto" : "Brutto"}
        </button>
      ))}
    </div>
  );
}

/** Kwota w aktualnym trybie, bez dopisku. */
export function Kwota({ netto, brutto }: { netto: number; brutto: number }) {
  const { tryb } = useTryb();
  return <>{zl(tryb === "netto" ? netto : brutto)}</>;
}

/** Słowo „netto" albo „brutto" w aktualnym trybie. */
export function NazwaTrybu() {
  const { tryb } = useTryb();
  return <>{tryb}</>;
}

/** Druga kwota, czyli ta, której akurat nie widać w dużym stopniu pisma. */
export function KwotaDruga({ netto, brutto }: { netto: number; brutto: number }) {
  const { tryb } = useTryb();
  return (
    <>
      {zl(tryb === "netto" ? brutto : netto)} {tryb === "netto" ? "brutto" : "netto"}
    </>
  );
}
