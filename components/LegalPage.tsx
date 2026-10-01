"use client";
import { Link, useT, useLocale } from "./I18nProvider";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { LEGAL_UPDATED, LEGAL_VERSION } from "@/lib/legal";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

export default function LegalPage({ title, intro, sections }: { title: string; intro: React.ReactNode; sections: LegalSection[] }) {
  const t = useT();
  const locale = useLocale();
  return (
    <main>
      <Navbar />
      <section className="relative px-5 sm:px-10 pt-36 pb-24" style={{ background: "var(--bg)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12">
          <aside className="hidden lg:block">
            <nav className="sticky top-28 space-y-1 text-sm">
              {sections.map((s, i) => (
                <a key={s.id} href={`#${s.id}`} className="block py-1.5 transition-colors hover:text-[var(--fg)]" style={{ color: "var(--fg-mute)" }}>
                  <span className="tabular-nums mr-2" style={{ color: "var(--fg-faint)" }}>{String(i + 1).padStart(2, "0")}</span>{s.title}
                </a>
              ))}
            </nav>
          </aside>

          <article className="animate-fade-up">
            <div className="text-sm font-semibold mb-4" style={{ color: "var(--fg)" }}>{t.legal.label}</div>
            <h1 className="font-display font-bold tracking-tight leading-[1.05] mb-5" style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", color: "var(--fg)" }}>
              {title}
            </h1>
            <p className="text-sm mb-8" style={{ color: "var(--fg-faint)" }}>
              {t.legal.updated} {LEGAL_UPDATED[locale]} · {t.legal.version} {LEGAL_VERSION}
            </p>
            <div className="text-base leading-relaxed mb-12" style={{ color: "var(--fg-soft)" }}>{intro}</div>

            <div className="space-y-12">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-28">
                  <h2 className="font-display font-bold text-xl sm:text-2xl tracking-tight mb-4" style={{ color: "var(--fg)" }}>
                    <span className="mr-3" style={{ color: "var(--green-ink)" }}>{i + 1}.</span>{s.title}
                  </h2>
                  <div className="legal-body text-[15px] leading-relaxed space-y-3" style={{ color: "var(--fg-soft)" }}>{s.body}</div>
                </section>
              ))}
            </div>

            <div className="mt-16 rounded-3xl p-6 text-sm" style={{ background: "var(--bg-alt)", color: "var(--fg-mute)" }}>
              {t.legal.seeAlso} <Link href="/conditions" className="font-semibold underline underline-offset-4" style={{ color: "var(--fg)" }}>{t.legal.terms}</Link>
              {" · "}
              <Link href="/confidentialite" className="font-semibold underline underline-offset-4" style={{ color: "var(--fg)" }}>{t.legal.privacy}</Link>
            </div>
          </article>
        </div>
      </section>
      <Footer />
    </main>
  );
}
