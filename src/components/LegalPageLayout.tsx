"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type LegalPageLayoutProps = {
  eyebrow: string;
  title: string;
  summary: string;
  children: React.ReactNode;
};

export default function LegalPageLayout({
  eyebrow,
  title,
  summary,
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="min-h-screen bg-white text-foreground">
      <section className="border-b border-foreground/[0.06] bg-surface">
        <div className="mx-auto max-w-[980px] px-6 py-20 sm:py-24 lg:px-10 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.16em] text-foreground/40 transition-colors hover:text-foreground"
            >
              <span>ICAROS Polska</span>
              <span className="text-foreground/20">/</span>
              <span>Powrót na stronę główną</span>
            </Link>
            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/35">
              {eyebrow}
            </p>
            <h1 className="mt-5 max-w-3xl text-[clamp(2rem,4vw,3.6rem)] font-bold tracking-[-0.04em] leading-[1.02]">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-[1.9] text-foreground/55">
              {summary}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-[980px] px-6 py-14 sm:py-16 lg:px-10 lg:py-20">
        <div className="legal-content max-w-none">
          {children}
        </div>
      </section>
    </main>
  );
}
