"use client";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useT } from "./I18nProvider";
import { localePath, splitLocale, type Locale } from "@/lib/i18n/config";
import { track } from "@/lib/analytics";

// Bascule FR ↔ EN en restant sur la même page.
export default function LanguageSwitch() {
  const locale = useLocale();
  const t = useT();
  const pathname = usePathname() || "/";
  const other: Locale = locale === "fr" ? "en" : "fr";
  const href = localePath(other, splitLocale(pathname).path);

  return (
    <NextLink href={href} hrefLang={other} onClick={() => track("language_switch", { to: other })} title={t.common.switchLanguage} aria-label={t.common.switchLanguage}
      className="h-10 px-3 flex items-center justify-center gap-1 rounded-full text-xs font-bold tracking-wide transition-transform duration-300 hover:-translate-y-px"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--fg)" }}>
      <span style={{ color: locale === "fr" ? "var(--fg)" : "var(--fg-faint)" }}>FR</span>
      <span style={{ color: "var(--fg-faint)" }}>/</span>
      <span style={{ color: locale === "en" ? "var(--fg)" : "var(--fg-faint)" }}>EN</span>
    </NextLink>
  );
}
