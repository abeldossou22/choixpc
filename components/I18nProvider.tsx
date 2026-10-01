"use client";
import { createContext, useContext, forwardRef, type ComponentProps } from "react";
import NextLink from "next/link";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

const Ctx = createContext<{ locale: Locale; t: Dictionary } | null>(null);

export function I18nProvider({ locale, dict, children }: { locale: Locale; dict: Dictionary; children: React.ReactNode }) {
  return <Ctx.Provider value={{ locale, t: dict }}>{children}</Ctx.Provider>;
}

function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("I18nProvider manquant");
  return v;
}

/** Textes de la langue courante. */
export const useT = () => useI18n().t;
export const useLocale = () => useI18n().locale;
/** Préfixe un chemin interne avec la langue courante : p("/compte") → "/en/compte". */
export function useLocalePath() {
  const { locale } = useI18n();
  return (href: string) => localePath(locale, href);
}

/** Lien interne qui reste dans la langue courante. */
export const Link = forwardRef<HTMLAnchorElement, ComponentProps<typeof NextLink>>(function Link({ href, ...rest }, ref) {
  const { locale } = useI18n();
  const h = typeof href === "string" ? localePath(locale, href) : href;
  return <NextLink ref={ref} href={h} {...rest} />;
});
