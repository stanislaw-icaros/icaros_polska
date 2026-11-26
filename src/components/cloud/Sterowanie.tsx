"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { STEROWANIE } from "@/lib/cloud/tresc";

type Bramka = { y: number; cx: number; stan: "przed" | "trafiona" | "minieta" };

const TLO = "#05070b";
const AKCENT = "#ff6a14";
const POZYCJA_Y = 0.6;
const POLOWA_BRAMKI = 0.085;
const ODSTEP = 0.42;
const PREDKOSC = 0.3;

function ogranicz(wartosc: number, min: number, max: number) {
  return Math.max(min, Math.min(max, wartosc));
}

/**
 * Pokaz zasady działania: wychylenie platformy steruje zjazdem na ekranie.
 *
 * Kursor albo palec przesuwany w poziomie przechyla platformę, a narciarz
 * na ekranie jedzie tam, gdzie platforma jest niżej. Kiedy nikt nie steruje,
 * zjazd prowadzi się sam, żeby scena nie stała martwa.
 *
 * To jest ilustracja zasady, nie zrzut z aplikacji ICAROS.
 */
export default function Sterowanie() {
  const scena = useRef<HTMLDivElement>(null);
  const plotno = useRef<HTMLCanvasElement>(null);
  const licznik = useRef<HTMLElement>(null);
  const wstrzymany = useRef(false);
  const wznow = useRef<() => void>(() => {});
  const [pauza, ustawPauze] = useState(false);

  useEffect(() => {
    const el = scena.current;
    const canvas = plotno.current;
    if (!el || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bezRuchu = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let szer = 0;
    let wys = 0;
    let klatka = 0;
    let widoczny = false;
    let poprzedni = 0;

    let przechyl = 0;
    let celPrzechylu = 0;
    let ostatnieSterowanie = -1e9;
    let x = 0.5;
    let droga = 0;
    let trafione = 0;
    let ostatniCx = 0.5;
    const bramki: Bramka[] = [];
    const slad: { x: number; droga: number }[] = [];

    const ziarno = Array.from({ length: 46 }, (_, i) => ({
      x: (Math.sin(i * 12.9898) * 43758.5453) % 1,
      y: (Math.sin(i * 78.233) * 12543.123) % 1,
    })).map((p) => ({ x: Math.abs(p.x), y: Math.abs(p.y) }));

    const nowaBramka = (y: number) => {
      const skok = (Math.random() - 0.5) * 0.5;
      ostatniCx = ogranicz(ostatniCx + skok, 0.24, 0.76);
      bramki.push({ y, cx: ostatniCx, stan: "przed" });
    };

    for (let i = 0; i < 4; i += 1) nowaBramka(POZYCJA_Y - 0.25 - i * ODSTEP);

    const dopasuj = () => {
      const ramka = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      szer = ramka.width;
      wys = ramka.height;
      canvas.width = Math.round(szer * dpr);
      canvas.height = Math.round(wys * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rysuj();
    };

    const rysuj = () => {
      const s = wys / 420;
      ctx.fillStyle = TLO;
      ctx.fillRect(0, 0, szer, wys);

      // Śnieg przesuwający się pod narciarzem: daje wrażenie prędkości.
      ctx.fillStyle = "rgba(210,222,245,0.2)";
      for (const p of ziarno) {
        const py = ((p.y + droga) % 1) * wys;
        ctx.fillRect(p.x * szer, py, 2 * s, 2 * s);
      }

      // Linia przejazdu przez kolejne bramki.
      ctx.strokeStyle = "rgba(210,222,245,0.14)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3 * s, 9 * s]);
      ctx.beginPath();
      ctx.moveTo(x * szer, POZYCJA_Y * wys);
      const przed = bramki.filter((b) => b.stan === "przed").sort((a, b) => b.y - a.y);
      let px = x * szer;
      let py = POZYCJA_Y * wys;
      for (const b of przed) {
        const bx = b.cx * szer;
        const by = b.y * wys;
        ctx.bezierCurveTo(px, (py + by) / 2, bx, (py + by) / 2, bx, by);
        px = bx;
        py = by;
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Ślad nart.
      for (const bok of [-1, 1]) {
        ctx.beginPath();
        let pierwszy = true;
        for (const punkt of slad) {
          const sy = (POZYCJA_Y + (droga - punkt.droga)) * wys;
          const sx = punkt.x * szer + bok * 5 * s;
          if (pierwszy) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
          pierwszy = false;
        }
        const gradient = ctx.createLinearGradient(0, POZYCJA_Y * wys, 0, wys);
        gradient.addColorStop(0, "rgba(244,246,250,0.5)");
        gradient.addColorStop(1, "rgba(244,246,250,0)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2 * s;
        ctx.stroke();
      }

      // Bramki.
      for (const b of bramki) {
        const by = b.y * wys;
        const zanik = ogranicz(b.y / 0.16, 0, 1);
        const kolor =
          b.stan === "trafiona"
            ? AKCENT
            : b.stan === "minieta"
              ? "rgba(244,246,250,0.22)"
              : "rgba(244,246,250,0.95)";
        ctx.globalAlpha = zanik;
        ctx.strokeStyle = "rgba(210,222,245,0.16)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo((b.cx - POLOWA_BRAMKI) * szer, by);
        ctx.lineTo((b.cx + POLOWA_BRAMKI) * szer, by);
        ctx.stroke();
        ctx.fillStyle = kolor;
        for (const bok of [-1, 1]) {
          const bx = (b.cx + bok * POLOWA_BRAMKI) * szer;
          ctx.beginPath();
          ctx.roundRect(bx - 2.5 * s, by - 15 * s, 5 * s, 30 * s, 2.5 * s);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // Narciarz widziany z góry: dwie narty i sylwetka.
      ctx.save();
      ctx.translate(x * szer, POZYCJA_Y * wys);
      ctx.rotate(przechyl * 0.42);
      ctx.strokeStyle = "#f4f6fa";
      ctx.lineCap = "round";
      ctx.lineWidth = 3.4 * s;
      for (const bok of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(bok * 5 * s, -17 * s);
        ctx.lineTo(bok * 5 * s, 15 * s);
        ctx.stroke();
      }
      ctx.fillStyle = "#f4f6fa";
      ctx.beginPath();
      ctx.arc(0, 0, 7.5 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Bramki wyłaniają się z ciemności u góry ekranu.
      const gora = ctx.createLinearGradient(0, 0, 0, wys * 0.2);
      gora.addColorStop(0, TLO);
      gora.addColorStop(1, "rgba(5,7,11,0)");
      ctx.fillStyle = gora;
      ctx.fillRect(0, 0, szer, wys * 0.2);
    };

    const krok = (teraz: number) => {
      klatka = 0;
      if (!widoczny || wstrzymany.current) return;
      const dt = Math.min(0.05, (teraz - poprzedni) / 1000 || 0);
      poprzedni = teraz;

      // Bez sterowania zjazd prowadzi się sam, celując w najbliższą bramkę.
      if (teraz - ostatnieSterowanie > 3200) {
        const najblizsza = bramki
          .filter((b) => b.stan === "przed")
          .sort((a, b) => b.y - a.y)[0];
        celPrzechylu = najblizsza ? ogranicz((najblizsza.cx - x) * 7, -1, 1) : 0;
      }

      przechyl += (celPrzechylu - przechyl) * Math.min(1, dt * 7);
      x = ogranicz(x + przechyl * dt * 0.62, 0.08, 0.92);
      droga += PREDKOSC * dt;

      for (const b of bramki) {
        const przedtem = b.y;
        b.y += PREDKOSC * dt;
        if (b.stan === "przed" && przedtem < POZYCJA_Y && b.y >= POZYCJA_Y) {
          if (Math.abs(x - b.cx) <= POLOWA_BRAMKI) {
            b.stan = "trafiona";
            trafione += 1;
            if (licznik.current) licznik.current.textContent = String(trafione);
          } else {
            b.stan = "minieta";
          }
        }
      }
      while (bramki.length && bramki[0].y > 1.15) bramki.shift();
      const najwyzsza = bramki.reduce((min, b) => Math.min(min, b.y), 1);
      if (najwyzsza > -0.1) nowaBramka(najwyzsza - ODSTEP);

      slad.unshift({ x, droga });
      if (slad.length > 90) slad.pop();

      el.style.setProperty("--tilt", przechyl.toFixed(4));
      rysuj();
      klatka = requestAnimationFrame(krok);
    };

    const start = () => {
      if (bezRuchu || klatka || wstrzymany.current) return;
      poprzedni = performance.now();
      klatka = requestAnimationFrame(krok);
    };
    wznow.current = () => {
      if (widoczny) start();
    };

    const naRuch = (e: PointerEvent) => {
      const ramka = el.getBoundingClientRect();
      const srodek = ramka.left + ramka.width / 2;
      celPrzechylu = ogranicz((e.clientX - srodek) / (ramka.width * 0.36), -1, 1);
      ostatnieSterowanie = performance.now();
    };

    const naKlawisz = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      celPrzechylu = e.key === "ArrowLeft" ? -1 : 1;
      ostatnieSterowanie = performance.now();
    };
    const poKlawiszu = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") celPrzechylu = 0;
    };

    const sekcja = el.closest("section") ?? el;
    const obserwator = new IntersectionObserver(
      ([wpis]) => {
        widoczny = wpis.isIntersecting;
        if (widoczny) start();
      },
      { threshold: 0.15 }
    );
    obserwator.observe(el);

    const rozmiar = new ResizeObserver(dopasuj);
    rozmiar.observe(canvas);
    dopasuj();

    sekcja.addEventListener("pointermove", naRuch as EventListener, { passive: true });
    el.addEventListener("keydown", naKlawisz);
    el.addEventListener("keyup", poKlawiszu);

    return () => {
      obserwator.disconnect();
      rozmiar.disconnect();
      sekcja.removeEventListener("pointermove", naRuch as EventListener);
      el.removeEventListener("keydown", naKlawisz);
      el.removeEventListener("keyup", poKlawiszu);
      if (klatka) cancelAnimationFrame(klatka);
    };
  }, []);

  return (
    <section className="cl-sek cl-st" aria-labelledby="cl-sterowanie">
      <div className="cl-w cl-st__uklad">
        <div>
          <h2 className="cl-h2" id="cl-sterowanie">
            {STEROWANIE.naglowek}
          </h2>
          <p className="cl-lead">{STEROWANIE.tekst}</p>
          <p className="cl-st__podpowiedz">
            <span className="cl-st__strzalki" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 3 5 9l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="m7 3 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="cl-st__mysz">{STEROWANIE.podpowiedzMysz}</span>
            <span className="cl-st__dotyk">{STEROWANIE.podpowiedzDotyk}</span>
          </p>
        </div>

        <div
          className="cl-st__scena"
          ref={scena}
          tabIndex={0}
          role="group"
          aria-label="Pokaz sterowania. Strzałki w lewo i w prawo przechylają platformę."
        >
          <div className="cl-st__ekran">
            <canvas ref={plotno} aria-hidden="true" />
            {/* Przy wyłączonych animacjach pokaz stoi, a przycisk chowa CSS. */}
            <button
                type="button"
                className="cl-st__pauza"
                aria-label={pauza ? "Wznów pokaz" : "Zatrzymaj pokaz"}
                aria-pressed={pauza}
                onClick={() => {
                  const nowa = !pauza;
                  wstrzymany.current = nowa;
                  ustawPauze(nowa);
                  if (!nowa) wznow.current();
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                  {pauza ? (
                    <path d="M3.2 1.6v10.8a.5.5 0 0 0 .77.42l8.3-5.4a.5.5 0 0 0 0-.84l-8.3-5.4a.5.5 0 0 0-.77.42Z" />
                  ) : (
                    <path d="M2.5 1.5h3v11h-3zM8.5 1.5h3v11h-3z" />
                  )}
                </svg>
              </button>
            <p className="cl-st__hud" style={{ margin: 0 }}>
              {STEROWANIE.licznik}
              <strong ref={licznik}>0</strong>
            </p>
          </div>
          <div className="cl-st__platforma">
            <Image
              src="/cloud/platforma-skos.webp"
              alt="Platforma ICAROS Cloud widziana z góry pod kątem"
              width={1800}
              height={714}
              sizes="(max-width: 900px) 86vw, 46vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
