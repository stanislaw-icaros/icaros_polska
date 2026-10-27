"use client";

import { useState } from "react";
import { ArrowRight, CalendarCheck, Loader2 } from "lucide-react";
import ConsentFields from "@/components/ConsentFields";
import { useSpamGuard } from "@/hooks/useSpamGuard";
import { trackMetaEvent } from "@/lib/meta/track";
import { etykietaPelna } from "@/lib/kalendarz/formaty";

/**
 * Dane potrzebne do rozmowy telefonicznej: imię i numer są wymagane,
 * resztę podaje się tylko wtedy, kiedy ma to sens. Formularz sam wysyła
 * zgłoszenie i oddaje wynik komponentowi kalendarza.
 */

export type WynikRezerwacji = {
  start: string;
  osoba: { imie: string; pelneImie: string };
  dlugoscMin: number;
  linkOdwolania?: string;
  email?: string;
};

function parametryZrodla() {
  if (typeof window === "undefined") return { strona: undefined, zrodlo: undefined, utm: {} };
  const parametry = new URLSearchParams(window.location.search);
  return {
    strona: window.location.pathname,
    zrodlo: parametry.get("zrodlo") || undefined,
    utm: {
      utm_source: parametry.get("utm_source") || undefined,
      utm_medium: parametry.get("utm_medium") || undefined,
      utm_campaign: parametry.get("utm_campaign") || undefined,
      utm_content: parametry.get("utm_content") || undefined,
    },
  };
}

const POLE =
  "w-full bg-foreground/[0.035] px-4 py-3.5 text-[14.5px] text-foreground outline-none transition-colors duration-300 placeholder:text-foreground/30 focus:bg-foreground/[0.06] focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-0";

function Etykieta({
  dla,
  children,
  opcjonalne = false,
}: {
  dla: string;
  children: React.ReactNode;
  opcjonalne?: boolean;
}) {
  return (
    <label className="mb-2 flex items-baseline gap-2" htmlFor={dla}>
      <span className="text-[12.5px] font-medium text-foreground/55">{children}</span>
      {opcjonalne ? <span className="text-[11px] text-foreground/30">opcjonalnie</span> : null}
    </label>
  );
}

