"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarCheck,
  CalendarX,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe,
  Loader2,
  Phone,
  UserRound,
} from "lucide-react";
import FormularzRozmowy, { type WynikRezerwacji } from "@/components/kalendarz/FormularzRozmowy";
import { COMPANY_EMAIL, COMPANY_PHONE, COMPANY_PHONE_HREF } from "@/lib/legal";
import {
  etykietaGodziny,
  etykietaKrotka,
  etykietaPelna,
  godzinaLokalna,
  nazwaMiesiaca,
  SKROTY_TYGODNIA,
} from "@/lib/kalendarz/formaty";

/**
 * Kalendarz rozmów: siatka miesiąca, godziny wybranego dnia i krótki formularz.
 *
 * Terminy przychodzą już policzone ze serwera, więc strona od razu pokazuje
 * wolne dni. Lista odświeża się tylko wtedy, kiedy ktoś inny zdąży zająć
 * wybrany termin. Domyślnie widać sumę wolnych godzin obu handlowców.
 *
 * Układ trzyma się jednej zasady: kolumny rozdziela odstęp i tło, nie kreski.
 */

export type Termin = { start: string; osoby: string[] };
export type Dzien = { data: string; etykieta: string; etykietaKrotka: string; terminy: Termin[] };
export type Handlowiec = { klucz: string; imie: string };

export type DaneKalendarza = {
  dni: Dzien[];
  handlowcy: Handlowiec[];
  dlugoscMin: number;
  awaria: boolean;
};

const DOWOLNA = "dowolna";

type Komorka = { data: string; numer: number };

/** Siatka miesiąca „2026-10”: puste miejsca przed pierwszym dniem i kolejne dni. */
function siatkaMiesiaca(miesiac: string): (Komorka | null)[] {
  const [rok, numer] = miesiac.split("-").map(Number);
  const pierwszy = new Date(Date.UTC(rok, numer - 1, 1));
  const przesuniecie = (pierwszy.getUTCDay() + 6) % 7;
  const ileDni = new Date(Date.UTC(rok, numer, 0)).getUTCDate();

  const komorki: (Komorka | null)[] = Array.from({ length: przesuniecie }, () => null);
  for (let dzien = 1; dzien <= ileDni; dzien += 1) {
    komorki.push({ data: `${miesiac}-${String(dzien).padStart(2, "0")}`, numer: dzien });
  }
  return komorki;
}

