"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  worldCategories,
  worldExtraReferences,
  worldPlaces,
  type WorldPlace,
} from "@/lib/world";

type Theme = "light" | "dark";

function tokens(theme: Theme) {
  const dark = theme === "dark";
  return {
    dark,
    section: dark ? "bg-[#0a0a0a]" : "bg-white",
    band: dark ? "bg-white/[0.02]" : "bg-surface",
    text: dark ? "text-white" : "text-foreground",
    eyebrow: dark ? "text-white/50" : "text-foreground/55",
    body: dark ? "text-white/70" : "text-foreground/70",
    muted: dark ? "text-white/45" : "text-foreground/45",
    border: dark ? "border-white/[0.09]" : "border-foreground/[0.09]",
    card: dark ? "bg-white/[0.02]" : "bg-white",
    hover: dark ? "hover:bg-white/[0.05]" : "hover:bg-foreground/[0.02]",
    chip: dark
      ? "border-white/[0.14] text-white/75"
      : "border-foreground/[0.14] text-foreground/70",
  };
}

type Tokens = ReturnType<typeof tokens>;

/** Kadr ośrodka. Bez zdjęcia pokazujemy wariant typograficzny, żeby siatka nie miała dziur. */
function PlaceVisual({ place, t }: { place: WorldPlace; t: Tokens }) {
  if (place.image) {
    return (
      <div className={`relative aspect-[16/10] overflow-hidden border-b ${t.border}`}>
        <Image
          src={place.image}
          alt={place.imageAlt ?? place.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 420px"
        />
        {place.imageCredit && (
          <span className="absolute bottom-2 right-2 bg-black/55 px-2 py-1 text-[9.5px] font-medium tracking-wide text-white/85">
            {place.imageCredit}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative flex aspect-[16/10] items-end overflow-hidden border-b p-7 ${t.border}`}
      style={{
        background: t.dark
          ? "linear-gradient(150deg, rgba(255,102,0,0.24) 0%, rgba(255,102,0,0.05) 42%, #0e0e0e 100%)"
          : "linear-gradient(150deg, rgba(255,102,0,0.20) 0%, rgba(255,102,0,0.05) 42%, #eeebe7 100%)",
      }}
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: t.dark
            ? "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)"
            : "linear-gradient(rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.045) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -top-4 right-5 select-none text-[128px] font-bold leading-none tracking-[-0.07em] opacity-[0.16]"
        aria-hidden
      >
        {place.countryCode}
      </span>
      <span
        className={`relative border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
          t.dark ? "border-white/25 bg-black/25 text-white/85" : "border-foreground/20 bg-white/60 text-foreground/75"
        }`}
      >
        {place.country}
      </span>
    </div>
  );
}

function PlaceCard({ place, t, index }: { place: WorldPlace; t: Tokens; index: number }) {
  return (
    <motion.a
      href={place.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: (index % 3) * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`group flex flex-col border ${t.border} ${t.card} ${t.hover} transition-colors duration-500`}
    >
      <PlaceVisual place={place} t={t} />

      <div className="flex flex-1 flex-col p-7 lg:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className={`text-[19px] font-semibold leading-[1.25] tracking-[-0.015em] ${t.text}`}>
              {place.name}
            </h3>
            <p className={`mt-2 flex items-center gap-1.5 text-[12.5px] ${t.muted}`}>
              <MapPin size={13} strokeWidth={1.6} />
              {place.city}, {place.country}
            </p>
          </div>
          <ArrowUpRight
            size={18}
            strokeWidth={1.6}
            className={`mt-1 shrink-0 transition-colors duration-500 ${
              t.dark ? "text-white/25 group-hover:text-brand-orange" : "text-foreground/20 group-hover:text-brand-orange"
            }`}
          />
        </div>

        <p className={`mt-5 text-[14px] leading-[1.75] ${t.body}`}>{place.summary}</p>

        <ul className="mt-6 flex flex-wrap gap-2 pt-1">
          {place.facts.map((fact) => (
            <li
              key={fact}
              className={`border px-2.5 py-1 text-[11px] font-medium leading-[1.4] ${t.chip}`}
            >
              {fact}
            </li>
          ))}
        </ul>

        <span className={`mt-6 text-[12px] font-semibold tracking-[0.02em] ${t.muted} transition-colors duration-500 group-hover:text-brand-orange`}>
          Strona ośrodka
        </span>
      </div>
    </motion.a>
  );
}

export default function WorldReferences({
  theme = "light",
  mapHref = "/mapa",
}: {
  theme?: Theme;
  /** Mapa polskich lokalizacji: /mapa dla pacjenta, /lokalizacje dla partnerów. */
  mapHref?: string;
}) {
  const t = tokens(theme);
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div className={t.section}>
      {/* Nagłówek */}
      <section ref={ref} className="relative overflow-hidden pt-36 lg:pt-44">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: t.dark
              ? "radial-gradient(ellipse 55% 45% at 80% 0%, rgba(255,102,0,0.13), transparent 68%)"
              : "radial-gradient(ellipse 55% 45% at 80% 0%, rgba(255,102,0,0.07), transparent 68%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <p className={`text-[11px] font-semibold uppercase tracking-[0.3em] ${t.eyebrow}`}>
              ICAROS na świecie
            </p>
            <h1 className={`mt-5 text-[clamp(2.1rem,5vw,3.4rem)] font-bold leading-[1.04] tracking-[-0.035em] ${t.text}`}>
              Wybrane miejsca, w&nbsp;których pracuje ICAROS
            </h1>
            <p className={`mt-6 text-[16.5px] leading-[1.8] ${t.body}`}>
              Kliniki urazowe, ośrodki rehabilitacji, centra przygotowania motorycznego
              i medical spa. Stoją w nich te same urządzenia, które montujemy w polskich
              gabinetach.
            </p>
            <Link
              href={mapHref}
              className={`mt-6 inline-flex items-center gap-2 text-[13px] font-semibold underline underline-offset-4 transition-colors ${
                t.dark
                  ? "text-white decoration-white/25 hover:decoration-white"
                  : "text-foreground decoration-foreground/25 hover:decoration-foreground"
              }`}
            >
              Zobacz mapę lokalizacji w Polsce
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Koszyki */}
      {worldCategories.map((cat, ci) => {
        const places = worldPlaces.filter((p) => p.category === cat.id);
        if (places.length === 0) return null;
        return (
          <section
            key={cat.id}
            id={cat.id}
            className={`scroll-mt-24 py-20 lg:py-28 ${ci % 2 === 1 ? t.band : ""}`}
          >
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-14"
              >
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-[2px] w-8"
                      style={{ background: "linear-gradient(90deg,#ff6600,#ff7b1f)" }}
                    />
                    <span className={`text-[10px] font-semibold uppercase tracking-[0.26em] ${t.eyebrow}`}>
                      {String(ci + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className={`mt-4 text-[clamp(1.5rem,3.2vw,2.2rem)] font-bold leading-[1.12] tracking-[-0.03em] ${t.text}`}>
                    {cat.label}
                  </h2>
                </div>
                <div className="lg:col-span-7">
                  <p className={`text-[15.5px] leading-[1.8] ${t.body}`}>{cat.lead}</p>
                </div>
              </motion.div>

              <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {places.map((place, i) => (
                  <PlaceCard key={place.id} place={place} t={t} index={i} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Pozostałe wdrożenia z katalogu */}
      <section className={`py-20 lg:py-24 ${worldCategories.length % 2 === 1 ? t.band : ""}`}>
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <h2 className={`text-[13px] font-semibold uppercase tracking-[0.18em] ${t.muted}`}>
            Gdzie jeszcze pracuje ICAROS
          </h2>
          <div className={`mt-8 grid grid-cols-1 border-l border-t sm:grid-cols-2 lg:grid-cols-4 ${t.border}`}>
            {worldExtraReferences.map((r) => (
              <div key={r.name} className={`border-b border-r p-6 ${t.border}`}>
                <p className={`text-[15px] font-semibold tracking-[-0.01em] ${t.text}`}>{r.name}</p>
                <p className={`mt-1.5 text-[12.5px] ${t.body}`}>{r.type}</p>
                <p className={`mt-3 text-[12px] ${t.muted}`}>{r.place}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Powrót do Polski */}
      <section className={`pb-24 lg:pb-32 ${worldCategories.length % 2 === 1 ? t.band : ""}`}>
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className={`relative overflow-hidden border ${t.border} ${t.card} px-8 py-12 lg:px-14 lg:py-16`}>
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: t.dark
                  ? "radial-gradient(ellipse 50% 90% at 92% 10%, rgba(255,102,0,0.12), transparent 70%)"
                  : "radial-gradient(ellipse 50% 90% at 92% 10%, rgba(255,102,0,0.08), transparent 70%)",
              }}
            />
            <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <p className={`text-[11px] font-semibold uppercase tracking-[0.3em] ${t.muted}`}>
                  A jak jest w Polsce
                </p>
                <h2 className={`mt-4 text-[clamp(1.5rem,3.2vw,2.2rem)] font-bold leading-[1.12] tracking-[-0.03em] ${t.text}`}>
                  Zobacz, gdzie ICAROS działa u nas
                </h2>
                <p className={`mt-4 text-[15px] leading-[1.8] ${t.body}`}>
                  Lista polskich placówek z urządzeniami ICAROS cały czas się wydłuża.
                  Aktualne miejsca znajdziesz na mapie.
                </p>
              </div>
              <Link
                href={mapHref}
                className="inline-flex shrink-0 items-center gap-3 px-8 py-4 text-[14px] font-semibold text-white shadow-[0_14px_30px_-12px_rgba(255,102,0,0.55)] transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
              >
                Mapa lokalizacji w Polsce
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          <p className={`mt-8 max-w-3xl text-[12.5px] leading-[1.7] ${t.muted}`}>
            Dane liczbowe i zdjęcia pochodzą ze stron wymienionych ośrodków.
          </p>
        </div>
      </section>
    </div>
  );
}
