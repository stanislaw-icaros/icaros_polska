"use client";

/** Drobne części wspólne landingu /health: wejścia sekcji, nagłówki, przycisk. */

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

/** useLayoutEffect ostrzega przy renderze na serwerze, gdzie i tak nic nie robi. */
const useUkladowy = typeof window === "undefined" ? useEffect : useLayoutEffect;
import { ArrowRight } from "lucide-react";

/**
 * Wejście elementu przy wjeździe sekcji w ekran.
 *
 * Stanem domyślnym jest „widać". Chowamy dopiero wtedy, gdy skrypt faktycznie
 * działa i element jest jeszcze poza kadrem, więc przy wyłączonym albo zepsutym
 * JS cała treść po prostu stoi na stronie. Chowanie idzie w useLayoutEffect,
 * czyli przed malowaniem: nie ma mignięcia.
 *
 * To, co już widać przy wejściu na stronę, nie animuje się wcale. Czytelnik nie
 * powinien czekać na tekst, który ma przed nosem.
 */
export function Wejscie({
  children,
  opoznienie = 0,
  className = "",
}: {
  children: ReactNode;
  opoznienie?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [widac, ustawWidac] = useState(true);

  useUkladowy(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    ustawWidac(false);
    const obserwator = new IntersectionObserver(
      ([wpis]) => {
        if (!wpis.isIntersecting) return;
        ustawWidac(true);
        obserwator.disconnect();
      },
      { rootMargin: "0px 0px 12% 0px" }
    );
    obserwator.observe(element);
    return () => obserwator.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${opoznienie}s` }}
      className={`transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
        widac ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** Nagłówek sekcji. Jeden rozmiar na całej stronie, dwa warianty koloru. */
export function Naglowek({
  children,
  jasno = false,
  className = "",
}: {
  children: ReactNode;
  jasno?: boolean;
  className?: string;
}) {
  return (
    <h2
      className={`text-balance text-[clamp(2rem,4.2vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] ${
        jasno ? "text-h-dark" : "text-h-ink"
      } ${className}`}
    >
      {children}
    </h2>
  );
}

/** Zdanie podane większym stopniem. Nie jest nagłówkiem, więc zostaje akapitem. */
export function Zdanie({
  children,
  jasno = false,
  className = "",
}: {
  children: ReactNode;
  jasno?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`text-pretty text-[clamp(1.1rem,1.8vw,1.5rem)] leading-[1.45] tracking-[-0.015em] ${
        jasno ? "text-h-dark" : "text-h-ink"
      } ${className}`}
    >
      {children}
    </p>
  );
}

/** Tekst bieżący. Pełny atrament, nigdy wyblakły. */
export function Akapit({
  children,
  jasno = false,
  className = "",
}: {
  children: ReactNode;
  jasno?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`max-w-[62ch] text-pretty text-[17px] leading-[1.68] ${
        jasno ? "text-h-dark" : "text-h-ink"
      } ${className}`}
    >
      {children}
    </p>
  );
}

/**
 * Jedyna akcja na stronie. Jedna nazwa, „Umów rozmowę", użyta wszędzie tak samo.
 * Na papierze akcent schodzi o stopień, żeby tekst miał kontrast.
 */
export function Akcja({
  jasno = false,
  etykieta = "Umów rozmowę",
  className = "",
}: {
  jasno?: boolean;
  etykieta?: string;
  className?: string;
}) {
  return (
    <Link
      href="/kalendarz"
      className={`group inline-flex min-h-[52px] items-center justify-center gap-3 px-8 text-[16px] font-semibold tracking-[0.01em] outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-4 ${
        jasno
          ? "bg-h-dark text-h-paper hover:bg-h-accent-deep focus-visible:ring-h-accent-deep focus-visible:ring-offset-h-paper"
          : "bg-h-accent text-h-void hover:bg-[#ff7b1f] focus-visible:ring-h-accent focus-visible:ring-offset-h-void"
      } ${className}`}
    >
      {etykieta}
      <ArrowRight
        aria-hidden
        className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1"
        strokeWidth={2}
      />
    </Link>
  );
}

/**
 * Sekcja na ciemnym tle. Każda dostaje własne światło: duży, bardzo delikatny
 * rozbłysk w jednym z czterech miejsc. Dzięki temu żaden ekran nie jest płaską
 * czernią, a sąsiednie sekcje nie wyglądają identycznie.
 */
/**
 * Styk sekcji. Światło gaśnie przy obu krawędziach, więc różnica tonów między
 * sąsiednimi sekcjami nie czyta się jako pozioma kreska. To przyciemnienie nad
 * tłem, nie ozdobny gradient wypełniający.
 */
export const STYK_GORA =
  "pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(to_bottom,rgba(4,4,6,0.85),transparent)]"; // taste-skill-ignore: przyciemnienie styku, nie wypełnienie
export const STYK_DOL =
  "pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(to_top,rgba(4,4,6,0.85),transparent)]"; // taste-skill-ignore: przyciemnienie styku, nie wypełnienie


/**
 * Liczba, która odlicza do swojej wartości, kiedy wjedzie w ekran.
 *
 * Cyfry idą przez MotionValue prosto do `textContent`, bez stanu Reacta, więc
 * odliczanie nie przerysowuje drzewa. Przy ograniczonym ruchu i bez skryptu
 * liczba od razu stoi na docelowej wartości.
 *
 * Wartość podaje się tak, jak ma być napisana: „+41%", „2×", „50,8%".
 */
export function Licznik({
  wartosc,
  className = "",
}: {
  wartosc: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const cyfryRef = useRef<HTMLSpanElement | null>(null);
  const widoczny = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const mniejRuchu = useReducedMotion();
  const postep = useMotionValue(0);

  const rozbiorka = wartosc.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
  const przed = rozbiorka ? rozbiorka[1] : "";
  const cyfry = rozbiorka ? rozbiorka[2] : wartosc;
  const po = rozbiorka ? rozbiorka[3] : "";
  const przecinek = cyfry.includes(",");
  const miejsca = przecinek ? cyfry.split(",")[1].length : 0;
  const cel = Number(cyfry.replace(",", "."));

  const napisz = (v: number) => {
    const tekst = v.toFixed(miejsca);
    return przecinek ? tekst.replace(".", ",") : tekst;
  };

  useMotionValueEvent(postep, "change", (v) => {
    if (cyfryRef.current) cyfryRef.current.textContent = napisz(v);
  });

  useEffect(() => {
    if (!widoczny || mniejRuchu || !Number.isFinite(cel)) return;
    const kontrola = animate(postep, cel, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => kontrola.stop();
  }, [widoczny, mniejRuchu, cel, postep]);

  return (
    <span ref={ref} className={className}>
      {przed}
      <span ref={cyfryRef}>{cyfry}</span>
      {po}
    </span>
  );
}

/**
 * Delikatna podpowiedź, że w coś da się kliknąć.
 *
 * Wokół grupy przycisków pulsuje miękka pomarańczowa poświata, ledwo widoczna,
 * i gaśnie na dobre po pierwszym kliknięciu. Bez niej nikt przewijający stronę
 * nie zauważa, że etapy sesji albo trasy można sobie przeklikać.
 *
 * Sama poświata jest płaskim kolorem, nie cieniem i nie gradientem: zmienia się
 * tylko krycie, więc nic nie przelicza się przy każdej klatce.
 */
export function Podpowiedz({
  children,
  aktywna = true,
  className = "",
}: {
  children: ReactNode;
  aktywna?: boolean;
  className?: string;
}) {
  const mniejRuchu = useReducedMotion();
  const [uzyte, ustawUzyte] = useState(false);
  const widac = aktywna && !uzyte && !mniejRuchu;

  return (
    <div
      className={`relative ${className}`}
      onPointerDown={() => ustawUzyte(true)}
      onKeyDown={() => ustawUzyte(true)}
    >
      {widac ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-x-3 -inset-y-2 rounded-xl bg-h-accent/12"
          initial={{ opacity: 0.2 }}
          animate={{ opacity: [0.2, 0.75, 0.2] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}

/**
 * Przełącznik dwóch widoków. Zwykłe przyciski, bo właśnie tym są: wcześniej
 * wyglądały jak przyciski, a klikanie w nie nic nie dawało.
 */
export function Przelacznik<T extends string>({
  etykieta,
  pozycje,
  aktywny,
  naZmiane,
}: {
  etykieta: string;
  pozycje: Array<{ klucz: T; nazwa: string }>;
  aktywny: T;
  naZmiane: (klucz: T) => void;
}) {
  return (
    <Podpowiedz className="inline-block">
      <div role="group" aria-label={etykieta} className="inline-flex rounded-lg bg-h-ink/10 p-1">
        {pozycje.map((pozycja) => {
          const wybrany = pozycja.klucz === aktywny;
          return (
            <button
              key={pozycja.klucz}
              type="button"
              aria-pressed={wybrany}
              onClick={() => naZmiane(pozycja.klucz)}
              className={`min-h-[44px] rounded-md px-5 text-[15px] font-semibold outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-h-accent focus-visible:ring-offset-4 focus-visible:ring-offset-h-void ${
                wybrany
                  ? "bg-h-accent text-h-void"
                  : "text-h-ink-soft hover:text-h-ink"
              }`}
            >
              {pozycja.nazwa}
            </button>
          );
        })}
      </div>
    </Podpowiedz>
  );
}

/**
 * Jeden wynik badania: wielka liczba, która odlicza przy wejściu w ekran,
 * obok zdanie i drobnym drukiem źródło.
 *
 * Wyniki stały wcześniej po cztery w rzędzie, drobne, jeden przy drugim.
 * Nikt tak tego nie czyta, więc teraz każdy dostaje własny wiersz i powietrze.
 */
export function Wynik({
  wartosc,
  opis,
  zrodlo,
}: {
  wartosc: string;
  opis: string;
  zrodlo?: string;
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-x-12 gap-y-4 lg:grid-cols-12">
      <p className="text-[clamp(3.5rem,9vw,7rem)] font-semibold leading-[0.82] tracking-[-0.05em] text-h-accent [font-variant-numeric:tabular-nums] lg:col-span-5">
        <Licznik wartosc={wartosc} />
      </p>
      <p className="max-w-[26ch] text-pretty text-[clamp(1.25rem,2.4vw,1.9rem)] font-medium leading-[1.25] tracking-[-0.025em] text-h-ink lg:col-span-7">
        {opis}
        {zrodlo ? <Zrodlo tekst={zrodlo} /> : null}
      </p>
    </div>
  );
}

/**
 * Źródło wyniku schowane pod znacznikiem. Stało wcześniej szarym drukiem
 * z boku każdego wiersza i zabierało miejsce, a czyta je co setny czytelnik.
 * Teraz jest pod ręką: najechanie myszą albo dotknięcie pokazuje przypis.
 */
export function Zrodlo({ tekst, jasno = false }: { tekst: string; jasno?: boolean }) {
  return (
    <span className="group relative ml-2 inline-flex align-middle">
      <button
        type="button"
        aria-label={`Źródło: ${tekst}`}
        className={`-m-3 flex h-11 w-11 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-h-accent focus-visible:ring-offset-2 ${
          jasno ? "focus-visible:ring-offset-h-paper" : "focus-visible:ring-offset-h-void"
        }`}
      >
        <span
          aria-hidden
          className={`flex h-5 w-5 items-center justify-center rounded-full text-[12px] font-semibold leading-none transition-colors duration-200 group-hover:bg-h-accent ${
            jasno
              ? "bg-h-dark/15 text-h-dark-soft group-hover:text-h-paper"
              : "bg-h-ink/15 text-h-ink-soft group-hover:text-h-void"
          }`}
        >
          i
        </span>
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 w-max max-w-[22rem] -translate-x-1/2 rounded-md bg-h-night px-4 py-3 text-left text-[13px] font-normal leading-[1.45] text-h-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {tekst}
      </span>
    </span>
  );
}

/**
 * Cytat ze znakiem cudzysłowu nad nim. Znak jest duży i przygaszony: ma
 * oznaczyć, że to czyjeś słowa, a nie konkurować z samym zdaniem.
 */
export function Cytat({
  cytat,
  autor,
  rola,
  zrodlo,
  className = "",
}: {
  cytat: string;
  autor: string;
  rola: string;
  zrodlo?: string;
  className?: string;
}) {
  return (
    <figure className={`m-0 ${className}`}>
      {/* Znak cudzysłowu rysowany, nie literą: polski „ siada przy linii pisma
          i nad cytatem wygląda, jakby zsunął się z miejsca. */}
      <svg
        aria-hidden
        viewBox="0 0 46 28"
        fill="currentColor"
        className="h-[clamp(1.5rem,3.2vw,2.5rem)] w-auto text-h-accent/35"
      >
        <circle cx="10" cy="10" r="10" />
        <path d="M3 12h14L9 28H1z" />
        <circle cx="36" cy="10" r="10" />
        <path d="M29 12h14l-8 16h-8z" />
      </svg>
      <blockquote className="mt-5 max-w-[34ch] text-balance text-[clamp(1.35rem,2.5vw,2rem)] font-medium leading-[1.18] tracking-[-0.03em] text-h-ink">
        {cytat}
      </blockquote>
      <figcaption className="mt-7 text-[17px] leading-[1.5] text-h-ink">
        {autor}
        <span className="block text-h-ink-soft">{rola}</span>
        {zrodlo ? (
          <span className="mt-2 block text-[13px] leading-[1.45] text-h-ink-soft">
            {zrodlo}
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}

export type Swiatlo = "lewo" | "prawo" | "gora" | "brak";

const ROZBLYSK: Record<Swiatlo, string> = {
  lewo: "radial-gradient(70% 55% at 8% 30%, rgba(255,102,0,0.09), transparent 70%)", // taste-skill-ignore: światło sceny, nie ozdobna plama
  prawo: "radial-gradient(70% 55% at 94% 24%, rgba(255,102,0,0.08), transparent 70%)", // taste-skill-ignore: światło sceny
  gora: "radial-gradient(90% 50% at 50% -6%, rgba(255,255,255,0.07), transparent 72%)", // taste-skill-ignore: światło sceny
  brak: "none",
};

export function Ciemna({
  children,
  id,
  swiatlo = "lewo",
  powierzchnia = "deep",
  className = "",
}: {
  children: ReactNode;
  id?: string;
  swiatlo?: Swiatlo;
  /** Stopień tonu: `void` najgłębszy, `surface` o stopień jaśniejszy. */
  powierzchnia?: "void" | "deep" | "surface";
  className?: string;
}) {
  // Wartości wprost, nie tokeny motywu: Tailwind nie wygenerował dla nowych
  // tokenów klas, a arbitralne wartości działają zawsze.
  const tlo =
    powierzchnia === "void"
      ? "bg-[#07070a]"
      : powierzchnia === "surface"
        ? "bg-[#13151c]"
        : "bg-[#0b0c11]";

  return (
    <section
      id={id}
      className={`relative z-10 overflow-hidden ${tlo} px-5 py-[clamp(5rem,11vw,9.5rem)] text-h-ink sm:px-8 lg:pl-32 lg:pr-32 ${className}`}
    >
      {swiatlo !== "brak" ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: ROZBLYSK[swiatlo] }}
        />
      ) : null}
      <div aria-hidden className={STYK_GORA} />
      <div aria-hidden className={STYK_DOL} />
      <div className="relative">{children}</div>
    </section>
  );
}
