import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Stary adres strony "Jak to działa". Slug nie zgadzał się z nazwą w menu.
      { source: "/rozwiazania", destination: "/jak-to-dziala", permanent: true },
      // Landing kampanijny przeniesiony: strona mówi o systemie Circle,
      // a nie o samym urządzeniu Health.
      { source: "/health", destination: "/oferta", permanent: true },
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
