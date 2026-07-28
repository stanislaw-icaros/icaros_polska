"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import VideoEmbed from "@/components/VideoEmbed";
import { products } from "@/lib/products";

/**
 * Galeria filmów produktowych (polskie wersje z kanału ICAROS POLSKA).
 * Bierzemy urządzenia z własnym filmem - Circle pomijamy, bo pokazuje
 * filmy Health, Guardian i Cloud, które i tak są tutaj osobno.
 *
 * Treść musi działać w obu strefach (pacjent i biznes), więc bez słownictwa
 * sprzedażowego typu "placówka" czy "prezentacja".
 */
const videoProducts = products.filter((product) => product.videos?.length === 1);

export default function ProductVideos({
  theme = "dark",
  basePath = "/produkty",
  eyebrow = "Filmy produktowe",
  // Twarda spacja przed "akcji", żeby nagłówek nie łamał się po samotnym "w".
  title = "Zobacz każde urządzenie w akcji",
  intro = "Cztery krótkie filmy pokazują, jak wygląda trening na poszczególnych urządzeniach ICAROS.",
}: {
  theme?: "light" | "dark";
  basePath?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
}) {
  const { ref, isVisible } = useScrollAnimation();
  const dark = theme === "dark";

  return (
    <section
      id="filmy"
      ref={ref}
      className={
        dark
          ? "border-t border-white/[0.06] bg-foreground py-24 text-white lg:py-32"
          : "bg-surface py-24 lg:py-32"
      }
    >
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.3em] ${
              dark ? "text-white/45" : "text-foreground/35"
            }`}
          >
            {eyebrow}
          </p>
          <h2
            className={`mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.1] tracking-[-0.03em] ${
              dark ? "text-white" : "text-foreground"
            }`}
          >
            {title}
          </h2>
          <p
            className={`mt-5 text-[16px] leading-[1.8] ${
              dark ? "text-white/70" : "text-foreground/55"
            }`}
          >
            {intro}
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
          {videoProducts.map((product, i) => {
            const video = product.videos![0];
            return (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 26 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: 0.12 + i * 0.08,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <VideoEmbed
                  videoId={video.id}
                  title={`${video.title} - film produktowy`}
                  poster={video.poster}
                  posterAlt={video.posterAlt}
                  posterLabel={product.category}
                  posterTitle={video.title}
                  theme={theme}
                  size="card"
                />
                <div className="mt-4 flex flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-6">
                  <p
                    className={`max-w-[380px] text-[13.5px] leading-[1.65] ${
                      dark ? "text-white/60" : "text-foreground/55"
                    }`}
                  >
                    {product.tagline}
                  </p>
                  <Link
                    href={`${basePath}/${product.slug}`}
                    className={`group inline-flex shrink-0 items-center gap-2 text-[12.5px] font-semibold transition-colors duration-300 ${
                      dark
                        ? "text-white/70 hover:text-white"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    Poznaj {product.shortName}
                    <svg
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p
          className={`mt-12 text-center text-[11.5px] ${
            dark ? "text-white/30" : "text-foreground/30"
          }`}
        >
          Materiały wideo: ICAROS Polska · filmy ładują się z YouTube dopiero po kliknięciu
        </p>
      </div>
    </section>
  );
}
