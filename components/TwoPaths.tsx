import Link from "next/link";

export default function TwoPaths() {
  return (
    <section id="features" className="relative py-28 sm:py-36 overflow-hidden" style={{ background: "var(--bg-alt)" }}>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-8"
        style={{ background: "radial-gradient(circle, #2EC97A 0%, transparent 70%)", filter: "blur(100px)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[3px] mb-6" style={{ color: "var(--text-faint)" }}>
            Services
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight mb-5" style={{ color: "var(--text)" }}>
            Votre situation,<br />
            <span className="text-gradient">notre solution</span>
          </h2>
          <p className="text-lg max-w-md mx-auto font-light" style={{ color: "var(--text-mute)" }}>
            Avec ou sans vendeur, ChoixPC s'adapte à vous.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Card A */}
          <div className="relative rounded-3xl p-8 sm:p-10 overflow-hidden group hover:-translate-y-1 transition-all duration-300"
            style={{ background: "linear-gradient(145deg, rgba(46,201,122,0.07) 0%, rgba(46,201,122,0.02) 100%)", border: "1px solid rgba(46,201,122,0.15)" }}>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
              style={{ background: "radial-gradient(circle, #2EC97A 0%, transparent 70%)", filter: "blur(40px)" }} />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest mb-8"
                style={{ background: "rgba(46,201,122,0.1)", border: "1px solid rgba(46,201,122,0.2)", color: "#2EC97A" }}>
                J'ai un vendeur
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl mb-4 leading-tight" style={{ color: "var(--text)" }}>
                Analyser les<br />propositions reçues
              </h3>
              <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-mute)" }}>
                Collez le message WhatsApp, SMS ou email de votre vendeur. L'IA décortique
                chaque configuration et vous donne un verdict clair avec score et explication.
              </p>
              <ul className="space-y-3 mb-10">
                {["Analyse de 1 à 3 configs en simultané", "Score sur 100 par proposition", "Verdict : Bon / Moyen / Déconseillé", "Contre-proposition si rien ne convient"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-soft)" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2EC97A] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-bold rounded-full transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #2EC97A, #1da866)", boxShadow: "0 4px 20px rgba(46,201,122,0.30)" }}>
                Analyser mes propositions
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>

          {/* Card B */}
          <div className="relative rounded-3xl p-8 sm:p-10 overflow-hidden group hover:-translate-y-1 transition-all duration-300"
            style={{ background: "linear-gradient(145deg, rgba(91,103,240,0.07) 0%, rgba(91,103,240,0.02) 100%)", border: "1px solid rgba(91,103,240,0.15)" }}>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
              style={{ background: "radial-gradient(circle, #5B67F0 0%, transparent 70%)", filter: "blur(40px)" }} />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest mb-8"
                style={{ background: "rgba(91,103,240,0.1)", border: "1px solid rgba(91,103,240,0.2)", color: "#8B93F8" }}>
                Pas de vendeur
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl mb-4 leading-tight" style={{ color: "var(--text)" }}>
                Générer une<br />configuration idéale
              </h3>
              <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-mute)" }}>
                Aucun vendeur encore ? L'IA génère la configuration parfaite pour vos besoins
                et votre budget. Vous saurez exactement quoi demander à n'importe quel vendeur.
              </p>
              <ul className="space-y-3 mb-10">
                {["Configuration générée sur mesure", "Composants expliqués simplement", "Ce qu'il faut prioriser si budget serré", "Fiche PDF à montrer au vendeur"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-soft)" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5B67F0] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-bold rounded-full transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #5B67F0, #4451e0)", boxShadow: "0 4px 20px rgba(91,103,240,0.30)" }}>
                Générer ma configuration
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </div>

        {/* WhatsApp Banner */}
        <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden"
          style={{ background: "rgba(37,211,102,0.05)", border: "1px solid rgba(37,211,102,0.15)" }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.845L.057 23.5l5.797-1.522A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 01-5.031-1.37l-.361-.214-3.741.981.998-3.648-.235-.374A9.86 9.86 0 012.1 12C2.1 6.525 6.525 2.1 12 2.1S21.9 6.525 21.9 12 17.475 21.9 12 21.9z"/>
                </svg>
              </div>
              <div>
                <div className="font-display font-bold text-base mb-1" style={{ color: "var(--text)" }}>Vous préférez un conseiller humain ?</div>
                <p className="text-sm" style={{ color: "var(--text-mute)" }}>Notre équipe HevelCare vous aide directement sur WhatsApp.</p>
              </div>
            </div>
            <a href="https://wa.me/22999080202" target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2.5 px-6 py-3 text-white text-sm font-bold rounded-full transition-all hover:-translate-y-0.5"
              style={{ background: "#25D366", boxShadow: "0 4px 20px rgba(37,211,102,0.30)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.845L.057 23.5l5.797-1.522A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 01-5.031-1.37l-.361-.214-3.741.981.998-3.648-.235-.374A9.86 9.86 0 012.1 12C2.1 6.525 6.525 2.1 12 2.1S21.9 6.525 21.9 12 17.475 21.9 12 21.9z"/>
              </svg>
              Écrire au +229 99 08 02 02
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
