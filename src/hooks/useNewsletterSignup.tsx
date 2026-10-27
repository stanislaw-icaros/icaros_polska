"use client";

import { useState } from "react";
import { useSpamGuard } from "@/hooks/useSpamGuard";
import { trackMetaEvent } from "@/lib/meta/track";
import { trackEvent } from "@/lib/analytics/track";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Logika zapisu na listę, wspólna dla pełnego formularza na /newsletter
 * i dla krótkiego paska z jednym polem. Dzięki temu obie formy wysyłają
 * to samo do /api/newsletter i tak samo liczą konwersję.
 */
export function useNewsletterSignup(source: string) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [done, setDone] = useState(false);
  const { spamFields, getSpamSignals } = useSpamGuard();

  async function submit(event: React.FormEvent) {
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
      trackEvent("newsletter_signup", { place: source });
      setDone(true);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Nie udało się zapisać adresu."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    email,
    setEmail,
    firstName,
    setFirstName,
    consent,
    setConsent,
    isSubmitting,
    errorMessage,
    done,
    spamFields,
    submit,
  };
}
