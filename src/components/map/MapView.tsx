"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import type { IcarosLocation } from "@/lib/mapa/locations";
import type { MapTheme } from "./MapCanvas";

// Leaflet sięga do `window`, więc mapę ładujemy wyłącznie po stronie klienta.
const MapCanvas = dynamic(() => import("./MapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[440px] items-center justify-center border border-current/[0.08] text-[13px] opacity-40 sm:h-[520px] lg:h-[640px]">
      Wczytywanie mapy…
    </div>
  ),
});

export default function MapView({
  locations,
  theme = "dark",
}: {
  locations: IcarosLocation[];
  theme?: MapTheme;
}) {
  const dark = theme === "dark";

  return (
    <section
      className={`relative overflow-x-hidden px-6 pb-20 pt-28 sm:px-10 lg:px-16 lg:pb-28 lg:pt-36 ${
        dark ? "text-white" : "text-foreground"
      }`}
    >
      {/* Nakładki tła - tylko w wersji ciemnej (biznes), by zachować obecny klimat. */}
      {dark && (
        <>
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 58% 48% at 80% 12%, rgba(255,102,0,0.16), transparent 68%)" }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
              backgroundSize: "84px 84px",
            }}
          />
        </>
      )}

      <div className="relative z-10 mx-auto w-full max-w-[1180px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-[680px]"
        >
          <div className="flex items-center gap-3">
            <span
              className="h-[2px] w-7"
              style={{ background: "linear-gradient(90deg,#ff6600,#ff7b1f)" }}
            />
            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${
                dark ? "text-white/55" : "text-foreground/55"
              }`}
            >
              Mapa wdrożeń
            </span>
          </div>
          <h1 className="mt-4 text-[clamp(1.9rem,5vw,3rem)] font-bold leading-[1.05] tracking-[-0.035em]">
            Gdzie działa ICAROS w Polsce
          </h1>
          <p
            className={`mt-4 max-w-[560px] text-[15px] leading-[1.7] ${
              dark ? "text-white/65" : "text-foreground/65"
            }`}
          >
            Placówki w całej Polsce, w których pracują urządzenia ICAROS. Część z nich jest
            dostępna publicznie - możesz umówić pokaz i przetestować sprzęt na żywo. Najedź na
            pinezkę lub wybierz placówkę z listy, aby poznać szczegóły.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mt-10"
        >
          <MapCanvas locations={locations} theme={theme} />
        </motion.div>
      </div>
    </section>
  );
}
