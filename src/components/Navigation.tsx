"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import AudienceSwitch from "@/components/AudienceSwitch";
import SocialLinks from "@/components/SocialLinks";
import { products } from "@/lib/products";

type NavLink = { href: string; label: string };
type NavGroup = { label: string; children: NavLink[]; align?: "left" | "right" };
type NavEntry = NavLink | NavGroup;

const isGroup = (e: NavEntry): e is NavGroup => "children" in e;

/** Lista urządzeń do rozwijanego menu "Urządzenia" - wspólna dla obu stref. */
const deviceChildren = (base: string): NavLink[] => [
  { href: base, label: "Wszystkie urządzenia" },
  ...products.map((p) => ({ href: `${base}/${p.slug}`, label: p.name })),
];

/**
 * Pytania, lokalizacje i zapisy schowane pod jedną pozycją "Zasoby" - ten sam
 * podział co w stopce. Dzięki temu pasek mieści się na laptopie 1280 px razem
 * z przełącznikiem stref i przyciskiem CTA, zamiast łamać się na dwie linie.
 */
const patientNav: NavEntry[] = [
  { href: "/jak-to-dziala", label: "Jak to działa" },
  { label: "Urządzenia", children: deviceChildren("/produkty") },
  { href: "/zastosowania", label: "Dla kogo" },
  { href: "/efektywnosc", label: "Efekty i badania" },
  {
    label: "Zasoby",
    align: "right",
    children: [
      { href: "/faq", label: "FAQ / Pytania" },
      { href: "/mapa", label: "Mapa w Polsce" },
      { href: "/icaros-na-swiecie", label: "ICAROS na świecie" },
      { href: "/raport", label: "Raport" },
      { href: "/newsletter", label: "Newsletter" },
    ],
  },
  { href: "/kontakt", label: "Kontakt" },
];

const businessNav: NavEntry[] = [
  { href: "/komercjalizacja", label: "Komercjalizacja" },
  { href: "/finansowanie", label: "Finansowanie" },
  { label: "Urządzenia", children: deviceChildren("/urzadzenia") },
  { href: "/dla-placowek", label: "Zastosowania" },
  {
    label: "Zasoby",
    align: "right",
    children: [
      { href: "/pytania", label: "FAQ / Pytania" },
      { href: "/lokalizacje", label: "Lokalizacje w Polsce" },
      { href: "/icaros-na-swiecie-partner", label: "ICAROS na świecie" },
      { href: "/newsletter-partner", label: "Newsletter" },
    ],
  },
  { href: "/kontakt-partner", label: "Kontakt" },
];

