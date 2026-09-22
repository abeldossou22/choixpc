"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const WORDS = ["votre prochain PC", "les mauvais choix", "votre budget", "les arnaques", "vos décisions tech"];

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % WORDS.length); setVisible(true); }, 350);
    }, 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-4 sm:px-6 pt-20 pb-0 noise"
      style={{ background: "var(--bg)" }}>

      {/* Radial glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse, #2EC97A 0%, transparent 65%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-20 left-0 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #5B67F0 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, #F5A623 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(var(--text) 1px,transparent 1px),linear-gradient(90deg,var(--text) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Animated rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none animate-spin-slow"
        style={{ border: "1px solid var(--border-soft)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ border: "1px solid var(--border-soft)", animation: "spin-slow 15s linear infinite reverse" }} />

      {/* Badge */}
      <div className="relative z-10 animate-fade-up mb-8">
        <div className="inline-flex items-center gap-2.5 glass rounded-full px-4 py-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-[#2EC97A]" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2EC97A]" />
          </span>
          <span className="text-sm font-medium" style={{ color: "var(--text-soft)" }}>Conseil IA gratuit · Résultat en 2 min</span>
        </div>
      </div>

      {/* Headline */}
      <h1 className="relative z-10 font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] max-w-5xl mb-6 animate-fade-up delay-100">
        <span className="block mb-2" style={{ color: "var(--text)" }}>Arrêtez de vous</span>
        <span className="block mb-2" style={{ color: "var(--text)" }}>faire avoir sur</span>
        <span className={`block text-gradient transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>
          {WORDS[idx]}
        </span>
      </h1>

      {/* Sub */}
      <p className="relative z-10 text-lg sm:text-xl max-w-2xl leading-relaxed mb-10 animate-fade-up delay-200 font-light"
        style={{ color: "var(--text-mute)" }}>
        En Afrique de l'Ouest, trop de gens achètent un ordinateur trop cher ou pas adapté.{" "}
        <span className="font-medium" style={{ color: "var(--text-soft)" }}>ChoixPC analyse votre situation et vous dit exactement quoi acheter</span>{" "}
        — gratuitement, en 2 minutes.
      </p>

      {/* CTAs */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center mb-14 animate-fade-up delay-300">
        <Link href="/register"
          className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 text-white font-bold text-base rounded-full transition-all duration-300 hover:-translate-y-1"
          style={{ background: "linear-gradient(135deg, #2EC97A 0%, #1da866 100%)", boxShadow: "0 8px 32px rgba(46,201,122,0.40), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
          <span>Commencer gratuitement</span>
          <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
        <Link href="#how"
          className="inline-flex items-center justify-center gap-2 px-7 py-4 glass font-medium text-base rounded-full hover:opacity-80 transition-all duration-200"
          style={{ color: "var(--text-soft)" }}>
          Voir comment ça marche
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </Link>
      </div>

      {/* Social proof */}
      <div className="relative z-10 flex flex-wrap justify-center gap-x-8 gap-y-2 mb-16 animate-fade-up delay-400">
        {["100% gratuit", "Sans inscription compliquée", "Adapté à l'Afrique de l'Ouest", "IA spécialisée"].map(text => (
          <div key={text} className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-faint)" }}>
            <span className="text-[#2EC97A] font-bold">✓</span>
            {text}
          </div>
        ))}
      </div>

      {/* ── MOCKUP ── */}
      <div className="relative z-10 w-full max-w-4xl animate-fade-up delay-500">
        <div className="hidden sm:flex absolute -top-6 left-6 z-20 items-center gap-2.5 glass-light rounded-2xl px-4 py-2.5 text-xs font-semibold animate-float-a"
          style={{ color: "var(--text-soft)" }}>
          <span className="text-[#F5A623]">◆</span> Budget · 250 000 FCFA
        </div>
        <div className="hidden sm:flex absolute top-10 -right-6 z-20 items-center gap-2.5 glass-light rounded-2xl px-4 py-2.5 text-xs font-semibold animate-float-b"
          style={{ color: "var(--text-soft)" }}>
          <span className="text-[#5B67F0]">◆</span> Usage · Études + Bureau
        </div>
        <div className="hidden sm:flex absolute -bottom-4 right-20 z-20 items-center gap-2.5 rounded-2xl px-4 py-2.5 text-xs font-semibold animate-float-a"
          style={{ background: "rgba(46,201,122,0.15)", border: "1px solid rgba(46,201,122,0.3)", color: "#2EC97A" }}>
          <span>◆</span> Config idéale trouvée — 95/100
        </div>

        {/* Browser */}
        <div className="rounded-t-3xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--glass-bg)", boxShadow: "0 -20px 80px rgba(46,201,122,0.12), 0 0 0 1px var(--border-soft)" }}>
          <div className="px-4 py-3 flex items-center gap-2.5" style={{ background: "var(--browser-chrome)", borderBottom: "1px solid var(--border-soft)" }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
            </div>
            <div className="ml-2 flex-1 rounded-lg h-7 flex items-center px-3 text-xs" style={{ background: "var(--input-bg)", border: "1px solid var(--border-soft)", color: "var(--text-faint)" }}>
              choixpc.hevelcare.com
            </div>
          </div>

          <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6" style={{ background: "var(--bg-card)" }}>
            <div className="flex-1">
              <div className="text-xs font-bold uppercase tracking-[3px] text-[#2EC97A] mb-3">Étape 1 — Usages</div>
              <div className="font-display font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Que ferez-vous avec votre ordinateur ?</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { label: "Études", active: true },
                  { label: "Bureautique", active: true },
                  { label: "Gaming", active: false },
                  { label: "Montage", active: false },
                  { label: "Dev", active: false },
                  { label: "Design", active: false },
                ].map(chip => (
                  <div key={chip.label} className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={chip.active
                      ? { background: "rgba(46,201,122,0.12)", border: "1px solid rgba(46,201,122,0.3)", color: "#2EC97A" }
                      : { background: "var(--input-bg)", border: "1px solid var(--border-soft)", color: "var(--text-faint)" }}>
                    {chip.label}
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-3.5 text-xs italic leading-relaxed" style={{ background: "var(--input-bg)", border: "1px solid var(--border-soft)", color: "var(--text-faint)" }}>
                "Je veux aussi regarder des films et travailler en déplacement..."
              </div>
            </div>

            <div className="w-full sm:w-56 flex-shrink-0">
              <div className="rounded-2xl p-4" style={{ background: "rgba(46,201,122,0.08)", border: "1px solid rgba(46,201,122,0.2)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full bg-[#2EC97A] flex items-center justify-center text-black text-xs font-black">✓</div>
                  <span className="text-xs font-bold text-[#2EC97A] uppercase tracking-wide">Recommandé</span>
                </div>
                <div className="font-display font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Lenovo IdeaPad 3</div>
                <div className="space-y-2">
                  {[["CPU", "Intel i5 12e gen"], ["RAM", "8 Go DDR4"], ["SSD", "256 Go"], ["Écran", '15.6" FHD']].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-xs" style={{ color: "var(--text-faint)" }}>{k}</span>
                      <span className="text-xs font-semibold" style={{ color: "var(--text-soft)" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(46,201,122,0.15)" }}>
                  <span className="text-xs" style={{ color: "var(--text-faint)" }}>Score IA</span>
                  <span className="text-sm font-black text-[#2EC97A]">95/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-24 w-full" style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }} />
      </div>
    </section>
  );
}
