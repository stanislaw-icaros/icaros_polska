import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyKontakt from "@/components/StickyKontakt";

/**
 * Strefa pacjenta ma jedną drogę do rozmowy: pasek u dołu, który prowadzi do
 * kalendarza w zakładce kontaktu. Formularza kontaktowego pod każdą podstroną
 * już nie ma.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer variant="patient" cta={false} />
      {/* Miejsce pod pasek kontaktu: bez niego zasłaniałby ostatni wiersz
          stopki. Kolor ten sam co stopka, więc czyta się jak jej margines. */}
      <div aria-hidden className="h-[116px] bg-foreground sm:h-[80px]" />
      <StickyKontakt wariant="patient" />
    </>
  );
}
