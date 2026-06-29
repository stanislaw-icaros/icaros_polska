"use client";

import Link from "next/link";
import { User, Briefcase } from "lucide-react";

/**
 * Przełącznik audytorium: Pacjent (część jasna) / Biznes (ciemna strefa dla placówek).
 * Bez subdomeny - kieruje między stroną główną a strefą Biznes.
 */
export default function AudienceSwitch({
  current,
  variant = "light",
}: {
  current: "patient" | "business";
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";

  const track = dark
    ? "border-white/10 bg-white/[0.05]"
    : "border-foreground/[0.07] bg-foreground/[0.035]";
  const inactive = dark
    ? "text-white/55 hover:text-white"
    : "text-foreground/50 hover:text-foreground";

  const segment = (
    label: string,
    href: string,
    active: boolean,
    Icon: typeof User,
  ) => (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.01em] transition-colors duration-300 ${
        active ? "text-white" : inactive
      }`}
      style={
        active
          ? {
              background: "linear-gradient(135deg, #ff6600, #ff7b1f)",
              boxShadow: "0 4px 14px -4px rgba(255,102,0,0.55)",
            }
          : undefined
      }
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      {label}
    </Link>
  );

  return (
    <div className={`inline-flex items-center gap-0.5 rounded-full border p-[3px] ${track}`}>
      {segment("Pacjent", "/", current === "patient", User)}
      {segment("Biznes", "/komercjalizacja", current === "business", Briefcase)}
    </div>
  );
}
