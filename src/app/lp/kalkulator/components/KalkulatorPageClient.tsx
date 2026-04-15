"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import LoadingScreen from "./LoadingScreen";
import ResultsPanel from "./ResultsPanel";
import AdjustmentSliders from "./AdjustmentSliders";
import ContactForm from "./ContactForm";
import KalkulatorFaq from "./FAQ";
import { formatCurrency } from "../lib/calculations";
import {
  DAYS_MAP,
  HOURS_MAP,
  STAFF_MAP,
  calculateFromAnswers,
  runSimulation,
} from "../lib/calculations";
import type {
  FacilityTypeKey,
  HoursBandKey,
  QuizAnswers,
  StaffBandKey,
  WorkingDaysBandKey,
} from "../lib/types";

const FACILITY_OPTIONS: { key: FacilityTypeKey; label: string }[] = [
  { key: "klinika", label: "Prywatna klinika rehabilitacyjna" },
  { key: "fizjoterapia", label: "Centrum fizjoterapii" },
  { key: "poliklinika", label: "Centrum medyczne / poliklinika" },
  { key: "wellness", label: "Obiekt wellness lub SPA" },
  { key: "sport", label: "Centrum sportowe / klub fitness" },
  { key: "senior", label: "Centrum seniora" },
  { key: "inne", label: "Inne" },
];

const HOURS_OPTIONS: { key: HoursBandKey; label: string }[] = [
  { key: "do4", label: "Do 4 godzin" },
  { key: "4-6", label: "4-6 godzin" },
  { key: "6-8", label: "6-8 godzin" },
  { key: "8-10", label: "8-10 godzin" },
  { key: "pow10", label: "Powyżej 10 godzin" },
];

const STAFF_OPTIONS: { key: StaffBandKey; label: string }[] = [
  { key: "1", label: "1 osoba" },
  { key: "2-3", label: "2-3 osoby" },
  { key: "4-6", label: "4-6 osób" },
  { key: "7plus", label: "7 lub więcej" },
];

const DAYS_OPTIONS: { key: WorkingDaysBandKey; label: string }[] = [
  { key: "do18", label: "Do 18 dni" },
  { key: "18-20", label: "18-20 dni" },
  { key: "20-22", label: "20-22 dni" },
  { key: "pow22", label: "Powyżej 22 dni" },
];

