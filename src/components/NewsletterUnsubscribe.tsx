"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Link2Off, MailMinus } from "lucide-react";
import { NEWSLETTER_PATH } from "@/lib/newsletter";

const CONTACT_EMAIL = "kontakt@icaros.com.pl";

const card = "border border-foreground/[0.09] bg-surface p-7 lg:p-9";
const iconBox =
  "flex h-11 w-11 items-center justify-center border border-brand-orange/40";
const heading = "mt-5 text-[22px] font-bold tracking-[-0.02em] text-foreground";
const body = "mt-3 text-[14px] leading-[1.75] text-foreground/55";

/**
 * Potwierdzenie rezygnacji. Adres przychodzi już zweryfikowany z podpisanego
 * linku, więc jedyne, co trzeba zrobić, to kliknąć przycisk.
 */
export default function NewsletterUnsubscribe({
  email,
  query,
}: {
  email: string | null;
  query: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [done, setDone] = useState(false);

  async function handleUnsubscribe() {
    if (isSubmitting) return;
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/newsletter/unsubscribe?${query}`, {
        method: "POST",
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Nie udało się wypisać adresu.");
      }
      setDone(true);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Nie udało się wypisać adresu."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!email) {
    return (
      <div className={card}>
        <div className={iconBox}>
          <Link2Off className="h-5 w-5 text-brand-orange" strokeWidth={1.8} />
        </div>
        <h1 className={heading}>Nie znamy adresu z tego linku</h1>
        <p className={body}>
          Link do wypisania jest niepełny albo nieaktualny. Napisz na{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Wypisz%20mnie%20z%20newslettera`}
            className="font-semibold text-brand-orange underline"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          z adresu, który ma zniknąć z listy, i usuniemy go od razu.
        </p>
      </div>
    );
  }

  if (done) {
    return (
      <div className={card} role="status">
        <div className={iconBox}>
          <Check className="h-5 w-5 text-brand-orange" strokeWidth={2.5} />
        </div>
        <h1 className={heading}>Adres wypisany</h1>
        <p className={body}>
          Na <strong className="font-semibold text-foreground">{email}</strong> nie
          wyślemy już newslettera. Jeśli kiedyś zmienisz zdanie, zapis zajmuje
          kilka sekund.
        </p>
        <Link
          href={NEWSLETTER_PATH}
          className="mt-5 inline-block text-[14px] font-semibold text-brand-orange underline"
        >
          Zapisz się ponownie
        </Link>
      </div>
    );
  }

  return (
    <div className={card}>
      <div className={iconBox}>
        <MailMinus className="h-5 w-5 text-brand-orange" strokeWidth={1.8} />
      </div>
      <h1 className={heading}>Wypisanie z listy</h1>
      <p className={body}>
        Po kliknięciu nie wyślemy już żadnej wiadomości na{" "}
        <strong className="font-semibold text-foreground">{email}</strong>. Nie
        musisz podawać powodu.
      </p>

      <button
        type="button"
        onClick={handleUnsubscribe}
        disabled={isSubmitting}
        className="mt-6 w-full px-7 py-[1.05rem] text-[15px] font-bold tracking-[0.01em] text-white shadow-[0_14px_30px_-12px_rgba(255,102,0,0.55)] transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
      >
        {isSubmitting ? "Wypisywanie..." : "Wypisz mnie z listy"}
      </button>

      {errorMessage ? (
        <p className="mt-3 text-[13px] text-red-600">{errorMessage}</p>
      ) : null}

      <Link
        href="/"
        className="mt-4 inline-block text-[13px] text-foreground/40 underline"
      >
        Nie chcę się wypisywać, wróć na stronę
      </Link>
    </div>
  );
}
