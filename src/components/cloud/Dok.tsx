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
 *
 * Na telefonie i tablecie chowa się też przy cenie pakietu: tam stoi ten sam przycisk
 * na całą szerokość, więc dwa identyczne byłyby jeden pod drugim.
 */
export default function Dok() {
  const [ukryty, ustawUkryty] = useState(false);

  useEffect(() => {
    const formularz = document.getElementById("zamowienie");
    const przyciskCeny = document.querySelector("[data-cl-cena]");
    // Ten sam próg, od którego przycisk przy cenie zajmuje całą szerokość.
    const waski = window.matchMedia("(max-width: 900px)");
    let przyFormularzu = false;
    let przyCenie = false;
    const odswiez = () => ustawUkryty(przyFormularzu || (przyCenie && waski.matches));

    const obserwatorFormularza = new IntersectionObserver(
      ([wpis]) => {
        przyFormularzu = wpis.isIntersecting;
        odswiez();
      },
      { rootMargin: "0px 0px -35% 0px" }
    );
    // Dolny margines to wysokość doku: przycisk przy cenie liczy się jako
    // widoczny dopiero wtedy, gdy wyjdzie ponad dok.
    const obserwatorCeny = new IntersectionObserver(
      ([wpis]) => {
        przyCenie = wpis.isIntersecting;
        odswiez();
      },
      { rootMargin: "0px 0px -88px 0px" }
    );
    if (formularz) obserwatorFormularza.observe(formularz);
    if (przyciskCeny) obserwatorCeny.observe(przyciskCeny);
    waski.addEventListener("change", odswiez);

    return () => {
      obserwatorFormularza.disconnect();
      obserwatorCeny.disconnect();
      waski.removeEventListener("change", odswiez);
    };
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
