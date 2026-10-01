export const locales = ["fr", "en"] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = "fr";

export function isLocale(v: string | undefined | null): v is Locale {
  return v === "fr" || v === "en";
}

// Le français est servi à la racine (/), l'anglais sous /en.
export function localePath(locale: Locale, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (locale === defaultLocale) return href;
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

// Retire le préfixe de langue d'un chemin : "/en/compte" → { locale: "en", path: "/compte" }
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const m = pathname.match(/^\/(fr|en)(\/.*)?$/);
  if (m) return { locale: m[1] as Locale, path: m[2] || "/" };
  return { locale: defaultLocale, path: pathname };
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://choixpc.hevelcare.com").replace(/\/$/, "");
