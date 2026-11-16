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
      {/* Pole-pułapka: prawdziwi użytkownicy go nie widzą i nie wypełniają.
          Nazwa nie może przypominać żadnego pola, które przeglądarka zna
          (firma, strona, adres), bo Chrome wypełnia takie pola autouzupełnianiem
          mimo autoComplete="off". Tak było z „company_website”: 16.11 test
          Stanisława w kalendarzu został po cichu zablokowany jako spam. */}
      <label htmlFor="pole_kontrolne_zx">Pozostaw puste</label>
      <input
        id="pole_kontrolne_zx"
        name="pole_kontrolne_zx"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        data-lpignore="true"
        data-1p-ignore="true"
        data-bwignore="true"
        data-form-type="other"
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
