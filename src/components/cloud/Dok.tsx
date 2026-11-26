"use client";

import { useEffect, useState } from "react";
import { Kwota, KwotaDruga, NazwaTrybu, PrzelacznikTrybu } from "@/components/cloud/Tryb";
import { CENY, CTA } from "@/lib/cloud/tresc";

/**
 * Jedyny stały element sterujący na stronie: cena w wybranym trybie
 * i przycisk zamówienia. Na telefonie to pasek przypięty do dołu.
 *
 * Chowa się, kiedy widać sekcję zamówienia, bo tam przycisk prowadziłby
 * do miejsca, w którym odwiedzający już jest, i zasłaniałby pola formularza.
 */
export default function Dok() {
  const [ukryty, ustawUkryty] = useState(false);

  useEffect(() => {
    const cel = document.getElementById("zamowienie");
    if (!cel) return;
    const obserwator = new IntersectionObserver(
      ([wpis]) => ustawUkryty(wpis.isIntersecting),
      { rootMargin: "0px 0px -35% 0px" }
    );
    obserwator.observe(cel);
    return () => obserwator.disconnect();
  }, []);

  return (
    <div className="cl-dok" data-ukryty={ukryty} inert={ukryty}>
      <PrzelacznikTrybu etykieta="Cena netto albo brutto" />
      <p className="cl-dok__cena" style={{ margin: 0 }}>
        <span className="cl-dok__kwota">
          <Kwota netto={CENY.pakietNetto} brutto={CENY.pakietBrutto} />
        </span>
        <span className="cl-dok__opis">
          <NazwaTrybu />
        </span>
        {/* Na telefonie w doku nie ma przełącznika, więc druga kwota stoi obok. */}
        <span className="cl-dok__druga">
          <KwotaDruga netto={CENY.pakietNetto} brutto={CENY.pakietBrutto} />
        </span>
      </p>
      <a className="cl-btn" href="#zamowienie">
        {CTA}
      </a>
    </div>
  );
}
