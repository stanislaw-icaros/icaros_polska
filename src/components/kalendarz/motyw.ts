/**
 * Dwa zestawy kolorów kalendarza rozmów.
 *
 * Kalendarz stoi w dwóch miejscach: na ciemnej stronie /kalendarz i w jasnej
 * zakładce kontaktu. Zamiast dwóch kopii komponentu trzymamy tu dwa zestawy
 * klas, a komponent wybiera jeden po nazwie motywu.
 */

export type MotywKalendarza = "ciemny" | "jasny";

export type TokenyKalendarza = {
  /** Płyta kalendarza. */
  karta: string;
  /** Pas nad siatką: o stopień inny od płyty. */
  pasek: string;
  mocny: string;
  slaby: string;
  /** Neutralny kafelek: godzina, dzień z wolnymi terminami, strzałka. */
  kafelek: string;
  /** Dzień bez wolnych godzin. */
  pusty: string;
  /** Strzałka miesiąca bez celu. */
  wygaszony: string;
  /** Kafelek po najechaniu zmienia się w akcent. */
  kafelekAkcent: string;
  akcent: string;
  /** Delikatna poświata akcentu pod paskiem z wybranym terminem. */
  poswiata: string;
  /** Pole formularza. */
  pole: string;
  /** Błąd formularza. */
  blad: string;
  /** Kolor tła pod obwódką focusu. */
  obwodka: string;
  /** Odnośnik w tekście po najechaniu. */
  linkHover: string;
  /** Jasność pól zgody. */
  zgody: "light" | "dark";
};

export const TOKENY: Record<MotywKalendarza, TokenyKalendarza> = {
  ciemny: {
    karta: "bg-h-night",
    pasek: "bg-h-surface",
    mocny: "text-h-ink",
    slaby: "text-h-ink-soft",
    kafelek: "bg-white/[0.06] text-h-ink hover:bg-white/[0.12]",
    pusty: "text-white/35",
    wygaszony: "disabled:bg-transparent disabled:text-white/25",
    kafelekAkcent: "hover:bg-h-accent hover:text-h-void",
    akcent: "bg-h-accent text-h-void hover:bg-[#ff7b1f]",
    poswiata: "bg-h-accent/[0.10]",
    pole:
      "bg-white/[0.05] text-h-ink placeholder:text-white/35 focus:bg-white/[0.09] focus-visible:ring-h-accent",
    blad: "bg-red-500/10 text-red-300",
    obwodka: "focus-visible:ring-offset-h-night",
    linkHover: "hover:text-h-accent",
    zgody: "dark",
  },
  jasny: {
    karta: "bg-white border border-foreground/[0.08]",
    pasek: "bg-surface",
    mocny: "text-foreground",
    slaby: "text-foreground/60",
    kafelek: "bg-foreground/[0.05] text-foreground hover:bg-foreground/[0.11]",
    pusty: "text-foreground/30",
    wygaszony: "disabled:bg-transparent disabled:text-foreground/20",
    kafelekAkcent: "hover:bg-brand-orange hover:text-white",
    akcent: "bg-brand-orange text-white hover:bg-brand-orange-light",
    poswiata: "bg-brand-orange/[0.08]",
    pole:
      "bg-foreground/[0.04] text-foreground placeholder:text-foreground/30 focus:bg-foreground/[0.07] focus-visible:ring-brand-orange",
    blad: "bg-red-50 text-red-700",
    obwodka: "focus-visible:ring-offset-white",
    linkHover: "hover:text-brand-orange",
    zgody: "light",
  },
};

/** Kolor akcentu w tekście i ikonach, osobno bo nie ma wersji z tłem. */
export const AKCENT_TEKST: Record<MotywKalendarza, string> = {
  ciemny: "text-h-accent",
  jasny: "text-brand-orange",
};
