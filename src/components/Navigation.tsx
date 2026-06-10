"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/rozwiazania", label: "Jak to działa" },
  { href: "/produkty", label: "Urządzenia" },
  { href: "/zastosowania", label: "Zastosowania" },
  { href: "/efektywnosc", label: "Efekty i badania" },
  { href: "/faq", label: "FAQ" },
  { href: "/raport", label: "Raport" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const solid = scrolled || pathname !== "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          solid
            ? "bg-white/90 backdrop-blur-2xl border-b border-foreground/[0.05] shadow-[0_1px_30px_-12px_rgba(0,0,0,0.15)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-18 lg:h-24">
            <Link href="/" className="relative shrink-0">
              <Image
                src="/icaros-logo.webp"
                alt="ICAROS"
                width={140}
                height={28}
                className="h-6 lg:h-7 w-auto"
                priority
              />
            </Link>

            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group relative text-[13px] font-medium transition-colors duration-500 tracking-[0.02em] ${
                      active ? "text-foreground" : "text-foreground/45 hover:text-foreground"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-[2px] transition-all duration-500 ${
                        active ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                      style={{ background: "linear-gradient(90deg, #ff6600, #ff7b1f)" }}
                    />
                  </Link>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center">
              <a
                href="#kontakt"
                className="text-[13px] font-semibold text-white px-7 py-3 transition-all duration-500 tracking-[0.02em] hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
              >
                Umów prezentację
              </a>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center"
              aria-label="Menu"
            >
              <div className="flex flex-col gap-[5px]">
                <span
                  className={`block w-6 h-[1px] bg-foreground transition-all duration-500 origin-center ${
                    mobileOpen ? "rotate-45 translate-y-[3px]" : ""
                  }`}
                />
                <span
                  className={`block w-6 h-[1px] bg-foreground transition-all duration-500 ${
                    mobileOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block w-6 h-[1px] bg-foreground transition-all duration-500 origin-center ${
                    mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""
                  }`}
                />
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
            className="fixed inset-0 z-40 bg-white flex flex-col justify-between pt-28 pb-12 px-8"
          >
            <div className="flex flex-col gap-0">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-[28px] font-medium text-foreground py-4 border-b border-foreground/[0.06] tracking-[-0.02em]"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <a
                href="#kontakt"
                onClick={() => setMobileOpen(false)}
                className="inline-flex text-base font-semibold text-white px-10 py-5 tracking-[0.01em] hover:opacity-90 transition-opacity duration-500"
                style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
              >
                Umów prezentację
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
