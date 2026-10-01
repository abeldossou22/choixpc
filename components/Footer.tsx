"use client";
import { Link, useT } from "./I18nProvider";
import { GTM_ID } from "@/lib/analytics";
import Logo from "./Logo";

export default function Footer() {
  const t = useT();
  return (
    <footer style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
        <Link href="/"><Logo size={32} /></Link>
        <p className="text-sm text-center" style={{ color: "var(--fg-mute)" }}>
          {t.footer.project}{" "}
          <a href="https://hevelcare.com" className="font-semibold underline decoration-[var(--green)] decoration-2 underline-offset-4" style={{ color: "var(--fg)" }}>
            HevelCare
          </a>
          {" "}· {t.footer.tagline}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs" style={{ color: "var(--fg-faint)" }}>
          <Link href="/conditions" className="hover:underline underline-offset-4">{t.footer.terms}</Link>
          <Link href="/confidentialite" className="hover:underline underline-offset-4">{t.footer.privacy}</Link>
          {GTM_ID && (
            <button onClick={() => window.dispatchEvent(new Event("choixpc:open-cookies"))} className="hover:underline underline-offset-4">{t.footer.cookies}</button>
          )}
          <span>© 2026 HevelCare</span>
        </div>
      </div>
    </footer>
  );
}
