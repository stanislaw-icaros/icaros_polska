"use client";

import { useRef, useState } from "react";

/**
 * Klientowa część ochrony antyspamowej dla formularzy.
 * Zwraca:
 *  - `spamFields` - ukryte pole-pułapkę (honeypot) do wstawienia w <form>,
 *  - `getSpamSignals()` - sygnały do dołączenia do body żądania (honeypot + czas wypełnienia).
 *
 * Użycie:
 *   const { spamFields, getSpamSignals } = useSpamGuard();
 *   ...
 *   <form>{spamFields} ... </form>
 *   body: JSON.stringify({ ...dane, ...getSpamSignals() })
 */
export function useSpamGuard() {
  const renderedAt = useRef<number>(Date.now());
  const [honeypot, setHoneypot] = useState("");

  const spamFields = (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        top: "-9999px",
        width: 1,
        height: 1,
        overflow: "hidden",
      }}
    >
      {/* Pole-pułapka: prawdziwi użytkownicy go nie widzą i nie wypełniają. */}
      <label htmlFor="company_website">Nie wypełniaj tego pola</label>
      <input
        id="company_website"
        name="company_website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
      />
    </div>
  );

  const getSpamSignals = () => ({
    honeypot,
    elapsedMs: Date.now() - renderedAt.current,
  });

  return { spamFields, getSpamSignals };
}