function OptionCard({
  selected,
  children,
  onClick,
}: {
  selected: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left border px-5 py-4 transition-all duration-300 ${
        selected
          ? "border-brand-orange bg-brand-orange/[0.04] text-foreground"
          : "border-foreground/[0.08] bg-white text-foreground/70 hover:border-foreground/20"
      }`}
    >
      {children}
    </button>
  );
}

export default function KalkulatorPageClient() {
  const searchParams = useSearchParams();

  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [answers, setAnswers] = useState<QuizAnswers>({
    facilityType: null,
    hoursBand: null,
    staffBand: null,
    baseSessionPrice: 100,
    workingDaysBand: null,
  });

  const baseResult = useMemo(() => calculateFromAnswers(answers), [answers]);

  const [sessionsOverride, setSessionsOverride] = useState<number | null>(null);
  const [priceOverride, setPriceOverride] = useState<number | null>(null);
  const [daysOverride, setDaysOverride] = useState<number | null>(null);

  const result = useMemo(() => {
    if (!baseResult || !answers.hoursBand || !answers.staffBand || !answers.workingDaysBand || !answers.baseSessionPrice) {
      return null;
    }
    return runSimulation({
      mappedHours: HOURS_MAP[answers.hoursBand],
      mappedStaff: STAFF_MAP[answers.staffBand],
      mappedDays: DAYS_MAP[answers.workingDaysBand],
      baseSessionPrice: answers.baseSessionPrice,
      sessionOverride: sessionsOverride ?? undefined,
      icarosPriceOverride: priceOverride ?? undefined,
      daysOverride: daysOverride ?? undefined,
    });
  }, [answers, baseResult, daysOverride, priceOverride, sessionsOverride]);

  const utm = useMemo(
    () => ({
      utm_source: searchParams.get("utm_source") || undefined,
      utm_medium: searchParams.get("utm_medium") || undefined,
      utm_campaign: searchParams.get("utm_campaign") || undefined,
      utm_content: searchParams.get("utm_content") || undefined,
    }),
    [searchParams]
  );

  const facilityLabel = FACILITY_OPTIONS.find((item) => item.key === answers.facilityType)?.label ?? "Brak";
  const hoursLabel = HOURS_OPTIONS.find((item) => item.key === answers.hoursBand)?.label ?? "Brak";
  const staffLabel = STAFF_OPTIONS.find((item) => item.key === answers.staffBand)?.label ?? "Brak";
  const daysLabel = DAYS_OPTIONS.find((item) => item.key === answers.workingDaysBand)?.label ?? "Brak";

  function CountMoney({ value }: { value: number }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      const duration = 950;
      const start = performance.now();

      const update = (timestamp: number) => {
        const progress = Math.min(1, (timestamp - start) / duration);
        setDisplayValue(Math.round(value * progress));
        if (progress < 1) requestAnimationFrame(update);
      };

      requestAnimationFrame(update);
    }, [value]);

    return <>{formatCurrency(displayValue)}</>;
  }

  function goNext() {
    setStep((prev) => Math.min(5, prev + 1));
  }

  function goBack() {
    setStep((prev) => Math.max(1, prev - 1));
  }

  function handleCalculate() {
    if (!baseResult) return;
    setIsCalculating(true);
    setShowResults(false);
    setTimeout(() => {
      setIsCalculating(false);
      setShowResults(true);
      setSessionsOverride(baseResult.sessionsPerDay);
      setPriceOverride(baseResult.icarosSessionPrice);
      setDaysOverride(baseResult.mappedDays);
    }, 2500);
  }

  function resetQuiz() {
    setShowResults(false);
    setIsCalculating(false);
    setStep(1);
  }

  return (
    <main className="bg-white min-h-screen overflow-x-hidden">
      {!started ? (
        <>
        <section className="grid grid-cols-1 lg:grid-cols-[45fr_55fr] min-h-[100svh]">
          <div className="bg-foreground text-white flex items-center px-6 lg:px-14 xl:px-20 py-12 sm:py-14 lg:py-0">
            <div className="max-w-[520px] lg:mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="w-12 h-[2px] mb-8 hidden lg:block" style={{ background: "linear-gradient(90deg, #ff6600, #ff7b1f)" }} />
                <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white/35">
                  Kalkulator ROI
                </p>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="mt-5 text-[clamp(2.05rem,7.2vw,3.4rem)] leading-[0.93] font-bold tracking-[-0.04em]"
              >
                Ile dodatkowych
                <br />
                przychodów
                <br />
                miesięcznie generuje
                <br />
                ICAROS w&nbsp;klinice
                <br />
                takiej jak Twoja?
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-6 text-[14px] leading-[1.75] text-white/55 max-w-[420px]"
              >
                5 pytań. 2 minuty. Wynik dopasowany do Twojej placówki.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="mt-8"
              >
                <button
                  type="button"
                  onClick={() => setStarted(true)}
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-white text-[14px] font-semibold hover:opacity-90 transition-all duration-500"
                  style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
                >
                  Zacznij analizę
                  <svg
                    className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.85 }}
                className="mt-10 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-8"
              >
                {[
                  { value: "9+", label: "Badań klinicznych" },
                  { value: "DE", label: "Made in Germany" },
                  { value: "5 lat", label: "Gwarancja" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.value}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.95 + i * 0.12, duration: 0.5 }}
                  >
                    <div className="text-[22px] font-bold tracking-tight text-white">
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-white/30 mt-1 tracking-[0.08em] sm:tracking-[0.15em] uppercase font-medium leading-tight">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          <div className="relative min-h-[38svh] sm:min-h-[44svh] lg:min-h-0 overflow-hidden">
            <Image
              src="/hero-icaros.webp"
              alt="ICAROS Health — nowoczesna rehabilitacja z wirtualną rzeczywistością"
              fill
              priority
              fetchPriority="high"
              className="object-cover object-[40%_center]"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-foreground/50 to-transparent pointer-events-none" />

            <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10 z-10 bg-white/90 backdrop-blur-xl px-6 py-4 border border-foreground/[0.06]">
              <div className="text-[10px] text-foreground/30 uppercase tracking-[0.2em] font-medium">
                Na zdjęciu
              </div>
              <div className="text-[14px] font-semibold text-foreground mt-1">
                ICAROS Health
              </div>
              <div className="text-[12px] text-foreground/40 mt-0.5">
                Certyfikowany wyrób medyczny &middot; Klasa I
              </div>
            </div>
          </div>
        </section>
        </>
      ) : null}

      {started && !isCalculating && !showResults ? (
        <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-foreground px-0">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 45% at 50% 50%, rgba(255,102,0,0.14), transparent 70%), radial-gradient(ellipse 35% 30% at 50% 50%, rgba(255,123,31,0.08), transparent 60%)" }} />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

          <div className="relative z-10 w-full max-w-[680px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-14">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white/30">
                Krok {step} z 5
              </p>
              <div className="mt-3 h-[2px] w-full bg-white/10">
                <div className="h-full transition-all duration-500" style={{ width: `${(step / 5) * 100}%`, background: "linear-gradient(90deg, #ff6600, #ff7b1f)" }} />
              </div>
            </motion.div>

            <div className="relative">
              <div
                className="absolute -inset-10 lg:-inset-16 -z-10 blur-3xl opacity-60 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,102,0,0.35), rgba(255,123,31,0.15) 50%, transparent 80%)" }}
              />

            <motion.div
              key={step}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative bg-white border border-foreground/[0.06] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] max-h-[78svh] sm:max-h-[75svh] flex flex-col"
            >
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8 pb-0">

            {step === 1 ? (
              <section>
                <h2 className="text-[clamp(1.5rem,3vw,2.1rem)] font-bold tracking-[-0.03em] text-foreground">
                  Jaki rodzaj placówki prowadzisz?
                </h2>
                <div className="mt-5 space-y-2.5">
                  {FACILITY_OPTIONS.map((option) => (
                    <OptionCard
                      key={option.key}
                      selected={answers.facilityType === option.key}
                      onClick={() => { setAnswers((prev) => ({ ...prev, facilityType: option.key })); goNext(); }}
                    >
                      {option.label}
                    </OptionCard>
                  ))}
                </div>
              </section>
            ) : null}

            {step === 2 ? (
              <section>
                <h2 className="text-[clamp(1.5rem,3vw,2.1rem)] font-bold tracking-[-0.03em] text-foreground">
                  Ile godzin dziennie jest otwarta Twoja placówka?
                </h2>
                <div className="mt-5 space-y-2.5">
                  {HOURS_OPTIONS.map((option) => (
                    <OptionCard
                      key={option.key}
                      selected={answers.hoursBand === option.key}
                      onClick={() => setAnswers((prev) => ({ ...prev, hoursBand: option.key }))}
                    >
                      {option.label}
                    </OptionCard>
                  ))}
                </div>
                <p className="mt-4 text-[12px] text-foreground/45">
                  Jeśli godziny różnią się w zależności od dnia, wybierz typowy dzień roboczy.
                </p>
              </section>
            ) : null}

            {step === 3 ? (
              <section>
                <h2 className="text-[clamp(1.5rem,3vw,2.1rem)] font-bold tracking-[-0.03em] text-foreground">
                  Ilu fizjoterapeutów pracuje na zmianie?
                </h2>
                <div className="mt-5 space-y-2.5">
                  {STAFF_OPTIONS.map((option) => (
                    <OptionCard
                      key={option.key}
                      selected={answers.staffBand === option.key}
                      onClick={() => setAnswers((prev) => ({ ...prev, staffBand: option.key }))}
                    >
                      {option.label}
                    </OptionCard>
                  ))}
                </div>
                <p className="mt-4 text-[12px] text-foreground/45 leading-relaxed">
                  Chodzi o osoby bezpośrednio pracujące z pacjentem, nie recepcję ani administrację.
                </p>
              </section>
            ) : null}

            {step === 4 ? (
              <section>
                <h2 className="text-[clamp(1.5rem,3vw,2.1rem)] font-bold tracking-[-0.03em] text-foreground">
                  Jaka jest średnia cena standardowej sesji (30 min)?
                </h2>
                <div className="mt-5 max-w-[340px]">
                  <label className="text-[12px] uppercase tracking-[0.08em] text-foreground/45">Cena w PLN</label>
                  <div className="mt-2 flex items-center border border-foreground/[0.1]">
                    <input
                      type="number"
                      min={40}
                      max={500}
                      value={answers.baseSessionPrice ?? ""}
                      onChange={(event) =>
                        setAnswers((prev) => ({
                          ...prev,
                          baseSessionPrice: Number(event.target.value || 0),
                        }))
                      }
                      className="w-full px-4 py-3 text-[16px] outline-none"
                    />
                    <span className="px-4 text-foreground/45 text-[14px]">zł</span>
                  </div>
                </div>
                <p className="mt-4 text-[12px] text-foreground/45">
                  Jeśli nie wiesz dokładnie, wpisz 100 zł. Typowy zakres to 60-200 zł za 30 minut.
                </p>
              </section>
            ) : null}

            {step === 5 ? (
              <section>
                <h2 className="text-[clamp(1.5rem,3vw,2.1rem)] font-bold tracking-[-0.03em] text-foreground">
                  Ile dni w miesiącu działa Twoja placówka?
                </h2>
                <div className="mt-5 space-y-2.5">
                  {DAYS_OPTIONS.map((option) => (
                    <OptionCard
                      key={option.key}
                      selected={answers.workingDaysBand === option.key}
                      onClick={() => setAnswers((prev) => ({ ...prev, workingDaysBand: option.key }))}
                    >
                      {option.label}
                    </OptionCard>
                  ))}
                </div>
                <p className="mt-4 text-[12px] text-foreground/45">
                  Nie wiesz? Wybierz 20-22 dni — to standard dla większości placówek w Polsce.
                </p>
              </section>
            ) : null}

              </div>

              <div
                className="shrink-0 border-t border-foreground/[0.06] px-5 sm:px-6 lg:px-8 py-4 flex items-center justify-between bg-white"
                style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}
              >
                {step > 1 ? (
                  <button type="button" onClick={goBack} className="text-[13px] text-foreground/40 hover:text-foreground transition-colors">
                    ← Wstecz
                  </button>
                ) : <span />}
                {step < 5 ? (
                  <button
                    type="button"
                    disabled={
                      (step === 1 && !answers.facilityType) ||
                      (step === 2 && !answers.hoursBand) ||
                      (step === 3 && !answers.staffBand) ||
                      (step === 4 && (!answers.baseSessionPrice || answers.baseSessionPrice < 40))
                    }
                    onClick={goNext}
                    className="px-7 py-3 text-white text-[14px] font-semibold disabled:opacity-40 transition-opacity"
                    style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
                  >
                    Dalej →
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!answers.workingDaysBand || !baseResult}
                    onClick={handleCalculate}
                    className="px-7 py-3 text-white text-[14px] font-semibold disabled:opacity-40 transition-opacity"
                    style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
                  >
                    Pokaż mi wynik →
                  </button>
                )}
              </div>
            </motion.div>
            </div>
          </div>
        </section>
      ) : null}

      {isCalculating ? <LoadingScreen /> : null}

      {showResults && result ? (
        <>
          <section className="relative min-h-[100svh] overflow-hidden bg-foreground text-white">
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(255,102,0,0.10), transparent 70%)" }} />
              <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

              <div className="relative z-10 max-w-[1100px] mx-auto px-5 sm:px-6 lg:px-10 min-h-[100svh] flex items-center">
                <div className="w-full py-16 sm:py-20">
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <div className="w-12 h-[2px]" style={{ background: "linear-gradient(90deg, #ff6600, #ff7b1f)" }} />
                    <p className="mt-5 text-[10px] font-semibold tracking-[0.32em] uppercase text-white/35">
                      Wynik analizy ROI
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="mt-8"
                  >
                    <p className="text-[14px] text-white/50">
                      Szacowany dodatkowy zysk netto z ICAROS
                    </p>
                    <div className="mt-3 flex items-baseline gap-3">
                      <span
                        className="text-[clamp(3.1rem,10vw,6.5rem)] font-bold tracking-[-0.04em] leading-none"
                        style={{ background: "linear-gradient(135deg, #ffffff 0%, #ff7b1f 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                      >
                        <CountMoney value={result.profit60} />
                      </span>
                      <span className="text-[clamp(1.2rem,2.5vw,2rem)] font-bold text-white/60 tracking-tight">
                        zł / mies.
                      </span>
                    </div>
                    <p className="mt-2 text-[12px] text-white/40">
                      po odjęciu raty leasingowej (60 mies.) · przy 50% zapełnienia
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10"
                  >
                    {[
                      { label: "Sesje ICAROS / dzień", value: String(result.sessionsPerDay), sub: "Konserwatywnie, 50% zapełnienia" },
                      { label: "Dodatkowy przychód", value: null, money: result.monthlyRevenue, sub: "Przychód brutto / miesiąc" },
                      { label: "Rata leasingowa", value: formatCurrency(result.leasing60) + " zł", sub: "Netto / miesiąc (60 mies.)" },
                    ].map((card) => (
                      <div key={card.label} className="bg-foreground p-5 lg:p-6">
                        <div className="text-[10px] uppercase tracking-[0.18em] text-white/30 font-medium">
                          {card.label}
                        </div>
                        <div className="mt-3 text-[24px] font-bold tracking-tight text-white">
                          {card.money != null ? <><CountMoney value={card.money} /> zł</> : card.value}
                        </div>
                        <div className="mt-1.5 text-[11px] text-white/40">
                          {card.sub}
                        </div>
                      </div>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="mt-6 border border-white/10 bg-white/5 p-4 lg:p-5 text-[13px] text-white/55 leading-[1.7] max-w-[720px]"
                  >
                    {facilityLabel} · {hoursLabel} · {staffLabel} · {answers.baseSessionPrice} zł/sesję · {daysLabel}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                    className="mt-8 flex flex-wrap items-center gap-5"
                  >
                    <a
                      href="#wyniki-szczegoly"
                      className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-white text-[14px] font-semibold hover:opacity-90 transition-all duration-500"
                      style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
                    >
                      Zobacz pełną analizę
                      <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-4-4m4 4l4-4" />
                      </svg>
                    </a>
                    <button
                      type="button"
                      onClick={resetQuiz}
                      className="text-[13px] text-white/45 hover:text-white transition-colors"
                    >
                      Zmień dane
                    </button>
                  </motion.div>
                </div>
              </div>
            </section>

          <section
            id="wyniki-szczegoly"
            className="max-w-[1100px] mx-auto px-6 lg:px-10 py-14 lg:py-20"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 96px)" }}
          >
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <ResultsPanel result={result} />

            <AdjustmentSliders
              sessionsPerDay={sessionsOverride ?? result.sessionsPerDay}
              icarosSessionPrice={priceOverride ?? result.icarosSessionPrice}
              daysInMonth={daysOverride ?? result.mappedDays}
              onSessionsChange={setSessionsOverride}
              onPriceChange={setPriceOverride}
              onDaysChange={setDaysOverride}
            />

            <section className="mt-12 border border-foreground/[0.08] bg-white p-6 lg:p-10">
              <h3 className="text-[24px] font-bold tracking-[-0.02em] text-foreground">
                Ta analiza jest celowo konserwatywna.
              </h3>
              <p className="mt-3 text-[14px] text-foreground/45">
                Nie uwzględniamy części efektów, które często pojawiają się po wdrożeniu:
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="border border-foreground/[0.08] p-5">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-9 h-9 flex items-center justify-center border border-foreground/[0.08]">
                      <svg className="w-4 h-4 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-foreground">Nowych klientów</p>
                      <p className="mt-1.5 text-[13px] text-foreground/50 leading-[1.7]">
                        Placówki z ICAROS regularnie otrzymują zapytania od pacjentów szukających innowacyjnej rehabilitacji.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border border-foreground/[0.08] p-5">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-9 h-9 flex items-center justify-center border border-foreground/[0.08]">
                      <svg className="w-4 h-4 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" /></svg>
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-foreground">Dłuższych ścieżek terapii</p>
                      <p className="mt-1.5 text-[13px] text-foreground/50 leading-[1.7]">
                        Pacjenci rozpoczynający terapię z ICAROS częściej kontynuują rehabilitację przez dłuższy czas.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border border-foreground/[0.08] p-5">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-9 h-9 flex items-center justify-center border border-foreground/[0.08]">
                      <svg className="w-4 h-4 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-foreground">Przewagi konkurencyjnej</p>
                      <p className="mt-1.5 text-[13px] text-foreground/50 leading-[1.7]">
                        Urządzenie VR klasy medycznej buduje unikatową pozycję placówki na rynku lokalnym.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border border-foreground/[0.08] p-5">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-9 h-9 flex items-center justify-center border border-foreground/[0.08]">
                      <svg className="w-4 h-4 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" /></svg>
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-foreground">Efektu skali</p>
                      <p className="mt-1.5 text-[13px] text-foreground/50 leading-[1.7]">
                        Kalkulacja zakłada 50% zapełnienia. Wiele placówek po kilku miesiącach dochodzi do 70-80%.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-12 border border-foreground/[0.08] bg-white p-6 lg:p-10">
              <h3 className="text-[24px] font-bold tracking-[-0.02em] text-foreground">
                Jak to działa w praktyce?
              </h3>
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-[15px] text-foreground/60 leading-[1.9]">
                    ICAROS Circle działa równolegle do standardowych sesji. Fizjoterapeuta prowadzi terapię z
                    pacjentem A, a pacjent B realizuje sesję ICAROS pod minimalnym nadzorem. Nie musisz wydłużać
                    godzin pracy ani zatrudniać nowego etatu.
                  </p>
                  <ul className="mt-5 space-y-2 text-[14px] text-foreground/70">
                    <li>• nowa linia przychodów</li>
                    <li>• wykorzystanie istniejącej przestrzeni</li>
                    <li>• skalowanie bez dodatkowego etatu</li>
                  </ul>
                </div>
                <div className="relative w-full h-[260px] lg:h-[320px] overflow-hidden border border-foreground/[0.08]">
                  <Image
                    src="/hero-icaros.webp"
                    alt="ICAROS w użyciu"
                    fill
                    className="object-cover object-[86%_center] sm:object-[78%_center] lg:object-[70%_center] scale-[1.12] sm:scale-[1.14] lg:scale-[1.15]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </section>

            <div id="kontakt-kalkulator">
              <ContactForm
                utm={utm}
                facilityTypeLabel={facilityLabel}
                hoursLabel={hoursLabel}
                staffLabel={staffLabel}
                daysLabel={daysLabel}
                pricePerSession={answers.baseSessionPrice || 100}
                result={result}
              />
            </div>

              <KalkulatorFaq />
            </motion.div>
          </section>

          <div className="fixed bottom-0 left-0 right-0 z-50 bg-foreground/95 backdrop-blur-lg border-t border-white/10">
            <div
              className="max-w-[1100px] mx-auto px-5 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-4"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
            >
              <div className="hidden sm:block">
                <span className="text-[13px] text-white/50">Szacowany zysk netto: </span>
                <span className="text-[15px] font-bold text-white">{formatCurrency(result.profit60)} zł / mies.</span>
              </div>
              <a
                href="#kontakt-kalkulator"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-white text-[13px] font-semibold hover:opacity-90 transition-opacity ml-auto"
                style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
              >
                Porozmawiajmy
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
          </div>
        </>
      ) : null}
    </main>
  );
}

