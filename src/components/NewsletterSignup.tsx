"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import ConsentFields from "@/components/ConsentFields";
import { useSpamGuard } from "@/hooks/useSpamGuard";
import { trackMetaEvent } from "@/lib/meta/track";
import { NEWSLETTER_CONSENT_TEXT, NEWSLETTER_FOOTNOTE } from "@/lib/newsletter";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Formularz zapisu na listę. Jedno wymagane pole (adres) i jedna zgoda,
 * żeby zapis był kwestią kilku sekund.
 */
export default function NewsletterSignup({
  source = "newsletter",
  tone = "light",
  className = "",
}: {
  source?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [done, setDone] = useState(false);
  const { spamFields, getSpamSignals } = useSpamGuard();

  const dark = tone === "dark";
  const t = {
    card: dark
      ? "border-white/[0.10] bg-white/[0.03]"
      : "border-foreground/[0.09] bg-surface",
    heading: dark ? "text-white" : "text-foreground",
    body: dark ? "text-white/60" : "text-foreground/55",
    input: dark
      ? "border-white/15 bg-white/[0.04] text-white placeholder:text-white/30"
      : "border-foreground/[0.14] bg-white text-foreground placeholder:text-foreground/35",
    footnote: dark ? "text-white/35" : "text-foreground/40",
    error: dark ? "text-red-400" : "text-red-600",
    iconBox: dark ? "border-brand-orange/50" : "border-brand-orange/40",
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;

    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(cleanEmail)) {
      setErrorMessage("Podaj prawidłowy adres e-mail.");
      return;
    }
    if (!consent) {
      setErrorMessage("Zaznacz zgodę na otrzymywanie newslettera.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...getSpamSignals(),
          email: cleanEmail,
          firstName: firstName.trim(),
          consent,
          source,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Nie udało się zapisać adresu.");
      }

      trackMetaEvent("CompleteRegistration", { email: cleanEmail });
      setDone(true);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Nie udało się zapisać adresu."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className={`border p-7 lg:p-9 ${t.card} ${className}`} role="status">
        <div className={`flex h-11 w-11 items-center justify-center border ${t.iconBox}`}>
          <Check className="h-5 w-5 text-brand-orange" strokeWidth={2.5} />
        </div>
        <h2 className={`mt-5 text-[20px] font-bold tracking-[-0.02em] ${t.heading}`}>
          Adres jest na liście
        </h2>
        <p className={`mt-3 text-[14px] leading-[1.75] ${t.body}`}>
          Napiszemy, kiedy będzie konkretny powód: zaproszenie na targi, termin
          testów w placówce albo nowe wyniki badań. Wiadomości przychodzą
          z&nbsp;adresu kontakt@icaros.com.pl, warto go dodać do kontaktów.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`border p-7 lg:p-9 ${t.card} ${className}`}
    >
      {spamFields}

      <h2 className={`text-[17px] font-bold tracking-[-0.02em] ${t.heading}`}>
        Zapis na listę
      </h2>

      <div className="mt-6 space-y-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Adres e-mail"
          aria-label="Adres e-mail"
          autoComplete="email"
          required
          className={`w-full border px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-brand-orange ${t.input}`}
        />
        <input
          type="text"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          placeholder="Imię (opcjonalnie)"
          aria-label="Imię"
          autoComplete="given-name"
          className={`w-full border px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-brand-orange ${t.input}`}
        />

        <ConsentFields
          tone={tone}
          className="pt-1"
          showMarketing={false}
          dataConsent={consent}
          onDataConsentChange={setConsent}
          dataConsentText={NEWSLETTER_CONSENT_TEXT}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-7 py-[1.05rem] text-[15px] font-bold tracking-[0.01em] text-white shadow-[0_14px_30px_-12px_rgba(255,102,0,0.55)] transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
        >
          {isSubmitting ? "Zapisywanie..." : "Zapisz mnie na listę"}
        </button>
      </div>

      {errorMessage ? (
        <p className={`mt-3 text-[13px] ${t.error}`}>{errorMessage}</p>
      ) : null}

      <p className={`mt-4 text-[11.5px] leading-[1.6] ${t.footnote}`}>
        {NEWSLETTER_FOOTNOTE}
      </p>
    </form>
  );
}
