import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import HowItWorks from "@/components/HowItWorks";
import TwoPaths from "@/components/TwoPaths";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ background: "var(--bg)" }}>
      <Navbar />
      <Hero />
      <Testimonials />
      <HowItWorks />
      <TwoPaths />

      {/* SHODA Section */}
      <section id="shoda" className="relative py-28 sm:py-36 overflow-hidden" style={{ background: "var(--bg)" }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none opacity-6"
          style={{ background: "radial-gradient(ellipse, #5B67F0 0%, transparent 70%)", filter: "blur(80px)" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[3px] mb-8" style={{ color: "var(--text-faint)" }}>
                Après l'achat
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl tracking-tight leading-tight mb-6" style={{ color: "var(--text)" }}>
                Vérifiez que votre PC<br />
                est <span className="text-gradient">vraiment conforme</span>
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-mute)" }}>
                ChoixPC vous aide à choisir le bon ordinateur. <span className="font-medium" style={{ color: "var(--text-soft)" }}>SHODA</span> vérifie
                que celui que vous avez reçu correspond exactement à ce qu'on vous a vendu.
                Testez tous les composants en quelques clics.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-10">
                {[
                  { icon: "⬡", label: "Processeur", color: "#2EC97A" },
                  { icon: "⬡", label: "RAM", color: "#5B67F0" },
                  { icon: "⬡", label: "Disque dur", color: "#F5A623" },
                  { icon: "⬡", label: "Écran", color: "#2EC97A" },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-3 glass rounded-2xl px-4 py-3">
                    <span style={{ color: f.color }} className="text-lg font-bold">{f.icon}</span>
                    <span className="text-sm font-medium" style={{ color: "var(--text-soft)" }}>{f.label}</span>
                  </div>
                ))}
              </div>
              <a href="https://shoda-eight.vercel.app/" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 text-white text-sm font-bold rounded-full transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #5B67F0, #4451e0)", boxShadow: "0 8px 32px rgba(91,103,240,0.35)" }}>
                Télécharger SHODA — Gratuit
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>

            <div className="relative">
              <div className="rounded-3xl p-6 relative overflow-hidden"
                style={{ background: "rgba(91,103,240,0.06)", border: "1px solid rgba(91,103,240,0.15)" }}>
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 pointer-events-none"
                  style={{ background: "radial-gradient(circle, #5B67F0 0%, transparent 70%)", filter: "blur(30px)" }} />

                <div className="relative z-10">
                  <div className="text-xs font-bold uppercase tracking-[3px] text-[#5B67F0] mb-5">Rapport SHODA</div>
                  <div className="space-y-3">
                    {[
                      { label: "Processeur Intel i5-1235U", score: 98, color: "#2EC97A" },
                      { label: "RAM 8 Go DDR4 3200MHz", score: 100, color: "#2EC97A" },
                      { label: "SSD NVMe 256 Go", score: 95, color: "#2EC97A" },
                      { label: "Dalle IPS 15.6\" 1920×1080", score: 92, color: "#F5A623" },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between mb-1.5">
                            <span className="text-xs" style={{ color: "var(--text-mute)" }}>{item.label}</span>
                            <span className="text-xs font-bold" style={{ color: item.color }}>{item.score}%</span>
                          </div>
                          <div className="h-1.5 rounded-full" style={{ background: "var(--border-soft)" }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${item.score}%`, background: `linear-gradient(90deg, ${item.color}80, ${item.color})` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-5 flex items-center justify-between" style={{ borderTop: "1px solid var(--border-soft)" }}>
                    <span className="text-xs" style={{ color: "var(--text-faint)" }}>Score global</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-[#2EC97A]">96</span>
                      <span className="text-xs font-medium" style={{ color: "var(--text-faint)" }}>/100 — Conforme</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 glass rounded-2xl px-4 py-3 flex items-start gap-3">
                <span className="text-[#F5A623] text-sm font-bold mt-0.5">!</span>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-mute)" }}>
                  <span className="font-semibold" style={{ color: "var(--text-soft)" }}>Conseil HevelCare :</span> Lancez SHODA dans les 24h après l'achat. En cas de non-conformité, vous pourrez encore négocier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative py-28 sm:py-36 overflow-hidden" style={{ background: "var(--bg-deep)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-15"
            style={{ background: "radial-gradient(ellipse, #2EC97A 0%, transparent 65%)", filter: "blur(80px)" }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center px-5 sm:px-10">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[3px] mb-8" style={{ color: "var(--text-faint)" }}>
            Commencer maintenant
          </div>
          <h2 className="font-display font-black text-5xl sm:text-6xl md:text-7xl tracking-tight leading-[0.95] mb-6" style={{ color: "var(--text)" }}>
            Faites le<br />
            <span className="text-gradient">bon choix</span><br />
            aujourd'hui.
          </h2>
          <p className="text-lg mb-12 font-light" style={{ color: "var(--text-faint)" }}>
            Gratuit · Sans engagement · 2 minutes suffisent
          </p>
          <Link href="/register"
            className="inline-flex items-center gap-3 px-10 py-5 text-white font-bold text-lg rounded-full transition-all duration-300 hover:-translate-y-1.5"
            style={{ background: "linear-gradient(135deg, #2EC97A 0%, #1da866 100%)", boxShadow: "0 12px 48px rgba(46,201,122,0.45), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
            Créer mon compte gratuit
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm" style={{ color: "var(--text-faint)", opacity: 0.7 }}>
            <span>Aucune carte bancaire</span>
            <span>·</span>
            <span>Aucun abonnement</span>
            <span>·</span>
            <span>Toujours gratuit</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
