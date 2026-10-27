"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarX, Loader2 } from "lucide-react";
import { COMPANY_EMAIL } from "@/lib/legal";

/**
 * Odwołanie terminu z linku w mailu. Potwierdzenie jest świadomym kliknięciem,
 * żeby skaner linków w skrzynce pocztowej nie odwołał rozmowy za klienta.
 */
export default function OdwolanieTerminu({
  bilet,
  etykietaTerminu,
  imieHandlowca,
  minelo,
}: {
  bilet: { b: string; t: string } | null;
  etykietaTerminu: string | null;
  imieHandlowca?: string;
  minelo: boolean;
}) {
  const [stan, setStan] = useState<"gotowy" | "wysylanie" | "odwolane">("gotowy");
  const [blad, setBlad] = useState("");

  async function odwolaj() {
    if (!bilet || stan === "wysylanie") return;
    setStan("wysylanie");
    setBlad("");

    try {
      const odpowiedz = await fetch("/api/kalendarz/odwolaj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bilet),
      });
      const dane = (await odpowiedz.json()) as { success?: boolean; error?: string };
      if (dane.success) {
        setStan("odwolane");
        return;
      }
      setBlad(dane.error || "Nie udało się odwołać terminu.");
      setStan("gotowy");
    } catch {
      setBlad("Brak połączenia z serwerem. Spróbuj jeszcze raz.");
      setStan("gotowy");
    }
  }

  if (!bilet || !etykietaTerminu) {
    return (
      <Oprawa naglowek="Ten link jest nieprawidłowy">
        <p className="tekst">
          Nie rozpoznajemy tego odnośnika. Jeśli chcesz odwołać rozmowę, napisz na{" "}
          <a
            href={`mailto:${COMPANY_EMAIL}`}
            className="font-medium text-brand-orange underline underline-offset-2"
          >
            {COMPANY_EMAIL}
          </a>
          .
        </p>
      </Oprawa>
    );
  }

  if (minelo) {
    return (
      <Oprawa naglowek="Ta rozmowa już się odbyła">
        <p className="tekst">
          Termin {etykietaTerminu} jest przeszłością, nie ma czego odwoływać. Nowy termin można
          wybrać w kalendarzu.
        </p>
        <Przycisk />
      </Oprawa>
    );
  }

  if (stan === "odwolane") {
    return (
      <Oprawa naglowek="Termin został odwołany">
        <p className="tekst">
          Nikt nie zadzwoni {etykietaTerminu}. Godzina wróciła do kalendarza i można wybrać inną.
        </p>
        <Przycisk />
      </Oprawa>
    );
  }

  return (
    <Oprawa naglowek="Odwołać ten termin?">
      <div className="mt-6 border border-foreground/[0.08] bg-surface p-6">
        <p className="text-[16px] font-semibold text-foreground">{etykietaTerminu}</p>
        {imieHandlowca ? (
          <p className="mt-1 text-[13px] text-foreground/55">Rozmowę ma prowadzić {imieHandlowca}</p>
        ) : null}
      </div>

      {blad ? (
        <p className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          {blad}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={odwolaj}
          disabled={stan === "wysylanie"}
          className="inline-flex items-center gap-2 bg-foreground px-6 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-orange disabled:opacity-60"
        >
          {stan === "wysylanie" ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
          ) : (
            <CalendarX className="h-4 w-4" strokeWidth={1.75} />
          )}
          Tak, odwołaj termin
        </button>
        <Link
          href="/kalendarz"
          className="inline-flex items-center gap-2 border border-foreground/[0.12] px-6 py-3.5 text-[14px] font-semibold text-foreground transition-colors hover:border-foreground/30"
        >
          Zostaw termin i wróć
        </Link>
      </div>
    </Oprawa>
  );
}

function Oprawa({ naglowek, children }: { naglowek: string; children: React.ReactNode }) {
  return (
    <div className="animate-[fade-up_0.6s_ease-out_both]">
      <h1 className="text-[clamp(1.6rem,3.6vw,2.4rem)] font-bold leading-[1.1] tracking-[-0.03em] text-foreground">
        {naglowek}
      </h1>
      <div className="[&_.tekst]:mt-4 [&_.tekst]:text-[15px] [&_.tekst]:leading-[1.75] [&_.tekst]:text-foreground/60">
        {children}
      </div>
    </div>
  );
}

function Przycisk() {
  return (
    <Link
      href="/kalendarz"
      className="mt-7 inline-flex items-center gap-2 bg-foreground px-7 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-orange"
    >
      Wybierz nowy termin
    </Link>
  );
}
