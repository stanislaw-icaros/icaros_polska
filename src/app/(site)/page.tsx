import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import LocationsTeaser from "@/components/LocationsTeaser";
import KnowledgeBaseIndex from "@/components/KnowledgeBaseIndex";
import NewsletterStrip from "@/components/NewsletterStrip";
import BannerHealth from "@/components/BannerHealth";
import References from "@/components/References";
import { getLocations } from "@/lib/mapa/getLocations";

/**
 * Kolejność sekcji odpowiada temu, co ma zobaczyć pacjent: najpierw gdzie
 * spróbować ICAROS (mapa zaraz pod belką partnerów), potem zapis na listę,
 * a dopiero dalej baza wiedzy i referencje.
 */
export default async function Home() {
  const locations = await getLocations();
  return (
    <>
      <Hero locationCount={locations.length} />
      <TrustBar />
      <LocationsTeaser locations={locations} />
      <BannerHealth />
      <NewsletterStrip form source="strona-glowna" />
      <KnowledgeBaseIndex />
      <References />
    </>
  );
}
