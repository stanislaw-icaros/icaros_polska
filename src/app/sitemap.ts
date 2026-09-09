import type { MetadataRoute } from "next";
import { products } from "@/lib/products";

const base = "https://www.icaros.com.pl";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: { path: string; priority: number }[] = [
    { path: "/jak-to-dziala", priority: 0.8 },
    { path: "/produkty", priority: 0.8 },
    // Podstrony produktów (pacjent) - ważne, tu prowadzą kody QR.
    ...products.map((p) => ({ path: `/produkty/${p.slug}`, priority: 0.7 })),
    { path: "/zastosowania", priority: 0.7 },
    { path: "/efektywnosc", priority: 0.7 },
    { path: "/mapa", priority: 0.5 },
    { path: "/icaros-na-swiecie", priority: 0.6 },
    { path: "/kontakt", priority: 0.7 },
    { path: "/komercjalizacja", priority: 0.7 },
    { path: "/finansowanie", priority: 0.6 },
    { path: "/urzadzenia", priority: 0.7 },
    // Podstrony produktów (biznes).
    ...products.map((p) => ({ path: `/urzadzenia/${p.slug}`, priority: 0.6 })),
    { path: "/dla-placowek", priority: 0.6 },
    { path: "/lokalizacje", priority: 0.5 },
    { path: "/pytania", priority: 0.6 },
    { path: "/kontakt-partner", priority: 0.6 },
    { path: "/faq", priority: 0.6 },
    { path: "/raport", priority: 0.6 },
    { path: "/newsletter", priority: 0.6 },
    { path: "/newsletter-partner", priority: 0.5 },
  ];
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...pages.map((page) => ({
      url: `${base}${page.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: page.priority,
    })),
    {
      url: `${base}/polityka-prywatnosci`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/polityka-cookies`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
