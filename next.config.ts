import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Drugi serwer deweloperski w tym samym folderze (np. z innej sesji) potrzebuje
  // własnego katalogu roboczego, bo `next dev` zakłada blokadę na `.next/dev`.
  // Bez zmiennej wszystko działa po staremu.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async redirects() {
    // Po podpięciu subdomeny landing Cloud ma jeden adres. Dopóki zmiennej
    // nie ma, `/cloud` na www działa normalnie.
    const adresCloud = process.env.NEXT_PUBLIC_CLOUD_URL;
    return [
      ...(adresCloud
        ? [
            {
              source: "/cloud",
              has: [{ type: "host" as const, value: "(www\\.)?icaros\\.com\\.pl" }],
              destination: adresCloud,
              permanent: false,
            },
          ]
        : []),
      // Stary adres strony "Jak to działa". Slug nie zgadzał się z nazwą w menu.
      { source: "/rozwiazania", destination: "/jak-to-dziala", permanent: true },
      // Landing kampanijny wrócił pod krótki adres: strona sprzedaje ICAROS
      // Health, a „oferta" nic nie mówiła ani nam, ani klientowi.
      { source: "/oferta", destination: "/health", permanent: true },
    ];
  },
  async rewrites() {
    return [
      { source: "/favicon.ico", destination: "/favicon/favicon.ico" },
      {
        source: "/apple-touch-icon.png",
        destination: "/favicon/apple-touch-icon.png",
      },
    ];
  },
};

export default nextConfig;
