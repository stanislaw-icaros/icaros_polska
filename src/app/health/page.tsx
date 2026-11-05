import type { Metadata } from "next";
import { ScenaProvider } from "@/components/health/Scena";
import Horyzont from "@/components/health/Horyzont";
import Porownanie from "@/components/health/Porownanie";
import Sesja from "@/components/health/Sesja";
import Budowa from "@/components/health/Budowa";
import Perspektywa from "@/components/health/Perspektywa";
import Doswiadczenia from "@/components/health/Doswiadczenia";
import Zaangazowanie from "@/components/health/Zaangazowanie";
import Badacze from "@/components/health/Badacze";
import Badania from "@/components/health/Badania";
import Glos from "@/components/health/Glos";
import Film from "@/components/health/Film";
import Urzadzenia from "@/components/health/Urzadzenia";
import Pytania from "@/components/health/Pytania";
import PrzyciskWRogu from "@/components/health/PrzyciskWRogu";
import Ladowanie, { Stopka } from "@/components/health/Ladowanie";

export const metadata: Metadata = {
  title: "ICAROS Health | Nowoczesne technologie VR w rehabilitacji",
  description:
    "ICAROS Health to wyrób medyczny klasy I do treningu stabilności tułowia i równowagi. Zobacz przebieg sesji, trasy VR, badania i cztery urządzenia systemu ICAROS.",
  alternates: { canonical: "/health" },
  openGraph: {
    title: "ICAROS Health | Nowoczesne technologie VR w rehabilitacji",
    description:
      "Wyrób medyczny klasy I do treningu stabilności tułowia i równowagi. Przebieg sesji, trasy VR i wyniki badań.",
    url: "/health",
    type: "website",
    locale: "pl_PL",
    images: [
      {
        url: "/health/poster-lot.webp",
        width: 2000,
        height: 1125,
        alt: "Pacjentka w goglach VR na urządzeniu ICAROS Health, w tle alpejskie szczyty o świcie",
      },
    ],
  },
};

/** Pasek przeglądarki w kolorze strony, nie w bieli reszty serwisu. */
export const viewport = {
  themeColor: "#07070a",
};

/**
 * Landing kampanijny ICAROS Health. Celowo nie ma tu nawigacji ani stopki
 * serwisu: jedyną nawigacją jest suwak horyzontu, a jedyną akcją przycisk
 * prowadzący do kalendarza.
 *
 * Kolejność sekcji po uwagach z 4 listopada 2026: zestawienie, zaraz po nim
 * film, potem przebieg sesji. Cztery urządzenia systemu zjechały na sam dół,
 * pod pytania o Healtha, bo to już propozycja „może zainteresuje Cię też".
 */
export default function HealthPage() {
  return (
    <>
      {/* Pierwsza klatka tła decyduje o tym, co widać na starcie. */}
      <link
        rel="preload"
        as="image"
        href="/health/poster-sala.webp"
        type="image/webp"
      />
      <ScenaProvider>
      <main className="relative">
        <Horyzont />
        <Porownanie />
        <Film />
        <Sesja />
        <Budowa />
        <Perspektywa />
        <Doswiadczenia />
        <Zaangazowanie />
        <Badacze />
        <Badania />
        <Glos />
        <Pytania />
        <Urzadzenia />
        <Ladowanie />
        <Stopka />
      </main>
      <PrzyciskWRogu />
      </ScenaProvider>
    </>
  );
}
