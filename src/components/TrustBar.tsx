"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const partners = [
  "Deutsche Sporthochschule Köln",
  "TU München",
  "Ruhr-Universität Bochum",
  "Universitätsklinikum Heidelberg",
];

export default function TrustBar() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-8 lg:py-10 bg-white border-b border-foreground/[0.04]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-foreground/20 shrink-0">
            Partnerzy naukowi
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-3">
            {partners.map((name) => (
              <span
                key={name}
                className="text-[13px] font-medium text-foreground/20 hover:text-foreground/50 transition-colors duration-700"
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
