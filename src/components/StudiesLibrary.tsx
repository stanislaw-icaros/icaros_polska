"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { studies, researchPartners, type Study } from "@/lib/studies";

const ArrowIcon = () => (
  <svg className="h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9m8 0v8" />
  </svg>
);

function StudyRow({ study, index }: { study: Study; index: number }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group flex h-full flex-col border border-foreground/[0.08] bg-white p-7 lg:p-8 transition-colors duration-500 hover:border-foreground/20"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-orange">
          {study.device}
        </span>
        <span className="text-[11px] font-medium tabular-nums text-foreground/35">
          {study.year}
        </span>
      </div>

      <h3 className="mt-5 text-[16px] font-semibold leading-[1.4] tracking-[-0.01em] text-foreground">
        {study.title}
      </h3>

      <p className="mt-4 text-[13.5px] leading-[1.7] text-foreground/60">
        {study.finding}
      </p>

      <div className="mt-6 flex flex-1 flex-col justify-end gap-4 border-t border-foreground/[0.06] pt-5">
        <p className="text-[12px] font-medium text-foreground/45">{study.institution}</p>
        {study.links && study.links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {study.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-1.5 border border-foreground/[0.12] px-3 py-1.5 text-[11.5px] font-medium text-foreground/70 transition-colors duration-300 hover:border-brand-orange hover:text-brand-orange"
              >
                {link.label}
                <ArrowIcon />
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default function StudiesLibrary() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="baza-badan" ref={ref} className="border-t border-foreground/[0.06] bg-surface py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-foreground/40">
            Baza badań
          </p>
          <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.1] tracking-[-0.03em] text-foreground">
            Efekty potwierdzone badaniami
          </h2>
          <p className="mt-5 text-[16px] leading-[1.8] text-foreground/65">
            Ponad 12 badań klinicznych i pilotażowych przeprowadzonych przez czołowe
            europejskie ośrodki naukowe. Poniżej znajdziesz je zebrane w jednym
            miejscu wraz z linkami do publikacji.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-10 flex flex-wrap gap-2.5"
        >
          {researchPartners.map((partner) => (
            <span
              key={partner}
              className="border border-foreground/[0.1] bg-white px-3.5 py-2 text-[12px] font-medium text-foreground/60"
            >
              {partner}
            </span>
          ))}
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {studies.map((study, i) => (
            <StudyRow key={study.id} study={study} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 text-[12.5px] leading-[1.7] text-foreground/40"
        >
          Pełne opracowanie wyników badań ICAROS dostępne jest w{" "}
          <a
            href="https://www.icaros.com/fileadmin/user_upload/ICAROS_-_Studies_2022.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 underline underline-offset-2 transition-colors hover:text-brand-orange"
          >
            kompendium badań ICAROS
          </a>
          . Część badań jest w toku - wyniki uzupełniamy na bieżąco.
        </motion.p>
      </div>
    </section>
  );
}
