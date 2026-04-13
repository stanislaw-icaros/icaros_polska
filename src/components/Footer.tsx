"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const footerLinks = {
  rozwiazania: {
    title: "Rozwiązania",
    links: [
      { label: "ICAROS Circle", href: "#produkty" },
      { label: "ICAROS Health", href: "#produkty" },
      { label: "ICAROS Guardian", href: "#produkty" },
      { label: "ICAROS Cloud", href: "#produkty" },
    ],
  },
  firma: {
    title: "Firma",
    links: [
      { label: "O ICAROS", href: "#rozwiazania" },
      { label: "Badania naukowe", href: "#badania" },
      { label: "Kontakt", href: "#kontakt" },
    ],
  },
  zasoby: {
    title: "Zasoby",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Kalkulacja ROI", href: "#efektywnosc" },
      { label: "Umów prezentację", href: "#kontakt" },
    ],
  },
};

export default function Footer() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <footer ref={ref} className="bg-foreground text-white">
      <div className="border-b border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
          >
            <div>
              <h3 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold tracking-[-0.03em]">
                Gotowy na nowoczesną rehabilitację?
              </h3>
              <p className="mt-3 text-white/30 text-[15px]">
                Umów bezpłatną prezentację i zobacz, jak ICAROS zmienia zasady gry.
              </p>
            </div>
            <a
              href="#kontakt"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-foreground text-[14px] font-semibold hover:bg-white/90 transition-all duration-500 shrink-0"
            >
              Umów prezentację
              <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="text-[18px] font-bold tracking-[0.15em]">ICAROS</span>
              <span className="text-[9px] font-medium tracking-[0.2em] text-white/25 uppercase mt-0.5">
                Polska
              </span>
            </div>
            <p className="mt-5 text-[13px] text-white/25 leading-[1.8] max-w-xs">
              Oficjalny dystrybutor technologii ICAROS w&nbsp;Polsce. Nowoczesne
              rozwiązania łączące rehabilitację z&nbsp;grywalizacją i&nbsp;wirtualną
              rzeczywistością.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="text-[11px] text-white/15 tracking-[0.1em]">Technologia</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] text-white/30 font-medium border border-white/[0.06]">
                Made in Germany
              </span>
            </div>
          </div>

          {Object.values(footerLinks).map((section) => (
            <div key={section.title} className="lg:col-span-2">
              <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/20 mb-6">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13px] text-white/30 hover:text-white/70 transition-colors duration-500"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/20 mb-6">
              Kontakt
            </h4>
            <ul className="space-y-4">
              <li className="text-[13px] text-white/30">admin@icaros.com.pl</li>
              <li className="text-[13px] text-white/30">Polska</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-white/15">
              &copy; {new Date().getFullYear()} ICAROS Polska. Wszelkie prawa
              zastrzeżone.
            </p>
            <div className="flex items-center gap-8">
              <a href="#" className="text-[11px] text-white/15 hover:text-white/40 transition-colors duration-500">
                Polityka prywatności
              </a>
              <a href="#" className="text-[11px] text-white/15 hover:text-white/40 transition-colors duration-500">
                Regulamin
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
