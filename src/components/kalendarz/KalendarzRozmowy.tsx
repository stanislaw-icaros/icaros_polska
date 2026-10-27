"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  CalendarX,
  Check,
  Clock,
  Loader2,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import FormularzRozmowy, { type WynikRezerwacji } from "@/components/kalendarz/FormularzRozmowy";
import { COMPANY_EMAIL, COMPANY_PHONE, COMPANY_PHONE_HREF } from "@/lib/legal";
import {
  etykietaDnia,
  etykietaGodziny,
  etykietaPelna,
  godzinaLokalna,
  numerDnia,
  skrotDniaTygodnia,
  skrotMiesiaca,
} from "@/lib/kalendarz/formaty";

/**
 * Kalendarz rozmów: wybór dnia, godziny i ewentualnie osoby.
 *
 * Terminy przychodzą już policzone ze serwera, więc strona od razu pokazuje
 * godziny. Lista odświeża się tylko wtedy, kiedy ktoś inny zdąży zająć
 * wybrany termin. Domyślnie widać sumę wolnych godzin obu handlowców.
 */

export type Termin = { start: string; osoby: string[] };
export type Dzien = { data: string; etykieta: string; etykietaKrotka: string; terminy: Termin[] };
export type Handlowiec = { klucz: string; imie: string; rola: string };

export type DaneKalendarza = {
  dni: Dzien[];
  handlowcy: Handlowiec[];
  dlugoscMin: number;
  awaria: boolean;
};

const DOWOLNA = "dowolna";

