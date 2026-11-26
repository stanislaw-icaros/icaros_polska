"use client";

import { trackMetaEvent } from "@/lib/meta/track";
import { COMPANY_PHONE, COMPANY_PHONE_HREF } from "@/lib/legal";

/**
 * Numer telefonu. Kliknięcie liczymy jako zdarzenie Contact, nie jako
 * zgłoszenie, więc nie trafia do Lead.
 */
export default function Telefon({ className = "" }: { className?: string }) {
  return (
    <a
      href={`tel:${COMPANY_PHONE_HREF}`}
      onClick={() => trackMetaEvent("Contact")}
      className={className}
    >
      {COMPANY_PHONE.replace(/ /g, " ")}
    </a>
  );
}
