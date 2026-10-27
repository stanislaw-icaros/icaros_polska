"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useNewsletterSignup } from "@/hooks/useNewsletterSignup";
import { NEWSLETTER_CONSENT_TEXT } from "@/lib/newsletter";

/**
 * Krótki zapis na listę: jedno pole i jedna zgoda, do wstawienia w pasku
 * newslettera. Pełny formularz z imieniem jest na /newsletter.
 */
export default function NewsletterInlineForm({
  source,
  tone = "light",
}: {
  source: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const {
    email,
    setEmail,
    consent,
    setConsent,
    isSubmitting,
    errorMessage,
    done,
    spamFields,
    submit,
  } = useNewsletterSignup(source);

  const t = {
    input: dark
      ? "border-white/15 bg-white/[0.04] text-white placeholder:text-white/35"
      : "border-foreground/[0.14] bg-white text-foreground placeholder:text-foreground/35",
    consent: dark ? "text-white/45" : "text-foreground/50",
    link: dark
      ? "text-white/70 decoration-white/25 hover:text-white"
      : "text-foreground/70 decoration-foreground/30 hover:text-foreground",
    done: dark ? "text-white" : "text-foreground",
    error: dark ? "text-red-400" : "text-red-600",
  };

  if (done) {
    return (
      <div className={`flex items-center gap-3 sm:w-[360px] ${t.done}`} role="status">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand-orange/50">
          <Check className="h-5 w-5 text-brand-orange" strokeWidth={2.5} />
        </span>
        <span className="text-[14px] font-semibold leading-[1.45]">
          Adres jest na liście. Potwierdzenie poszło mailem.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="w-full sm:w-[360px]">
      {spamFields}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Adres e-mail"
          aria-label="Adres e-mail"
          autoComplete="email"
          required
          className={`min-w-0 flex-1 border px-4 py-3 text-[14px] outline-none transition-colors focus:border-brand-orange ${t.input}`}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap px-6 py-3 text-[14px] font-semibold text-white transition-opacity duration-500 hover:opacity-90 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
        >
          {isSubmitting ? "Zapisywanie..." : "Zapisz się"}
          {!isSubmitting && <ArrowRight className="h-4 w-4" strokeWidth={2} />}
        </button>
      </div>

      <label
        className={`mt-3 flex items-start gap-2.5 text-[11.5px] leading-[1.5] ${t.consent}`}
      >
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-[2px] shrink-0 accent-brand-orange"
        />
        <span>
          {NEWSLETTER_CONSENT_TEXT}{" "}
          <Link
            href="/polityka-prywatnosci"
            target="_blank"
            className={`underline underline-offset-2 transition-colors ${t.link}`}
          >
            Polityka prywatności
          </Link>
          .
        </span>
      </label>

      {errorMessage ? (
        <p className={`mt-2 text-[12.5px] ${t.error}`}>{errorMessage}</p>
      ) : null}
    </form>
  );
}
