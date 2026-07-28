"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import VideoEmbed from "@/components/VideoEmbed";

/**
 * Historie pacjentów i wdrożeń - filmy z kanału YouTube ICAROS (@icarosflight),
 * odtwarzane na miejscu, bez wychodzenia ze strony. Dodając nowy case, wklej
 * videoId z URL (youtube.com/watch?v=VIDEOID) oraz polski opis.
 */
const cases = [
  { id: "1ZkUim9wuc0", title: "Walter - powrót po udarze", tag: "Rehabilitacja neurologiczna" },
  { id: "o4mamD9qnoU", title: "Sandra - trening po udarze mózgu", tag: "Rehabilitacja neurologiczna" },
  { id: "4cnqw7hJfOE", title: "Sprawność w starszym wieku", tag: "Seniorzy i prewencja upadków" },
  { id: "ZmHZOsO6YYg", title: "Klinika MEDICLIN Rhein-Ruhr", tag: "Wdrożenie kliniczne" },
  { id: "yNqi6zoX9U4", title: "Akademia Sportu w Kolonii", tag: "Badania i nauka o sporcie" },
  { id: "El6O-KoyQqw", title: "ICAROS w fizjoterapii", tag: "Wywiad z placówki" },
];

export default function VideoCases() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="bg-surface py-28 lg:py-40">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-foreground/30">
            Historie pacjentów
          </p>
          <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.1] tracking-[-0.03em] text-foreground">
            ICAROS w prawdziwej rehabilitacji
          </h2>
          <p className="mt-5 text-[16px] leading-[1.8] text-foreground/50">
            Pacjenci po udarze, seniorzy i placówki opowiadają o swoich doświadczeniach
            z&nbsp;ICAROS. Kliknij, aby obejrzeć film.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <VideoEmbed videoId={c.id} title={c.title} theme="light" size="card" />
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-orange">
                {c.tag}
              </p>
              <h3 className="mt-1.5 text-[16px] font-semibold leading-snug tracking-[-0.01em] text-foreground">
                {c.title}
              </h3>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-[12px] text-foreground/30">
          Materiały wideo: ICAROS GmbH &middot; filmy ładują się z YouTube dopiero po kliknięciu
        </p>
      </div>
    </section>
  );
}
