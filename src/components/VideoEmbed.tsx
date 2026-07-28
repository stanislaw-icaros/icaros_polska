"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Osadzenie filmu z YouTube w wersji "dwóch kliknięć": do momentu kliknięcia
 * pokazujemy tylko miniaturę, więc strona nie wysyła żadnego zapytania do
 * YouTube i nie zapisuje cookies. Dopiero klik uruchamia odtwarzacz
 * (youtube-nocookie). Efekt uboczny: strona ładuje się zauważalnie szybciej.
 */

type Theme = "light" | "dark";
type Size = "hero" | "card";

let connectionsWarmed = false;

/** Łączymy się z YouTube dopiero, gdy kursor zbliży się do przycisku odtwarzania. */
function warmConnections() {
  if (connectionsWarmed || typeof document === "undefined") return;
  connectionsWarmed = true;

  for (const href of ["https://www.youtube-nocookie.com", "https://i.ytimg.com"]) {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    document.head.appendChild(link);
  }
}

export default function VideoEmbed({
  videoId,
  title,
  poster,
  posterAlt,
  posterLabel,
  posterTitle,
  hint,
  theme = "light",
  size = "hero",
  className = "",
}: {
  /** ID filmu z YouTube (fragment po watch?v=). */
  videoId: string;
  /** Tytuł dla czytników ekranu i odtwarzacza. */
  title: string;
  /**
   * Własna miniatura z /public. Używamy jej tam, gdzie automatyczna klatka
   * z YouTube wypada słabo (np. zbliżenie na stopy). Bonus: strona nie
   * odpytuje wtedy serwerów Google, dopóki ktoś nie kliknie play.
   */
  poster?: string;
  /** Opis własnej miniatury dla czytników ekranu. */
  posterAlt?: string;
  /** Mały nadpis na miniaturze, np. kategoria urządzenia. */
  posterLabel?: string;
  /** Nagłówek na miniaturze. Pomijamy, gdy tuż nad filmem jest ten sam tekst. */
  posterTitle?: string;
  /** Notka pod ramką, np. informacja o ładowaniu z YouTube. */
  hint?: string;
  theme?: Theme;
  size?: Size;
  className?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [youtubePoster, setYoutubePoster] = useState(
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
  );

  const dark = theme === "dark";
  const hero = size === "hero";

  // Passe-partout wokół kadru: na jasnych stronach delikatna szarość, bo filmy
  // ICAROS są bardzo jasne i biała ramka zlewałaby się z obrazem.
  const frame = dark
    ? "border-white/10 bg-[#0d0d0d] shadow-[0_40px_80px_-32px_rgba(0,0,0,0.8)]"
    : "border-foreground/[0.09] bg-foreground/[0.035] shadow-[0_28px_66px_-30px_rgba(0,0,0,0.32)]";

  return (
    <div className={className}>
      <div className={`border ${frame} ${hero ? "p-2 sm:p-3" : ""}`}>
        <div className="relative aspect-video w-full overflow-hidden bg-black">
          {isPlaying ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&color=white&hl=pl`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              onPointerEnter={warmConnections}
              onFocus={warmConnections}
              aria-label={`Odtwórz film: ${title}`}
              className="group absolute inset-0 h-full w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-0"
            >
              {poster ? (
                <Image
                  src={poster}
                  alt={posterAlt ?? ""}
                  fill
                  sizes={hero ? "(max-width: 1024px) 100vw, 1100px" : "(max-width: 768px) 100vw, 560px"}
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={youtubePoster}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={() =>
                    setYoutubePoster(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)
                  }
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              )}

              <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/10 transition-opacity duration-700 group-hover:opacity-90" />

              <span className="absolute right-3.5 top-3.5 border border-white/25 bg-black/45 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm sm:right-5 sm:top-5">
                YouTube
              </span>

              <span className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`relative flex items-center justify-center rounded-full bg-white/95 shadow-[0_14px_44px_-10px_rgba(0,0,0,0.55)] ring-1 ring-black/[0.06] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08] ${
                    hero ? "h-[64px] w-[64px] sm:h-[76px] sm:w-[76px]" : "h-14 w-14"
                  }`}
                >
                  <span
                    className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: "linear-gradient(135deg,#ff6600,#ff7b1f)" }}
                  />
                  <svg
                    className={`relative ml-1 text-brand-orange transition-colors duration-500 group-hover:text-white ${
                      hero ? "h-6 w-6 sm:h-7 sm:w-7" : "h-5 w-5"
                    }`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>

              {(posterLabel || posterTitle) && (
                <span
                  className={`absolute inset-x-0 bottom-0 flex flex-col items-start gap-1.5 text-left ${
                    hero ? "p-5 sm:p-7" : "p-4 sm:p-5"
                  }`}
                >
                  {posterLabel && (
                    <span className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-white/70">
                      {posterLabel}
                    </span>
                  )}
                  {posterTitle && (
                    <span
                      className={`font-semibold tracking-[-0.015em] text-white ${
                        hero ? "text-[17px] sm:text-[21px]" : "text-[15px]"
                      }`}
                    >
                      {posterTitle}
                    </span>
                  )}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {hint && (
        <p
          className={`mt-3 text-[11.5px] ${dark ? "text-white/35" : "text-foreground/35"}`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
