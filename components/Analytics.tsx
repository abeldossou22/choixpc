"use client";
import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { Link, useLocale, useT } from "./I18nProvider";
import { GTM_ID, getConsent, setConsent, track } from "@/lib/analytics";

/** Charge Google Tag Manager, suit les clics utiles et affiche le bandeau de consentement. */
export default function Analytics() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useT().cookies;
  const [open, setOpen] = useState(false);

  // Bandeau : affiché tant qu'aucun choix n'a été fait, et rouvert depuis le lien « Cookies » du pied de page.
  useEffect(() => {
    if (!GTM_ID) return;
    if (getConsent() === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener("choixpc:open-cookies", reopen);
    return () => window.removeEventListener("choixpc:open-cookies", reopen);
  }, []);

  // Contexte de page (langue) à chaque navigation, sans donnée personnelle.
  useEffect(() => {
    if (GTM_ID) track("page_context", { locale, page_path: pathname });
  }, [locale, pathname]);

  // Clics sur WhatsApp, SHODA et les boutons d'inscription, où qu'ils soient dans le site.
  useEffect(() => {
    if (!GTM_ID) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const section = a.closest("section[id]")?.id ?? a.closest("header, footer")?.tagName.toLowerCase() ?? "page";
      if (href.includes("wa.me")) track("whatsapp_click", { section });
      else if (href.includes("shoda")) track("shoda_click", { section });
      else if (/\/register$/.test(href)) track("cta_click", { section });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!GTM_ID) return null;

  const choose = (value: "granted" | "denied") => { setConsent(value); setOpen(false); };

  return (
    <>
      <Script id="gtm" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html:
        `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');` }} />
      <noscript>
        <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="gtm" />
      </noscript>

      {open && (
        <div role="dialog" aria-live="polite" aria-label={t.title}
          className="fixed z-[60] inset-x-3 bottom-3 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:max-w-sm rounded-3xl p-5 animate-fade-up print:hidden"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
          <div className="font-display font-bold text-base mb-1.5" style={{ color: "var(--fg)" }}>{t.title}</div>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--fg-mute)" }}>
            {t.text}{" "}
            <Link href="/confidentialite#cookies" className="underline underline-offset-2" style={{ color: "var(--fg)" }}>{t.more}</Link>
          </p>
          <div className="flex gap-2">
            <button onClick={() => choose("denied")} className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-full btn-ghost">{t.refuse}</button>
            <button onClick={() => choose("granted")} className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-full btn-primary">{t.accept}</button>
          </div>
        </div>
      )}
    </>
  );
}
