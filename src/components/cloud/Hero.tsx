"use client";

import { useEffect, useRef } from "react";
import Telefon from "@/components/cloud/Telefon";
import { CTA_DRUGIE, H1, HERO_DANE, OPIS_POD_H1 } from "@/lib/cloud/tresc";

const ALT =
  "ICAROS Cloud: owalna nadmuchiwana platforma z białą obręczą, czarną powierzchnią i uchwytem na tablet";

/**
 * Pierwszy ekran. Trzy warstwy na jednej osi: światło, napis, platforma.
 * Platforma stoi przed napisem i kołysze się na swoim wypukłym spodzie tak,
 * jak robi to naprawdę, a jej odbicie w podłodze idzie w przeciwną stronę.
 *
 * Ruch jest tylko tutaj. Kursor steruje wychyleniem, bez kursora platforma
 * kołysze się sama, bardzo wolno. Przewijanie rozsuwa warstwy w głąb.
 */
export default function Hero() {
  const korzen = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = korzen.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let klatka = 0;
    let widoczny = true;
    let celMx = 0;
    let mx = 0;
    let ostatniRuch = 0;
    let wys = el.offsetHeight || 1;
    const start = performance.now();

    const naRuch = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      celMx = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
      ostatniRuch = performance.now();
    };

    const krok = (teraz: number) => {
      klatka = 0;
      if (!widoczny) return;

      // Samo kołysanie trwa kilkanaście sekund po wejściu i wygasa. Potem
      // platforma rusza się tylko za kursorem, żeby nic nie migało bez końca.
      const spoczynek = teraz - ostatniRuch > 2600;
      const zanik = Math.max(0, 1 - (teraz - start) / 14000);
      const cel = spoczynek ? Math.sin(teraz / 2400) * 0.42 * zanik : celMx;
      mx += (cel - mx) * 0.045;

      const p = Math.max(0, Math.min(1, window.scrollY / (wys * 0.9)));

      el.style.setProperty("--mx", mx.toFixed(4));
      el.style.setProperty("--p", p.toFixed(4));
      klatka = requestAnimationFrame(krok);
    };

    const obserwator = new IntersectionObserver(([wpis]) => {
      widoczny = wpis.isIntersecting;
      if (widoczny && !klatka) klatka = requestAnimationFrame(krok);
    });
    obserwator.observe(el);

    const rozmiar = new ResizeObserver(() => {
      wys = el.offsetHeight || 1;
    });
    rozmiar.observe(el);

    window.addEventListener("pointermove", naRuch, { passive: true });
    klatka = requestAnimationFrame(krok);

    return () => {
      obserwator.disconnect();
      rozmiar.disconnect();
      window.removeEventListener("pointermove", naRuch);
      if (klatka) cancelAnimationFrame(klatka);
    };
  }, []);

  return (
    <header className="cl-hero" ref={korzen}>
      <div className="cl-hero__swiatlo" aria-hidden="true" />

      <div className="cl-pasek">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="cl-pasek__logo"
          src="/icaros-logo.webp"
          alt="ICAROS"
          width={1000}
          height={135}
          translate="no"
        />
        <div className="cl-pasek__prawa">
          <Telefon className="cl-pasek__tel" />
          <a className="cl-link cl-pasek__rozmowa" href="#kalendarz">
            {CTA_DRUGIE}
          </a>
        </div>
      </div>

      <div className="cl-hero__scena">
        {/* Chmura za napisem. Istnieje tylko w czasie animacji wejścia. */}
        <div className="cl-hero__chmura" aria-hidden="true" />
        <span className="cl-hero__slowo" aria-hidden="true" translate="no">
          CLOUD
        </span>
        <div className="cl-hero__produkt">
          <div className="cl-hero__podloga" aria-hidden="true" />
          {/* Oba pliki są gotowe w dwóch rozmiarach i idą prosto z CDN, bez
              optymalizatora obrazów: to pierwszy ekran po kliknięciu w reklamę. */}
          <div className="cl-hero__odbicie" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/cloud/platforma-m.webp" alt="" width={1200} height={394} decoding="async" />
          </div>
          <div className="cl-hero__bryla">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cloud/platforma.webp"
              srcSet="/cloud/platforma-m.webp 1200w, /cloud/platforma.webp 2400w"
              sizes="(max-width: 700px) 94vw, 74vw"
              alt={ALT}
              width={2400}
              height={788}
              fetchPriority="high"
              decoding="sync"
            />
          </div>
          {/* Mgła przy podłodze, w którą platforma osiada. Też tylko na wejście. */}
          <div className="cl-hero__mgla" aria-hidden="true" />
        </div>
      </div>

      <div className="cl-hero__dol">
        <div>
          <h1 className="cl-hero__h1">{H1}</h1>
          <p className="cl-hero__opis">{OPIS_POD_H1}</p>
          <a className="cl-link cl-hero__rozmowa" href="#kalendarz">
            {CTA_DRUGIE}
          </a>
        </div>
        <dl className="cl-hero__dane">
          {HERO_DANE.map((pozycja) => (
            <div key={pozycja.etykieta}>
              <dt>{pozycja.etykieta}</dt>
              <dd>{pozycja.wartosc}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
