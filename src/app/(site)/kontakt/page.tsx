import type { Metadata } from "next";
import ContactInfo from "@/components/ContactInfo";
import { getLocations } from "@/lib/mapa/getLocations";

export const metadata: Metadata = {
  title: "Kontakt | ICAROS Polska",
  description:
    "Skontaktuj się z ICAROS Polska - oficjalnym dystrybutorem technologii ICAROS. E-mail, telefon +48 32 30 77 444, dane spółki i social media.",
  alternates: { canonical: "/kontakt" },
};

export default async function KontaktPage() {
  const locations = await getLocations();
  return <ContactInfo variant="patient" locations={locations} />;
}
