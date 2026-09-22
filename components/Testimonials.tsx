"use client";
import { useState, useEffect, useRef } from "react";

const TESTIMONIALS = [
  { name: "Akpédjé R.", role: "Étudiante en gestion, Cotonou", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces", quote: "J'allais acheter un PC à 280 000 FCFA chez un vendeur. ChoixPC m'a montré qu'il était surévalué et m'a trouvé mieux pour 190 000 FCFA. J'ai économisé presque 100 000 FCFA !", rating: 5 },
  { name: "Fabrice D.", role: "Développeur freelance, Porto-Novo", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces", quote: "En tant que développeur, je savais ce qu'il me fallait en théorie. ChoixPC m'a confirmé le choix et m'a même alerté sur une config avec un SSD trop petit que j'allais prendre.", rating: 5 },
  { name: "Sandrine A.", role: "Comptable, Cotonou", photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=faces", quote: "Je n'y connais rien en informatique. L'outil m'a tout expliqué simplement, sans jargon. J'ai pu comparer 3 propositions de vendeurs différents en 5 minutes.", rating: 5 },
  { name: "Ulrich K.", role: "Graphiste, Abomey-Calavi", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces", quote: "Le vendeur me poussait vers un PC gaming alors que je fais du design. ChoixPC a vu directement que la RAM était insuffisante pour Photoshop. Service précieux.", rating: 5 },
  { name: "Mireille T.", role: "Entrepreneure, Cotonou", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=faces", quote: "Configuration générée parfaite pour mon budget. J'ai montré la fiche PDF au vendeur, il a respecté chaque détail. Aucune mauvaise surprise à la livraison.", rating: 5 },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setActive(i => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const card = scrollRef.current.children[active] as HTMLElement;
      if (card) scrollRef.current.scrollTo({ left: card.offsetLeft - 24, behavior: "smooth" });
    }
  }, [active]);

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full pointer-events-none opacity-6"
        style={{ background: "radial-gradient(ellipse, #F5A623 0%, transparent 70%)", filter: "blur(80px)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[3px] mb-6" style={{ color: "var(--text-faint)" }}>
            Témoignages
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl tracking-tight leading-tight mb-5" style={{ color: "var(--text)" }}>
            Ils ont fait le<br />
            <span className="text-gradient">bon choix</span>
          </h2>
          <p className="text-lg max-w-md mx-auto font-light" style={{ color: "var(--text-mute)" }}>
            Des centaines de personnes ont évité les mauvaises surprises grâce à ChoixPC.
          </p>
        </div>

        <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} onClick={() => setActive(i)}
              className="flex-shrink-0 w-[320px] sm:w-[360px] rounded-3xl p-7 snap-center cursor-pointer transition-all duration-300"
              style={{
                background: active === i ? "rgba(46,201,122,0.06)" : "var(--bg-card)",
                border: active === i ? "1px solid rgba(46,201,122,0.25)" : "1px solid var(--border-soft)",
                transform: active === i ? "scale(1.02)" : "scale(1)",
              }}>
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#F5A623">
                    <path d="M12 2l2.9 6.5L22 9.3l-5 4.9 1.2 7.1L12 17.8l-6.2 3.5L7 14.2 2 9.3l7.1-.8L12 2z"/>
                  </svg>
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6 min-h-[110px]" style={{ color: "var(--text-soft)" }}>
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0" style={{ border: "2px solid rgba(46,201,122,0.3)" }}>
                  <img src={t.photo} alt={t.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: "var(--text)" }}>{t.name}</div>
                  <div className="text-xs" style={{ color: "var(--text-faint)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: active === i ? "24px" : "6px", background: active === i ? "#2EC97A" : "var(--border)" }} />
          ))}
        </div>
      </div>
    </section>
  );
}
