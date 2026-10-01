import type { Metadata } from "next";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return pageMetadata(isLocale(params.locale) ? params.locale : defaultLocale, "questionnaire", "/questionnaire", { index: false });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
