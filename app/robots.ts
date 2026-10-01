import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/i18n/config";

const PRIVATE = ["/api/", "/auth/", "/compte", "/questionnaire", "/nouveau-mot-de-passe", "/mot-de-passe-oublie"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: [...PRIVATE, ...PRIVATE.filter(p => !p.startsWith("/api") && !p.startsWith("/auth")).map(p => `/en${p}`)] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
