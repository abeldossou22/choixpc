"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", whatsapp: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.prenom || !form.email || !form.whatsapp || !form.password) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    router.push("/questionnaire");
  };

  return (
    <div className="min-h-screen flex flex-col noise" style={{ background: "var(--bg)" }}>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none opacity-10"
        style={{ background: "radial-gradient(ellipse, #2EC97A 0%, transparent 65%)", filter: "blur(80px)" }} />

      <header className="relative z-10 px-5 sm:px-10 h-16 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border-soft)" }}>
        <Link href="/" className="flex items-center gap-2 transition-colors text-sm font-medium" style={{ color: "var(--text-faint)" }}>
          <ArrowLeft size={15} />
          Retour
        </Link>
        <Link href="/" className="flex items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 36 36" fill="none">
            <rect x="2" y="3" width="32" height="22" rx="5" style={{ fill: "var(--text)", fillOpacity: 0.06 }}/>
            <rect x="5" y="6" width="26" height="16" rx="3" style={{ fill: "var(--text)", fillOpacity: 0.04 }}/>
            <path d="M11 14.5L15.5 19.5L25 10.5" stroke="#2EC97A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-display font-bold text-base" style={{ color: "var(--text)" }}>Choix<span className="text-[#2EC97A]">PC</span></span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-up">
          <div className="rounded-3xl p-8 sm:p-10" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="text-center mb-8">
              <h1 className="font-display font-black text-3xl tracking-tight mb-3" style={{ color: "var(--text)" }}>
                Créer votre compte
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-faint)" }}>
                Accès gratuit. Aucune carte bancaire.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "prenom", placeholder: "Koffi", label: "Prénom *" },
                  { name: "nom", placeholder: "Mensah", label: "Nom" },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-mute)" }}>{f.label}</label>
                    <input type="text" name={f.name} value={form[f.name as keyof typeof form]}
                      onChange={handleChange} placeholder={f.placeholder}
                      className="w-full rounded-xl px-3.5 py-3 text-sm focus:outline-none transition-all"
                      style={{ background: "var(--input-bg)", border: "1px solid var(--border)", color: "var(--text)" }} />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-mute)" }}>Email *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="koffi@gmail.com"
                  className="w-full rounded-xl px-3.5 py-3 text-sm focus:outline-none transition-all"
                  style={{ background: "var(--input-bg)", border: "1px solid var(--border)", color: "var(--text)" }} />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-mute)" }}>WhatsApp *</label>
                <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--input-bg)" }}>
                  <div className="flex items-center gap-2 px-3.5 text-sm font-medium flex-shrink-0" style={{ borderRight: "1px solid var(--border-soft)", color: "var(--text-faint)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.845L.057 23.5l5.797-1.522A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 01-5.031-1.37l-.361-.214-3.741.981.998-3.648-.235-.374A9.86 9.86 0 012.1 12C2.1 6.525 6.525 2.1 12 2.1S21.9 6.525 21.9 12 17.475 21.9 12 21.9z"/>
                    </svg>
                    +229
                  </div>
                  <input type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange}
                    placeholder="97 00 00 00"
                    className="flex-1 px-3.5 py-3 text-sm focus:outline-none bg-transparent"
                    style={{ color: "var(--text)" }} />
                </div>
                <p className="text-xs mt-2" style={{ color: "var(--text-faint)" }}>HevelCare vous contactera sur ce numéro pour finaliser votre choix.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-mute)" }}>Mot de passe *</label>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} name="password" value={form.password}
                    onChange={handleChange} placeholder="Minimum 6 caractères"
                    className="w-full rounded-xl px-3.5 py-3 pr-11 text-sm focus:outline-none transition-all"
                    style={{ background: "var(--input-bg)", border: "1px solid var(--border)", color: "var(--text)" }} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "var(--text-faint)" }}>
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl px-4 py-3 text-sm text-red-400"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3.5 text-white font-bold text-sm rounded-full transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                style={{ background: "linear-gradient(135deg, #2EC97A, #1da866)", boxShadow: "0 8px 24px rgba(46,201,122,0.30)" }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Création en cours...
                  </span>
                ) : "Créer mon compte gratuit"}
              </button>

              <p className="text-center text-xs leading-relaxed pt-1" style={{ color: "var(--text-faint)" }}>
                En créant un compte, vous acceptez d'être contacté(e) par HevelCare sur WhatsApp.
              </p>
            </form>
          </div>

          <p className="text-center text-sm mt-6" style={{ color: "var(--text-faint)" }}>
            Déjà un compte ?{" "}
            <Link href="/login" className="text-[#2EC97A] hover:underline font-medium">Se connecter</Link>
          </p>
          <div className="text-center mt-4">
            <a href="https://wa.me/22999080202" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#25D366] hover:underline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.845L.057 23.5l5.797-1.522A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 01-5.031-1.37l-.361-.214-3.741.981.998-3.648-.235-.374A9.86 9.86 0 012.1 12C2.1 6.525 6.525 2.1 12 2.1S21.9 6.525 21.9 12 17.475 21.9 12 21.9z"/>
              </svg>
              Nous écrire directement — +229 99 08 02 02
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
