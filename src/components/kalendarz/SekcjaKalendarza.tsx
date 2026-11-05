import KalendarzRozmowy, { type DaneKalendarza } from "@/components/kalendarz/KalendarzRozmowy";
import KotwicaKalendarza from "@/components/kalendarz/KotwicaKalendarza";
import { dostepnoscZPamieci } from "@/lib/kalendarz/terminy";

/**
 * Kalendarz rozmów wstawiony w zakładkę kontaktu, na jasnym tle.
 *
 * To tutaj prowadzą wszystkie przyciski kontaktu: `/kontakt#kalendarz`
 * u pacjenta i `/kontakt-partner#kalendarz` w strefie biznes. Panelu
 * z formularzem, który wcześniej stał pod każdą podstroną, nie ma już nigdzie.
 *
 * Wolne godziny czytamy z kalendarzy Google przy każdym wejściu, więc strona,
 * która osadza tę sekcję, musi być dynamiczna.
 */

type Wariant = "patient" | "business";

const TRESC: Record<Wariant, { naglowek: string; wstep: (minuty: number) => string }> = {
  patient: {
    naglowek: "Umów rozmowę",
    wstep: (minuty) =>
      `Wybierz termin poniżej. Zadzwonimy na podany numer i w ${minuty} minut odpowiemy na pytania o trening, urządzenia i o to, gdzie najbliżej można spróbować ICAROS.`,
  },
  business: {
    naglowek: "Umów termin rozmowy",
    wstep: (minuty) =>
      `Wybierz termin poniżej. Zadzwonimy na podany numer i w ${minuty} minut odpowiemy na pytania o urządzenia, ceny, finansowanie i o to, jak ICAROS wygląda w pracy placówki.`,
  },
};

async function pobierzDane(): Promise<DaneKalendarza> {
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
      "[kalendarz] sekcja kontaktu nie dostala terminow:",
      blad instanceof Error ? blad.message : blad
    );
    return { dni: [], handlowcy: [], dlugoscMin: 15, awaria: true };
  }
}

export default async function SekcjaKalendarza({
  wariant = "business",
  osoba,
}: {
  wariant?: Wariant;
  osoba?: string;
}) {
  const dane = await pobierzDane();
  const tresc = TRESC[wariant];

  return (
    <section id="kalendarz" className="scroll-mt-24 bg-white py-24 lg:py-32">
      <KotwicaKalendarza id="kalendarz" />
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-[760px]">
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.1] tracking-[-0.03em] text-foreground">
            {tresc.naglowek}
          </h2>
          <p className="mt-5 max-w-[62ch] text-[16px] leading-[1.8] text-foreground/70">
            {tresc.wstep(dane.dlugoscMin)}
          </p>
        </div>

        <div className="mt-12 lg:mt-14">
          <KalendarzRozmowy
            poczatkowe={dane}
            osobaZAdresu={osoba}
            motyw="jasny"
            wariant={wariant}
          />
        </div>
      </div>
    </section>
  );
}
