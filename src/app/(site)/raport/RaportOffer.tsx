"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import ConsentFields from "@/components/ConsentFields";
import { trackMetaEvent } from "@/lib/meta/track";
import { useSpamGuard } from "@/hooks/useSpamGuard";
import { LEAD_STORAGE_KEY } from "@/app/lp/raport/lib/quiz";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REPORT_TICKS = [
  "Realne dane finansowe i modele leasingu",
  "Wyniki 9 badań klinicznych nad terapią VR",
  "Doświadczenia 100+ klinik w Europie",
];

export default function RaportOffer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [dataConsent, setDataConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { spamFields, getSpamSignals } = useSpamGuard();

  const utm = useMemo(
    () => ({
      utm_source: searchParams.get("utm_source") || undefined,
      utm_medium: searchParams.get("utm_medium") || undefined,
      utm_campaign: searchParams.get("utm_campaign") || undefined,
      utm_content: searchParams.get("utm_content") || undefined,
    }),
    [searchParams]
  );

  useEffect(() => {
    trackMetaEvent("ViewContent");
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;

    const cleanEmail = email.trim().toLowerCase();
    const cleanCompany = company.trim();

    if (!EMAIL_PATTERN.test(cleanEmail)) {
      setErrorMessage("Podaj prawidłowy adres e-mail.");
      return;
    }
    if (!dataConsent) {
      setErrorMessage("Zaznacz zgodę na przetwarzanie danych - bez niej nie wyślemy raportu.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...getSpamSignals(), email: cleanEmail, company: cleanCompany, marketingConsent, utm }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Nie udało się wysłać formularza.");
      }

      try {
        window.sessionStorage.setItem(
          LEAD_STORAGE_KEY,
          JSON.stringify({ firstName: "", email: cleanEmail, company: cleanCompany, marketingConsent, utm })
        );
      } catch {
        // sessionStorage niedostępne - quiz dalej zadziała bez przeniesionych danych
      }

      trackMetaEvent("Contact", { email: cleanEmail });
      router.push("/lp/raport/quiz");
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Wystąpił błąd podczas wysyłki.");
      setIsSubmitting(false);
    }
  }

  return (
    <section className="relative overflow-hidden bg-foreground pb-24 pt-32 text-white lg:pb-32 lg:pt-40">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 58% 48% at 82% 22%, rgba(255,102,0,0.20), transparent 68%)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1180px] px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[55fr_45fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-7" style={{ background: "linear-gradient(90deg,#ff6600,#ff7b1f)" }} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">
                Bezpłatny raport
              </span>
            </div>

            <h1 className="mt-5 text-[clamp(1.9rem,4.4vw,3rem)] font-bold leading-[1.05] tracking-[-0.035em]">
              Jak technologia VR zmienia rehabilitację w Europie
            </h1>

            <p className="mt-4 max-w-[460px] text-[15px] leading-[1.75] text-white/65 sm:text-[16px]">
              Konkretne dane dla placówek rehabilitacyjnych: realne liczby, badania
              kliniczne i doświadczenia klinik z całej Europy.
            </p>

            <ul className="mt-6 space-y-3">
              {REPORT_TICKS.map((tick) => (
                <li key={tick} className="flex items-center gap-3 text-[14px] text-white/75">
                  <Check className="h-4 w-4 shrink-0 text-brand-orange" strokeWidth={2.5} />
                  {tick}
                </li>
              ))}
            </ul>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-7 border border-white/10 bg-white/[0.03] p-5 sm:p-6"
            >
              {spamFields}
              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Twój adres e-mail"
                  aria-label="Adres e-mail"
                  autoComplete="email"
                  className="w-full border border-white/15 bg-white/[0.04] px-4 py-3.5 text-[15px] text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-orange"
                  required
                />
                <input
                  type="text"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  placeholder="Nazwa placówki (opcjonalnie)"
                  aria-label="Nazwa placówki"
                  autoComplete="organization"
                  className="w-full border border-white/15 bg-white/[0.04] px-4 py-3.5 text-[15px] text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-orange"
                />
                <ConsentFields
                  tone="dark"
                  className="pt-1"
                  dataConsent={dataConsent}
                  marketingConsent={marketingConsent}
                  onDataConsentChange={setDataConsent}
                  onMarketingConsentChange={setMarketingConsent}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-7 py-[1.05rem] text-[15.5px] font-bold tracking-[0.01em] text-white shadow-[0_14px_30px_-12px_rgba(255,102,0,0.55)] transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
                >
                  {isSubmitting ? "Wysyłanie..." : "Pobierz raport za darmo →"}
                </button>
              </div>

              {errorMessage ? <p className="mt-3 text-[13px] text-red-400">{errorMessage}</p> : null}

              <div className="mt-3.5 flex items-center gap-2 text-[11.5px] text-white/40">
                <Lock className="h-3.5 w-3.5" strokeWidth={1.5} />
                Zero spamu. Raport trafia na maila od razu.
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[280px] lg:max-w-[340px]"
          >
            <div
              className="pointer-events-none absolute -inset-12 -z-10 blur-3xl"
              style={{ background: "radial-gradient(ellipse 58% 58% at 50% 45%, rgba(255,102,0,0.42), transparent 76%)" }}
            />
            <div className="relative rotate-[-3deg] transition-transform duration-700 ease-out hover:rotate-0">
              <div className="overflow-hidden border border-white/10 shadow-[0_44px_90px_-24px_rgba(0,0,0,0.85)]">
                <Image
                  src="/raport-cover.png"
                  alt="Raport: Jak technologia VR zmienia rehabilitację w Europie"
                  width={1240}
                  height={1754}
                  priority
                  className="h-auto w-full"
                />
              </div>
              <div className="absolute -bottom-3.5 -right-3.5 border border-white/10 bg-foreground px-3.5 py-2 shadow-[0_12px_28px_-8px_rgba(0,0,0,0.7)]">
                <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-orange">
                  Raport PDF
                </span>
                <span className="mt-0.5 block text-[12px] font-bold tracking-tight text-white">12 stron</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
