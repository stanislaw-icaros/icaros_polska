import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NewsletterLanding from "@/components/NewsletterLanding";

export const metadata: Metadata = {
  title: "Newsletter | ICAROS Polska",
  description:
    "Zaproszenia na targi, terminy testów urządzeń w placówkach, nowe funkcje i wyniki badań. Kilka wiadomości w roku, zapis w jednym kroku.",
  alternates: { canonical: "/newsletter" },
};

export default function NewsletterPage() {
  return (
    <>
      <Navigation />
      <NewsletterLanding source="newsletter-landing" />
      <Footer variant="patient" />
    </>
  );
}
