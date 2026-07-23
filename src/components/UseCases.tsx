"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Image from "next/image";

export type UseCaseItem = {
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export default function UseCases({
  variant = "patient",
  eyebrow,
  title,
  intro,
  items,
}: {
  variant?: "patient" | "business";
  eyebrow: string;
  title: string;
  intro: string;
  items: UseCaseItem[];
}) {
  const { ref, isVisible } = useScrollAnimation();
  const dark = variant === "business";

  const t = {
    section: dark ? "bg-[#0a0a0a]" : "bg-white",
    eyebrow: dark ? "text-white/50" : "text-foreground/55",
    heading: dark ? "text-white" : "text-foreground",
    intro: dark ? "text-white/70" : "text-foreground/70",
    grid: dark ? "border-white/[0.08]" : "border-foreground/[0.06]",
    hover: dark ? "hover:bg-white/[0.02]" : "hover:bg-foreground/[0.015]",
    fade: dark ? "to-[#0a0a0a]" : "to-white",
    title: dark ? "text-white" : "text-foreground",
    desc: dark ? "text-white/55" : "text-foreground/50",
    arrow: dark ? "text-white/15 group-hover:text-white/40" : "text-foreground/10 group-hover:text-foreground/30",
  };

  return (
    <section ref={ref} className={`py-28 lg:py-40 ${t.section} ${dark ? "pt-36 lg:pt-44" : ""}`}>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className={`text-[11px] font-semibold uppercase tracking-[0.3em] ${t.eyebrow}`}>
            {eyebrow}
          </p>
          <h1 className={`mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.1] tracking-[-0.03em] ${t.heading}`}>
            {title}
          </h1>
          <p className={`mt-5 text-[16px] leading-[1.8] ${t.intro}`}>{intro}</p>
        </motion.div>

        <div className={`mt-20 grid grid-cols-1 border lg:grid-cols-2 ${t.grid}`}>
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden transition-colors duration-700 ${t.hover} ${
                i < items.length - 2 ? `border-b ${t.grid}` : ""
              } ${i % 2 === 0 ? `lg:border-r ${t.grid}` : ""}`}
            >
              <div className="relative h-48 overflow-hidden lg:h-52">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent ${t.fade}`} />
              </div>

              <div className="p-8 pt-4 lg:p-10 lg:pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span
                      className="bg-clip-text text-[11px] font-bold tracking-[0.2em] text-transparent"
                      style={{ backgroundImage: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
                    >
                      {item.number}
                    </span>
                    <h3 className={`mt-3 text-[20px] font-semibold tracking-[-0.01em] ${t.title}`}>
                      {item.title}
                    </h3>
                  </div>
                  <svg
                    className={`mt-6 h-5 w-5 shrink-0 transition-colors duration-500 ${t.arrow}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>

                <p className={`mt-4 text-[14px] leading-[1.8] ${t.desc}`}>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
