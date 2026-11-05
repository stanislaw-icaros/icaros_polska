import type { Metadata } from "next";
import ContactInfo from "@/components/ContactInfo";
import SekcjaKalendarza from "@/components/kalendarz/SekcjaKalendarza";
import { getLocations } from "@/lib/mapa/getLocations";

export const metadata: Metadata = {
  title: "Kontakt dla partnerów | ICAROS Polska",
  description:
    "Umów 15-minutową rozmowę o ICAROS albo napisz do nas. E-mail, telefon +48 32 30 77 444, dane spółki i mapa placówek.",
  alternates: { canonical: "/kontakt-partner" },
};

// Wolne godziny w kalendarzu czytamy z Google przy każdym wejściu.
export const dynamic = "force-dynamic";

export default async function KontaktBiznesPage({
  searchParams,
}: {
  searchParams: Promise<{ osoba?: string }>;
}) {
  const [locations, parametry] = await Promise.all([getLocations(), searchParams]);
  return (
    <>
      <ContactInfo variant="business" locations={locations} />
      <SekcjaKalendarza osoba={parametry.osoba} />
    </>
  );
}
