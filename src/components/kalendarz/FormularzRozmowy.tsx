"use client";

import { useState } from "react";
import { ArrowRight, CalendarCheck, Loader2 } from "lucide-react";
import ConsentFields from "@/components/ConsentFields";
import { AKCENT_TEKST, TOKENY, type MotywKalendarza } from "@/components/kalendarz/motyw";
import { useSpamGuard } from "@/hooks/useSpamGuard";
import { trackMetaEvent } from "@/lib/meta/track";
import { trackEvent } from "@/lib/analytics/track";
import { odczytajUtm } from "@/lib/analytics/utm";
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
  // UTM z adresu, a gdy go nie ma, z początku wizyty (np. wejście z reklamy na /health).
  const { utm, wejscie } = odczytajUtm();
  const strona = window.location.pathname;
  return {
    strona: wejscie && wejscie !== strona ? `${strona} (wejście: ${wejscie})` : strona,
    zrodlo: parametry.get("zrodlo") || undefined,
    utm,
  };
}

const POLE =
  "w-full px-4 py-3.5 text-[14.5px] outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-inset";

function Etykieta({
  dla,
  slaby,
  children,
  opcjonalne = false,
}: {
  dla: string;
  slaby: string;
  children: React.ReactNode;
  opcjonalne?: boolean;
}) {
  return (
    <label className="mb-2 flex items-baseline gap-2" htmlFor={dla}>
      <span className={`text-[13px] font-medium ${slaby}`}>{children}</span>
      {opcjonalne ? <span className={`text-[11px] ${slaby}`}>opcjonalnie</span> : null}
    </label>
  );
}

export default function FormularzRozmowy({
  termin,
  dlugoscMin,
  motyw = "ciemny",
  wariant = "business",
  wybranaOsoba,
  onZmienTermin,
  onSukces,
  onZajety,
}: {
  termin: string;
  dlugoscMin: number;
  motyw?: MotywKalendarza;
  /** Strefa pacjenta nie pyta o placówkę. */
  wariant?: "patient" | "business";
  wybranaOsoba?: string;
  onZmienTermin: () => void;
  onSukces: (wynik: WynikRezerwacji) => void;
  onZajety: () => void;
}) {
  const t = TOKENY[motyw];
  const biznes = wariant === "business";
  const akcentTekst = AKCENT_TEKST[motyw];
  const pole = `${POLE} ${t.pole}`;
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

      // Osobne zdarzenie dla rezerwacji, żeby w Meta nie mieszało się
      // z zapisem na newsletter (ten dalej wysyła CompleteRegistration).
      trackMetaEvent("Schedule", {
        email: dane.email.trim() || undefined,
        phone: dane.telefon.trim() || undefined,
      });
      trackEvent("booking_complete", { page: window.location.pathname });

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

      <div className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 py-4 ${t.poswiata}`}>
        <div className="flex items-center gap-3">
          <CalendarCheck className={`h-[18px] w-[18px] shrink-0 ${akcentTekst}`} strokeWidth={1.75} />
          <span className={`text-[15px] font-semibold tracking-[-0.01em] ${t.mocny}`}>
            {etykietaPelna(new Date(termin))}
          </span>
        </div>
        <button
          type="button"
          onClick={onZmienTermin}
          className={`text-[12.5px] font-medium underline underline-offset-[3px] transition-colors duration-300 ${t.slaby} ${t.linkHover}`}
        >
          Zmień termin
        </button>
      </div>

      <h3 className={`mt-8 text-[16px] font-semibold tracking-[-0.015em] ${t.mocny}`}>
        Dane do rozmowy
      </h3>

      <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
        <div>
          <Etykieta dla="rozmowa-imie" slaby={t.slaby}>Imię i nazwisko</Etykieta>
          <input
            id="rozmowa-imie"
            className={pole}
            value={dane.imie}
            onChange={ustaw("imie")}
            required
            autoComplete="name"
            placeholder="Jan Kowalski…"
          />
        </div>

        <div>
          <Etykieta dla="rozmowa-telefon" slaby={t.slaby}>Numer, na który zadzwonimy</Etykieta>
          <input
            id="rozmowa-telefon"
            className={pole}
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
          <Etykieta dla="rozmowa-email" slaby={t.slaby} opcjonalne>
            E-mail
          </Etykieta>
          <input
            id="rozmowa-email"
            className={pole}
            value={dane.email}
            onChange={ustaw("email")}
            type="email"
            autoComplete="email"
            spellCheck={false}
            placeholder="jan.kowalski@placowka.pl…"
          />
          <p className={`mt-2 text-[13px] ${t.slaby}`}>Wyślemy potwierdzenie i przypomnienie</p>
        </div>

        {biznes ? (
          <div>
            <Etykieta dla="rozmowa-firma" slaby={t.slaby} opcjonalne>
              Placówka lub firma
            </Etykieta>
            <input
              id="rozmowa-firma"
              className={pole}
              value={dane.firma}
              onChange={ustaw("firma")}
              autoComplete="organization"
              placeholder="Centrum Rehabilitacji Kraków…"
            />
          </div>
        ) : null}

        <div className="sm:col-span-2">
          <Etykieta dla="rozmowa-temat" slaby={t.slaby} opcjonalne>
            O czym porozmawiać
          </Etykieta>
          <textarea
            id="rozmowa-temat"
            className={`${pole} min-h-[88px] resize-y`}
            value={dane.temat}
            onChange={ustaw("temat")}
            placeholder={
              biznes
                ? "Interesuje mnie ICAROS Cloud do oddziału neurologii…"
                : "Szukam miejsca, w którym mogę spróbować treningu…"
            }
          />
        </div>
      </div>

      <ConsentFields
        tone={t.zgody}
        className="mt-6"
        dataConsent={zgodaDanych}
        onDataConsentChange={setZgodaDanych}
        marketingConsent={zgodaMarketingowa}
        onMarketingConsentChange={setZgodaMarketingowa}
        dataConsentText="Wyrażam zgodę na kontakt telefoniczny i przetwarzanie podanych danych."
      />

      <div aria-live="polite">
        {blad ? (
          <p className={`mt-5 px-4 py-3 text-[13px] ${t.blad}`}>
            {blad}
          </p>
        ) : null}
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          disabled={wysylanie}
          aria-busy={wysylanie}
          className={`group inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 px-8 text-[15px] font-semibold tracking-[0.01em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${t.akcent}`}
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
        <p className={`text-[13px] ${t.slaby}`}>
          Rozmowa trwa {dlugoscMin} minut, nic nie trzeba instalować
        </p>
      </div>
    </form>
  );
}
