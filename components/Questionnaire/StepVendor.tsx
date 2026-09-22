"use client";
import { Plus, Trash2, Store, Sparkles } from "lucide-react";
import type { ComputerProposal } from "@/lib/types";

interface Props {
  hasVendor: boolean | null;
  proposals: ComputerProposal[];
  onHasVendorChange: (v: boolean) => void;
  onProposalsChange: (p: ComputerProposal[]) => void;
}

export default function StepVendor({ hasVendor, proposals, onHasVendorChange, onProposalsChange }: Props) {
  const addProposal = () => {
    if (proposals.length >= 3) return;
    const id = `prop_${Date.now()}`;
    onProposalsChange([...proposals, { id, label: `Proposition ${proposals.length + 1}`, rawText: "" }]);
  };

  const updateProposal = (id: string, rawText: string) =>
    onProposalsChange(proposals.map((p) => (p.id === id ? { ...p, rawText } : p)));

  const removeProposal = (id: string) => {
    const updated = proposals.filter((p) => p.id !== id).map((p, i) => ({ ...p, label: `Proposition ${i + 1}` }));
    onProposalsChange(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-black text-2xl sm:text-3xl mb-1 tracking-tight" style={{ color: "var(--text)" }}>
          Avez-vous déjà un vendeur ?
        </h2>
        <p className="text-sm" style={{ color: "var(--text-mute)" }}>Un vendeur vous a déjà proposé des configurations ? Ou voulez-vous qu'on en génère une ?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={() => { onHasVendorChange(true); if (proposals.length === 0) addProposal(); }}
          className="flex flex-col items-center gap-3 p-6 rounded-3xl transition-all duration-200"
          style={hasVendor === true ? { background: "rgba(46,201,122,0.08)", border: "2px solid #2EC97A" } : { background: "var(--bg-card)", border: "2px solid var(--border-soft)" }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: hasVendor === true ? "rgba(46,201,122,0.15)" : "var(--input-bg)" }}>
            <Store size={24} color={hasVendor === true ? "#2EC97A" : "var(--text-faint)" as string} />
          </div>
          <div className="text-center">
            <div className="font-bold text-sm" style={{ color: hasVendor === true ? "#2EC97A" : "var(--text)" }}>Oui, j'ai un vendeur</div>
            <div className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>Je vais coller ses propositions</div>
          </div>
        </button>

        <button onClick={() => { onHasVendorChange(false); onProposalsChange([]); }}
          className="flex flex-col items-center gap-3 p-6 rounded-3xl transition-all duration-200"
          style={hasVendor === false ? { background: "rgba(91,103,240,0.08)", border: "2px solid #5B67F0" } : { background: "var(--bg-card)", border: "2px solid var(--border-soft)" }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: hasVendor === false ? "rgba(91,103,240,0.15)" : "var(--input-bg)" }}>
            <Sparkles size={24} color={hasVendor === false ? "#5B67F0" : "var(--text-faint)" as string} />
          </div>
          <div className="text-center">
            <div className="font-bold text-sm" style={{ color: hasVendor === false ? "#5B67F0" : "var(--text)" }}>Non, pas de vendeur</div>
            <div className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>L'IA va générer une config pour moi</div>
          </div>
        </button>
      </div>

      {hasVendor === true && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              Collez les propositions de votre vendeur <span className="font-normal" style={{ color: "var(--text-faint)" }}>(max 3)</span>
            </p>
            {proposals.length < 3 && (
              <button onClick={addProposal} className="flex items-center gap-1.5 text-xs font-semibold text-[#2EC97A] hover:opacity-80 transition-opacity">
                <Plus size={14} /> Ajouter une proposition
              </button>
            )}
          </div>

          <div className="space-y-4">
            {proposals.map((prop) => (
              <div key={prop.id} className="relative rounded-2xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#2EC97A] uppercase tracking-wide">{prop.label}</span>
                  {proposals.length > 1 && (
                    <button onClick={() => removeProposal(prop.id)} className="transition-colors hover:text-red-400" style={{ color: "var(--text-faint)" }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <textarea value={prop.rawText} onChange={(e) => updateProposal(prop.id, e.target.value)}
                  placeholder={`Collez ici le message WhatsApp, SMS ou email de votre vendeur pour ${prop.label.toLowerCase()}...\n\nEx: Dell Inspiron 15 — Intel i5 11e gen — 8Go RAM — 256Go SSD — Écran 15.6" — 185 000 FCFA — Neuf`}
                  rows={5}
                  className="w-full rounded-xl px-3 py-2.5 text-sm resize-none transition-all focus:outline-none"
                  style={{ background: "var(--input-bg)", border: "1px solid var(--border-soft)", color: "var(--text)" }} />
              </div>
            ))}
          </div>

          <p className="text-xs rounded-xl px-4 py-3" style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", color: "var(--text-mute)" }}>
            💡 <strong style={{ color: "var(--text-soft)" }}>Astuce :</strong> Copiez-collez le message tel quel depuis WhatsApp, SMS ou email. Notre IA comprendra même si le format n'est pas parfait.
          </p>
        </div>
      )}

      {hasVendor === false && (
        <div className="rounded-2xl px-5 py-4" style={{ background: "rgba(91,103,240,0.08)", border: "1px solid rgba(91,103,240,0.2)" }}>
          <p className="text-sm font-medium text-[#5B67F0]">
            ✨ Parfait ! Sur la base de vos usages et votre budget, notre IA va générer la configuration idéale et vous dire exactement quoi demander à n'importe quel vendeur.
          </p>
        </div>
      )}
    </div>
  );
}
