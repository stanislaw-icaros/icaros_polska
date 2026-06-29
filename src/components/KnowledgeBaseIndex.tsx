"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Activity, LayoutGrid, Building2, TrendingUp, HelpCircle, FileText, Briefcase, MapPin, ArrowUpRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const entries = [
  {
    href: "/rozwiazania",
    label: "Jak to działa",
    description: "Niemiecka technologia, która łączy rehabilitację, trening i wirtualną rzeczywistość.",
    image: "/icaros_health_w_uzyciu.webp",
    icon: Activity,
    span: "lg:col-span-2",
  },
  {
    href: "/produkty",
    label: "Urządzenia",
    description: "Cztery urządzenia, jeden ekosystem ICAROS Circle.",
    image: "/Full_Icaros_Circle_Display.webp",
    icon: LayoutGrid,
    span: "",
  },
  {
    href: "/zastosowania",
    label: "Stosowanie",
    description: "Schorzenia i wskazania, w których pomaga ICAROS - od neurologii po seniorów.",
    image: "/senior_6.webp",
    icon: Building2,
    span: "",
  },
  {
    href: "/efektywnosc",
    label: "Efekty i badania",
    description: "Ponad 9 badań klinicznych i historie pacjentów po udarze potwierdzające skuteczność.",
    image: "/Icaros-24_0428.webp",
    icon: TrendingUp,
    span: "lg:col-span-2",
  },
  {
    href: "/faq",
    label: "FAQ / Pytania",
    description: "Technologia, terapia, wdrożenie, wsparcie i koszty - w jednym miejscu.",
    image: "/Icaros-24_0552.webp",
    icon: HelpCircle,
    span: "",
  },
  {
    href: "/mapa",
    label: "Lokalizacje",
    description: "Mapa placówek w Polsce, gdzie pracuje ICAROS - część dostępna publicznie.",
    image: "/ICAROS-17_0051.webp",
    icon: MapPin,
    span: "",
  },
  {
    href: "/komercjalizacja",
    label: "Dla biznesu",
    description: "Argumenty za zakupem, kalkulator ROI i finansowanie - strefa dla placówek.",
    image: "/Icaros-24_0428.webp",
    icon: Briefcase,
    span: "",
  },
  {
    href: "/raport",
    label: "Bezpłatny raport",
    description: "Dane finansowe i doświadczenia 100+ klinik w Europie. Pobierz PDF.",
    image: "/ICAROS-17_0051.webp",
    icon: FileText,
    span: "",
  },
];

export default function KnowledgeBaseIndex() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="relative overflow-hidden bg-foreground py-24 lg:py-32 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 50% 50% at 85% 0%, rgba(255,102,0,0.10), transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-7" style={{ background: "linear-gradient(90deg,#ff6600,#ff7b1f)" }} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">
                Baza wiedzy
              </span>
            </div>
            <h2 className="mt-5 text-[clamp(1.9rem,4vw,2.9rem)] font-bold leading-[1.05] tracking-[-0.03em]">
              Wszystko, co warto wiedzieć o systemie ICAROS
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-[1.8] text-white/55">
            Każdy temat opisaliśmy osobno. Wybierz to, co Cię interesuje, albo
            przejdź je po kolei - jak rozdziały jednego przewodnika.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry, i) => {
            const Icon = entry.icon;
            return (
              <motion.div
                key={entry.href}
                initial={{ opacity: 0, y: 24 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={entry.span}
              >
                <Link
                  href={entry.href}
                  className="group relative flex h-full min-h-[280px] flex-col justify-end overflow-hidden border border-white/[0.08] p-7 lg:min-h-[320px] lg:p-8"
                >
                  <Image
                    src={entry.image}
                    alt=""
                    fill
                    className="object-cover opacity-60 transition-all duration-700 group-hover:scale-[1.05] group-hover:opacity-75"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/70 to-foreground/20" />

                  <div className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center border border-white/15 bg-white/5 backdrop-blur-sm transition-colors duration-500 group-hover:border-brand-orange/60">
                    <Icon className="h-[18px] w-[18px] text-white/80 transition-colors duration-500 group-hover:text-brand-orange" strokeWidth={1.5} />
                  </div>

                  <div className="relative">
                    <h3 className="text-[21px] font-bold tracking-[-0.02em] text-white">
                      {entry.label}
                    </h3>
                    <p className="mt-2.5 max-w-sm text-[14px] leading-[1.65] text-white/65">
                      {entry.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.02em] text-white/70 transition-colors duration-500 group-hover:text-white">
                      Otwórz
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
