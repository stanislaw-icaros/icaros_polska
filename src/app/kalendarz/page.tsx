import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import KalendarzRozmowy, { type DaneKalendarza } from "@/components/kalendarz/KalendarzRozmowy";
import { dostepnoscZPamieci } from "@/lib/kalendarz/terminy";
import { WYBOR_OSOBY_NA_STRONIE } from "@/lib/kalendarz/config";

export const metadata: Metadata = {
  title: "Umów rozmowę | ICAROS Polska",
  description:
    "Wybierz godzinę 15-minutowej rozmowy telefonicznej o ICAROS. Bez zakładania konta, dzwonimy na podany numer.",
  alternates: { canonical: "/kalendarz" },
};

/** Pasek przeglądarki w kolorze strony, tak jak na landingu kampanijnym. */
export const viewport = {
  themeColor: "#07070a",
};

// Wolne godziny czytamy z kalendarzy Google przy każdym wejściu.
export const dynamic = "force-dynamic";

async function pobierzDane(): Promise<DaneKalendarza> {
  try {
    const dostepnosc = await dostepnoscZPamieci();
    return {
      dni: dostepnosc.dni,
      handlowcy: dostepnosc.handlowcy,
      dlugoscMin: dostepnosc.dlugoscMin,
      wyborOsoby: WYBOR_OSOBY_NA_STRONIE,
      awaria: dostepnosc.dni.length === 0 && dostepnosc.ostrzezenia.length > 0,
    };
  } catch (blad) {
    console.error(
      "[kalendarz] strona nie dostala terminow:",
      blad instanceof Error ? blad.message : blad
    );
    return { dni: [], handlowcy: [], dlugoscMin: 15, wyborOsoby: false, awaria: true };
  }
}

export default async function KalendarzPage({
  searchParams,
}: {
  searchParams: Promise<{ osoba?: string }>;
}) {
  const [dane, parametry] = await Promise.all([pobierzDane(), searchParams]);

  return (
    <>
      <Navigation variant="business" />
      <main className="relative overflow-hidden bg-h-void pb-24 pt-28 text-h-ink lg:pb-32 lg:pt-36">
        {/* Światło sceny zdjęte z landingu, żeby czerń nie była płaska. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            // taste-skill-ignore: światło sceny, nie ozdobna plama
            backgroundImage:
              "radial-gradient(70% 55% at 8% 26%, rgba(255,102,0,0.09), transparent 70%)",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-[1100px] px-6 lg:px-8">
          <div className="max-w-[760px] animate-[fade-up_0.7s_ease-out_both]">
            <h1 className="text-balance text-[clamp(2rem,4.2vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-h-ink">
              Umów termin rozmowy
            </h1>
            <p className="mt-6 max-w-[62ch] text-pretty text-[17px] leading-[1.68] text-h-ink-soft">
              Wybierz termin poniżej. Zadzwonimy na podany numer i w {dane.dlugoscMin} minut
              odpowiemy na pytania o urządzenia, ceny, finansowanie i o to, jak ICAROS wygląda
              w pracy placówki.
            </p>
          </div>

          <div className="mt-12 lg:mt-14">
            <KalendarzRozmowy poczatkowe={dane} osobaZAdresu={parametry.osoba} />
          </div>
        </div>
      </main>
      <Footer variant="business" />
    </>
  );
}
