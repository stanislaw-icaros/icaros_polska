import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyKontakt from "@/components/StickyKontakt";

/**
 * Strefa biznes ma jedną drogę do kontaktu: pasek u dołu, który prowadzi do
 * kalendarza w zakładce kontaktu. Panelu „Porozmawiajmy o Twojej placówce"
 * pod każdą podstroną już nie ma.
 */
export default function BiznesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navigation variant="business" />
      <main className="bg-[#0a0a0a]">{children}</main>
      <Footer cta={false} />
      {/* Miejsce pod pasek kontaktu: bez niego zasłaniałby ostatni wiersz
          stopki. Kolor ten sam co stopka, więc czyta się jak jej margines. */}
      <div aria-hidden className="h-[116px] bg-foreground sm:h-[80px]" />
      <StickyKontakt />
    </>
  );
}
