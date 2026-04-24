"use client";

import { useMemo, useState } from "react";
import { formatCurrency } from "../lib/calculations";
import type { CalculatorResult } from "../lib/types";
import { hasCookieConsent } from "@/lib/cookie-consent";
import LegalLinks from "@/components/LegalLinks";
import { DISCLAIMER_MEDICAL_DEVICES } from "@/lib/legal";

type ContactFormProps = {
  utm: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
  };
  facilityTypeLabel: string;
  hoursLabel: string;
  staffLabel: string;
  daysLabel: string;
  pricePerSession: number;
  result: CalculatorResult;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function getDigitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export default function ContactForm({
  utm,
  facilityTypeLabel,
  hoursLabel,
  staffLabel,
  daysLabel,
  pricePerSession,
  result,
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function toErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    return "Wystąpił błąd podczas wysyłki.";
  }

  const calculatorMessage = useMemo(
    () => `[KALKULATOR LP]
Typ placówki: ${facilityTypeLabel}
Godziny/dzień: ${hoursLabel}
Personel: ${staffLabel}
Cena sesji: ${pricePerSession} PLN
Dni/mies.: ${daysLabel}

WYNIKI:
Szac. sesje ICAROS/dzień: ${result.sessionsPerDay}
Szac. przychód ICAROS/mies.: ${formatCurrency(result.monthlyRevenue)} PLN
Szac. zysk netto (60m): ${formatCurrency(result.profit60)} PLN/mies.
Zgoda marketingowa: ${marketingConsent ? "TAK" : "NIE"}`,
    [
      daysLabel,
      facilityTypeLabel,
      hoursLabel,
      marketingConsent,
      pricePerSession,
      result.monthlyRevenue,
      result.profit60,
      result.sessionsPerDay,
      staffLabel,
    ]
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;

    const digits = getDigitsOnly(phone);
    if (digits.length < 9) {
      setErrorMessage("Numer telefonu musi zawierać co najmniej 9 cyfr.");
      return;
    }

    if (!name.trim() || !company.trim()) {
      setErrorMessage("Uzupełnij wymagane pola formularza.");
      return;
    }

    if (marketingConsent && !email.trim()) {
      setErrorMessage("Podaj adres e-mail, aby otrzymywać materiały.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/pipedrive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim(),
          company: company.trim(),
          role: "Właściciel / Menedżer (Kalkulator LP)",
          message: calculatorMessage,
          leadSource: "Kalkulator LP",
          formSource: "LP kalkulator — formularz wyników",
          page: "/lp/kalkulator",
          utm,
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Nie udało się wysłać formularza.");
      }

      // Prepared for Meta Pixel rollout; safe no-op if pixel is not installed.
      if (
        typeof window !== "undefined" &&
        hasCookieConsent("marketing") &&
        typeof window.fbq === "function"
      ) {
        window.fbq("track", "Lead", {
          source: "kalkulator_lp",
          value_estimate: result.profit60,
        });
      }

      setSuccessMessage("Dziękujemy. Oddzwonimy w ciągu 1 dnia roboczego.");
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setMarketingConsent(false);
    } catch (error: unknown) {
      setErrorMessage(toErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-14 sm:mt-16 lg:mt-20 bg-foreground text-white p-5 sm:p-6 lg:p-10">
      <h2 className="text-[clamp(1.6rem,3vw,2.3rem)] font-bold tracking-[-0.03em]">
        Chcesz omówić tę kalkulację dla swojej placówki?
      </h2>
      <p className="mt-4 text-white/70 text-[14px] sm:text-[15px] max-w-2xl leading-[1.8]">
        Skontaktujemy się z Tobą bez zobowiązań i bez presji sprzedażowej. Tylko konkretna rozmowa
        o tym, co ma sens dla Twojego biznesu.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <label className="block">
          <span className="text-[12px] tracking-[0.05em] uppercase text-white/65">Imię i nazwisko *</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full bg-transparent border border-white/20 px-4 py-3 text-[14px] focus:border-white/45 outline-none"
            required
          />
        </label>

        <label className="block">
          <span className="text-[12px] tracking-[0.05em] uppercase text-white/65">Numer telefonu *</span>
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="mt-2 w-full bg-transparent border border-white/20 px-4 py-3 text-[14px] focus:border-white/45 outline-none"
            required
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-[12px] tracking-[0.05em] uppercase text-white/65">
            Adres e-mail{marketingConsent ? " *" : ""}
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full bg-transparent border border-white/20 px-4 py-3 text-[14px] focus:border-white/45 outline-none"
            required={marketingConsent}
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-[12px] tracking-[0.05em] uppercase text-white/65">Nazwa placówki *</span>
          <input
            type="text"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className="mt-2 w-full bg-transparent border border-white/20 px-4 py-3 text-[14px] focus:border-white/45 outline-none"
            required
          />
        </label>

        <label className="md:col-span-2 flex items-start gap-3 text-[13px] text-white/70">
          <input
            type="checkbox"
            checked={marketingConsent}
            onChange={(event) => setMarketingConsent(event.target.checked)}
            className="mt-[2px] accent-brand-orange"
          />
          <span>Chcę otrzymywać materiały edukacyjne i nowości ze świata nowoczesnej rehabilitacji.</span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="md:col-span-2 mt-2 px-7 py-4 bg-white text-foreground text-[14px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-70"
        >
          {isSubmitting ? "Wysyłanie..." : "Porozmawiajmy o mojej placówce →"}
        </button>

        {errorMessage ? <p className="md:col-span-2 text-[13px] text-red-300">{errorMessage}</p> : null}
        {successMessage ? <p className="md:col-span-2 text-[13px] text-emerald-300">{successMessage}</p> : null}

        <div className="md:col-span-2 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-5 text-[12px] text-white/80">
          <span className="inline-flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
            Twoje dane są bezpieczne. Nie spamujemy.
          </span>
          <span className="inline-flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
            Oddzwaniamy w ciągu 1 dnia roboczego.
          </span>
        </div>
        <p className="md:col-span-2 text-[12px] text-white/80 leading-[1.8]">
          {DISCLAIMER_MEDICAL_DEVICES}
        </p>

        <LegalLinks
          className="md:col-span-2 flex flex-wrap items-center gap-4 pt-1"
          linkClassName="text-[12px] text-white/80 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white"
        />
      </form>
    </section>
  );
}

