"use client";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import Reveal from "./Reveal";
import { useT } from "./I18nProvider";
import { PHOTOS, unsplash } from "@/lib/photos";

const STEP_PHOTOS = ["deskMan", "thinkingMan", "phoneWoman", "outdoorWoman"] as const;

function StepVisual({ i }: { i: number }) {
  const t = useT().how;
  const bubble = "rounded-2xl px-4 py-3 text-sm font-medium text-[#0F1026]";
  const bubbleStyle = { background: "rgba(255,255,255,0.94)", boxShadow: "0 10px 30px -10px rgba(0,0,0,.3)" };
  if (i === 0) return (
    <div className="flex flex-wrap gap-2 justify-center max-w-xs">
      {t.visualChips.map((c, k) => (
        <span key={c} className="px-4 py-2 rounded-full text-sm font-semibold"
          style={k < 2 ? { background: "#2EC97A", color: "#0F1026" } : { background: "rgba(255,255,255,0.92)", color: "#0F1026" }}>{c}</span>
      ))}
    </div>
  );
  if (i === 1) return (
    <div className={`${bubble} flex items-center gap-3`} style={bubbleStyle}>
      <span className="w-6 h-6 rounded-full flex items-center justify-center dot-solid"><Check size={13} strokeWidth={3} /></span>
      {t.visualBudget}
    </div>
  );
  if (i === 2) return (
    <div className={`${bubble} max-w-xs text-left leading-relaxed`} style={bubbleStyle}>
      {t.visualOffer}
    </div>
  );
  return (
    <div className={`${bubble} flex items-baseline gap-2`} style={bubbleStyle}>
      <span className="text-4xl font-black tracking-tight">95</span>
      <span className="text-sm text-[#0F1026]/50">{t.visualScore}</span>
    </div>
  );
}

const DURATION = 5000;

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const tr = useT();
  const t = tr.how;
  const STEPS = t.steps.map((s, i) => ({ ...s, num: `0${i + 1}`, photo: STEP_PHOTOS[i] }));

  useEffect(() => {
    const timer = setTimeout(() => setActive(i => (i + 1) % STEP_PHOTOS.length), DURATION);
    return () => clearTimeout(timer);
  }, [active]);

  return (
    <section id="how" className="relative py-24 sm:py-32 overflow-hidden" style={{ background: "var(--bg-alt)" }}>
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-10">
        <Reveal className="mb-14">
          <div className="text-sm font-semibold mb-4" style={{ color: "var(--fg)" }}>{t.label}</div>
          <div className="flex items-start gap-5">
            <h2 className="font-display font-bold tracking-tight leading-[1.05]"
              style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", color: "var(--fg)" }}>
              {t.title1} <span className="text-gradient">{t.titleHi}</span>
            </h2>
            <svg width="64" height="64" viewBox="0 0 64 64" className="flex-shrink-0 -rotate-12 hidden sm:block" aria-hidden>
              <path d="M32 4c9 0 14 6 20 10s9 12 6 21-2 17-11 21-17 5-25 0S6 44 5 34s2-18 8-24S23 4 32 4z" fill="#2EC97A" />
              <path d="M20 33l8 8 17-18" stroke="#0F1026" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <p className="text-base mt-4" style={{ color: "var(--fg-mute)" }}>{t.sub}</p>
          <p className="text-sm sm:text-base mt-6 font-medium" style={{ color: "var(--fg-soft)" }}>
            {STEPS.map((s, i) => (
              <span key={s.num}>{s.title}{i < STEPS.length - 1 && <span className="mx-2" style={{ color: "var(--fg-faint)" }}>→</span>}</span>
            ))}
          </p>
        </Reveal>

        <Reveal delay={120} className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-stretch">
          {/* Liste des étapes */}
          <div className="grid grid-cols-2 md:flex md:flex-col gap-2">
            {STEPS.map((s, i) => {
              const on = i === active;
              return (
                <button key={s.num} onClick={() => setActive(i)}
                  className="relative overflow-hidden flex items-start gap-2 sm:gap-3 text-left rounded-[22px] sm:rounded-[26px] px-3.5 sm:px-5 py-3.5 sm:py-4 transition-[background-color,color,box-shadow] duration-700 ease-smooth"
                  style={on
                    ? { background: "var(--blue)", color: "#FFFFFF", boxShadow: "0 12px 30px -12px rgba(91,103,240,0.7)" }
                    : { background: "var(--bg-card)", color: "var(--fg-mute)" }}>
                  <span className="text-sm font-medium tabular-nums">{s.num}</span>
                  <span className="min-w-0 text-[13px] sm:text-sm font-semibold leading-snug [overflow-wrap:anywhere] hyphens-auto">{s.title}</span>
                  {on && (
                    <span key={active} className="absolute left-3.5 right-3.5 sm:left-5 sm:right-5 bottom-1.5 sm:bottom-2 h-[2px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.25)" }}>
                      <span className="block h-full rounded-full step-progress" style={{ background: "#FFFFFF", animationDuration: `${DURATION}ms` }} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Visuel */}
          <div className="grid rounded-[28px] overflow-hidden min-h-[360px] sm:min-h-[400px]">
            {STEPS.map((step, i) => (
          <div key={step.num} aria-hidden={i !== active}
            className="relative [grid-area:1/1] flex flex-col justify-between transition-[opacity,transform] duration-[900ms] ease-smooth"
            style={{ opacity: i === active ? 1 : 0, transform: i === active ? "none" : "scale(1.03)", pointerEvents: i === active ? "auto" : "none" }}>
            <img src={unsplash(PHOTOS[step.photo].id, 1100, 800)} alt={tr.photos[step.photo]}
              className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(15,16,38,0.10) 0%, rgba(15,16,38,0) 40%, rgba(15,16,38,0.55) 100%)" }} />
            <div className="relative z-10 flex justify-end p-4 sm:p-6">
              <StepVisual i={i} />
            </div>
            <div className="relative z-10 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 10px 30px -10px rgba(0,0,0,.25)" }}>
                <span className="flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold text-white" style={{ background: "var(--blue)" }}>
                  {t.stepWord} {Number(step.num)}
                </span>
                <p className="text-sm leading-relaxed font-medium text-[#0F1026]">{step.desc}</p>
              </div>
            </div>
          </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
