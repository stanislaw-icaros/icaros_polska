import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ValueProposition from "@/components/ValueProposition";
import VideoShowcase from "@/components/VideoShowcase";
import ProductEcosystem from "@/components/ProductEcosystem";
import UseCases from "@/components/UseCases";
import BusinessCase from "@/components/BusinessCase";
import Studies from "@/components/Studies";
import References from "@/components/References";
import FAQ from "@/components/FAQ";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <TrustBar />
        <ValueProposition />
        <VideoShowcase />
        <ProductEcosystem />
        <UseCases />
        <BusinessCase />
        <Studies />
        <References />
        <FAQ />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
