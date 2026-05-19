"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import LegalLinks from "@/components/LegalLinks";
import ConsentFields from "@/components/ConsentFields";
import { DISCLAIMER_MEDICAL_DEVICES } from "@/lib/legal";
import { hasCookieConsent } from "@/lib/cookie-consent";
import {
  FACILITY_OPTIONS,
  PATIENTS_OPTIONS,
  TECH_OPTIONS,
  LEAD_STORAGE_KEY,
  calculateQuizResult,
  facilityLabel,
  patientsLabel,
  techLabel,
  formatCurrency,
  type FacilityType,
  type LeadHandoff,
  type PatientsBand,
  type QuizAnswers,
  type TechInterest,
} from "../lib/quiz";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const TOTAL_STEPS = 3;

const BAND_MESSAGE: Record<PatientsBand, string> = {
  "1-5": "Już przy 2 sesjach VR dziennie system finansuje sam siebie i zaczyna pracować na zysk.",
  "6-15": "Przy Waszym przepływie pacjentów ICAROS staje się stabilną, dodatkową linią przychodu.",
  "16-30": "Przy Waszej liczbie pacjentów ICAROS realnie podnosi miesięczny wynik placówki.",
  "30+": "Przy Waszej skali zwrot z inwestycji może nastąpić już w pierwszym roku.",
};

const TECH_MESSAGE: Record<TechInterest, string> = {
  aktywnie:
    "Skoro aktywnie szukacie nowych technologii - to dobry moment, żeby zobaczyć konkretne liczby na żywo.",
  zainteresowani:
    "Jeśli temat Was interesuje, krótka rozmowa pomoże ocenić, czy to ma sens akurat u Was.",
  tradycyjne:
    "Nawet jeśli stawiacie na sprawdzone metody, warto wiedzieć, jak VR uzupełnia klasyczną terapię.",
};