function liczbaGodzin(ile: number): string {
  if (ile === 1) return "1 wolna godzina";
  const jednostki = ile % 10;
  const dziesiatki = ile % 100;
  if (jednostki >= 2 && jednostki <= 4 && (dziesiatki < 12 || dziesiatki > 14)) {
    return `${ile} wolne godziny`;
  }
  return `${ile} wolnych godzin`;
}

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

  const mapaDni = useMemo(
    () => new Map(dniWidoczne.map((wpis) => [wpis.data, wpis])),
    [dniWidoczne]
  );

  const dzien =
    dzienWybrany && mapaDni.has(dzienWybrany) ? dzienWybrany : dniWidoczne[0]?.data || "";

  const dzienAktywny = mapaDni.get(dzien);

  const miesiace = useMemo(
    () => [...new Set(dniWidoczne.map((wpis) => wpis.data.slice(0, 7)))].sort(),
    [dniWidoczne]
  );

  const miesiac = dzien.slice(0, 7) || miesiace[0] || "";
  const indeksMiesiaca = miesiace.indexOf(miesiac);
  const komorki = useMemo(() => (miesiac ? siatkaMiesiaca(miesiac) : []), [miesiac]);

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

  const nazwaZespolu = dane.handlowcy.map((element) => element.imie).join(" i ");
  const wybrany = dane.handlowcy.find((element) => element.klucz === osoba);

  function wybierzTermin(start: string) {
    setTerminWybrany(start);
    setKomunikat("");
    requestAnimationFrame(() => {
      sekcjaFormularza.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  function wybierzOsobe(klucz: string) {
    setOsobaWybrana(klucz);
    setTerminWybrany(null);
  }

  /** Zmiana miesiąca od razu ustawia pierwszy wolny dzień, żeby lista godzin nie została w tyle. */
  function wybierzMiesiac(docelowy: string) {
    const pierwszy = dniWidoczne.find((wpis) => wpis.data.startsWith(docelowy));
    if (!pierwszy) return;
    setDzienWybrany(pierwszy.data);
    setTerminWybrany(null);
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

  if (dane.awaria || dane.dni.length === 0) {
    return (
      <Karta>
        <div className="p-8 sm:p-14">
          <h2 className="text-[21px] font-semibold tracking-[-0.025em] text-h-ink">
            {dane.awaria
              ? "Nie możemy teraz pokazać wolnych godzin"
              : "Najbliższe tygodnie są zajęte"}
          </h2>
          <p className="mt-3.5 max-w-[480px] text-[14.5px] leading-[1.75] text-h-ink-soft">
            {dane.awaria
              ? "Kalendarz chwilowo nie odpowiada. Najszybciej dogadamy termin telefonicznie albo mailem, odpowiadamy w jednym dniu roboczym."
              : "W widocznym okresie nie ma już wolnych godzin. Napisz albo zadzwoń, znajdziemy termin poza kalendarzem."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`tel:${COMPANY_PHONE_HREF}`}
              className="inline-flex items-center gap-2 bg-h-accent px-7 py-3.5 text-[14px] font-semibold text-h-void transition-colors duration-300 hover:bg-[#ff7b1f]"
            >
              <Phone className="h-4 w-4" strokeWidth={1.75} />
              {COMPANY_PHONE}
            </a>
            <a
              href={`mailto:${COMPANY_EMAIL}`}
              className="inline-flex items-center gap-2 bg-white/[0.06] px-7 py-3.5 text-[14px] font-semibold text-h-ink transition-colors duration-300 hover:bg-white/[0.11]"
            >
              Napisz do nas
            </a>
          </div>
        </div>
      </Karta>
    );
  }

  const brakDlaOsoby = dniWidoczne.length === 0;

  return (
    <>
      <Karta>
        <div
          className={`lg:grid ${
            termin ? "lg:grid-cols-[300px_minmax(0,1fr)]" : "lg:grid-cols-[300px_minmax(0,1fr)_228px]"
          }`}
        >
          <div className="bg-h-surface p-7 sm:p-8">
            <h2 className="text-[21px] font-semibold leading-[1.2] tracking-[-0.03em] text-h-ink">
              Rozmowa telefoniczna
            </h2>

            {/* Na telefonie szczegóły lecą w jednym wierszu, żeby kalendarz był wyżej. */}
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2.5 lg:block lg:space-y-3">
              {[
                { ikona: Clock, tekst: `${dane.dlugoscMin} minut` },
                { ikona: Phone, tekst: "Zadzwonimy na podany numer" },
                { ikona: Globe, tekst: "Godziny w czasie polskim" },
              ].map((punkt) => (
                <li
                  key={punkt.tekst}
                  className="flex items-center gap-2.5 text-[13.5px] text-h-ink-soft"
                >
                  <punkt.ikona className="h-4 w-4 shrink-0 text-h-accent" strokeWidth={1.75} />
                  {punkt.tekst}
                </li>
              ))}
            </ul>

            {dane.handlowcy.length > 1 ? (
              <div className="mt-8">
                <p className="text-[13px] font-medium text-h-ink-soft">Kto zadzwoni</p>
                <div
                  className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1"
                  role="group"
                  aria-label="Wybór osoby"
                >
                  {[
                    { klucz: DOWOLNA, nazwa: nazwaZespolu },
                    ...dane.handlowcy.map((element) => ({
                      klucz: element.klucz,
                      nazwa: element.imie,
                    })),
                  ].map((opcja) => {
                    const aktywny = osoba === opcja.klucz;
                    return (
                      <button
                        key={opcja.klucz}
                        type="button"
                        aria-pressed={aktywny}
                        onClick={() => wybierzOsobe(opcja.klucz)}
                        className={`flex w-full items-center gap-2 px-3.5 py-3 text-left transition-colors duration-300 ${
                          opcja.klucz === DOWOLNA ? "col-span-2 lg:col-span-1" : ""
                        } ${
                          aktywny
                            ? "bg-white/[0.10] text-h-ink"
                            : "bg-white/[0.04] text-h-ink-soft hover:bg-white/[0.08] hover:text-h-ink"
                        }`}
                      >
                        <span className="truncate text-[13.5px] font-medium">{opcja.nazwa}</span>
                        {aktywny ? (
                          <Check
                            className="ml-auto h-4 w-4 shrink-0 text-h-accent"
                            strokeWidth={2.25}
                          />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {brakDlaOsoby ? (
            <div className="p-7 sm:p-8">
              <h3 className="text-[16.5px] font-semibold tracking-[-0.015em] text-h-ink">
                {wybrany ? `${wybrany.imie} nie ma teraz wolnych godzin` : "Brak wolnych godzin"}
              </h3>
              <p className="mt-3 text-[14px] leading-[1.7] text-h-ink-soft">
                Po wybraniu {nazwaZespolu} pokażą się wszystkie terminy.
              </p>
              <button
                type="button"
                onClick={() => wybierzOsobe(DOWOLNA)}
                className="mt-6 inline-flex items-center gap-2 bg-h-accent px-7 py-3.5 text-[14px] font-semibold text-h-void transition-colors duration-300 hover:bg-[#ff7b1f]"
              >
                Pokaż wszystkie terminy
              </button>
            </div>
          ) : termin ? (
            <div ref={sekcjaFormularza} className="scroll-mt-28 p-7 sm:p-9">
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
            </div>
          ) : (
            <>
              <div className="p-7 sm:p-9">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[16px] font-semibold tracking-[-0.02em] text-h-ink">
                    {nazwaMiesiaca(miesiac)}
                  </p>
                  <div className="flex gap-1.5">
                    {[
                      { ikona: ChevronLeft, krok: -1, opis: "Poprzedni miesiąc" },
                      { ikona: ChevronRight, krok: 1, opis: "Następny miesiąc" },
                    ].map((strzalka) => {
                      const docelowy = miesiace[indeksMiesiaca + strzalka.krok];
                      return (
                        <button
                          key={strzalka.opis}
                          type="button"
                          aria-label={strzalka.opis}
                          disabled={!docelowy}
                          onClick={() => wybierzMiesiac(docelowy)}
                          className="flex h-9 w-9 items-center justify-center bg-white/[0.05] text-h-ink-soft transition-colors duration-300 hover:bg-white/[0.11] hover:text-h-ink disabled:cursor-not-allowed disabled:bg-transparent disabled:text-white/15"
                        >
                          <strzalka.ikona className="h-4 w-4" strokeWidth={2} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-7 gap-1.5">
                  {SKROTY_TYGODNIA.map((skrot) => (
                    <span
                      key={skrot}
                      className="pb-2 text-center text-[12.5px] font-medium text-h-ink-soft"
                    >
                      {skrot}
                    </span>
                  ))}
                  {komorki.map((komorka, numerKomorki) => {
                    if (!komorka) return <span key={`puste-${numerKomorki}`} />;
                    const wpis = mapaDni.get(komorka.data);
                    if (!wpis) {
                      return (
                        <span
                          key={komorka.data}
                          className="flex h-11 items-center justify-center text-[14px] tabular-nums text-white/35"
                        >
                          {komorka.numer}
                        </span>
                      );
                    }
                    const aktywny = komorka.data === dzien;
                    return (
                      <button
                        key={komorka.data}
                        type="button"
                        aria-pressed={aktywny}
                        aria-label={`${wpis.etykieta}, ${liczbaGodzin(wpis.terminy.length)}`}
                        onClick={() => {
                          setDzienWybrany(komorka.data);
                          setTerminWybrany(null);
                        }}
                        className={`flex h-11 items-center justify-center text-[14px] font-semibold tabular-nums transition-colors duration-300 ${
                          aktywny
                            ? "bg-h-accent text-h-void"
                            : "bg-white/[0.06] text-h-ink hover:bg-white/[0.12]"
                        }`}
                      >
                        {komorka.numer}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-7 pt-0 sm:p-9 sm:pt-0 lg:pt-9">
                {dzienAktywny ? (
                  <>
                    <div className="flex items-baseline justify-between gap-2 lg:block">
                      <p className="text-[14.5px] font-semibold tracking-[-0.01em] text-h-ink">
                        {etykietaKrotka(new Date(`${dzienAktywny.data}T12:00:00Z`))}
                      </p>
                      <p className="flex items-center gap-1.5 text-[13px] text-h-ink-soft lg:mt-1.5">
                        {odswiezanie ? (
                          <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} />
                        ) : null}
                        {liczbaGodzin(dzienAktywny.terminy.length)}
                      </p>
                    </div>

                    <div className="mt-4 space-y-5 lg:max-h-[372px] lg:overflow-y-auto lg:pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/15">
                      {grupy.map((grupa) => (
                        <div key={grupa.nazwa}>
                          <p className="mb-2.5 text-[12.5px] font-medium text-h-ink-soft">
                            {grupa.nazwa}
                          </p>
                          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-1">
                            {grupa.terminy.map((wpis) => (
                              <button
                                key={wpis.start}
                                type="button"
                                onClick={() => wybierzTermin(wpis.start)}
                                className="bg-white/[0.06] py-3 text-[13.5px] font-semibold tabular-nums text-h-ink transition-colors duration-300 hover:bg-h-accent hover:text-h-void"
                              >
                                {etykietaGodziny(new Date(wpis.start))}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </>
          )}
        </div>
      </Karta>

      {komunikat ? (
        <p className="mt-4 bg-h-accent/[0.10] px-5 py-3.5 text-[13px] text-h-ink-soft">
          {komunikat}
        </p>
      ) : null}

      <div className="mt-7 flex flex-wrap gap-x-9 gap-y-3">
        {[
          { ikona: UserRound, tekst: "Bez zakładania konta i bez logowania" },
          { ikona: CalendarCheck, tekst: "Potwierdzenie mailem z wpisem do kalendarza" },
          { ikona: CalendarX, tekst: "Termin można odwołać jednym kliknięciem" },
        ].map((punkt) => (
          <p
            key={punkt.tekst}
            className="flex items-center gap-2.5 text-[13px] text-h-ink-soft"
          >
            <punkt.ikona className="h-4 w-4 shrink-0 text-h-accent/70" strokeWidth={1.75} />
            {punkt.tekst}
          </p>
        ))}
      </div>

      <p className="mt-4 text-[13px] text-h-ink-soft">
        Wolisz od razu zadzwonić{" "}
        <a
          href={`tel:${COMPANY_PHONE_HREF}`}
          className="font-medium text-h-ink transition-colors duration-300 hover:text-h-accent"
        >
          {COMPANY_PHONE}
        </a>{" "}
        lub napisz na{" "}
        <a
          href={`mailto:${COMPANY_EMAIL}`}
          className="font-medium text-h-ink transition-colors duration-300 hover:text-h-accent"
        >
          {COMPANY_EMAIL}
        </a>
      </p>
    </>
  );
}

/** Płyta kalendarza: o stopień jaśniejsza od tła, bez linii i bez cienia. */
function Karta({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-[fade-up_0.6s_ease-out_both] overflow-hidden bg-h-night">
      {children}
    </div>
  );
}

/** Dokąd prowadzimy klienta po rezerwacji i po ilu sekundach. */
const STRONA_PRZYGOTOWANIA = "/urzadzenia";
const SEKUND_DO_PRZEJSCIA = 7;

/**
 * Ekran po rezerwacji zasłania całą stronę. Klient ma go nie przeoczyć,
 * bo to jedyne miejsce, w którym prosimy o zapoznanie się z urządzeniami
 * i w którym można jeszcze odwołać termin.
 */
function PelnyEkran({ children }: { children: React.ReactNode }) {
  const kontener = useRef<HTMLDivElement>(null);
  const [osadzony, setOsadzony] = useState(false);

  // Portal do body, bo strona kalendarza ma własny kontekst nakładania
  // i nakładka zostałaby pod nawigacją niezależnie od z-index.
  useEffect(() => {
    setOsadzony(true);
    const poprzedni = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = poprzedni;
    };
  }, []);

  // Czytnik ekranu zaczyna od nakładki, a nie od miejsca, w którym był.
  useEffect(() => {
    if (osadzony) kontener.current?.focus();
  }, [osadzony]);

  if (!osadzony) return null;

  return createPortal(
    <div
      ref={kontener}
      role="dialog"
      aria-modal="true"
      aria-labelledby="kalendarz-potwierdzenie"
      tabIndex={-1}
      className="fixed inset-0 z-[125] overflow-y-auto bg-h-void text-h-ink outline-none"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(70% 55% at 50% 0%, rgba(255,102,0,0.10), transparent 70%)",
        }}
      />
      <div className="relative flex min-h-full items-center justify-center px-6 py-16 sm:py-20">
        <div className="w-full max-w-[620px] animate-[fade-up_0.6s_ease-out_both]">{children}</div>
      </div>
    </div>,
    document.body
  );
}

function Potwierdzenie({ wynik }: { wynik: WynikRezerwacji }) {
  const router = useRouter();
  const [odwolywanie, setOdwolywanie] = useState(false);
  const [odwolane, setOdwolane] = useState(false);
  const [bladOdwolania, setBladOdwolania] = useState("");
  const [sekundy, setSekundy] = useState(SEKUND_DO_PRZEJSCIA);
  const [odliczanie, setOdliczanie] = useState(true);

  // Odliczanie do strony z urządzeniami. Klient może je zatrzymać, bo na tym
  // ekranie jest jeszcze odwołanie terminu i nie wolno go zabrać pod ręką.
  useEffect(() => {
    if (!odliczanie || odwolane || odwolywanie) return;
    if (sekundy <= 0) {
      router.push(STRONA_PRZYGOTOWANIA);
      return;
    }
    const licznik = window.setTimeout(() => setSekundy((ile) => ile - 1), 1000);
    return () => window.clearTimeout(licznik);
  }, [odliczanie, odwolane, odwolywanie, sekundy, router]);

  async function odwolaj() {
    if (!wynik.linkOdwolania || odwolywanie) return;
    setOdliczanie(false);
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
      <PelnyEkran>
        <div className="text-center">
          <CalendarX className="mx-auto h-11 w-11 text-white/35" strokeWidth={1.25} />
          <h2
            id="kalendarz-potwierdzenie"
            className="mt-7 text-[clamp(1.75rem,4.4vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.035em] text-h-ink"
          >
            Termin został odwołany
          </h2>
          <p className="mx-auto mt-4 max-w-[420px] text-[15px] leading-[1.75] text-h-ink-soft">
            Nikt nie zadzwoni w tej godzinie. Nowy termin można wybrać w każdej chwili.
          </p>
          <Link
            href="/kalendarz"
            className="mt-9 inline-flex items-center gap-2 bg-h-accent px-8 py-4 text-[14.5px] font-semibold text-h-void transition-colors duration-300 hover:bg-[#ff7b1f]"
          >
            Wybierz nowy termin
          </Link>
        </div>
      </PelnyEkran>
    );
  }

  const postep = ((SEKUND_DO_PRZEJSCIA - sekundy) / SEKUND_DO_PRZEJSCIA) * 100;

  return (
    <PelnyEkran>
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-h-accent/15">
          <Check className="h-8 w-8 text-h-accent" strokeWidth={2.25} />
        </span>
        <h2
          id="kalendarz-potwierdzenie"
          className="mt-7 text-[clamp(1.85rem,4.8vw,3rem)] font-bold leading-[1.06] tracking-[-0.04em] text-h-ink"
        >
          Dziękujemy, termin jest zapisany
        </h2>
      </div>

      <div className="mt-9 bg-h-surface px-6 py-7 text-center">
        <p className="text-[17.5px] font-semibold tracking-[-0.015em] text-h-ink">
          {etykietaPelna(new Date(wynik.start))}
        </p>
        <p className="mt-2 text-[13.5px] text-h-ink-soft">
          {wynik.osoba.pelneImie
            ? `Zadzwoni ${wynik.osoba.pelneImie}`
            : "Zadzwonimy w umówionym momencie"}
          , rozmowa trwa {wynik.dlugoscMin} minut
        </p>
      </div>

      <ul className="mt-7 space-y-3 text-[13.5px] leading-[1.65] text-h-ink-soft">
        <li className="flex gap-3">
          <CalendarCheck
            className="mt-[2px] h-4 w-4 shrink-0 text-h-accent"
            strokeWidth={1.75}
          />
          {wynik.email
            ? "Potwierdzenie z plikiem do kalendarza poszło na podany adres e-mail."
            : "Termin jest wpisany w nasz kalendarz. Warto go sobie zanotować."}
        </li>
        <li className="flex gap-3">
          <Phone className="mt-[2px] h-4 w-4 shrink-0 text-h-accent" strokeWidth={1.75} />
          Zadzwonimy z polskiego numeru, dokładnie w wybranej godzinie.
        </li>
      </ul>

      <div className="mt-9 bg-h-accent/[0.10] p-6 sm:p-8">
        <h3 className="text-[19px] font-semibold tracking-[-0.025em] text-h-ink">
          Prosimy o zapoznanie się z urządzeniami
        </h3>
        <p className="mt-3 text-[14.5px] leading-[1.75] text-h-ink-soft">
          Za chwilę pokażemy stronę z opisem Circle, Health, Cloud, Guardian i I.S.T. Board.
          Kilka minut tam i rozmowa zaczyna się od konkretów.
        </p>

        <Link
          href={STRONA_PRZYGOTOWANIA}
          className="group mt-7 inline-flex w-full items-center justify-center gap-2.5 bg-h-accent px-8 py-4 text-[14.5px] font-semibold text-h-void transition-colors duration-300 hover:bg-[#ff7b1f] sm:w-auto"
        >
          Zobacz urządzenia
          <ArrowRight
            className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
            strokeWidth={2}
          />
        </Link>

        {odliczanie && !odwolywanie ? (
          <div className="mt-7">
            <div className="h-1 w-full bg-white/10">
              <div
                className="h-full bg-h-accent transition-[width] duration-1000 ease-linear motion-reduce:transition-none"
                style={{ width: `${postep}%` }}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <p className="text-[13px] text-h-ink-soft">Przejdziemy tam za {sekundy} s</p>
              <button
                type="button"
                onClick={() => setOdliczanie(false)}
                className="text-[13px] font-medium text-h-ink-soft underline underline-offset-[3px] transition-colors duration-300 hover:text-h-ink"
              >
                Zostaw mnie tutaj
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {wynik.linkOdwolania ? (
        <div className="mt-8 text-center">
          {bladOdwolania ? (
            <p className="mb-3 text-[13px] text-red-300">{bladOdwolania}</p>
          ) : null}
          <button
            type="button"
            onClick={odwolaj}
            disabled={odwolywanie}
            className="inline-flex items-center gap-2 text-[13px] font-medium text-h-ink-soft underline underline-offset-[3px] transition-colors duration-300 hover:text-h-ink disabled:opacity-60"
          >
            {odwolywanie ? <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} /> : null}
            Odwołaj ten termin
          </button>
        </div>
      ) : null}
    </PelnyEkran>
  );
}
