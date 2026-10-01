"use client";
import { Plus, Trash2, Store, Sparkles } from "lucide-react";
import type { ComputerProposal } from "@/lib/types";
import { useT } from "@/components/I18nProvider";

interface Props {
  hasVendor: boolean | null;
  proposals: ComputerProposal[];
  onHasVendorChange: (v: boolean) => void;
  onProposalsChange: (p: ComputerProposal[]) => void;
}

export default function StepVendor({ hasVendor, proposals, onHasVendorChange, onProposalsChange }: Props) {
  const t = useT().questionnaire.vendor;
  const addProposal = () => {
    if (proposals.length >= 3) return;
    onProposalsChange([...proposals, { id: `prop_${Date.now()}`, label: `${t.proposal} ${proposals.length + 1}`, rawText: "" }]);
  };
  const updateProposal = (id: string, rawText: string) =>
    onProposalsChange(proposals.map(p => p.id === id ? { ...p, rawText } : p));
  const removeProposal = (id: string) =>
    onProposalsChange(proposals.filter(p => p.id !== id).map((p, i) => ({ ...p, label: `${t.proposal} ${i + 1}` })));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-black text-2xl sm:text-3xl mb-1 tracking-tight" style={{ color: "var(--fg)" }}>
          {t.title}
        </h2>
        <p className="text-sm" style={{ color: "var(--fg-mute)" }}>{t.sub}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { val: true,  Icon: Store,    label: t.yes, sub: t.yesSub, color: "var(--green-ink)", activeBg: "rgba(46,201,122,0.08)", activeBorder: "rgba(46,201,122,0.5)" },
          { val: false, Icon: Sparkles, label: t.no, sub: t.noSub, color: "var(--blue-ink)", activeBg: "rgba(91,103,240,0.08)", activeBorder: "rgba(91,103,240,0.5)" },
        ].map(({ val, Icon, label, sub, color, activeBg, activeBorder }) => {
          const active = hasVendor === val;
          return (
            <button key={String(val)} onClick={() => { onHasVendorChange(val); if (val && proposals.length === 0) addProposal(); if (!val) onProposalsChange([]); }}
              className="flex flex-col items-center gap-3 p-6 rounded-3xl transition-all duration-200"
              style={active ? { background: activeBg, border: `2px solid ${activeBorder}` } : { background: "var(--bg-card)", border: "2px solid var(--border)" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: active ? `${activeBg}` : "var(--input-bg)" }}>
                <Icon size={24} color={active ? color : "var(--fg-faint)"} />
              </div>
              <div className="text-center">
                <div className="font-bold text-sm" style={{ color: active ? color : "var(--fg)" }}>{label}</div>
                <div className="text-xs mt-1" style={{ color: "var(--fg-faint)" }}>{sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      {hasVendor === true && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: "var(--fg)" }}>
              {t.listTitle} <span className="font-normal" style={{ color: "var(--fg-faint)" }}>{t.max}</span>
            </p>
            {proposals.length < 3 && (
              <button onClick={addProposal} className="flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-70" style={{ color: "var(--green-ink)" }}>
                <Plus size={14} /> {t.add}
              </button>
            )}
          </div>
          {proposals.map(prop => (
            <div key={prop.id} className="rounded-2xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--green-ink)" }}>{prop.label}</span>
                {proposals.length > 1 && (
                  <button onClick={() => removeProposal(prop.id)} className="transition-colors hover:text-red-400" style={{ color: "var(--fg-faint)" }}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <textarea value={prop.rawText} onChange={e => updateProposal(prop.id, e.target.value)}
                placeholder={t.placeholder}
                rows={5}
                className="w-full rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none"
                style={{ background: "var(--input-bg)", border: "1px solid var(--border-soft)", color: "var(--fg)" }} />
            </div>
          ))}
          <p className="text-xs rounded-xl px-4 py-3" style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", color: "var(--fg-mute)" }}>
            💡 <strong style={{ color: "var(--fg-soft)" }}>{t.tipStrong}</strong> {t.tip}
          </p>
        </div>
      )}

      {hasVendor === false && (
        <div className="rounded-2xl px-5 py-4" style={{ background: "rgba(91,103,240,0.08)", border: "1px solid rgba(91,103,240,0.2)" }}>
          <p className="text-sm font-medium" style={{ color: "var(--blue-ink)" }}>
            {t.noInfo}
          </p>
        </div>
      )}
    </div>
  );
}
