"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SocialLinks from "@/components/SocialLinks";
import {
  COMPANY_ADDRESS,
  COMPANY_EMAIL,
  COMPANY_NAME,
  COMPANY_PHONE,
  COMPANY_PHONE_HREF,
  KRS,
  NIP,
  REGON,
} from "@/lib/legal";

type Variant = "patient" | "business";

export default function ContactInfo({ variant = "patient" }: { variant?: Variant }) {
  const { ref, isVisible } = useScrollAnimation();
  const dark = variant === "business";

  const t = {
    section: dark ? "bg-[#0a0a0a]" : "bg-white",
    eyebrow: dark ? "text-white/50" : "text-foreground/55",
    heading: dark ? "text-white" : "text-foreground",
    body: dark ? "text-white/70" : "text-foreground/70",
    label: dark ? "text-white/40" : "text-foreground/40",
    card: dark ? "border-white/[0.08] bg-white/[0.02]" : "border-foreground/[0.08] bg-surface",
    divider: dark ? "border-white/[0.08]" : "border-foreground/[0.08]",
    link: dark ? "text-white hover:text-white/70" : "text-foreground hover:text-foreground/60",
    social: dark ? "text-white/45 hover:text-white" : "text-foreground/40 hover:text-foreground",
  };

  const channels = [
    {
      icon: <Mail size={18} strokeWidth={1.5} />,
      label: "E-mail",
      value: COMPANY_EMAIL,
      href: `mailto:${COMPANY_EMAIL}`,
    },
    {
      icon: <Phone size={18} strokeWidth={1.5} />,
      label: "Telefon",
      value: COMPANY_PHONE,
      href: `tel:${COMPANY_PHONE_HREF}`,
    },
    {
      icon: <MapPin size={18} strokeWidth={1.5} />,
      label: "Adres",
      value: COMPANY_ADDRESS,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY_ADDRESS)}`,
    },
  ];

  return (
    <section ref={ref} className={`relative overflow-hidden pt-36 pb-24 lg:pt-44 lg:pb-32 ${t.section}`}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: dark
            ? "radial-gradient(ellipse 60% 50% at 85% 0%, rgba(255,102,0,0.10), transparent 70%)"
            : "radial-gradient(ellipse 60% 50% at 85% 0%, rgba(255,102,0,0.06), transparent 70%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className={`text-[11px] font-semibold uppercase tracking-[0.3em] ${t.eyebrow}`}>
              Kontakt
            </p>
            <h1 className={`mt-5 text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em] ${t.heading}`}>
              Porozmawiajmy o&nbsp;ICAROS
            </h1>
            <p className={`mt-6 max-w-md text-[16px] leading-[1.8] ${t.body}`}>
              Masz pytania o&nbsp;urządzenia, terapię lub współpracę? Napisz lub zadzwoń.
              Jesteśmy oficjalnym dystrybutorem technologii ICAROS w&nbsp;Polsce i&nbsp;chętnie
              pomożemy dobrać rozwiązanie do&nbsp;Twoich potrzeb.
            </p>

            <div className="mt-10 space-y-4">
              {channels.map((c, i) => (
                <motion.a
                  key={c.label}
                  href={c.href}
                  target={c.label === "Adres" ? "_blank" : undefined}
                  rel={c.label === "Adres" ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, x: -16 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                  className={`group flex items-center gap-4 border ${t.card} p-5 transition-colors duration-300`}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center ${dark ? "text-white/70" : "text-foreground/70"}`}>
                    {c.icon}
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-[10px] font-semibold uppercase tracking-[0.2em] ${t.label}`}>
                      {c.label}
                    </span>
                    <span className={`mt-1 block break-words text-[15px] font-medium ${t.link} transition-colors duration-300`}>
                      {c.value}
                    </span>
                  </span>
                </motion.a>
              ))}
            </div>

            <div className="mt-10">
              <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${t.label}`}>
                Znajdź nas w social mediach
              </p>
              <SocialLinks
                className="mt-4"
                iconSize="h-[18px] w-[18px]"
                itemClassName={t.social}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.8 }}
            className={`flex flex-col justify-between border ${t.card} p-8 lg:p-12`}
          >
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${t.label}`}>
                Dane spółki
              </p>
              <p className={`mt-5 text-[17px] font-semibold leading-[1.4] ${t.heading}`}>
                {COMPANY_NAME}
              </p>
              <p className={`mt-3 text-[14px] leading-[1.8] ${t.body}`}>{COMPANY_ADDRESS}</p>

              <div className={`mt-8 grid grid-cols-3 gap-4 border-t ${t.divider} pt-8`}>
                {[
                  { k: "KRS", v: KRS },
                  { k: "NIP", v: NIP },
                  { k: "REGON", v: REGON },
                ].map((row) => (
                  <div key={row.k}>
                    <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${t.label}`}>
                      {row.k}
                    </p>
                    <p className={`mt-1.5 text-[13px] font-medium tabular-nums ${t.body}`}>{row.v}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`mt-10 flex items-center gap-2 border-t ${t.divider} pt-8`}>
              <span className={`text-[11px] tracking-[0.1em] ${t.label}`}>Technologia</span>
              <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-medium ${dark ? "border border-white/[0.12] text-white/75" : "border border-foreground/[0.12] text-foreground/70"}`}>
                Made in Germany
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
