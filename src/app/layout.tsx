import type { Metadata } from "next";
import { Geist } from "next/font/google";
import CookieConsentGate from "@/components/CookieConsentGate";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
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
  openGraph: {
    title: "ICAROS Polska — Nowoczesna technologia rehabilitacji i terapii",
    description:
      "Niemiecka technologia łącząca rehabilitację z grywalizacją i VR. Rozwiązania dla klinik i centrów rehabilitacyjnych.",
    locale: "pl_PL",
    type: "website",
  },
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