export default function FormularzRozmowy({
  termin,
  dlugoscMin,
  wybranaOsoba,
  onZmienTermin,
  onSukces,
  onZajety,
}: {
  termin: string;
  dlugoscMin: number;
  wybranaOsoba?: string;
  onZmienTermin: () => void;
  onSukces: (wynik: WynikRezerwacji) => void;
  onZajety: () => void;
}) {
  const { spamFields, getSpamSignals } = useSpamGuard();
  const [dane, setDane] = useState({
    imie: "",
    telefon: "",
    email: "",
    firma: "",
    temat: "",
  });
  const [zgodaDanych, setZgodaDanych] = useState(false);
  const [zgodaMarketingowa, setZgodaMarketingowa] = useState(false);
  const [wysylanie, setWysylanie] = useState(false);
  const [blad, setBlad] = useState("");

  const ustaw = (pole: keyof typeof dane) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setDane((poprzednie) => ({ ...poprzednie, [pole]: event.target.value }));

  async function wyslij(event: React.FormEvent) {
    event.preventDefault();
    if (wysylanie) return;

    if (!zgodaDanych) {
      setBlad("Potrzebujemy zgody na kontakt, żeby zadzwonić.");
      return;
    }

    setWysylanie(true);
    setBlad("");

    try {
      const zrodlo = parametryZrodla();
      const odpowiedz = await fetch("/api/kalendarz/rezerwacja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: termin,
          osoba: wybranaOsoba,
          imie: dane.imie.trim(),
          telefon: dane.telefon.trim(),
          email: dane.email.trim() || undefined,
          firma: dane.firma.trim() || undefined,
          temat: dane.temat.trim() || undefined,
          zgodaDanych,
          zgodaMarketingowa,
          ...zrodlo,
          ...getSpamSignals(),
        }),
      });

      const wynik = (await odpowiedz.json()) as {
        success?: boolean;
        error?: string;
        zajety?: boolean;
        start?: string;
        osoba?: { imie: string; pelneImie: string };
        dlugoscMin?: number;
        linkOdwolania?: string;
      };

      if (odpowiedz.status === 409 || wynik.zajety) {
        onZajety();
        return;
      }

      if (!odpowiedz.ok || !wynik.success) {
        setBlad(wynik.error || "Nie udało się zapisać terminu. Spróbuj jeszcze raz.");
        return;
      }

      trackMetaEvent("CompleteRegistration", {
        email: dane.email.trim() || undefined,
        phone: dane.telefon.trim() || undefined,
      });

      onSukces({
        start: wynik.start || termin,
        osoba: wynik.osoba || { imie: "", pelneImie: "" },
        dlugoscMin: wynik.dlugoscMin || dlugoscMin,
        linkOdwolania: wynik.linkOdwolania,
        email: dane.email.trim() || undefined,
      });
    } catch {
      setBlad("Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie.");
    } finally {
      setWysylanie(false);
    }
  }

  return (
    <form onSubmit={wyslij} className="animate-[fade-up_0.45s_ease-out_both]">
      {spamFields}

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 bg-brand-orange/[0.07] px-5 py-4">
        <div className="flex items-center gap-3">
          <CalendarCheck className="h-[18px] w-[18px] shrink-0 text-brand-orange" strokeWidth={1.75} />
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">
            {etykietaPelna(new Date(termin))}
          </span>
        </div>
        <button
          type="button"
          onClick={onZmienTermin}
          className="text-[12.5px] font-medium text-foreground/50 underline underline-offset-[3px] transition-colors duration-300 hover:text-brand-orange"
        >
          Zmień termin
        </button>
      </div>

      <h3 className="mt-8 text-[16px] font-semibold tracking-[-0.015em] text-foreground">
        Dane do rozmowy
      </h3>

      <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
        <div>
          <Etykieta dla="rozmowa-imie">Imię i nazwisko</Etykieta>
          <input
            id="rozmowa-imie"
            className={POLE}
            value={dane.imie}
            onChange={ustaw("imie")}
            required
            autoComplete="name"
            placeholder="Jan Kowalski…"
          />
        </div>

        <div>
          <Etykieta dla="rozmowa-telefon">Numer, na który zadzwonimy</Etykieta>
          <input
            id="rozmowa-telefon"
            className={POLE}
            value={dane.telefon}
            onChange={ustaw("telefon")}
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="600 100 200…"
          />
        </div>

        <div>
          <Etykieta dla="rozmowa-email" opcjonalne>
            E-mail
          </Etykieta>
          <input
            id="rozmowa-email"
            className={POLE}
            value={dane.email}
            onChange={ustaw("email")}
            type="email"
            autoComplete="email"
            spellCheck={false}
            placeholder="jan.kowalski@placowka.pl…"
          />
          <p className="mt-2 text-[11.5px] text-foreground/35">
            Wyślemy potwierdzenie i przypomnienie
          </p>
        </div>

        <div>
          <Etykieta dla="rozmowa-firma" opcjonalne>
            Placówka lub firma
          </Etykieta>
          <input
            id="rozmowa-firma"
            className={POLE}
            value={dane.firma}
            onChange={ustaw("firma")}
            autoComplete="organization"
            placeholder="Centrum Rehabilitacji Kraków…"
          />
        </div>

        <div className="sm:col-span-2">
          <Etykieta dla="rozmowa-temat" opcjonalne>
            O czym porozmawiać
          </Etykieta>
          <textarea
            id="rozmowa-temat"
            className={`${POLE} min-h-[88px] resize-y`}
            value={dane.temat}
            onChange={ustaw("temat")}
            placeholder="Interesuje mnie ICAROS Cloud do oddziału neurologii…"
          />
        </div>
      </div>

      <ConsentFields
        tone="light"
        className="mt-6"
        dataConsent={zgodaDanych}
        onDataConsentChange={setZgodaDanych}
        marketingConsent={zgodaMarketingowa}
        onMarketingConsentChange={setZgodaMarketingowa}
        dataConsentText="Wyrażam zgodę na kontakt telefoniczny i przetwarzanie podanych danych."
      />

      <div aria-live="polite">
        {blad ? (
          <p className="mt-5 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {blad}
          </p>
        ) : null}
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          disabled={wysylanie}
          aria-busy={wysylanie}
          className="group inline-flex w-full items-center justify-center gap-2.5 bg-foreground px-8 py-4 text-[14.5px] font-semibold text-white transition-colors duration-300 hover:bg-brand-orange disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          Potwierdź termin
          {wysylanie ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
          ) : (
            <ArrowRight
              className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
              strokeWidth={2}
            />
          )}
        </button>
        <p className="text-[12px] text-foreground/40">
          Rozmowa trwa {dlugoscMin} minut, nic nie trzeba instalować
        </p>
      </div>
    </form>
  );
}
