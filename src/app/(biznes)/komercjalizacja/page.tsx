import type { Metadata } from "next";
import Komercjalizacja from "./Komercjalizacja";
import NewsletterStrip from "@/components/NewsletterStrip";

export const metadata: Metadata = {
  title: "Komercjalizacja | ICAROS Biznes",
  description:
    "Argumenty za wprowadzeniem ICAROS do oferty placówki: skuteczność, innowacja, wyróżnik i konkretny zwrot z inwestycji. Kalkulator ROI dla Twojej placówki.",
};

export default function KomercjalizacjaPage() {
  return (
    <>
      <Komercjalizacja />
      <NewsletterStrip variant="dark" />
    </>
  );
}
