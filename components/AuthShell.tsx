"use client";
import { Link, useT } from "./I18nProvider";
import LanguageSwitch from "./LanguageSwitch";
import { ArrowLeft } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

export const WA_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.845L.057 23.5l5.797-1.522A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 01-5.031-1.37l-.361-.214-3.741.981.998-3.648-.235-.374A9.86 9.86 0 012.1 12C2.1 6.525 6.525 2.1 12 2.1S21.9 6.525 21.9 12 17.475 21.9 12 21.9z"/>
  </svg>
);

export const inputClass = "w-full rounded-2xl px-4 py-3 text-sm focus:outline-none transition-[border-color,box-shadow] duration-300 ease-smooth focus:border-[var(--fg-faint)] focus:shadow-[0_0_0_4px_rgba(46,201,122,0.25)]";
export const inputStyle = { background: "var(--input-bg)", border: "1px solid var(--border)", color: "var(--fg)" };

export default function AuthShell({ children, footer }: { children: React.ReactNode; footer?: React.ReactNode }) {
  const t = useT();
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="absolute inset-0 bg-grid pointer-events-none"
        style={{ maskImage: "radial-gradient(ellipse 60% 50% at 50% 30%, #000 20%, transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 30%, #000 20%, transparent 70%)" }} />

      <header className="relative z-10 px-5 sm:px-10 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--fg-mute)" }}>
          <ArrowLeft size={15} /> {t.common.back}
        </Link>
        <Link href="/"><Logo size={32} /></Link>
        <div className="flex items-center gap-2"><LanguageSwitch /><ThemeToggle /></div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md animate-fade-up">
          <div className="rounded-[32px] p-7 sm:p-10" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
            {children}
          </div>
          {footer}
          <div className="text-center mt-4">
            <a href="https://wa.me/22999080202" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium hover:underline" style={{ color: "#25D366" }}>
              {WA_ICON}
              {t.common.whatsappDirect}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
