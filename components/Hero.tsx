"use client";
import { Link, useT } from "./I18nProvider";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowDown, Check } from "lucide-react";
import { PHOTOS, unsplash, type PhotoKey } from "@/lib/photos";

const Handle = ({ pos }: { pos: string }) => <span className={`handle ${pos}`} />;

function FloatingPhoto({ photo, chip, dot, className, rotate }: { photo: PhotoKey; chip: string; dot: string; className: string; rotate: string }) {
  const p = PHOTOS[photo];
  const t = useT();
  return (
    <figure className={`hidden min-[1400px]:block absolute z-0 w-44 ${className}`}>
      <div style={{ transform: `rotate(${rotate})` }}>
        <div className="rounded-3xl overflow-hidden p-1.5" style={{ background: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <img src={unsplash(p.id, 360, 440)} alt={t.photos[photo]} className="w-full h-52 object-cover rounded-[20px]" />
        </div>
        <figcaption className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", color: "var(--fg)" }}>
          <span className="w-2 h-2 rounded-full" style={{ background: dot }} /> {chip}
        </figcaption>
      </div>
    </figure>
  );
}

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const t = useT();
  const h = t.hero;
  const WORDS = h.words;

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % WORDS.length); setVisible(true); }, 550);
    }, 3200);
    return () => clearInterval(timer);
  }, [WORDS.length]);

  return (
    <section className="relative overflow-hidden px-4 sm:px-6 pt-32 sm:pt-36">
      {/* Grille + halos de marque */}
      <div className="absolute inset-0 bg-grid pointer-events-none"
        style={{ maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 75%)" }} />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[520px] rounded-full pointer-events-none opacity-25 dark:opacity-40"
        style={{ background: "radial-gradient(ellipse, #5B67F0 0%, transparent 65%)", filter: "blur(90px)" }} />
      <div className="absolute top-1/3 -left-40 w-[480px] h-[480px] rounded-full pointer-events-none opacity-15 dark:opacity-25"
        style={{ background: "radial-gradient(circle, #2EC97A 0%, transparent 70%)", filter: "blur(90px)" }} />

      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
        {/* Photos flottantes (grands écrans) */}
        <FloatingPhoto photo="studentWoman" chip={h.floatA} dot="var(--green)" rotate="-6deg" className="-left-44 top-24 animate-float-a" />
        <FloatingPhoto photo="benchWoman" chip={h.floatB} dot="var(--blue)" rotate="5deg" className="-right-44 top-44 animate-float-b" />

        {/* Badge */}
        <div className="animate-fade-up mb-7 inline-flex items-center gap-2.5 rounded-full px-4 py-2"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full" style={{ background: "var(--green)" }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "var(--green)" }} />
          </span>
          <span className="text-sm font-medium" style={{ color: "var(--fg-soft)" }}>{h.badge}</span>
        </div>

        {/* Titre dans un cadre de sélection */}
        <div className="select-frame w-full max-w-4xl px-5 sm:px-10 py-7 sm:py-9 animate-fade-up delay-100">
          <Handle pos="-top-[5px] -left-[5px]" /><Handle pos="-top-[5px] -right-[5px]" />
          <Handle pos="-bottom-[5px] -left-[5px]" /><Handle pos="-bottom-[5px] -right-[5px]" />
          <div className="hidden sm:block absolute -top-7 -left-6 sticker text-3xl -rotate-12 select-none">{h.sticker}</div>
          <h1 className="font-display font-bold tracking-tight leading-[1.04] mb-5"
            style={{ fontSize: "clamp(2.5rem, 6.4vw, 5rem)", color: "var(--fg)" }}>
            {h.title1}<br />
            {h.title2}{" "}
            {/* Tous les mots sont empilés au même endroit : la largeur (et donc la hauteur) reste celle du plus long. */}
            <span className="inline-grid align-top text-center">
              {WORDS.map((w, i) => (
                <span key={w} aria-hidden={i !== idx}
                  className={`[grid-area:1/1] whitespace-nowrap text-gradient word-swap ${i === idx && visible ? "" : "is-out"}`}>
                  {w}
                </span>
              ))}
            </span>
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--fg-mute)" }}>
            {h.sub1}{" "}
            <span className="font-semibold" style={{ color: "var(--fg)" }}>
              {h.subStrong}
            </span>{" "}
            {h.sub2}
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10 mb-8 animate-fade-up delay-200">
          <Link href="/register"
            className="group relative overflow-hidden inline-flex items-center gap-3 pl-2 pr-14 sm:pr-16 py-2 font-semibold text-[15px] sm:text-base whitespace-nowrap rounded-full btn-primary">
            <span className="w-10 h-10 rounded-full flex items-center justify-center dot-green">
              <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform duration-500 ease-smooth" />
            </span>
            {t.common.startFree}
            <span className="absolute -right-7 top-2.5 rotate-45 px-7 py-0.5 text-[10px] font-bold" style={{ background: "var(--yellow)", color: "#0F1026" }}>{h.ribbon}</span>
          </Link>
          <Link href="#how"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 font-semibold text-base rounded-full btn-ghost">
            {h.secondary} <ArrowDown size={15} />
          </Link>
        </div>

        {/* Réassurance */}
        <div className="flex flex-wrap justify-center gap-x-7 gap-y-2 mb-16 animate-fade-up delay-300">
          {h.trust.map(item => (
            <span key={item} className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--fg-mute)" }}>
              <span className="w-4 h-4 rounded-full flex items-center justify-center dot-solid"><Check size={10} strokeWidth={3.5} /></span> {item}
            </span>
          ))}
        </div>

        {/* Maquette produit */}
        <div className="relative w-full max-w-5xl animate-fade-up delay-400">
          <div className="hidden sm:flex absolute -top-5 left-6 z-20 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold animate-float-a"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", color: "var(--fg)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--yellow)" }} /> {h.chipBudget}
          </div>
          <div className="hidden sm:flex absolute top-14 -right-4 z-20 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold animate-float-b"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", color: "var(--fg)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--blue)" }} /> {h.chipUsage}
          </div>

          <div className="rounded-t-[28px] overflow-hidden text-left"
            style={{ border: "1px solid var(--border)", borderBottom: "none", background: "var(--bg-card)", boxShadow: "0 -20px 80px -20px rgba(91,103,240,0.25)" }}>
            <div className="px-5 py-3 flex items-center gap-3" style={{ background: "var(--bg-alt)", borderBottom: "1px solid var(--border)" }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
              </div>
              <div className="mx-auto rounded-full h-7 flex items-center px-4 text-xs"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--fg-mute)" }}>
                choixpc.hevelcare.com
              </div>
              <div className="w-12" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_320px] gap-6 p-6 sm:p-9">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[3px] mb-3" style={{ color: "var(--green-ink)" }}>
                  {h.stepLabel}
                </div>
                <div className="font-display font-bold text-xl sm:text-2xl tracking-tight mb-5" style={{ color: "var(--fg)" }}>
                  {h.question}
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {h.chips.map((label, i) => ({ label, active: i < 2 })).map(chip => (
                    <div key={chip.label} className="px-4 py-2 rounded-full text-sm font-semibold"
                      style={chip.active
                        ? { background: "rgba(46,201,122,0.12)", border: "1px solid rgba(46,201,122,0.45)", color: "var(--green-ink)" }
                        : { background: "var(--input-bg)", border: "1px solid var(--border)", color: "var(--fg-mute)" }}>
                      {chip.label}
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl p-4 text-sm italic leading-relaxed"
                  style={{ background: "var(--input-bg)", border: "1px solid var(--border)", color: "var(--fg-mute)" }}>
                  {h.quote}
                </div>
              </div>

              {/* Résultat sur photo */}
              <div className="relative rounded-3xl overflow-hidden min-h-[380px] flex flex-col justify-end p-4">
                <img src={unsplash(PHOTOS.smilingMan.id, 700, 900)} alt={t.photos.smilingMan}
                  className="absolute inset-0 w-full h-full object-cover object-top" loading="lazy" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 20%, rgba(15,16,38,0.55) 100%)" }} />
                <div className="relative z-10 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 10px 30px -10px rgba(0,0,0,.35)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold dot-solid">
                      <Check size={11} strokeWidth={3.5} /> {h.recommended}
                    </span>
                    <span className="text-sm font-black text-[#0E8A50]">95/100</span>
                  </div>
                  <div className="font-display font-bold text-base mb-2 text-[#0F1026]">Lenovo IdeaPad 3</div>
                  <div className="space-y-1">
                    {h.specs.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2 text-[11px]">
                        <span className="text-[#0F1026]/50">{k}</span>
                        <span className="font-semibold text-[#0F1026]/80 text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-16 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }} />
    </section>
  );
}
