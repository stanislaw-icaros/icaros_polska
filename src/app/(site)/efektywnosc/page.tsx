import type { Metadata } from "next";
import Link from "next/link";
import Studies from "@/components/Studies";
import StudiesLibrary from "@/components/StudiesLibrary";
import VideoCases from "@/components/VideoCases";

export const metadata: Metadata = {
  title: "Efekty i badania | ICAROS Polska",
  description:
    "Dowody naukowe i realne efekty terapii ICAROS: wyniki ponad 13 badań klinicznych nad terapią VR oraz historie pacjentów po udarze i seniorów.",
};

export default function EfektywnoscPage() {
  return (
    <>
      <Studies />
      <StudiesLibrary />
      <VideoCases />

      {/* Raport */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
          <div className="relative overflow-hidden border border-foreground/[0.08] bg-surface px-8 py-12 lg:px-14 lg:py-16">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse 50% 80% at 90% 10%, rgba(255,102,0,0.07), transparent 70%)" }}
            />
            <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-foreground/30">
                  Bezpłatny raport
                </p>
                <h2 className="mt-4 text-[clamp(1.6rem,3.4vw,2.4rem)] font-bold leading-[1.1] tracking-[-0.03em] text-foreground">
                  Wszystkie dane w jednym dokumencie
                </h2>
                <p className="mt-4 text-[15px] leading-[1.8] text-foreground/55">
                  Wyniki badań klinicznych, efekty terapii i doświadczenia ponad 100 klinik
                  w&nbsp;Europie - zebrane w jednym raporcie PDF. Pobierz za darmo.
                </p>
              </div>
              <Link
                href="/raport"
                className="inline-flex shrink-0 items-center gap-3 px-8 py-4 text-[14px] font-semibold text-white shadow-[0_14px_30px_-12px_rgba(255,102,0,0.55)] transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
              >
                Pobierz raport
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
