import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NewsletterLanding from "@/components/NewsletterLanding";

export const metadata: Metadata = {
  title: "Newsletter | ICAROS Biznes",
  description:
    "Zaproszenia na targi, terminy pokazów urządzeń, nowości w ofercie i wyniki badań. Kilka wiadomości w roku, zapis w jednym kroku.",
  alternates: { canonical: "/newsletter" },
};

export default function NewsletterPartnerPage() {
  return (
    <>
      <Navigation variant="business" />
      <NewsletterLanding tone="dark" source="newsletter-landing-biznes" />
      <Footer />
    </>
  );
}
