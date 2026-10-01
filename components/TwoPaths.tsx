"use client";
import { useState } from "react";
import { Link, useT } from "./I18nProvider";
import { ArrowRight, Store, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import { PHOTOS, unsplash } from "@/lib/photos";

const WA_SVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.845L.057 23.5l5.797-1.522A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 01-5.031-1.37l-.361-.214-3.741.981.998-3.648-.235-.374A9.86 9.86 0 012.1 12C2.1 6.525 6.525 2.1 12 2.1S21.9 6.525 21.9 12 17.475 21.9 12 21.9z"/>
  </svg>
);

const PATH_META = [
  { Icon: Store, photo: "shopkeeper" as const, focus: "center 55%" },
  { Icon: Sparkles, photo: "studentWoman" as const, focus: "center 30%" },
];

export default function TwoPaths() {
  const [tab, setTab] = useState(0);
  const tr = useT();
  const t = tr.paths;
  const PATHS = t.items.map((item, i) => ({ ...item, ...PATH_META[i] }));

  return (
    <section id="features" className="relative py-24 sm:py-32 overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-10">
        <Reveal className="mb-10">
          <div className="text-sm font-semibold mb-4" style={{ color: "var(--fg)" }}>{t.label}</div>
          <h2 className="font-display font-bold tracking-tight leading-[1.05] mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", color: "var(--fg)" }}>
            {t.title1} <span className="text-gradient">{t.titleHi}</span>
          </h2>
          <p className="text-base" style={{ color: "var(--fg-mute)" }}>{t.sub}</p>
        </Reveal>

        <Reveal delay={120}>

        {/* Onglets */}
        <div className="relative grid grid-cols-2 p-1.5 rounded-[28px] sm:rounded-full mb-4"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <span aria-hidden className="absolute top-1.5 bottom-1.5 left-1.5 rounded-[22px] sm:rounded-full transition-transform duration-700 ease-smooth"
            style={{ width: "calc(50% - 6px)", background: "var(--blue)", boxShadow: "0 10px 26px -10px rgba(91,103,240,0.7)", transform: `translateX(${tab * 100}%)` }} />
          {PATHS.map((x, i) => {
            const on = i === tab;
            return (
              <button key={x.tab} onClick={() => setTab(i)}
                className="relative z-10 flex items-center justify-center gap-2 rounded-full py-3 px-2 sm:px-3 text-[13px] sm:text-sm leading-tight font-semibold transition-colors duration-700 ease-smooth"
                style={{ color: on ? "#FFFFFF" : "var(--fg-mute)" }}>
                <x.Icon size={15} className="flex-shrink-0 transition-colors duration-700 ease-smooth" style={{ color: on ? "#FFFFFF" : "var(--blue)" }} />
                <span>{x.tab}</span>
              </button>
            );
          })}
        </div>

        {/* Panneau */}
        <div className="grid rounded-[28px] overflow-hidden">
          {PATHS.map((p, i) => (
        <div key={p.tab} aria-hidden={i !== tab}
          className="relative [grid-area:1/1] transition-[opacity,transform] duration-[900ms] ease-smooth"
          style={{ background: "var(--bg-alt)", opacity: i === tab ? 1 : 0, transform: i === tab ? "none" : "scale(1.02)", pointerEvents: i === tab ? "auto" : "none" }}>
          <div className="absolute inset-x-0 top-0 h-80 sm:h-[26rem] lg:h-auto lg:inset-0 lg:left-auto lg:w-[58%]" style={{ background: "var(--bg-alt)" }}>
            <img src={unsplash(PHOTOS[p.photo].id, 1000, 1000)} alt={tr.photos[p.photo]}
              className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: p.focus }} loading="lazy" />
            <div className="absolute inset-0 lg:hidden" style={{ background: "linear-gradient(180deg, rgba(15,16,38,0.05) 0%, rgba(15,16,38,0.35) 100%)" }} />
          </div>
          <div className="absolute inset-0 hidden lg:block pointer-events-none" style={{ background: "linear-gradient(90deg, var(--bg-alt) 40%, transparent 48%)" }} />
          <div className="relative z-10 h-full pt-60 sm:pt-80 lg:pt-8 px-3 sm:px-8 pb-4 sm:pb-8 lg:min-h-[560px] lg:flex lg:items-center lg:justify-start">
            <div className="absolute top-5 right-5 sm:top-8 sm:right-8 lg:right-10 lg:top-10 sticker text-2xl sm:text-4xl lg:text-5xl rotate-[-8deg] select-none">
              {p.sticker}
            </div>
            <div className="rounded-3xl p-5 sm:p-9 text-center lg:text-left lg:max-w-[500px]" style={{ background: "var(--bg-card)", boxShadow: "0 20px 50px -20px rgba(0,0,0,.35)" }}>
              <h3 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-3" style={{ color: "var(--fg)" }}>{p.title}</h3>
              <p className="text-base leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-6" style={{ color: "var(--fg-soft)" }}>{p.desc}</p>
              <div className="h-px mb-6" style={{ background: "var(--border)" }} />
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
                {p.items.map(it => (
                  <span key={it} className="chip px-4 py-2 rounded-full text-sm font-medium"
                    >{it}</span>
                ))}
              </div>
              <Link href="/register"
                className="group inline-flex items-center gap-3 pl-2 pr-6 py-2 font-semibold text-sm rounded-full btn-primary">
                <span className="w-8 h-8 rounded-full flex items-center justify-center dot-green">
                  <ArrowRight size={15} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
                {p.cta}
              </Link>
            </div>
          </div>
        </div>
          ))}
        </div>
        </Reveal>

        {/* WhatsApp */}
        <div className="mt-4 rounded-[28px] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-[#25D366]"
              style={{ background: "rgba(37,211,102,0.10)" }}>
              {WA_SVG}
            </div>
            <div>
              <div className="font-display font-bold text-base mb-0.5" style={{ color: "var(--fg)" }}>{t.humanTitle}</div>
              <p className="text-sm" style={{ color: "var(--fg-mute)" }}>{t.humanSub}</p>
            </div>
          </div>
          <a href="https://wa.me/22999080202" target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold rounded-full btn-ghost">
            <span className="text-[#25D366]">{WA_SVG}</span> {t.humanCta}
          </a>
        </div>
      </div>
    </section>
  );
}
