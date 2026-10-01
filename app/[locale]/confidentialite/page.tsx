import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { getDictionary } from "@/lib/i18n";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";
import * as fr from "@/content/privacy.fr";
import * as en from "@/content/privacy.en";

type Props = { params: { locale: string } };

export function generateMetadata({ params }: Props): Metadata {
  return pageMetadata(isLocale(params.locale) ? params.locale : defaultLocale, "privacy", "/confidentialite");
}

export default function Page({ params }: Props) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const content = locale === "en" ? en : fr;
  const title = getDictionary(locale).meta.pages.privacy.title;
  return <LegalPage title={title} intro={content.intro} sections={content.sections} />;
}
