"use client";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import HowItWorks from "@/components/HowItWorks";
import TwoPaths from "@/components/TwoPaths";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import Reveal from "@/components/Reveal";
import { PHOTOS, unsplash } from "@/lib/photos";
import { Link, useT } from "@/components/I18nProvider";
import { ArrowRight, ArrowUpRight, Check, Cpu, MemoryStick, HardDrive, Monitor } from "lucide-react";

export default function HomePage() {
  const tr = useT();
  const s = tr.shoda;
  const c = tr.cta;
  const CHIP_ICONS = [Cpu, MemoryStick, HardDrive, Monitor];
  return (
    <main>
      <Navbar />
      <Hero />
      <Testimonials />
      <HowItWorks />
      <TwoPaths />

      {/* SHODA */}
      <section id="shoda" className="relative py-24 sm:py-32 overflow-hidden" style={{ background: "var(--bg-alt)" }}>
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Reveal>
              <div className="text-sm font-semibold mb-4" style={{ color: "var(--fg)" }}>{s.label}</div>
              <h2 className="font-display font-bold tracking-tight leading-[1.05] mb-6"
                style={{ fontSize: "clamp(2rem, 4.4vw, 3.2rem)", color: "var(--fg)" }}>
                {s.title1}{" "}
                <span className="text-gradient">{s.titleHi}</span>
              </h2>
              <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: "var(--fg-mute)" }}>
                {s.p1}{" "}
                <span className="font-semibold" style={{ color: "var(--fg)" }}>SHODA</span> {s.p2}
              </p>
              <div className="flex flex-wrap gap-2 mb-10">
                {s.chips.map((label, i) => ({ label, Icon: CHIP_ICONS[i] })).map(({ label, Icon }) => (
                  <span key={label} className="chip inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium">
                    <Icon size={14} /> {label}
                  </span>
                ))}
              </div>
              <a href="https://shoda-eight.vercel.app/" target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 pl-2 pr-6 py-2 text-sm font-semibold rounded-full btn-primary">
                <span className="w-8 h-8 rounded-full flex items-center justify-center dot-green">
                  <ArrowUpRight size={15} strokeWidth={2.5} />
                </span>
                {s.cta}
              </a>
            </Reveal>

            {/* Rapport SHODA */}
            <Reveal delay={150} className="relative rounded-[28px] overflow-hidden p-3 sm:p-8 pt-56 sm:pt-72" style={{ background: "var(--strong)" }}>
              <div className="absolute inset-x-0 top-0 h-80 sm:h-[26rem]">
                <img src={unsplash(PHOTOS.proudMan.id, 1000, 900)} alt={tr.photos.proudMan}
                  className="absolute inset-0 w-full h-full object-cover object-top" loading="lazy" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 45%, var(--strong) 100%)" }} />
              </div>
              <div className="relative z-10 rounded-3xl p-6" style={{ background: "var(--bg-card)", boxShadow: "0 20px 50px -20px rgba(0,0,0,.35)" }}>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-[2px] sm:tracking-[3px]" style={{ color: "var(--fg)" }}>{s.report}</span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold dot-solid">{s.conform}</span>
                </div>
                <div className="space-y-4">
                  {s.rows.map((label, i) => ({ label, score: [98, 100, 95, 92][i] })).map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs" style={{ color: "var(--fg-mute)" }}>{item.label}</span>
                        <span className="text-xs font-bold" style={{ color: "var(--fg)" }}>{item.score}%</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: "var(--input-bg)" }}>
                        <div className="h-full rounded-full" style={{ width: `${item.score}%`, background: item.score >= 95 ? "var(--green)" : "var(--yellow)" }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
                  <span className="text-xs" style={{ color: "var(--fg-mute)" }}>{s.global}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black tracking-tight" style={{ color: "var(--fg)" }}>96</span>
                    <span className="text-xs" style={{ color: "var(--fg-mute)" }}>{s.globalScore}</span>
                  </div>
                </div>
              </div>
              <div className="relative z-10 mt-3 rounded-2xl px-4 py-3 flex items-start gap-3" style={{ background: "rgba(15,16,38,0.9)" }}>
                <span className="font-black mt-0.5 text-[#F5A623]">!</span>
                <p className="text-xs leading-relaxed text-white/75">
                  <span className="font-semibold text-white">{s.tipStrong}</span> {s.tip}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="relative py-24 sm:py-32 overflow-hidden" style={{ background: "var(--bg)" }}>
        <div className="absolute inset-0 bg-grid pointer-events-none"
          style={{ maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, #000 20%, transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, #000 20%, transparent 70%)" }} />
        <Reveal className="relative z-10 max-w-2xl mx-auto px-5">
          <div className="relative rounded-[32px] p-8 sm:p-12 overflow-hidden"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(91,103,240,0.30) 0%, transparent 70%)" }} />
            <div className="relative">
              <Logo size={52} />
              <div className="text-xs font-bold mt-6 mb-3" style={{ color: "var(--green-ink)" }}>{c.label}</div>
              <h2 className="font-display font-bold tracking-tight leading-[1.02] mb-5"
                style={{ fontSize: "clamp(2.4rem, 6vw, 3.6rem)", color: "var(--fg)" }}>
                {c.title}<span style={{ color: "var(--green-ink)" }}>.</span>
              </h2>
              <p className="text-base mb-7" style={{ color: "var(--fg-mute)" }}>
                {c.sub}
              </p>
              <ul className="rounded-2xl p-5 space-y-3 mb-8" style={{ border: "1px solid var(--border)" }}>
                {c.items.map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm" style={{ color: "var(--fg-soft)" }}>
                    <Check size={16} strokeWidth={3} style={{ color: "var(--green-ink)" }} /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/register"
                className="group inline-flex items-center gap-3 pl-2 pr-6 sm:pr-7 py-2 font-semibold text-[15px] sm:text-base whitespace-nowrap rounded-full btn-primary"
                >
                <span className="w-10 h-10 rounded-full flex items-center justify-center dot-green">
                  <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
                {c.button}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
