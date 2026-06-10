import type { MetadataRoute } from "next";

const base = "https://www.icaros.com.pl";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: { path: string; priority: number }[] = [
    { path: "/rozwiazania", priority: 0.8 },
    { path: "/produkty", priority: 0.8 },
    { path: "/zastosowania", priority: 0.7 },
    { path: "/efektywnosc", priority: 0.7 },
    { path: "/faq", priority: 0.6 },
    { path: "/raport", priority: 0.6 },
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
