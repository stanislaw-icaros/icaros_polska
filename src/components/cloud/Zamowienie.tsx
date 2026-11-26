import Image from "next/image";
import KalendarzRozmowy, { type DaneKalendarza } from "@/components/kalendarz/KalendarzRozmowy";
import KotwicaKalendarza from "@/components/kalendarz/KotwicaKalendarza";
import FormularzZamowienia from "@/components/cloud/FormularzZamowienia";
import Telefon from "@/components/cloud/Telefon";
import { dostepnoscZPamieci } from "@/lib/kalendarz/terminy";
import { CTA_DRUGIE, ZAMOWIENIE } from "@/lib/cloud/tresc";

async function pobierzTerminy(): Promise<DaneKalendarza> {
  try {
    const dostepnosc = await dostepnoscZPamieci();
    return {
      dni: dostepnosc.dni,
      handlowcy: dostepnosc.handlowcy,
      dlugoscMin: dostepnosc.dlugoscMin,
      awaria: dostepnosc.dni.length === 0 && dostepnosc.ostrzezenia.length > 0,
    };
  } catch (blad) {
    console.error(
      "[cloud] kalendarz nie dostal terminow:",
      blad instanceof Error ? blad.message : blad
    );
    return { dni: [], handlowcy: [], dlugoscMin: 15, awaria: true };
  }
}

/**
 * Zamówienie: formularz, telefon i kalendarz w jednym miejscu.
 *
 * Trzy drogi, każda kończy się dealem w Pipedrive ze źródłem „Cloud".
 * WhatsAppa tu nie ma (ustalenie z 26 listopada 2026).
 */
export default async function Zamowienie() {
  const terminy = await pobierzTerminy();

  return (
    <section className="cl-sek cl-zam" id="zamowienie" aria-labelledby="cl-zamowienie">
      <div className="cl-w">
        <Image
          className="cl-zam__obraz"
          src="/cloud/cloud-podloga.webp"
          alt=""
          width={2200}
          height={1244}
          sizes="(max-width: 1240px) 100vw, 1180px"
        />

        <h2 className="cl-h2" id="cl-zamowienie">
          {ZAMOWIENIE.naglowek}
        </h2>
        <p className="cl-lead">{ZAMOWIENIE.lead}</p>

        <div className="cl-zam__uklad">
          <FormularzZamowienia />

          <div className="cl-zam__bok">
            <h3 className="cl-h3">{ZAMOWIENIE.rozmowaNaglowek}</h3>
            <p>{ZAMOWIENIE.rozmowaTekst}</p>
            <Telefon className="cl-zam__tel" />
            <p>
              <a className="cl-link" href="#kalendarz">
                {CTA_DRUGIE}
              </a>
            </p>
          </div>
        </div>

        <div className="cl-zam__kal" id="kalendarz">
          <KotwicaKalendarza id="kalendarz" />
          <h3 className="cl-h3">{CTA_DRUGIE}</h3>
          <KalendarzRozmowy poczatkowe={terminy} motyw="ciemny" wariant="business" />
        </div>
      </div>
    </section>
  );
}
