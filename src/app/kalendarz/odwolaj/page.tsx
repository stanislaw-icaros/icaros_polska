import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import OdwolanieTerminu from "@/components/kalendarz/OdwolanieTerminu";
import { etykietaPelna } from "@/lib/kalendarz/formaty";
import { odczytajBilet } from "@/lib/kalendarz/podpis";
import { handlowiec } from "@/lib/kalendarz/config";

export const metadata: Metadata = {
  title: "Odwołanie terminu | ICAROS Polska",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Parametry = { b?: string; t?: string };

/** Rozpoznanie biletu z linku. Poza komponentem, bo sprawdza aktualny czas. */
async function odczytaj(searchParams: Promise<Parametry>) {
  const { b, t } = await searchParams;
  const bilet = odczytajBilet(b, t);

  if (!bilet || !b || !t) {
    return { bilet: null, etykietaTerminu: null, imieHandlowca: undefined, minelo: false };
  }

  const start = new Date(bilet.s);
  return {
    bilet: { b, t },
    etykietaTerminu: etykietaPelna(start),
    imieHandlowca: handlowiec(bilet.o)?.pelneImie,
    minelo: start.getTime() < Date.now(),
  };
}

export default async function OdwolajPage({
  searchParams,
}: {
  searchParams: Promise<Parametry>;
}) {
  const dane = await odczytaj(searchParams);

  return (
    <>
      <Navigation />
      <main className="bg-white pb-24 pt-32 lg:pb-32 lg:pt-40">
        <div className="mx-auto w-full max-w-[640px] px-6 lg:px-10">
          <OdwolanieTerminu {...dane} />
        </div>
      </main>
      <Footer variant="business" />
    </>
  );
}
