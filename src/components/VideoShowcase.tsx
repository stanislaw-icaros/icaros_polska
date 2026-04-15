"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { hasCookieConsent, readCookieConsent } from "@/lib/cookie-consent";

export default function VideoShowcase() {
  const { ref, isVisible } = useScrollAnimation();
  const [canLoadVideo, setCanLoadVideo] = useState(false);

  useEffect(() => {
    const syncConsent = () => {
      const preferences = readCookieConsent();
      setCanLoadVideo(Boolean(preferences?.externalMedia || hasCookieConsent("externalMedia")));
    };

    syncConsent();
    window.addEventListener("cookie-consent-updated", syncConsent as EventListener);
    return () => window.removeEventListener("cookie-consent-updated", syncConsent as EventListener);
  }, []);

  return (
    <section ref={ref} className="py-28 lg:py-40 bg-surface relative overflow-hidden">
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-foreground/30">
            Zobacz w akcji
          </p>
          <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-[-0.03em] text-foreground leading-[1.1]">
            Technologia, która mówi sama za siebie
          </h2>
          <p className="mt-5 text-[16px] text-foreground/50 leading-[1.8]">
            Zobacz, jak ICAROS zmienia doświadczenie rehabilitacji i&nbsp;treningu
            w&nbsp;placówkach na całym świecie.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="bg-foreground p-3 sm:p-4 lg:p-6 shadow-[0_12px_60px_-12px_rgba(0,0,0,0.15)]">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              {canLoadVideo ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube.com/embed/5sSi2cPwyD0?rel=0&modestbranding=1&color=white"
                  title="ICAROS — innowacyjna rehabilitacja i trening VR"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-foreground px-6 text-center text-white">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-white/35">
                    Treść zewnętrzna
                  </p>
                  <p className="max-w-md text-[15px] leading-[1.8] text-white/65">
                    Wideo z YouTube wczyta się po wyrażeniu zgody na treści zewnętrzne w ustawieniach cookies.
                  </p>
                  <Link
                    href="/polityka-cookies"
                    className="text-[13px] font-semibold text-white underline decoration-white/25 underline-offset-4"
                  >
                    Zobacz politykę cookies
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-[12px] text-foreground/30">
              ICAROS GmbH &middot; Oficjalne wideo produktowe
            </p>
            <a
              href="#kontakt"
              className="group inline-flex items-center gap-2 text-[13px] font-semibold text-foreground/40 hover:text-foreground transition-colors duration-500 tracking-[0.02em]"
            >
              Umów prezentację na żywo
              <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
