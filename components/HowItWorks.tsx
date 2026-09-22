const STEPS = [
  { num: "01", color: "#2EC97A", title: "Vos usages", desc: "Sélectionnez vos activités ou décrivez librement ce que vous voulez faire. Études, gaming, design, dev — on comprend tout.", icon: "◎" },
  { num: "02", color: "#5B67F0", title: "Votre budget", desc: "Indiquez votre enveloppe en FCFA. On optimise chaque recommandation pour votre budget réel, sans vous pousser à dépenser plus.", icon: "◈" },
  { num: "03", color: "#F5A623", title: "Les propositions", desc: "Collez le message WhatsApp de votre vendeur ou laissez l'IA générer une configuration idéale depuis le marché local.", icon: "◐" },
  { num: "04", color: "#2EC97A", title: "Le verdict", desc: "Score sur 100, pros/cons détaillés, explication en langage simple. Plus une fiche PDF à télécharger et montrer à votre vendeur.", icon: "◉" },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-28 sm:py-36 overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-5"
        style={{ background: "radial-gradient(circle, #5B67F0 0%, transparent 70%)", filter: "blur(80px)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[3px] mb-6" style={{ color: "var(--text-faint)" }}>
            Processus
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight mb-5" style={{ color: "var(--text)" }}>
            Simple comme<br />
            <span className="text-gradient">bonjour</span>
          </h2>
          <p className="text-lg max-w-md mx-auto font-light" style={{ color: "var(--text-mute)" }}>
            4 étapes. 2 minutes. Un conseil sur mesure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-3xl overflow-hidden" style={{ background: "var(--border-soft)" }}>
          {STEPS.map((step, i) => (
            <div key={step.num} className="relative p-8 group transition-colors"
              style={{ background: "var(--bg-card)" }}>
              <div className="font-display font-black text-6xl mb-6 leading-none" style={{ color: `${step.color}15`, WebkitTextStroke: `1px ${step.color}30` }}>
                {step.num}
              </div>
              <div className="text-2xl mb-4 font-bold" style={{ color: step.color }}>{step.icon}</div>
              <h3 className="font-display font-bold text-lg mb-3" style={{ color: "var(--text)" }}>{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-mute)" }}>{step.desc}</p>
              <div className="absolute bottom-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, transparent, ${step.color}60, transparent)` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
