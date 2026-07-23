import type { Metadata } from "next";
import ContactInfo from "@/components/ContactInfo";

export const metadata: Metadata = {
  title: "Kontakt | ICAROS Polska",
  description:
    "Skontaktuj się z ICAROS Polska - oficjalnym dystrybutorem technologii ICAROS. E-mail, telefon +48 32 30 77 444, dane spółki i social media.",
  alternates: { canonical: "/kontakt" },
};

export default function KontaktPage() {
  return <ContactInfo variant="patient" />;
}
