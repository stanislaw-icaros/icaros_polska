import type { Metadata } from "next";
import { Geist } from "next/font/google";
import CookieConsentGate from "@/components/CookieConsentGate";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://icaros.com.pl"),
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
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ICAROS Polska — nowoczesna technologia rehabilitacji i terapii",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "ICAROS Polska — Nowoczesna technologia rehabilitacji i terapii",
    description:
      "Oficjalny dystrybutor ICAROS w Polsce. Niemiecka technologia łącząca rehabilitację z grywalizacją i VR.",
    images: ["/og-image.jpg"],
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