function CountMoney({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const duration = 900;
    const start = performance.now();
    cancelAnimationFrame(rafRef.current);
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return <>{formatCurrency(display)}</>;
}

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left border px-5 py-4 text-[15px] transition-all duration-200 ${
        selected
          ? "border-brand-orange bg-brand-orange/[0.05] text-foreground"
          : "border-foreground/[0.1] bg-white text-foreground/75 hover:border-foreground/30"
      }`}
    >
      {label}
    </button>
  );
}

export default function QuizClient() {
  const [lead, setLead] = useState<LeadHandoff | null>(null);
  const [phase, setPhase] = useState<"quiz" | "calculating" | "result">("quiz");
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    facilityType: null,
    patientsBand: null,
    techInterest: null,
  });

  const [firstName, setFirstName] = useState("");
  const [nip, setNip] = useState("");
  const [phone, setPhone] = useState("");
  const [dataConsent, setDataConsent] = useState(false);
  const [fallbackEmail, setFallbackEmail] = useState("");
  const [fallbackCompany, setFallbackCompany] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(LEAD_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as LeadHandoff;
        setLead(parsed);
        if (parsed.firstName) setFirstName(parsed.firstName);
      }
    } catch {
      // brak danych z poprzedniego kroku - quiz dalej działa
    }
  }, []);

  const result = useMemo(() => calculateQuizResult(answers), [answers]);

  function selectFacility(value: FacilityType) {
    setAnswers((prev) => ({ ...prev, facilityType: value }));
    setStep(2);
  }

  function selectPatients(value: PatientsBand) {
    setAnswers((prev) => ({ ...prev, patientsBand: value }));
    setStep(3);
  }

  function selectTech(value: TechInterest) {
    setAnswers((prev) => ({ ...prev, techInterest: value }));
    setPhase("calculating");
    if (
      typeof window !== "undefined" &&
      hasCookieConsent("marketing") &&
      typeof window.fbq === "function"
    ) {
      window.fbq("trackCustom", "QuizComplete");
    }
    window.setTimeout(() => {
      setPhase("result");
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 1900);
  }

  async function handlePhoneSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting || !result) return;

    const cleanFirstName = firstName.trim();
    const company = (lead?.company || fallbackCompany).trim();
    const email = (lead?.email || fallbackEmail).trim().toLowerCase();
    const nipDigits = nip.replace(/\D/g, "");
    const phoneDigits = phone.replace(/\D/g, "");

    if (!cleanFirstName) {
      setErrorMessage("Podaj imię osoby kontaktowej.");
      return;
    }
    if (!company) {
      setErrorMessage("Podaj nazwę placówki.");
      return;
    }
    if (nipDigits.length !== 10) {
      setErrorMessage("Podaj NIP placówki - dokładnie 10 cyfr.");
      return;
    }
    if (phoneDigits.length < 9) {
      setErrorMessage("Podaj numer telefonu - co najmniej 9 cyfr.");
      return;
    }
    if (!dataConsent) {
      setErrorMessage("Zaznacz zgodę na przetwarzanie danych.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    const message = [
      "[QUIZ LP /lp/raport]",
      `Typ placówki: ${facilityLabel(answers.facilityType)}`,
      `Pacjentów dziennie: ${patientsLabel(answers.patientsBand)}`,
      `Nowe technologie: ${techLabel(answers.techInterest)}`,
      "",
      "WYNIK QUIZU:",
      `Rekomendowany model: ${result.model.name}`,
      `Szac. sesje VR / dzień: ${result.sessionsPerDay}`,
      `Szac. przychód / mies.: ${formatCurrency(result.monthlyRevenue)} PLN`,
      `Szac. rata leasingu netto / mies.: ${formatCurrency(result.leasingNet, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} PLN`,
      `Szac. zysk netto / mies.: ${formatCurrency(result.monthlyProfit)} PLN`,
      `Szac. zysk roczny: ${formatCurrency(result.yearlyProfit)} PLN`,
    ].join("\n");

    try {
      const response = await fetch("/api/pipedrive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanFirstName,
          email: email || undefined,
          phone: phone.trim(),
          company,
          nip: nipDigits,
          marketingConsent: lead?.marketingConsent,
          role: "Placówka medyczna - quiz raportu",
          message,
          leadSource: "Facebook Ads",
          formSource: "LP raport - quiz (hot lead)",
          page: "/lp/raport/quiz",
          utm: lead?.utm ?? {},
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Nie udało się wysłać zgłoszenia.");
      }

      if (
        typeof window !== "undefined" &&
        hasCookieConsent("marketing") &&
        typeof window.fbq === "function"
      ) {
        window.fbq("trackCustom", "HotLeadQuiz");
        window.fbq("track", "Contact");
      }

      setSuccessMessage(
        "Dziękujemy. Skontaktujemy się z Tobą w ciągu 1 dnia roboczego."
      );
      setFirstName("");
      setNip("");
      setPhone("");
      setDataConsent(false);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Wystąpił błąd podczas wysyłki."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative bg-foreground text-white min-h-[100svh] overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 55% 40% at 50% 30%, rgba(255,102,0,0.14), transparent 70%)" }} />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      {phase === "quiz" ? (
        <section className="relative z-10 min-h-[100svh] flex items-center">
          <div className="w-full max-w-[640px] mx-auto px-5 sm:px-6 py-10 lg:py-14">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="border border-white/10 bg-white/[0.04] px-4 py-3 mb-6"
            >
              <p className="text-[13px] leading-[1.6] text-white/75">
                Twój raport jest w drodze na e-mail. W międzyczasie sprawdź
                w 30 sekund, jak VR mogłoby wyglądać w Twojej placówce.
              </p>
            </motion.div>

            <div className="mb-6">
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white/70">
                Pytanie {step} z {TOTAL_STEPS}
              </p>
              <div className="mt-3 h-[2px] w-full bg-white/10">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${(step / TOTAL_STEPS) * 100}%`,
                    background: "linear-gradient(90deg, #ff6600, #ff7b1f)",
                  }}
                />
              </div>
            </div>

            <motion.div
              key={step}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-white text-foreground border border-white/10 p-5 sm:p-7"
            >
              {step === 1 ? (
                <>
                  <h1 className="text-[clamp(1.4rem,3vw,1.95rem)] font-bold tracking-[-0.03em] leading-[1.12]">
                    Jaki typ placówki prowadzisz?
                  </h1>
                  <div className="mt-5 space-y-2.5">
                    {FACILITY_OPTIONS.map((option) => (
                      <OptionButton
                        key={option.key}
                        label={option.label}
                        selected={answers.facilityType === option.key}
                        onClick={() => selectFacility(option.key)}
                      />
                    ))}
                  </div>
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <h1 className="text-[clamp(1.4rem,3vw,1.95rem)] font-bold tracking-[-0.03em] leading-[1.12]">
                    Ilu pacjentów przyjmujecie dziennie?
                  </h1>
                  <div className="mt-5 space-y-2.5">
                    {PATIENTS_OPTIONS.map((option) => (
                      <OptionButton
                        key={option.key}
                        label={option.label}
                        selected={answers.patientsBand === option.key}
                        onClick={() => selectPatients(option.key)}
                      />
                    ))}
                  </div>
                </>
              ) : null}

              {step === 3 ? (
                <>
                  <h1 className="text-[clamp(1.4rem,3vw,1.95rem)] font-bold tracking-[-0.03em] leading-[1.12]">
                    Czy rozważaliście nowe technologie w terapii?
                  </h1>
                  <div className="mt-5 space-y-2.5">
                    {TECH_OPTIONS.map((option) => (
                      <OptionButton
                        key={option.key}
                        label={option.label}
                        selected={answers.techInterest === option.key}
                        onClick={() => selectTech(option.key)}
                      />
                    ))}
                  </div>
                </>
              ) : null}

              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                  className="mt-5 text-[13px] text-foreground/40 hover:text-foreground transition-colors"
                >
                  ← Wstecz
                </button>
              ) : null}
            </motion.div>
          </div>
        </section>
      ) : null}

      {phase === "calculating" ? (
        <section className="relative z-10 min-h-[100svh] flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-10 h-10 border-2 border-white/15 border-t-brand-orange rounded-full animate-spin"
          />
          <p className="mt-6 text-[14px] text-white/70">
            Liczymy szacunek dla Twojej placówki...
          </p>
        </section>
      ) : null}

      {phase === "result" && result ? (
        <section className="relative z-10 max-w-[860px] mx-auto px-5 sm:px-6 py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-[2px]" style={{ background: "linear-gradient(90deg, #ff6600, #ff7b1f)" }} />
            <p className="mt-5 text-[10px] font-semibold tracking-[0.3em] uppercase text-white/40">
              Wynik dla Twojej placówki
            </p>
            <p className="mt-4 text-[14px] text-white/55">
              Szacowany dodatkowy zysk netto z ICAROS
            </p>
            <div className="mt-2 flex items-baseline gap-3 flex-wrap">
              <span
                className="text-[clamp(2.9rem,9vw,5.6rem)] font-bold tracking-[-0.04em] leading-none"
                style={{ background: "linear-gradient(135deg, #ffffff 0%, #ff7b1f 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                <CountMoney value={result.monthlyProfit} />
              </span>
              <span className="text-[clamp(1.1rem,2.4vw,1.8rem)] font-bold text-white/55 tracking-tight">
                zł / mies.
              </span>
            </div>
            <p className="mt-3 text-[13px] text-white/50 leading-[1.7] max-w-[560px]">
              {answers.patientsBand ? BAND_MESSAGE[answers.patientsBand] : ""}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10"
          >
            {[
              { label: "Sesje VR / dzień", value: String(result.sessionsPerDay), sub: "Konserwatywny scenariusz" },
              { label: "Dodatkowy przychód", value: `${formatCurrency(result.monthlyRevenue)} zł`, sub: "Brutto / miesiąc" },
              { label: "Szacowany zysk roczny", value: `${formatCurrency(result.yearlyProfit)} zł`, sub: "Po racie leasingu, netto" },
            ].map((card) => (
              <div key={card.label} className="bg-foreground p-5">
                <div className="text-[10px] uppercase tracking-[0.16em] text-white/35 font-medium">
                  {card.label}
                </div>
                <div className="mt-2.5 text-[22px] font-bold tracking-tight text-white">
                  {card.value}
                </div>
                <div className="mt-1 text-[11px] text-white/40">{card.sub}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 border border-brand-orange/30 bg-brand-orange/[0.06] p-5"
          >
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-brand-orange">
              Rekomendowany model
            </p>
            <p className="mt-2 text-[18px] font-bold tracking-[-0.02em] text-white">
              {result.model.name}
            </p>
            <p className="mt-1.5 text-[13.5px] leading-[1.7] text-white/60">
              Dobrany do profilu Twojej placówki ({facilityLabel(answers.facilityType)},{" "}
              {patientsLabel(answers.patientsBand)?.toLowerCase()}) -{" "}
              {result.model.purpose}. Szacunkowa rata leasingu:{" "}
              {formatCurrency(result.leasingNet, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              zł netto / mies. (48 rat, 10% wpłaty).
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-5 text-[12.5px] leading-[1.8] text-white/45"
          >
            To szacunek na podstawie danych z polskiego rynku rehabilitacji
            i doświadczeń klinik w Europie. Przyjęto cenę sesji VR{" "}
            {result.sessionPrice} zł i {result.workingDays} dni roboczych
            w miesiącu. Rzeczywiste wyniki zależą od specyfiki Twojej placówki.{" "}
            {answers.techInterest ? TECH_MESSAGE[answers.techInterest] : ""}
          </motion.p>

          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            href="/lp/kalkulator"
            className="mt-4 inline-flex items-center gap-2 text-[13px] text-brand-orange underline decoration-brand-orange/40 underline-offset-4 hover:decoration-brand-orange transition-colors"
          >
            Chcesz policzyć dokładniej? Otwórz pełny kalkulator ROI
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.7 }}
            className="mt-10 bg-white text-foreground p-5 sm:p-7"
          >
            {successMessage ? (
              <div className="text-center py-6">
                <div className="mx-auto w-12 h-12 flex items-center justify-center bg-brand-orange/10">
                  <svg className="w-6 h-6 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="mt-4 text-[16px] font-semibold">{successMessage}</p>
                <p className="mt-1.5 text-[13.5px] text-foreground/55">
                  W międzyczasie zajrzyj do raportu na swojej skrzynce.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-[clamp(1.35rem,2.6vw,1.85rem)] font-bold tracking-[-0.03em] leading-[1.15]">
                  Chcesz sprawdzić, jak to wyglądałoby u Ciebie?
                </h2>
                <p className="mt-2.5 text-[14px] leading-[1.7] text-foreground/60">
                  Oddzwonimy, odpowiemy na pytania i bez zobowiązań pokażemy,
                  jak wdrożenie wyglądałoby konkretnie u Ciebie. Zostaw kilka
                  danych - dzięki nim przygotujemy się do rozmowy.
                </p>

                <form onSubmit={handlePhoneSubmit} className="mt-6 space-y-4" noValidate>
                  <label className="block">
                    <span className="text-[11px] font-medium tracking-[0.06em] uppercase text-foreground/50">
                      Imię osoby kontaktowej
                    </span>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      placeholder="np. Anna"
                      autoComplete="given-name"
                      className="mt-2 w-full border border-foreground/15 px-4 py-3 text-[15px] outline-none focus:border-brand-orange transition-colors"
                    />
                  </label>

                  {!lead?.company ? (
                    <label className="block">
                      <span className="text-[11px] font-medium tracking-[0.06em] uppercase text-foreground/50">
                        Nazwa placówki
                      </span>
                      <input
                        type="text"
                        value={fallbackCompany}
                        onChange={(event) => setFallbackCompany(event.target.value)}
                        autoComplete="organization"
                        className="mt-2 w-full border border-foreground/15 px-4 py-3 text-[15px] outline-none focus:border-brand-orange transition-colors"
                      />
                    </label>
                  ) : null}

                  {!lead?.email ? (
                    <label className="block">
                      <span className="text-[11px] font-medium tracking-[0.06em] uppercase text-foreground/50">
                        Adres e-mail
                      </span>
                      <input
                        type="email"
                        value={fallbackEmail}
                        onChange={(event) => setFallbackEmail(event.target.value)}
                        autoComplete="email"
                        className="mt-2 w-full border border-foreground/15 px-4 py-3 text-[15px] outline-none focus:border-brand-orange transition-colors"
                      />
                    </label>
                  ) : null}

                  <label className="block">
                    <span className="text-[11px] font-medium tracking-[0.06em] uppercase text-foreground/50">
                      NIP placówki
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={nip}
                      onChange={(event) => setNip(event.target.value)}
                      placeholder="10 cyfr"
                      className="mt-2 w-full border border-foreground/15 px-4 py-3 text-[15px] outline-none focus:border-brand-orange transition-colors"
                    />
                    <span className="mt-1.5 block text-[12px] leading-[1.6] text-foreground/45">
                      Potrzebny, by zweryfikować placówkę i przygotować propozycję
                      dopasowaną do Twojej działalności.
                    </span>
                  </label>

                  <label className="block">
                    <span className="text-[11px] font-medium tracking-[0.06em] uppercase text-foreground/50">
                      Numer telefonu
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="np. 600 700 800"
                      autoComplete="tel"
                      className="mt-2 w-full border border-foreground/15 px-4 py-3 text-[15px] outline-none focus:border-brand-orange transition-colors"
                    />
                  </label>

                  <ConsentFields
                    tone="light"
                    showMarketing={false}
                    dataConsent={dataConsent}
                    onDataConsentChange={setDataConsent}
                  />

                  {errorMessage ? (
                    <p className="text-[13px] text-red-600">{errorMessage}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-7 py-4 text-white text-[14.5px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
                  >
                    {isSubmitting ? "Wysyłanie..." : "Poproś o kontakt →"}
                  </button>
                  <p className="text-[12px] text-foreground/45 text-center">
                    Bez zobowiązań. Oddzwaniamy w ciągu 1 dnia roboczego.
                  </p>
                </form>
              </>
            )}
          </motion.div>

          <p className="mt-10 text-[12px] leading-[1.8] text-white/40">
            {DISCLAIMER_MEDICAL_DEVICES}
          </p>
          <LegalLinks
            className="mt-5 flex flex-wrap items-center gap-5"
            linkClassName="text-[12px] text-white/45 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
          />
        </section>
      ) : null}
    </main>
  );
}
