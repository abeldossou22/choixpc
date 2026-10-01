import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import "../globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { I18nProvider } from "@/components/I18nProvider";
import Analytics from "@/components/Analytics";
import { CONSENT_BOOTSTRAP, GTM_ID } from "@/lib/analytics";
import { getDictionary } from "@/lib/i18n";
import { isLocale, locales, localePath, SITE_URL, type Locale } from "@/lib/i18n/config";

const creato = localFont({
  variable: "--font-creato",
  display: "swap",
  src: [
    { path: "../../public/fonts/CreatoDisplay-Light.woff2",           weight: "300", style: "normal" },
    { path: "../../public/fonts/CreatoDisplay-LightItalic.woff2",     weight: "300", style: "italic" },
    { path: "../../public/fonts/CreatoDisplay-Regular.woff2",         weight: "400", style: "normal" },
    { path: "../../public/fonts/CreatoDisplay-RegularItalic.woff2",   weight: "400", style: "italic" },
    { path: "../../public/fonts/CreatoDisplay-Medium.woff2",          weight: "500", style: "normal" },
    { path: "../../public/fonts/CreatoDisplay-MediumItalic.woff2",    weight: "500", style: "italic" },
    { path: "../../public/fonts/CreatoDisplay-Bold.woff2",            weight: "700", style: "normal" },
    { path: "../../public/fonts/CreatoDisplay-BoldItalic.woff2",      weight: "700", style: "italic" },
    { path: "../../public/fonts/CreatoDisplay-ExtraBold.woff2",       weight: "800", style: "normal" },
    { path: "../../public/fonts/CreatoDisplay-ExtraBoldItalic.woff2", weight: "800", style: "italic" },
    { path: "../../public/fonts/CreatoDisplay-Black.woff2",           weight: "900", style: "normal" },
    { path: "../../public/fonts/CreatoDisplay-BlackItalic.woff2",     weight: "900", style: "italic" },
  ],
});

type Props = { params: { locale: string } };

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F8FC" },
    { media: "(prefers-color-scheme: dark)", color: "#070814" },
  ],
};

export function generateMetadata({ params }: Props): Metadata {
  if (!isLocale(params.locale)) return {};
  const locale: Locale = params.locale;
  const t = getDictionary(locale).meta;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.title, template: t.titleTemplate },
    description: t.description,
    keywords: t.keywords,
    applicationName: "ChoixPC",
    authors: [{ name: "HevelCare", url: "https://hevelcare.com" }],
    creator: "HevelCare",
    publisher: "HevelCare",
    alternates: {
      canonical: localePath(locale, "/"),
      languages: { fr: "/", en: "/en", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      siteName: "ChoixPC",
      title: t.title,
      description: t.description,
      url: localePath(locale, "/"),
      locale: locale === "fr" ? "fr_FR" : "en_US",
      alternateLocale: locale === "fr" ? ["en_US"] : ["fr_FR"],
      images: [{ url: `/og/${locale}`, width: 1200, height: 630, alt: t.ogAlt }],
    },
    twitter: { card: "summary_large_image", title: t.title, description: t.description, images: [`/og/${locale}`] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    icons: {
      icon: [
        // ?v=… force les navigateurs à recharger l'icône (ils la gardent très longtemps en cache)
        { url: "/favicon.ico?v=3", sizes: "48x48" },
        { url: "/favicon.svg?v=3", type: "image/svg+xml" },
        { url: "/icon-32.png?v=3", type: "image/png", sizes: "32x32" },
        { url: "/icon-192.png?v=3", type: "image/png", sizes: "192x192" },
      ],
      shortcut: ["/favicon.ico?v=3"],
      apple: [{ url: "/apple-touch-icon.png?v=3", sizes: "180x180" }],
    },
    manifest: "/manifest.webmanifest",
    formatDetection: { telephone: false },
  };
}

export default function RootLayout({ children, params }: Props & { children: React.ReactNode }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);

  // Données structurées : aident Google à comprendre qui édite le site et ce qu'il propose.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "HevelCare",
        url: "https://hevelcare.com",
        logo: `${SITE_URL}/icon-512.png`,
        contactPoint: { "@type": "ContactPoint", telephone: "+22999080202", contactType: "customer support", availableLanguage: ["French", "English"] },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "ChoixPC",
        description: dict.meta.description,
        inLanguage: locale,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "WebApplication",
        name: "ChoixPC",
        url: `${SITE_URL}${localePath(locale, "/")}`,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        inLanguage: locale,
        description: dict.meta.description,
        offers: { "@type": "Offer", price: "0", priceCurrency: "XOF" },
        provider: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <html lang={locale} suppressHydrationWarning className={creato.variable}>
      <body>
        {/* Consentement refusé par défaut : doit s'exécuter avant le chargement de Google Tag Manager. */}
        {GTM_ID && <script dangerouslySetInnerHTML={{ __html: CONSENT_BOOTSTRAP }} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <I18nProvider locale={locale} dict={dict}>
            {children}
            <Analytics />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
