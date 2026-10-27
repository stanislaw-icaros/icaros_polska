"use client";

import { useState } from "react";
import { Loader2, Phone } from "lucide-react";
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
  "w-full border border-foreground/[0.12] bg-white px-4 py-3 text-[15px] text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-brand-orange";

const ETYKIETA = "mb-1.5 block text-[12px] font-medium text-foreground/50";

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
    <form onSubmit={wyslij} className="animate-[fade-up_0.5s_ease-out_both]">
      {spamFields}

      <div className="flex flex-wrap items-center justify-between gap-3 border border-brand-orange/25 bg-brand-orange/[0.04] px-5 py-4">
        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 shrink-0 text-brand-orange" strokeWidth={1.75} />
          <span className="text-[15px] font-semibold text-foreground">
            {etykietaPelna(new Date(termin))}
          </span>
        </div>
        <button
          type="button"
          onClick={onZmienTermin}
          className="text-[13px] font-medium text-foreground/50 underline underline-offset-2 transition-colors hover:text-foreground"
        >
          Zmień termin
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={ETYKIETA} htmlFor="rozmowa-imie">
            Imię i nazwisko
          </label>
          <input
            id="rozmowa-imie"
            className={POLE}
            value={dane.imie}
            onChange={ustaw("imie")}
            required
            autoComplete="name"
            placeholder="Jan Kowalski"
          />
        </div>

        <div>
          <label className={ETYKIETA} htmlFor="rozmowa-telefon">
            Numer, na który mamy zadzwonić
          </label>
          <input
            id="rozmowa-telefon"
            className={POLE}
            value={dane.telefon}
            onChange={ustaw("telefon")}
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="600 100 200"
          />
        </div>

        <div>
          <label className={ETYKIETA} htmlFor="rozmowa-email">
            E-mail, żeby wysłać potwierdzenie
          </label>
          <input
            id="rozmowa-email"
            className={POLE}
            value={dane.email}
            onChange={ustaw("email")}
            type="email"
            autoComplete="email"
            placeholder="jan.kowalski@placowka.pl"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={ETYKIETA} htmlFor="rozmowa-firma">
            Placówka lub firma
          </label>
          <input
            id="rozmowa-firma"
            className={POLE}
            value={dane.firma}
            onChange={ustaw("firma")}
            autoComplete="organization"
            placeholder="Centrum Rehabilitacji Kraków"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={ETYKIETA} htmlFor="rozmowa-temat">
            O czym porozmawiać
          </label>
          <textarea
            id="rozmowa-temat"
            className={`${POLE} min-h-[84px] resize-y`}
            value={dane.temat}
            onChange={ustaw("temat")}
            placeholder="Interesuje mnie ICAROS Cloud do oddziału neurologii"
          />
        </div>
      </div>

      <ConsentFields
        tone="light"
        className="mt-5"
        dataConsent={zgodaDanych}
        onDataConsentChange={setZgodaDanych}
        marketingConsent={zgodaMarketingowa}
        onMarketingConsentChange={setZgodaMarketingowa}
        dataConsentText="Wyrażam zgodę na kontakt telefoniczny i przetwarzanie podanych danych."
      />

      {blad ? (
        <p className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          {blad}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={wysylanie}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-foreground px-8 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-brand-orange disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {wysylanie ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
            Zapisujemy termin
          </>
        ) : (
          <>Potwierdź termin</>
        )}
      </button>

      <p className="mt-3 text-[12px] text-foreground/40">
        Rozmowa trwa {dlugoscMin} minut. Nie trzeba zakładać konta ani niczego instalować.
      </p>
    </form>
  );
}
