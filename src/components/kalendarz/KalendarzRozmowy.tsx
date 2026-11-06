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
} from "lucide-react";
import FormularzRozmowy, { type WynikRezerwacji } from "@/components/kalendarz/FormularzRozmowy";
import { AKCENT_TEKST, TOKENY, type MotywKalendarza } from "@/components/kalendarz/motyw";
import { COMPANY_EMAIL, COMPANY_PHONE, COMPANY_PHONE_HREF } from "@/lib/legal";
import {
  etykietaDnia,
  etykietaGodziny,
  etykietaPelna,
  nazwaMiesiaca,
  SKROTY_TYGODNIA,
} from "@/lib/kalendarz/formaty";

/**
 * Kalendarz rozmów: siatka miesiąca, godziny wybranego dnia i krótki formularz.
 *
 * Terminy przychodzą już policzone ze serwera, więc strona od razu pokazuje
 * wolne dni. Lista odświeża się tylko wtedy, kiedy ktoś inny zdąży zająć
 * wybrany termin.
 *
 * Po uwagach z 4 listopada 2026 zostały tu dwie rzeczy do kliknięcia: dzień
 * i godzina. Wyboru osoby nie ma (klient nie wie, kto to Jarosław i kto
 * Sebastian), nie ma też liczby wolnych godzin ani podziału na przed i po
 * południu. Osobę nadal da się wskazać adresem `?osoba=jarek`, na przykład
 * w SMS-ie do leada.
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

export default function KalendarzRozmowy({
  poczatkowe,
  osobaZAdresu,
  motyw = "ciemny",
  wariant = "business",
}: {
  poczatkowe: DaneKalendarza;
  osobaZAdresu?: string;
  motyw?: MotywKalendarza;
  /** Strefa pacjenta nie pyta o placówkę ani o NIP. */
  wariant?: "patient" | "business";
}) {
  const t = TOKENY[motyw];
  const akcentTekst = AKCENT_TEKST[motyw];

  const [dane, setDane] = useState<DaneKalendarza>(poczatkowe);
  const [odswiezanie, setOdswiezanie] = useState(false);

  // Wybory trzymamy jako „co kliknął użytkownik”, a to, co widać, wyliczamy
  // z aktualnej listy. Odświeżenie godzin nie wymaga wtedy sprzątania stanu
  // w efektach.
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

  const wybrany = dane.handlowcy.find((element) => element.klucz === osoba);

  function wybierzTermin(start: string) {
    setTerminWybrany(start);
    setKomunikat("");
    requestAnimationFrame(() => {
      sekcjaFormularza.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
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
      <Karta t={t}>
        <div className="p-8 sm:p-14">
          <h2 className={`text-[21px] font-semibold tracking-[-0.025em] ${t.mocny}`}>
            {dane.awaria
              ? "Nie możemy teraz pokazać wolnych godzin"
              : "Najbliższe tygodnie są zajęte"}
          </h2>
          <p className={`mt-3.5 max-w-[480px] text-[14.5px] leading-[1.75] ${t.slaby}`}>
            {dane.awaria
              ? "Kalendarz chwilowo nie odpowiada. Najszybciej dogadamy termin telefonicznie albo mailem, odpowiadamy w jednym dniu roboczym."
              : "W widocznym okresie nie ma już wolnych godzin. Napisz albo zadzwoń, znajdziemy termin poza kalendarzem."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`tel:${COMPANY_PHONE_HREF}`}
              className={`inline-flex items-center gap-2 px-7 py-3.5 text-[14px] font-semibold transition-colors duration-300 ${t.akcent}`}
            >
              <Phone className="h-4 w-4" strokeWidth={1.75} />
              {COMPANY_PHONE}
            </a>
            <a
              href={`mailto:${COMPANY_EMAIL}`}
              className={`inline-flex items-center gap-2 px-7 py-3.5 text-[14px] font-semibold transition-colors duration-300 ${t.kafelek}`}
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
      <Karta t={t}>
        {/* Co to za rozmowa, jednym pasem nad kalendarzem. Wcześniej stało to
            w osobnej kolumnie po lewej i zabierało siatce połowę szerokości. */}
        <div className={`${t.pasek} px-7 py-6 sm:px-9`}>
          <h2 className={`text-[19px] font-semibold leading-[1.2] tracking-[-0.03em] ${t.mocny}`}>
            Rozmowa telefoniczna
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2.5">
            {[
              { ikona: Clock, tekst: `${dane.dlugoscMin} minut` },
              { ikona: Phone, tekst: "Zadzwonimy na podany numer" },
              { ikona: Globe, tekst: "Godziny w czasie polskim" },
            ].map((punkt) => (
              <li key={punkt.tekst} className={`flex items-center gap-2.5 text-[13.5px] ${t.slaby}`}>
                <punkt.ikona className={`h-4 w-4 shrink-0 ${akcentTekst}`} strokeWidth={1.75} />
                {punkt.tekst}
              </li>
            ))}
          </ul>
        </div>

        {brakDlaOsoby ? (
          <div className="p-7 sm:p-9">
            <h3 className={`text-[16.5px] font-semibold tracking-[-0.015em] ${t.mocny}`}>
              {wybrany ? `${wybrany.imie} nie ma teraz wolnych godzin` : "Brak wolnych godzin"}
            </h3>
            <p className={`mt-3 text-[14px] leading-[1.7] ${t.slaby}`}>
              Pokażemy wszystkie terminy, jakie mamy w najbliższych tygodniach.
            </p>
            <button
              type="button"
              onClick={() => {
                setOsobaWybrana(DOWOLNA);
                setTerminWybrany(null);
              }}
              className={`mt-6 inline-flex items-center gap-2 px-7 py-3.5 text-[14px] font-semibold transition-colors duration-300 ${t.akcent}`}
            >
              Pokaż wszystkie terminy
            </button>
          </div>
        ) : termin ? (
          <div ref={sekcjaFormularza} className="scroll-mt-28 p-7 sm:p-9">
            <FormularzRozmowy
              termin={termin}
              dlugoscMin={dane.dlugoscMin}
              motyw={motyw}
              wariant={wariant}
              wybranaOsoba={osoba === DOWOLNA ? undefined : osoba}
              onZmienTermin={() => setTerminWybrany(null)}
              onSukces={setWynik}
              onZajety={() =>
                odswiez("Ten termin właśnie ktoś zajął. Lista godzin jest już odświeżona.")
              }
            />
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="p-7 sm:p-9">
              {/* Strzałki stoją przy nazwie miesiąca, nie przy prawej krawędzi:
                  przy krawędzi nikt ich nie wiązał z „Listopad 2026".
                  Uwaga Sebastiana z 5 listopada 2026. */}
              <div className="flex items-center gap-2">
                <p className={`text-[16px] font-semibold tracking-[-0.02em] ${t.mocny}`}>
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
                        className={`flex h-11 w-11 items-center justify-center transition-colors duration-300 disabled:cursor-not-allowed ${t.kafelek} ${t.wygaszony}`}
                      >
                        <strzalka.ikona className="h-[21px] w-[21px]" strokeWidth={2.5} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-7 grid grid-cols-7 gap-1.5">
                {SKROTY_TYGODNIA.map((skrot) => (
                  <span
                    key={skrot}
                    className={`pb-2 text-center text-[12.5px] font-medium ${t.slaby}`}
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
                        className={`flex h-12 items-center justify-center text-[14px] tabular-nums ${t.pusty}`}
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
                      aria-label={wpis.etykieta}
                      onClick={() => {
                        setDzienWybrany(komorka.data);
                        setTerminWybrany(null);
                      }}
                      className={`flex h-12 items-center justify-center text-[15px] font-semibold tabular-nums transition-colors duration-300 ${
                        aktywny ? t.akcent : t.kafelek
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
                  <p
                    className={`flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em] ${t.mocny}`}
                  >
                    {etykietaDnia(new Date(`${dzienAktywny.data}T12:00:00Z`))}
                    {odswiezanie ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                    ) : null}
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:max-h-[404px] lg:grid-cols-2 lg:overflow-y-auto lg:pr-2">
                    {dzienAktywny.terminy.map((wpis) => (
                      <button
                        key={wpis.start}
                        type="button"
                        onClick={() => wybierzTermin(wpis.start)}
                        className={`py-3.5 text-[14px] font-semibold tabular-nums transition-colors duration-300 ${t.kafelek} ${t.kafelekAkcent}`}
                      >
                        {etykietaGodziny(new Date(wpis.start))}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </Karta>

      {komunikat ? (
        <p className={`mt-4 px-5 py-3.5 text-[13px] ${t.poswiata} ${t.slaby}`}>{komunikat}</p>
      ) : null}

      <div className="mt-7 flex flex-wrap gap-x-9 gap-y-3">
        {[
          "Bez zakładania konta i bez logowania",
          "Potwierdzenie mailem z wpisem do kalendarza",
          "Termin można odwołać jednym kliknięciem",
        ].map((tekst) => (
          <p key={tekst} className={`flex items-center gap-2.5 text-[13px] ${t.slaby}`}>
            <Check className={`h-4 w-4 shrink-0 ${akcentTekst}`} strokeWidth={2} />
            {tekst}
          </p>
        ))}
      </div>

      <p className={`mt-4 text-[13px] ${t.slaby}`}>
        Wolisz od razu zadzwonić{" "}
        <a
          href={`tel:${COMPANY_PHONE_HREF}`}
          className={`font-medium transition-colors duration-300 ${t.mocny} ${t.linkHover}`}
        >
          {COMPANY_PHONE}
        </a>{" "}
        lub napisz na{" "}
        <a
          href={`mailto:${COMPANY_EMAIL}`}
          className={`font-medium transition-colors duration-300 ${t.mocny} ${t.linkHover}`}
        >
          {COMPANY_EMAIL}
        </a>
      </p>
    </>
  );
}

/** Płyta kalendarza: o stopień inna od tła, bez linii i bez cienia. */
function Karta({
  t,
  children,
}: {
  t: (typeof TOKENY)[MotywKalendarza];
  children: React.ReactNode;
}) {
  return (
    <div className={`animate-[fade-up_0.6s_ease-out_both] overflow-hidden ${t.karta}`}>
      {children}
    </div>
  );
}

/** Dokąd prowadzimy klienta po rezerwacji i po ilu sekundach. */
const STRONA_PRZYGOTOWANIA = "/health";
// Siedem sekund nie starczało na przeczytanie tego, o co prosimy, dwadzieścia
// też było za mało. Kto nie chce czekać, ma przycisk nad odliczaniem.
const SEKUND_DO_PRZEJSCIA = 40;

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
          Prosimy o zapoznanie się z materiałami
        </h3>
        <p className="mt-3 text-[14.5px] leading-[1.75] text-h-ink-soft">
          Za chwilę pokażemy stronę o ICAROS: cztery urządzenia, filmy z sesji i wyniki
          badań. Kilka minut tam i rozmowa zaczyna się od konkretów.
        </p>

        <Link
          href={STRONA_PRZYGOTOWANIA}
          className="group mt-7 inline-flex min-h-[64px] w-full items-center justify-center gap-3 bg-h-accent px-10 text-[17px] font-semibold tracking-[0.01em] text-h-void transition-colors duration-300 hover:bg-[#ff7b1f]"
        >
          Zobacz, jak działa ICAROS
          <ArrowRight
            className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1"
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
