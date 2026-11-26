import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Dok from "@/components/cloud/Dok";
import Hero from "@/components/cloud/Hero";
import Kalkulator from "@/components/cloud/Kalkulator";
import Cwiczenia from "@/components/cloud/Cwiczenia";
import { Badania, Dane, Gry, Pakiet, Pytania, Sesja, Stopka, Warunki } from "@/components/cloud/Sekcje";
import Sterowanie from "@/components/cloud/Sterowanie";
import { TrybProvider } from "@/components/cloud/Tryb";
import Zamowienie from "@/components/cloud/Zamowienie";
import ZdarzenieWejscia from "@/components/cloud/ZdarzenieWejscia";
import { CENY, H1, zl } from "@/lib/cloud/tresc";
import "./cloud.css";

/** Krój nagłówków i liczb. Tekst czytany zostaje w Geiście całego serwisu. */
const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
  display: "swap",
});

const OPIS = `Pakiet ICAROS Cloud dla gabinetów fizjoterapii, studiów treningowych i siłowni: platforma, iPad i aplikacja PRO bez abonamentu za ${zl(CENY.pakietNetto)} netto. Zamawiasz przez formularz i masz 30 dni na zwrot.`;

/**
 * Adres, pod którym landing ma być znany wyszukiwarkom i przy udostępnianiu.
 * Dopóki subdomeny nie ma, to `/cloud` na www. Po podpięciu subdomeny
 * ustawiamy na Vercelu `NEXT_PUBLIC_CLOUD_URL=https://cloud.icaros.com.pl`.
 */
const ADRES_SUBDOMENY = process.env.NEXT_PUBLIC_CLOUD_URL?.replace(/\/+$/, "");
const ADRES = ADRES_SUBDOMENY ? `${ADRES_SUBDOMENY}/` : "/cloud";

export const metadata: Metadata = {
  title: H1,
  description: OPIS,
  alternates: { canonical: ADRES },
  openGraph: {
    title: H1,
    description: OPIS,
    url: ADRES,
    type: "website",
    locale: "pl_PL",
    images: [
      {
        url: "/cloud/og.jpg",
        width: 1200,
        height: 630,
        alt: "Platforma ICAROS Cloud na czarnym tle",
      },
    ],
  },
};

/**
 * Animacja wejścia pierwszego ekranu gra raz na sesję przeglądarki.
 *
 * Skrypt wykonuje się w trakcie parsowania HTML, zanim przeglądarka narysuje
 * pierwszy ekran, i ustawia atrybut, na który czekają reguły w `cloud.css`.
 * Przy odświeżeniu w tej samej karcie atrybutu już nie ma, więc strona stoi
 * od razu. Nie gra też przy wyłączonych animacjach w systemie. Do podglądu
 * na żądanie służy `?intro=1` w adresie.
 */
const SKRYPT_WEJSCIA = `try{var s=sessionStorage,w=/[?&]intro=1/.test(location.search);if((w||!s.getItem("cl-wejscie"))&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.setAttribute("data-cl-wejscie","");s.setItem("cl-wejscie","1")}}catch(e){}`;

/** Pasek przeglądarki w kolorze strony. */
export const viewport = {
  themeColor: "#000000",
};

/** Kalendarz czyta wolne terminy z Google przy każdym wejściu. */
export const dynamic = "force-dynamic";

/**
 * Landing sprzedażowy pakietu ICAROS Cloud.
 *
 * Jedna strona, jeden cel: zamówienie pakietu albo rozmowa. Bez nawigacji
 * serwisu, bez bramki profesjonalisty (Cloud nie jest wyrobem medycznym)
 * i bez odnośników wyprowadzających poza stopkę.
 *
 * Całą treść i wszystkie liczby trzyma `src/lib/cloud/tresc.ts`, razem z listą
 * `DO_POTWIERDZENIA`. Subdomenę `cloud.icaros.com.pl` przepisuje `src/proxy.ts`.
 */
export default function CloudPage() {
  return (
    <div className={`cl ${outfit.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: SKRYPT_WEJSCIA }} />
      {/* Platforma z pierwszego ekranu: przeglądarka zaczyna ją pobierać, zanim
          dojdzie do znacznika obrazu. */}
      <link
        rel="preload"
        as="image"
        type="image/webp"
        imageSrcSet="/cloud/platforma-m.webp 1200w, /cloud/platforma.webp 2400w"
        imageSizes="(max-width: 700px) 94vw, 74vw"
        fetchPriority="high"
      />
      <a className="cl-skok" href="#tresc">
        Przejdź do treści
      </a>
      <ZdarzenieWejscia />
      <TrybProvider>
        <Hero />
        <main id="tresc">
          <Sterowanie />
          <Cwiczenia />
          <Gry />
          <Sesja />
          <Pakiet />
          <Kalkulator />
          <Badania />
          <Dane />
          <Warunki />
          <Pytania />
          <Zamowienie />
        </main>
        <Stopka />
        <Dok />
      </TrybProvider>
    </div>
  );
}