export default function KalendarzRozmowy({
  poczatkowe,
  osobaZAdresu,
}: {
  poczatkowe: DaneKalendarza;
  osobaZAdresu?: string;
}) {
  const [dane, setDane] = useState<DaneKalendarza>(poczatkowe);
  const [odswiezanie, setOdswiezanie] = useState(false);

  // Wybory trzymamy jako „co kliknął użytkownik”, a to, co widać, wyliczamy
  // z aktualnej listy. Zmiana osoby albo odświeżenie godzin nie wymaga wtedy
  // sprzątania stanu w efektach.
  const [osobaWybrana, setOsobaWybrana] = useState<string | null>(null);
  const [dzienWybrany, setDzienWybrany] = useState<string | null>(null);
  const [terminWybrany, setTerminWybrany] = useState<string | null>(null);
  const [wynik, setWynik] = useState<WynikRezerwacji | null>(null);
  const [komunikat, setKomunikat] = useState("");
  const sekcjaFormularza = useRef<HTMLDivElement>(null);

  const osoba = osobaWybrana ?? osobaZAdresu ?? DOWOLNA;

  const dniWidoczne = useMemo(
    () =>
      dane.dni
        .map((wpis) => ({
          ...wpis,
          terminy:
            osoba === DOWOLNA
              ? wpis.terminy
              : wpis.terminy.filter((element) => element.osoby.includes(osoba)),
        }))
        .filter((wpis) => wpis.terminy.length > 0),
    [dane.dni, osoba]
  );

  const dzien =
    dzienWybrany && dniWidoczne.some((wpis) => wpis.data === dzienWybrany)
      ? dzienWybrany
      : dniWidoczne[0]?.data || "";

  const dzienAktywny = dniWidoczne.find((wpis) => wpis.data === dzien);

  // Wybrana godzina przestaje obowiązywać, gdy zniknie z listy.
  const termin =
    terminWybrany && dzienAktywny?.terminy.some((wpis) => wpis.start === terminWybrany)
      ? terminWybrany
      : null;

  const grupy = useMemo(() => {
    const terminy = dzienAktywny?.terminy || [];
    return [
      {
        nazwa: "Przed południem",
        terminy: terminy.filter((wpis) => godzinaLokalna(new Date(wpis.start)) < 12),
      },
      {
        nazwa: "Po południu",
        terminy: terminy.filter((wpis) => godzinaLokalna(new Date(wpis.start)) >= 12),
      },
    ].filter((grupa) => grupa.terminy.length > 0);
  }, [dzienAktywny]);

  function wybierzTermin(start: string) {
    setTerminWybrany(start);
    setKomunikat("");
    requestAnimationFrame(() => {
      sekcjaFormularza.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  async function odswiez(informacja: string) {
    setTerminWybrany(null);
    setKomunikat(informacja);
    setOdswiezanie(true);
    try {
      const odpowiedz = await fetch("/api/kalendarz/terminy", { cache: "no-store" });
      setDane((await odpowiedz.json()) as DaneKalendarza);
    } catch {
      setKomunikat("Nie udało się odświeżyć listy godzin. Odśwież stronę.");
    } finally {
      setOdswiezanie(false);
    }
  }

  if (wynik) return <Potwierdzenie wynik={wynik} />;

  const brakTerminow = !dane.awaria && dane.dni.length === 0;
  const brakDlaOsoby = !dane.awaria && dane.dni.length > 0 && dniWidoczne.length === 0;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
      <div className="min-w-0">
        {dane.handlowcy.length > 1 && !dane.awaria && !brakTerminow ? (
          <div className="mb-8">
            <p className="mb-3 text-[12px] font-medium text-foreground/50">Z kim rozmawiać</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Wybór osoby">
              {[
                { klucz: DOWOLNA, imie: "Dowolna osoba", rola: "najwięcej terminów" },
                ...dane.handlowcy,
              ].map((element) => {
                const aktywny = osoba === element.klucz;
                return (
                  <button
                    key={element.klucz}
                    type="button"
                    aria-pressed={aktywny}
                    onClick={() => {
                      setOsobaWybrana(element.klucz);
                      setTerminWybrany(null);
                    }}
                    className={`border px-4 py-2.5 text-left transition-colors ${
                      aktywny
                        ? "border-brand-orange bg-brand-orange/[0.06]"
                        : "border-foreground/[0.12] hover:border-foreground/30"
                    }`}
                  >
                    <span className="block text-[14px] font-semibold text-foreground">
                      {element.imie}
                    </span>
                    <span className="block text-[11px] text-foreground/45">{element.rola}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {dane.awaria || brakTerminow ? (
          <div className="border border-foreground/[0.08] bg-surface p-8">
            <h2 className="text-[17px] font-semibold text-foreground">
              {dane.awaria
                ? "Nie możemy teraz pokazać wolnych godzin"
                : "Najbliższe tygodnie są zajęte"}
            </h2>
            <p className="mt-3 max-w-[460px] text-[14px] leading-[1.7] text-foreground/60">
              {dane.awaria
                ? "Kalendarz chwilowo nie odpowiada. Najszybciej dogadamy termin telefonicznie albo mailem, odpowiadamy w jednym dniu roboczym."
                : "W widocznym okresie nie ma już wolnych godzin. Napisz albo zadzwoń, znajdziemy termin poza kalendarzem."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`tel:${COMPANY_PHONE_HREF}`}
                className="inline-flex items-center gap-2 bg-foreground px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-brand-orange"
              >
                <Phone className="h-4 w-4" strokeWidth={1.75} />
                {COMPANY_PHONE}
              </a>
              <a
                href={`mailto:${COMPANY_EMAIL}`}
                className="inline-flex items-center gap-2 border border-foreground/[0.12] px-6 py-3 text-[14px] font-semibold text-foreground transition-colors hover:border-foreground/30"
              >
                <Mail className="h-4 w-4" strokeWidth={1.75} />
                Napisz do nas
              </a>
            </div>
          </div>
        ) : null}

        {brakDlaOsoby ? (
          <div className="border border-foreground/[0.08] bg-surface p-8">
            <h2 className="text-[17px] font-semibold text-foreground">
              Ta osoba nie ma teraz wolnych godzin
            </h2>
            <p className="mt-3 text-[14px] leading-[1.7] text-foreground/60">
              Po wybraniu „Dowolna osoba” pokażą się wszystkie terminy.
            </p>
            <button
              type="button"
              onClick={() => setOsobaWybrana(DOWOLNA)}
              className="mt-5 inline-flex items-center gap-2 bg-foreground px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-brand-orange"
            >
              Pokaż wszystkie terminy
            </button>
          </div>
        ) : null}

        {dniWidoczne.length > 0 ? (
          <>
            <p className="mb-3 text-[12px] font-medium text-foreground/50">Wybierz dzień</p>
            <div
              className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-foreground/15"
              role="group"
              aria-label="Wybór dnia"
            >
              {dniWidoczne.map((wpis) => {
                const data = new Date(`${wpis.data}T12:00:00Z`);
                const aktywny = wpis.data === dzien;
                return (
                  <button
                    key={wpis.data}
                    type="button"
                    aria-pressed={aktywny}
                    onClick={() => {
                      setDzienWybrany(wpis.data);
                      setTerminWybrany(null);
                    }}
                    className={`w-[74px] shrink-0 snap-start border px-2 py-3 text-center transition-colors ${
                      aktywny
                        ? "border-brand-orange bg-brand-orange/[0.06]"
                        : "border-foreground/[0.12] hover:border-foreground/30"
                    }`}
                  >
                    <span className="block text-[11px] text-foreground/45">
                      {skrotDniaTygodnia(data)}
                    </span>
                    <span className="mt-0.5 block text-[21px] font-bold leading-none tracking-[-0.03em] text-foreground">
                      {numerDnia(data)}
                    </span>
                    <span className="mt-1 block text-[11px] text-foreground/45">
                      {skrotMiesiaca(data)}
                    </span>
                    <span className="mt-2 block text-[10px] font-medium text-brand-orange">
                      {wpis.terminy.length} godz.
                    </span>
                  </button>
                );
              })}
            </div>

            {dzienAktywny ? (
              <div className="mt-8">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[15px] font-semibold text-foreground">
                    {etykietaDnia(new Date(`${dzienAktywny.data}T12:00:00Z`))}
                  </p>
                  <p className="flex items-center gap-2 text-[11px] text-foreground/40">
                    {odswiezanie ? (
                      <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} />
                    ) : null}
                    Godziny w czasie polskim, rozmowa trwa {dane.dlugoscMin} minut
                  </p>
                </div>

                {grupy.map((grupa) => (
                  <div key={grupa.nazwa} className="mt-5">
                    <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-foreground/35">
                      {grupa.nazwa}
                    </p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                      {grupa.terminy.map((wpis) => {
                        const aktywny = termin === wpis.start;
                        return (
                          <button
                            key={wpis.start}
                            type="button"
                            aria-pressed={aktywny}
                            onClick={() => wybierzTermin(wpis.start)}
                            className={`border py-3 text-[14px] font-semibold tabular-nums transition-colors ${
                              aktywny
                                ? "border-brand-orange bg-brand-orange text-white"
                                : "border-foreground/[0.12] text-foreground hover:border-brand-orange hover:text-brand-orange"
                            }`}
                          >
                            {etykietaGodziny(new Date(wpis.start))}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {komunikat ? (
              <p className="mt-6 border border-brand-orange/25 bg-brand-orange/[0.05] px-4 py-3 text-[13px] text-foreground/70">
                {komunikat}
              </p>
            ) : null}

            <div ref={sekcjaFormularza} className="mt-10 scroll-mt-28">
              {termin ? (
                <FormularzRozmowy
                  termin={termin}
                  dlugoscMin={dane.dlugoscMin}
                  wybranaOsoba={osoba === DOWOLNA ? undefined : osoba}
                  onZmienTermin={() => setTerminWybrany(null)}
                  onSukces={setWynik}
                  onZajety={() =>
                    odswiez("Ten termin właśnie ktoś zajął. Lista godzin jest już odświeżona.")
                  }
                />
              ) : (
                <p className="border border-dashed border-foreground/[0.14] px-5 py-6 text-[13px] text-foreground/45">
                  Po wybraniu godziny pojawi się tu krótki formularz: imię i numer telefonu.
                </p>
              )}
            </div>
          </>
        ) : null}
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <KartaInformacji dlugoscMin={dane.dlugoscMin} />
      </aside>
    </div>
  );
}

function KartaInformacji({ dlugoscMin }: { dlugoscMin: number }) {
  const punkty = [
    { ikona: Phone, tekst: `Zwykła rozmowa telefoniczna, ${dlugoscMin} minut` },
    { ikona: UserRound, tekst: "Bez zakładania konta i bez logowania" },
    { ikona: Clock, tekst: "Dzwonimy dokładnie w wybranym momencie" },
    { ikona: CalendarX, tekst: "Termin można odwołać jednym kliknięciem" },
  ];

  return (
    <div className="border border-foreground/[0.08] bg-surface p-6">
      <h2 className="text-[15px] font-semibold text-foreground">Jak wygląda rozmowa</h2>
      <ul className="mt-4 space-y-3">
        {punkty.map((punkt) => (
          <li key={punkt.tekst} className="flex gap-3 text-[13px] leading-[1.6] text-foreground/60">
            <punkt.ikona
              className="mt-[2px] h-4 w-4 shrink-0 text-brand-orange"
              strokeWidth={1.75}
            />
            {punkt.tekst}
          </li>
        ))}
      </ul>

      <div className="mt-5 border-t border-foreground/[0.08] pt-5">
        <p className="text-[12px] text-foreground/40">Wolisz od razu napisać albo zadzwonić</p>
        <a
          href={`mailto:${COMPANY_EMAIL}`}
          className="mt-2 flex items-center gap-2 text-[13px] font-medium text-foreground/70 transition-colors hover:text-brand-orange"
        >
          <Mail className="h-3.5 w-3.5" strokeWidth={1.75} />
          {COMPANY_EMAIL}
        </a>
        <a
          href={`tel:${COMPANY_PHONE_HREF}`}
          className="mt-1.5 flex items-center gap-2 text-[13px] font-medium text-foreground/70 transition-colors hover:text-brand-orange"
        >
          <Phone className="h-3.5 w-3.5" strokeWidth={1.75} />
          {COMPANY_PHONE}
        </a>
      </div>
    </div>
  );
}

function Potwierdzenie({ wynik }: { wynik: WynikRezerwacji }) {
  const [odwolywanie, setOdwolywanie] = useState(false);
  const [odwolane, setOdwolane] = useState(false);
  const [bladOdwolania, setBladOdwolania] = useState("");

  async function odwolaj() {
    if (!wynik.linkOdwolania || odwolywanie) return;
    setOdwolywanie(true);
    setBladOdwolania("");

    try {
      const parametry = new URL(wynik.linkOdwolania).searchParams;
      const odpowiedz = await fetch("/api/kalendarz/odwolaj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ b: parametry.get("b"), t: parametry.get("t") }),
      });
      const dane = (await odpowiedz.json()) as { success?: boolean; error?: string };
      if (dane.success) setOdwolane(true);
      else setBladOdwolania(dane.error || "Nie udało się odwołać terminu.");
    } catch {
      setBladOdwolania("Brak połączenia z serwerem.");
    } finally {
      setOdwolywanie(false);
    }
  }

  if (odwolane) {
    return (
      <div className="mx-auto max-w-[620px] animate-[fade-up_0.5s_ease-out_both] text-center">
        <CalendarX className="mx-auto h-10 w-10 text-foreground/30" strokeWidth={1.25} />
        <h2 className="mt-5 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.03em] text-foreground">
          Termin został odwołany
        </h2>
        <p className="mt-3 text-[15px] leading-[1.7] text-foreground/60">
          Nikt nie zadzwoni w tej godzinie. Nowy termin można wybrać w każdej chwili.
        </p>
        <Link
          href="/kalendarz"
          className="mt-7 inline-flex items-center gap-2 bg-foreground px-7 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-orange"
        >
          Wybierz nowy termin
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[620px] animate-[fade-up_0.5s_ease-out_both]">
      <div className="border border-foreground/[0.08] bg-surface p-8 text-center sm:p-10">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10">
          <Check className="h-6 w-6 text-brand-orange" strokeWidth={2.25} />
        </span>
        <h2 className="mt-6 text-[clamp(1.5rem,3vw,2rem)] font-bold leading-[1.15] tracking-[-0.03em] text-foreground">
          Termin jest zapisany
        </h2>
        <p className="mt-4 text-[16px] font-semibold text-foreground">
          {etykietaPelna(new Date(wynik.start))}
        </p>
        <p className="mt-2 text-[14px] text-foreground/60">
          {wynik.osoba.pelneImie
            ? `Zadzwoni ${wynik.osoba.pelneImie}`
            : "Zadzwonimy w umówionym momencie"}
          , rozmowa trwa {wynik.dlugoscMin} minut.
        </p>

        <div className="mt-7 border-t border-foreground/[0.08] pt-6 text-left">
          <h3 className="text-[13px] font-semibold text-foreground">Co dalej</h3>
          <ul className="mt-3 space-y-2.5 text-[13px] leading-[1.6] text-foreground/60">
            <li className="flex gap-3">
              <CalendarCheck
                className="mt-[2px] h-4 w-4 shrink-0 text-brand-orange"
                strokeWidth={1.75}
              />
              {wynik.email
                ? "Potwierdzenie z plikiem do kalendarza poszło na podany adres e-mail."
                : "Termin jest wpisany w nasz kalendarz. Warto go sobie zanotować."}
            </li>
            <li className="flex gap-3">
              <Phone className="mt-[2px] h-4 w-4 shrink-0 text-brand-orange" strokeWidth={1.75} />
              Dzwonimy z polskiego numeru, dokładnie w wybranej godzinie.
            </li>
          </ul>
        </div>

        {wynik.linkOdwolania ? (
          <div className="mt-7 border-t border-foreground/[0.08] pt-6">
            {bladOdwolania ? (
              <p className="mb-3 text-[13px] text-red-700">{bladOdwolania}</p>
            ) : null}
            <button
              type="button"
              onClick={odwolaj}
              disabled={odwolywanie}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-foreground/50 underline underline-offset-2 transition-colors hover:text-foreground disabled:opacity-60"
            >
              {odwolywanie ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
              ) : null}
              Odwołaj ten termin
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
