"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Map as MapIcon } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { trackMapClick } from "@/lib/analytics/track";
import type { IcarosLocation } from "@/lib/mapa/locations";

// Leaflet sięga do `window`, więc mapkę ładujemy wyłącznie po stronie klienta.
const MiniMap = dynamic(() => import("./map/MiniMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] w-full bg-[#eef1f4] lg:h-full" aria-hidden />
  ),
});

/** Ile nazw miast pokazujemy obok mapki, zanim zwiniemy resztę do licznika. */
const CITY_LIMIT = 8;

/**
 * Sekcja z mapą placówek wstawiana wysoko na stronie głównej. Pełna,
 * interaktywna mapa z listą i filtrami jest pod /mapa; tutaj chodzi o to,
 * żeby pinezki były widoczne od razu po wejściu na stronę.
 */
export default function LocationsTeaser({
  locations,
  href = "/mapa",
}: {
  locations: IcarosLocation[];
  href?: string;
}) {
  const { ref, isVisible } = useScrollAnimation();

  // Najpierw miasta z największą liczbą placówek, potem alfabetycznie - inaczej
  // na początku listy lądują przypadkowe wsie, a Kraków czy Wrocław się nie mieszczą.
  const byCity = new Map<string, number>();
  for (const loc of locations) {
    if (!loc.city) continue;
    byCity.set(loc.city, (byCity.get(loc.city) ?? 0) + 1);
  }
  const cities = Array.from(byCity.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "pl"))
    .map(([city]) => city);
  const shownCities = cities.slice(0, CITY_LIMIT);
  const restCount = cities.length - shownCities.length;

  return (
    <section ref={ref} className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-14"
        >
          <div className="flex flex-col justify-center lg:col-span-5">
            <h2 className="text-[clamp(1.9rem,4vw,2.7rem)] font-bold leading-[1.08] tracking-[-0.03em] text-foreground">
              Gdzie spróbujesz ICAROS
            </h2>
            <p className="mt-5 max-w-[460px] text-[15px] leading-[1.8] text-foreground/60">
              {locations.length} placówek w Polsce pracuje już na urządzeniach ICAROS.
              Sprawdź na mapie, która jest najbliżej Ciebie, i umów się na trening
              bezpośrednio z nią.
            </p>

            {shownCities.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2">
                {shownCities.map((city) => (
                  <span
                    key={city}
                    className="border border-foreground/[0.09] px-3 py-1.5 text-[12px] font-medium text-foreground/55"
                  >
                    {city}
                  </span>
                ))}
                {restCount > 0 && (
                  <span className="px-3 py-1.5 text-[12px] font-medium text-foreground/35">
                    i {restCount} więcej
                  </span>
                )}
              </div>
            )}

            <Link
              href={href}
              onClick={() => trackMapClick("strona_glowna_przycisk")}
              className="group mt-9 inline-flex w-fit items-center gap-3 px-8 py-4 text-[14px] font-semibold text-white transition-opacity duration-500 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
            >
              <MapIcon className="h-[18px] w-[18px]" strokeWidth={2} />
              Otwórz mapę placówek
              <ArrowRight
                className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                strokeWidth={2}
              />
            </Link>
          </div>

          <div className="lg:col-span-7">
            <Link
              href={href}
              onClick={() => trackMapClick("strona_glowna_mapka")}
              aria-label="Otwórz mapę placówek ICAROS w Polsce"
              className="group block overflow-hidden border border-foreground/[0.09] transition-colors duration-500 hover:border-foreground/25"
            >
              <MiniMap
                locations={locations}
                theme="light"
                fitToMarkers
                className="h-[280px] sm:h-[340px] lg:h-[420px]"
              />
              <span className="flex items-center justify-between gap-3 border-t border-foreground/[0.09] px-5 py-4 text-[12px] font-semibold text-foreground/55 transition-colors duration-500 group-hover:text-foreground">
                Mapa placówek w Polsce
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                  strokeWidth={2}
                />
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
