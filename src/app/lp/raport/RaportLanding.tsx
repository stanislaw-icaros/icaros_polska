"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import LegalLinks from "@/components/LegalLinks";
import ConsentFields from "@/components/ConsentFields";
import { DISCLAIMER_MEDICAL_DEVICES } from "@/lib/legal";
import { hasCookieConsent } from "@/lib/cookie-consent";
import { LEAD_STORAGE_KEY } from "./lib/quiz";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REPORT_TICKS = [
  "Realne dane finansowe i modele leasingu",
  "Wyniki 9 badań klinicznych nad terapią VR",
  "Doświadczenia 100+ klinik w Europie",
];

export default function RaportLanding() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [dataConsent, setDataConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const utm = useMemo(
    () => ({
      utm_source: searchParams.get("utm_source") || undefined,
      utm_medium: searchParams.get("utm_medium") || undefined,
      utm_campaign: searchParams.get("utm_campaign") || undefined,
      utm_content: searchParams.get("utm_content") || undefined,
    }),
    [searchParams]
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;

    const cleanFirstName = firstName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanCompany = company.trim();

    if (!cleanFirstName) {
      setErrorMessage("Podaj swoje imię.");
      return;
    }
    if (!EMAIL_PATTERN.test(cleanEmail)) {
      setErrorMessage("Podaj prawidłowy adres e-mail.");
      return;
    }
    if (!cleanCompany) {
      setErrorMessage("Podaj nazwę placówki.");
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
        body: JSON.stringify({
          firstName: cleanFirstName,
          email: cleanEmail,
          company: cleanCompany,
          marketingConsent,
          utm,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Nie udało się wysłać formularza.");
      }

      try {
        window.sessionStorage.setItem(
          LEAD_STORAGE_KEY,
          JSON.stringify({
            firstName: cleanFirstName,
            email: cleanEmail,
            company: cleanCompany,
            marketingConsent,
            utm,
          })
        );
      } catch {
        // sessionStorage niedostępne - quiz dalej zadziała bez przeniesionych danych
      }

      if (
        typeof window !== "undefined" &&
        hasCookieConsent("marketing") &&
        typeof window.fbq === "function"
      ) {
        window.fbq("track", "Lead", { content_name: "lead-magnet-raport" });
      }

      router.push("/lp/raport/quiz");
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Wystąpił błąd podczas wysyłki."
      );
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-x-hidden bg-foreground text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 58% 48% at 80% 26%, rgba(255,102,0,0.20), transparent 68%)" }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 50% 50% at 8% 92%, rgba(255,123,31,0.08), transparent 72%)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
        }}
      />

      <header className="relative z-10 px-6 pt-7 sm:px-10 sm:pt-8 lg:px-16">
        <Image
          src="/icaros-logo.webp"
          alt="ICAROS Polska"
          width={1000}
          height={135}
          priority
          className="h-[21px] w-auto"
        />
      </header>

      <section className="relative z-10 flex flex-1 items-center px-6 py-10 sm:px-10 sm:py-14 lg:px-16">
        <div className="mx-auto w-full max-w-[1080px]">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[43fr_57fr] lg:gap-14 xl:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto w-full max-w-[260px] sm:max-w-[300px] lg:max-w-none"
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
                  <span className="mt-0.5 block text-[12px] font-bold tracking-tight text-white">
                    12 stron
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-7" style={{ background: "linear-gradient(90deg,#ff6600,#ff7b1f)" }} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
                  Bezpłatny raport
                </span>
              </div>

              <h1 className="mt-5 text-[clamp(1.95rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.04em]">
                Jak technologia VR zmienia rehabilitację w Europie
              </h1>

              <p className="mt-4 max-w-[440px] text-[15px] leading-[1.7] text-white/65 sm:text-[16px]">
                Konkretne dane dla placówek rehabilitacyjnych: realne liczby,
                badania kliniczne i doświadczenia klinik z całej Europy.
              </p>

              <ul className="mt-6 space-y-2.5">
                {REPORT_TICKS.map((tick) => (
                  <li key={tick} className="flex items-center gap-3 text-[14px] text-white/75">
                    <svg
                      className="h-4 w-4 shrink-0 text-brand-orange"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {tick}
                  </li>
                ))}
              </ul>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-7 border border-white/10 bg-white/[0.03] p-5 sm:p-6"
              >
                <div className="space-y-3">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="Twoje imię"
                    aria-label="Imię"
                    autoComplete="given-name"
                    className="w-full border border-white/15 bg-white/[0.04] px-4 py-3.5 text-[15px] text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-orange"
                    required
                  />
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
                    placeholder="Nazwa Twojej placówki"
                    aria-label="Nazwa placówki"
                    autoComplete="organization"
                    className="w-full border border-white/15 bg-white/[0.04] px-4 py-3.5 text-[15px] text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-orange"
                    required
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
                    className="w-full px-7 py-4 text-[14.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
                  >
                    {isSubmitting ? "Wysyłanie..." : "Pobierz bezpłatny raport →"}
                  </button>
                </div>

                {errorMessage ? (
                  <p className="mt-3 text-[13px] text-red-400">{errorMessage}</p>
                ) : null}

                <div className="mt-3.5 flex items-center gap-2 text-[11.5px] text-white/40">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  Zero spamu. Raport trafia na maila od razu.
                </div>
              </form>

              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/40">
                <span>100+ klinik w Europie</span>
                <span className="text-white/20">·</span>
                <span>9 badań klinicznych</span>
                <span className="text-white/20">·</span>
                <span>Made in Germany</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-6 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1080px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <LegalLinks
            className="flex flex-wrap items-center gap-5"
            linkClassName="text-[11px] text-white/40 transition-colors hover:text-white/80"
          />
          <p className="text-[11px] text-white/30">
            © {new Date().getFullYear()} ICAROS Polska - oficjalny dystrybutor ICAROS w Polsce.
          </p>
        </div>
        <p className="mx-auto mt-3 max-w-[1080px] text-[11px] leading-[1.7] text-white/25">
          {DISCLAIMER_MEDICAL_DEVICES}
        </p>
      </footer>
    </main>
  );
}
