import type { Metadata } from "next";
import { Geist } from "next/font/google";
import CookieConsentGate from "@/components/CookieConsentGate";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

/** Bump when replacing `public/og-image.jpg` so social crawlers refetch (FB/WhatsApp cache hard). */
const OG_IMAGE_CACHE = "3";

const ogImageUrl = `/og-image.jpg?v=${OG_IMAGE_CACHE}` as const;

export const metadata: Metadata = {
  // Use www so og:image/twitter absolute URLs are 200 without apex→www redirect (Meta often drops image otherwise).
  metadataBase: new URL("https://www.icaros.com.pl"),
  title: "ICAROS Polska — Nowoczesna technologia rehabilitacji i terapii",
  description:
    "Oficjalny dystrybutor ICAROS w Polsce. Niemiecka technologia łącząca rehabilitację z grywalizacją i VR. Rozwiązania dla klinik, centrów rehabilitacyjnych i obiektów premium.",
  keywords: [
    "ICAROS",
    "rehabilitacja",
    "terapia",
    "VR rehabilitacja",
    "grywalizacja",
    "sprzęt rehabilitacyjny",
    "klinika rehabilitacyjna",
    "ICAROS Polska",
    "nowoczesna rehabilitacja",
    "technologia medyczna",
  ],
  manifest: "/favicon/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "ICAROS Polska — Nowoczesna technologia rehabilitacji i terapii",
    description:
      "Niemiecka technologia łącząca rehabilitację z grywalizacją i VR. Rozwiązania dla klinik i centrów rehabilitacyjnych.",
    locale: "pl_PL",
    type: "website",
    url: "/",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "ICAROS Polska — nowoczesna technologia rehabilitacji i terapii",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ICAROS Polska — Nowoczesna technologia rehabilitacji i terapii",
    description:
      "Oficjalny dystrybutor ICAROS w Polsce. Niemiecka technologia łącząca rehabilitację z grywalizacją i VR.",
    images: [ogImageUrl],
  },
};

export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <div id="site-content" className="flex min-h-full flex-col">
          {children}
        </div>
        <CookieConsentGate />
      </body>
    </html>
  );
}