function NavItemLink({
  href,
  label,
  active,
  linkBase,
  linkActive,
}: {
  href: string;
  label: string;
  active: boolean;
  linkBase: string;
  linkActive: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative whitespace-nowrap text-[13px] font-medium transition-colors duration-500 tracking-[0.01em] ${
        active ? linkActive : linkBase
      }`}
    >
      {label}
      <span
        className={`absolute -bottom-1.5 left-0 h-[2px] transition-all duration-500 ${
          active ? "w-full" : "w-0 group-hover:w-full"
        }`}
        style={{ background: "linear-gradient(90deg, #ff6600, #ff7b1f)" }}
      />
    </Link>
  );
}

function NavDropdown({
  group,
  dark,
  linkBase,
  linkActive,
}: {
  group: NavGroup;
  dark: boolean;
  linkBase: string;
  linkActive: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = group.children.some((c) => c.href === pathname);
  const alignRight = group.align === "right";

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`group relative flex items-center gap-1 whitespace-nowrap text-[13px] font-medium transition-colors duration-500 tracking-[0.01em] ${
          active || open ? linkActive : linkBase
        }`}
      >
        {group.label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
        />
        <span
          className={`absolute -bottom-1.5 left-0 h-[2px] transition-all duration-500 ${
            active ? "w-full" : "w-0 group-hover:w-full"
          }`}
          style={{ background: "linear-gradient(90deg, #ff6600, #ff7b1f)" }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute top-full pt-3 ${alignRight ? "right-0" : "left-0"}`}
          >
            <div
              className={`min-w-[200px] overflow-hidden border shadow-[0_18px_50px_-18px_rgba(0,0,0,0.35)] ${
                dark ? "border-white/10 bg-[#121212]" : "border-foreground/[0.08] bg-white"
              }`}
            >
              {group.children.map((c) => {
                const childActive = pathname === c.href;
                // ICAROS Circle to kompletny zestaw, nie kolejne urządzenie - wyróżniamy kolorem.
                const isCircle = c.href.endsWith("/circle");
                if (isCircle) {
                  return (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between gap-3 border-b px-5 py-3 text-[13px] font-semibold transition-colors duration-300 ${
                        dark ? "border-white/10" : "border-foreground/[0.08]"
                      } text-brand-orange hover:text-brand-orange-light ${
                        childActive ? (dark ? "bg-white/[0.06]" : "bg-foreground/[0.04]") : dark ? "hover:bg-white/[0.05]" : "hover:bg-foreground/[0.03]"
                      }`}
                    >
                      {c.label}
                      <span className="border border-brand-orange/30 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-orange/80">
                        Zestaw
                      </span>
                    </Link>
                  );
                }
                return (
                  <Link
                    key={c.href}
                    href={c.href}
                    onClick={() => setOpen(false)}
                    className={`block px-5 py-3 text-[13px] font-medium transition-colors duration-300 ${
                      dark
                        ? `${childActive ? "text-white bg-white/[0.06]" : "text-white/60 hover:text-white hover:bg-white/[0.05]"}`
                        : `${childActive ? "text-foreground bg-foreground/[0.04]" : "text-foreground/55 hover:text-foreground hover:bg-foreground/[0.03]"}`
                    }`}
                  >
                    {c.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navigation({
  variant = "patient",
}: {
  variant?: "patient" | "business";
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const business = variant === "business";
  const navEntries = business ? businessNav : patientNav;
  const solid = business || scrolled || pathname !== "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navBg = business
    ? "bg-[#0a0a0a]/90 backdrop-blur-2xl border-b border-white/[0.06]"
    : solid
    ? "bg-white/90 backdrop-blur-2xl border-b border-foreground/[0.05] shadow-[0_1px_30px_-12px_rgba(0,0,0,0.15)]"
    : "bg-transparent";

  const linkBase = business
    ? "text-white/45 hover:text-white"
    : "text-foreground/45 hover:text-foreground";
  const linkActive = business ? "text-white" : "text-foreground";
  const barColor = business ? "bg-white" : "bg-foreground";

  const mobileBorder = business ? "border-white/[0.08]" : "border-foreground/[0.06]";
  const mobileTop = business ? "text-white" : "text-foreground";
  const mobileMuted = business ? "text-white/40" : "text-foreground/35";
  const mobileChild = business
    ? "text-white/70 hover:text-white"
    : "text-foreground/60 hover:text-foreground";

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${navBg}`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between gap-6 h-18 lg:h-24">
            <div className="flex items-center gap-4 shrink-0">
              <Link href={business ? "/komercjalizacja" : "/"} className="relative shrink-0">
                <Image
                  src="/icaros-logo.webp"
                  alt="ICAROS"
                  width={140}
                  height={28}
                  className={`h-6 2xl:h-7 w-auto ${business ? "invert" : ""}`}
                  priority
                />
              </Link>
              {business && (
                <span className="hidden 2xl:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white border border-white/20">
                  Biznes
                </span>
              )}
              <div className="hidden xl:block">
                <AudienceSwitch
                  current={business ? "business" : "patient"}
                  variant={business ? "dark" : "light"}
                />
              </div>
            </div>

            <div className="hidden xl:flex items-center gap-4 2xl:gap-6">
              {navEntries.map((entry) =>
                isGroup(entry) ? (
                  <NavDropdown
                    key={entry.label}
                    group={entry}
                    dark={business}
                    linkBase={linkBase}
                    linkActive={linkActive}
                  />
                ) : (
                  <NavItemLink
                    key={entry.href}
                    href={entry.href}
                    label={entry.label}
                    active={pathname === entry.href}
                    linkBase={linkBase}
                    linkActive={linkActive}
                  />
                ),
              )}
            </div>

            {/* Po odchudzeniu paska prawa kolumna mieści się już na 1280 px w obu strefach. */}
            <div className="hidden xl:flex items-center">
              {business ? (
                <a
                  href="#kontakt"
                  className="whitespace-nowrap text-[13px] font-semibold text-white px-6 py-3 transition-all duration-500 tracking-[0.02em] hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
                >
                  Umów prezentację
                </a>
              ) : (
                <SocialLinks
                  iconSize="h-[18px] w-[18px]"
                  itemClassName="text-foreground/40 hover:text-foreground"
                />
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden relative w-10 h-10 flex items-center justify-center"
              aria-label="Menu"
            >
              <div className="flex flex-col gap-[5px]">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`block w-6 h-[1px] ${barColor} transition-all duration-500 origin-center ${
                      mobileOpen && i === 0 ? "rotate-45 translate-y-[3px]" : ""
                    } ${mobileOpen && i === 1 ? "opacity-0 scale-x-0" : ""} ${
                      mobileOpen && i === 2 ? "-rotate-45 -translate-y-[3px]" : ""
                    }`}
                  />
                ))}
              </div>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={`fixed inset-0 z-40 flex flex-col justify-between pt-28 pb-12 px-8 overflow-y-auto ${
              business ? "bg-[#0a0a0a] text-white" : "bg-white"
            }`}
          >
            <div className="flex flex-col gap-0">
              <div className="pb-6">
                <AudienceSwitch
                  current={business ? "business" : "patient"}
                  variant={business ? "dark" : "light"}
                />
              </div>
              {/* Grupy zostają grupami także na telefonie - płaska lista wszystkich
                  podstron rozciągała menu na kilka ekranów. */}
              {navEntries.map((entry, i) => (
                <motion.div
                  key={isGroup(entry) ? entry.label : entry.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className={`border-b ${mobileBorder}`}
                >
                  {isGroup(entry) ? (
                    <div className="py-5">
                      <p
                        className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${mobileMuted}`}
                      >
                        {entry.label}
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-x-6">
                        {entry.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className={`py-2 text-[15px] transition-colors duration-300 ${mobileChild}`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={entry.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block py-4 text-[22px] font-medium tracking-[-0.02em] ${mobileTop}`}
                    >
                      {entry.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="pt-8"
            >
              {business ? (
                <a
                  href="#kontakt"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex text-base font-semibold text-white px-10 py-5 tracking-[0.01em] hover:opacity-90 transition-opacity duration-500"
                  style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
                >
                  Umów prezentację
                </a>
              ) : (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/40">
                    Odwiedź nas
                  </p>
                  <SocialLinks
                    className="mt-4"
                    iconSize="h-6 w-6"
                    itemClassName="text-foreground/45 hover:text-foreground"
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
