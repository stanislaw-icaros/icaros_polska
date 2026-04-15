"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LOADING_LINES = [
  "Szacujemy potencjał Twojej placówki...",
  "Obliczamy możliwe sesje równoległe...",
  "Porównujemy z kosztem leasingu...",
  "Gotowe.",
];

export default function LoadingScreen() {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIndex((prev) => (prev + 1) % LOADING_LINES.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-foreground" />
      <div className="absolute inset-0 opacity-[0.12]" style={{ background: "radial-gradient(circle at 30% 20%, rgba(255,123,31,0.25), transparent 55%), radial-gradient(circle at 70% 70%, rgba(255,102,0,0.18), transparent 60%)" }} />
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "96px 96px" }} />

      <div className="relative h-full w-full flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[680px]"
        >
          <div className="text-center">
            <div className="mx-auto w-12 h-[2px]" style={{ background: "linear-gradient(90deg, #ff6600, #ff7b1f)" }} />
            <h2 className="mt-8 text-[clamp(1.7rem,3.2vw,2.6rem)] font-bold tracking-[-0.03em] text-white leading-[1.05]">
              Analizujemy Twoje dane
            </h2>

            <div className="mt-5 min-h-[26px]">
              <motion.p
                key={lineIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="text-[14px] text-white/55"
              >
                {LOADING_LINES[lineIndex]}
              </motion.p>
            </div>
          </div>

          <div className="mt-10">
            <div className="relative mx-auto h-24 w-24">
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 90deg, rgba(255,102,0,1), rgba(255,123,31,0.7), rgba(255,255,255,0.05), rgba(255,102,0,1))",
                  filter: "blur(0.2px)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-[3px] rounded-full bg-foreground" />
              <motion.div
                aria-hidden
                className="absolute inset-[10px] rounded-full border border-white/10"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="absolute inset-[18px] rounded-full bg-white/5 backdrop-blur-sm" />
            </div>

            <div className="mt-10">
              <div className="h-[2px] w-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full w-1/2"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,102,0,0.95), transparent)" }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.35, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/35">
                <span>Proszę czekać</span>
                <span className="inline-block w-1 h-1 rounded-full bg-white/25" />
                <span>Trwa obliczanie</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

