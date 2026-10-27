import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import KalendarzRozmowy, { type DaneKalendarza } from "@/components/kalendarz/KalendarzRozmowy";
import { dostepnoscZPamieci } from "@/lib/kalendarz/terminy";

export const metadata: Metadata = {
  title: "Umów rozmowę | ICAROS Polska",
  description:
    "Wybierz godzinę 15-minutowej rozmowy telefonicznej o ICAROS. Bez zakładania konta, dzwonimy na podany numer.",
  alternates: { canonical: "/kalendarz" },
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
      awaria: dostepnosc.dni.length === 0 && dostepnosc.ostrzezenia.length > 0,
    };
  } catch (blad) {
    console.error(
      "[kalendarz] strona nie dostala terminow:",
      blad instanceof Error ? blad.message : blad
    );
    return { dni: [], handlowcy: [], dlugoscMin: 15, awaria: true };
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
      <Navigation />
      <main className="relative overflow-hidden bg-white pb-24 pt-32 lg:pb-32 lg:pt-40">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-[1180px] px-6 lg:px-10">
          <div className="max-w-[640px] animate-[fade-up_0.7s_ease-out_both]">
            <h1 className="text-[clamp(2rem,4.6vw,3.1rem)] font-bold leading-[1.03] tracking-[-0.04em] text-foreground">
              Kiedy możemy zadzwonić?
            </h1>
            <p className="mt-5 text-[15px] leading-[1.8] text-foreground/55 sm:text-[16px]">
              Wybranie godziny zajmuje chwilę. Dzwonimy na podany numer i w {" "}
              {dane.dlugoscMin} minut odpowiadamy na pytania o urządzenia, ceny, finansowanie
              i o to, jak ICAROS wygląda w pracy placówki.
            </p>
          </div>

          <div className="mt-12 lg:mt-16">
            <KalendarzRozmowy poczatkowe={dane} osobaZAdresu={parametry.osoba} />
          </div>
        </div>
      </main>
      <Footer variant="business" />
    </>
  );
}
