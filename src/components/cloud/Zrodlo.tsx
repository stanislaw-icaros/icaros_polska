"use client";

import { useId, useState } from "react";

/**
 * Źródło badania schowane pod przyciskiem. Na komputerze otwiera się po
 * najechaniu, wszędzie po kliknięciu albo dotknięciu. Zamyka je Escape
 * i wyjście z przycisku.
 */
export default function Zrodlo({ instytucja, szczegoly }: { instytucja: string; szczegoly: string }) {
  const [otwarte, ustawOtwarte] = useState(false);
  const id = useId();

  return (
    <span
      className="cl-zr"
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") ustawOtwarte(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") ustawOtwarte(false);
      }}
    >
      <button
        type="button"
        aria-expanded={otwarte}
        aria-controls={id}
        onClick={() => ustawOtwarte((stan) => !stan)}
        onBlur={() => ustawOtwarte(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") ustawOtwarte(false);
        }}
      >
        Źródło
      </button>
      <span className="cl-zr__dymek" id={id} role="note" data-otwarte={otwarte}>
        <strong>{instytucja}</strong>
        <span>{szczegoly}</span>
      </span>
    </span>
  );
}
