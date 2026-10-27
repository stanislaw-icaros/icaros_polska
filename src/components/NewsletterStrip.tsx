"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import NewsletterInlineForm from "@/components/NewsletterInlineForm";
import { trackNewsletterClick } from "@/lib/analytics/track";
import {
  NEWSLETTER_PATH,
  NEWSLETTER_PATH_BUSINESS,
  NEWSLETTER_STRIP,
  NEWSLETTER_STRIP_BUSINESS,
} from "@/lib/newsletter";

/**
 * Wąski pasek zapisu na listę. Wstawiany w kilku punktach serwisu, zawsze
 * jako jedna sekcja na podstronę, żeby nie konkurował z głównym CTA strony.
 *
 * `variant="dark"` to strefa Biznes - razem z kolorami zmienia się opis listy
 * i cel odnośnika (ciemna wersja strony zapisu).
 *
 * `form` włącza zapis bez przechodzenia dalej: jedno pole i zgoda w samym
 * pasku. Używamy go tam, gdzie pasek stoi wysoko na stronie; na pozostałych
 * podstronach zostaje sam odnośnik, żeby na stronie był jeden formularz.
 */
export default function NewsletterStrip({
  variant = "light",
  title,
  description,
  form = false,
  source,
}: {
  variant?: "light" | "dark";
  title?: string;
  description?: string;
  form?: boolean;
  /** Skąd przyszedł zapis - trafia do bazy i do statystyk. */
  source?: string;
}) {
  const { ref, isVisible } = useScrollAnimation();
  const dark = variant === "dark";
  const copy = dark ? NEWSLETTER_STRIP_BUSINESS : NEWSLETTER_STRIP;
  const href = dark ? NEWSLETTER_PATH_BUSINESS : NEWSLETTER_PATH;
  const place = source ?? (dark ? "pasek-biznes" : "pasek");

  const t = {
    section: dark ? "bg-[#0a0a0a]" : "bg-white",
    card: dark
      ? "border-white/[0.10] bg-white/[0.03]"
      : "border-foreground/[0.09] bg-surface",
    cardLink: dark ? "hover:border-white/25" : "hover:border-foreground/20",
    eyebrow: dark ? "text-white/45" : "text-foreground/35",
    title: dark ? "text-white" : "text-foreground",
    desc: dark ? "text-white/50" : "text-foreground/50",
  };

  const text = (
    <div className="max-w-[660px]">
      <span
        className={`text-[10.5px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}
      >
        {copy.eyebrow}
      </span>
      <h2
        className={`mt-3 text-[clamp(1.1rem,2vw,1.35rem)] font-bold leading-[1.25] tracking-[-0.02em] ${t.title}`}
      >
        {title ?? copy.title}
      </h2>
      <p className={`mt-2 text-[13.5px] leading-[1.65] ${t.desc}`}>
        {description ?? copy.description}
      </p>
    </div>
  );

  return (
    <section ref={ref} className={`py-14 lg:py-16 ${t.section}`}>
      <div className="mx-auto max-w-[1180px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {form ? (
            <div
              className={`flex flex-col gap-7 border px-7 py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-10 lg:px-9 lg:py-8 ${t.card}`}
            >
              {text}
              <NewsletterInlineForm source={place} tone={dark ? "dark" : "light"} />
            </div>
          ) : (
            <Link
              href={href}
              onClick={() => trackNewsletterClick(place)}
              className={`group flex flex-col gap-6 border px-7 py-7 transition-colors duration-500 sm:flex-row sm:items-center sm:justify-between sm:gap-10 lg:px-9 lg:py-8 ${t.card} ${t.cardLink}`}
            >
              {text}

              <span
                className="inline-flex shrink-0 items-center justify-center gap-3 whitespace-nowrap px-7 py-[0.9rem] text-[14px] font-semibold text-white shadow-[0_14px_30px_-12px_rgba(255,102,0,0.55)] transition-opacity duration-500 group-hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
              >
                {copy.cta}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                  strokeWidth={2}
                />
              </span>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
