import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import KnowledgeBaseIndex from "@/components/KnowledgeBaseIndex";
import NewsletterStrip from "@/components/NewsletterStrip";
import References from "@/components/References";
import { getLocations } from "@/lib/mapa/getLocations";

export default async function Home() {
  const locationCount = (await getLocations()).length;
  return (
    <>
      <Hero locationCount={locationCount} />
      <TrustBar />
      <KnowledgeBaseIndex />
      <NewsletterStrip />
      <References />
    </>
  );
}
