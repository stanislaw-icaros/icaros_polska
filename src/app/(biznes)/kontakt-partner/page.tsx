import type { Metadata } from "next";
import ContactInfo from "@/components/ContactInfo";

export const metadata: Metadata = {
  title: "Kontakt dla partnerów | ICAROS Polska",
  description:
    "Skontaktuj się z ICAROS Polska w sprawie współpracy, wdrożenia i finansowania. E-mail, telefon +48 32 30 77 444, dane spółki i social media.",
  alternates: { canonical: "/kontakt-partner" },
};

export default function KontaktBiznesPage() {
  return <ContactInfo variant="business" />;
}
