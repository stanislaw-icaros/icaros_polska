"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import type { IcarosLocation } from "@/lib/mapa/locations";
import { worldCategories, worldPlaces } from "@/lib/world";
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
  worldHref = "/icaros-na-swiecie",
}: {
  locations: IcarosLocation[];
  theme?: MapTheme;
  /** Podstrona z zagranicznymi wdrożeniami - inna w strefie pacjenta i partnera. */
  worldHref?: string;
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

        {/* Wejście na podstronę z wybranymi wdrożeniami zagranicznymi. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className={`mt-20 border-t pt-16 lg:mt-24 lg:pt-20 ${
            dark ? "border-white/[0.09]" : "border-foreground/[0.09]"
          }`}
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
              ICAROS na świecie
            </span>
          </div>
          <h2 className="mt-4 max-w-[680px] text-[clamp(1.5rem,3.6vw,2.3rem)] font-bold leading-[1.1] tracking-[-0.03em]">
            A jak to wygląda poza Polską
          </h2>
          <p
            className={`mt-4 max-w-[620px] text-[15px] leading-[1.75] ${
              dark ? "text-white/65" : "text-foreground/65"
            }`}
          >
            Te same urządzenia pracują w centrach urazowych z kilkuset łóżkami, w ośrodkach
            przygotowania motorycznego zawodowych sportowców i w medical spa pod Rzymem.
          </p>

          <div
            className={`mt-10 grid grid-cols-1 border-l border-t sm:grid-cols-3 ${
              dark ? "border-white/[0.09]" : "border-foreground/[0.09]"
            }`}
          >
            {worldCategories.map((cat) => {
              const places = worldPlaces.filter((p) => p.category === cat.id);
              return (
                <Link
                  key={cat.id}
                  href={`${worldHref}#${cat.id}`}
                  className={`group border-b border-r p-7 transition-colors duration-500 ${
                    dark
                      ? "border-white/[0.09] hover:bg-white/[0.04]"
                      : "border-foreground/[0.09] hover:bg-foreground/[0.02]"
                  }`}
                >
                  <h3 className="text-[16px] font-semibold leading-[1.3] tracking-[-0.01em]">
                    {cat.label}
                  </h3>
                  <p
                    className={`mt-3 text-[12.5px] leading-[1.6] ${
                      dark ? "text-white/50" : "text-foreground/50"
                    }`}
                  >
                    {places
                      .slice(0, 3)
                      .map((p) => p.name)
                      .join(", ")}
                  </p>
                </Link>
              );
            })}
          </div>

          <Link
            href={worldHref}
            className="mt-10 inline-flex items-center gap-3 px-8 py-4 text-[14px] font-semibold text-white shadow-[0_14px_30px_-12px_rgba(255,102,0,0.55)] transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
          >
            Zobacz ICAROS na świecie
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
