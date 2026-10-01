import type { Metadata } from "next";
import { getDictionary, type Dictionary } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";

type PageKey = keyof Dictionary["meta"]["pages"];

/** Métadonnées d'une page : titre, description, URL canonique et équivalents FR/EN (hreflang). */
export function pageMetadata(locale: Locale, key: PageKey, path: string, opts: { index?: boolean } = {}): Metadata {
  const m = getDictionary(locale).meta.pages[key];
  const url = localePath(locale, path);
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: url,
      languages: { fr: localePath("fr", path), en: localePath("en", path), "x-default": localePath("fr", path) },
    },
    openGraph: {
      type: "website",
      siteName: "ChoixPC",
      title: `${m.title} — ChoixPC`,
      description: m.description,
      url,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      images: [{ url: `/og/${locale}`, width: 1200, height: 630 }],
    },
    robots: opts.index === false ? { index: false, follow: false } : undefined,
  };
}
