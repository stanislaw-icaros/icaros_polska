"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import LegalLinks from "@/components/LegalLinks";
import SocialLinks from "@/components/SocialLinks";
import { COMPANY_ADDRESS, COMPANY_NAME, DISCLAIMER_MEDICAL_DEVICES, KRS, NIP } from "@/lib/legal";
import { products } from "@/lib/products";

const footerLinks = {
  rozwiazania: {
    title: "Urządzenia",
    links: products.map((p) => ({ label: p.name, href: `/produkty/${p.slug}` })),
  },
  firma: {
    title: "Firma",
    links: [
      { label: "O ICAROS", href: "/jak-to-dziala" },
      { label: "Badania naukowe", href: "/efektywnosc" },
      { label: "Finansowanie", href: "/finansowanie" },
      { label: "Kontakt", href: "/kontakt" },
    ],
  },
  zasoby: {
    title: "Zasoby",
    links: [
      { label: "FAQ / Pytania", href: "/faq" },
      { label: "Lokalizacje w Polsce", href: "/mapa" },
      { label: "ICAROS na świecie", href: "/icaros-na-swiecie" },
      { label: "Raport", href: "/raport" },
    ],
  },
};

export default function Footer({
  variant = "business",
}: {
  variant?: "patient" | "business";
}) {
  const { ref, isVisible } = useScrollAnimation();
  const patient = variant === "patient";

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
                {patient ? "Masz pytania o ICAROS?" : "Gotowy na nowoczesną rehabilitację?"}
              </h3>
              <p className="mt-3 text-white/75 text-[15px]">
                {patient
                  ? "Napisz do nas albo znajdź placówkę z ICAROS w pobliżu."
                  : "Umów bezpłatną prezentację i zobacz, jak ICAROS zmienia zasady gry."}
              </p>
            </div>
            <a
              href={patient ? "/kontakt" : "#kontakt"}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-foreground text-[14px] font-semibold hover:bg-white/90 transition-all duration-500 shrink-0"
            >
              {patient ? "Skontaktuj się" : "Umów prezentację"}
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
              <span className="text-[9px] font-medium tracking-[0.2em] text-white/70 uppercase mt-0.5">
                Polska
              </span>
            </div>
            <p className="mt-5 text-[13px] text-white/75 leading-[1.8] max-w-xs">
              Oficjalny dystrybutor technologii ICAROS w&nbsp;Polsce. Nowoczesne
              rozwiązania łączące rehabilitację z&nbsp;grywalizacją i&nbsp;wirtualną
              rzeczywistością.
            </p>
            <p className="mt-5 max-w-sm text-[12px] leading-[1.8] text-white/18">
              {COMPANY_NAME}, {COMPANY_ADDRESS}. KRS {KRS}, NIP {NIP}.
            </p>
            <p className="mt-4 max-w-md text-[12px] leading-[1.8] text-white/70">
              {DISCLAIMER_MEDICAL_DEVICES}
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="text-[11px] text-white/60 tracking-[0.1em]">Technologia</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] text-white/75 font-medium border border-white/[0.10]">
                Made in Germany
              </span>
            </div>

            <div className="mt-10">
              <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/60">
                Odwiedź nas w social mediach
              </h4>
              <SocialLinks variant="square" className="mt-5" iconSize="h-[18px] w-[18px]" />
            </div>
          </div>

          {Object.values(footerLinks).map((section) => (
            <div key={section.title} className="lg:col-span-2">
              <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/60 mb-6">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.label}`}>
                    {link.href.startsWith("#") ? (
                      <a
                        href={link.href}
                        className="text-[13px] text-white/75 hover:text-white transition-colors duration-500"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[13px] text-white/75 hover:text-white transition-colors duration-500"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/60 mb-6">
              Kontakt
            </h4>
            <ul className="space-y-4">
              <li><a href="mailto:kontakt@icaros.com.pl" className="text-[13px] text-white/80 hover:text-white transition-colors duration-300">kontakt@icaros.com.pl</a></li>
              <li className="text-[13px] text-white/75">Polska</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-white/55">
              &copy; {new Date().getFullYear()} ICAROS Polska. Wszelkie prawa
              zastrzeżone.
            </p>
            <LegalLinks />
          </div>
        </div>
      </div>
    </footer>
  );
}
