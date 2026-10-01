import type { MetadataRoute } from "next";
import { locales, localePath, SITE_URL } from "@/lib/i18n/config";

// Pages publiques à faire indexer, dans chaque langue.
const PAGES: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/register", priority: 0.8, changeFrequency: "monthly" },
  { path: "/login", priority: 0.4, changeFrequency: "yearly" },
  { path: "/conditions", priority: 0.3, changeFrequency: "yearly" },
  { path: "/confidentialite", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.flatMap(page =>
    locales.map(locale => ({
      url: `${SITE_URL}${localePath(locale, page.path)}`,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(locales.map(l => [l, `${SITE_URL}${localePath(l, page.path)}`])),
      },
    })),
  );
}
