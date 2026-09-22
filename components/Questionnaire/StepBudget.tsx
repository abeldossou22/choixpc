"use client";

const BUDGET_OPTIONS = [
  { label: "Moins de 100 000 FCFA", min: 0, max: 100000, desc: "Usage basique, occasion possible" },
  { label: "100 000 – 200 000 FCFA", min: 100000, max: 200000, desc: "Bon rapport qualité/prix" },
  { label: "200 000 – 350 000 FCFA", min: 200000, max: 350000, desc: "Confort et performance" },
  { label: "350 000 – 500 000 FCFA", min: 350000, max: 500000, desc: "Haute performance" },
  { label: "500 000 – 800 000 FCFA", min: 500000, max: 800000, desc: "Professionnel / Gaming" },
  { label: "Plus de 800 000 FCFA", min: 800000, max: null, desc: "Haut de gamme" },
];

interface Props {
  budgetMin: number;
  budgetMax: number | null;
  budgetLabel: string;
  onChange: (min: number, max: number | null, label: string) => void;
}

export default function StepBudget({ budgetMin, budgetMax, budgetLabel, onChange }: Props) {
  const isSelected = (opt: (typeof BUDGET_OPTIONS)[0]) => opt.min === budgetMin && opt.max === budgetMax;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-black text-2xl sm:text-3xl mb-1 tracking-tight" style={{ color: "var(--text)" }}>
          Quel est votre budget ?
        </h2>
        <p className="text-sm" style={{ color: "var(--text-mute)" }}>Choisissez une tranche. Nous adaptons nos conseils à votre enveloppe en FCFA.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BUDGET_OPTIONS.map((opt) => {
          const active = isSelected(opt);
          return (
            <button key={opt.label} onClick={() => onChange(opt.min, opt.max, opt.label)}
              className="flex items-center justify-between p-4 rounded-2xl text-left transition-all duration-200"
              style={active
                ? { background: "rgba(46,201,122,0.08)", border: "2px solid #2EC97A" }
                : { background: "var(--bg-card)", border: "2px solid var(--border-soft)" }}>
              <div>
                <div className="font-semibold text-sm" style={{ color: active ? "#2EC97A" : "var(--text)" }}>{opt.label}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>{opt.desc}</div>
              </div>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ml-3 transition-all"
                style={active ? { background: "#2EC97A", border: "2px solid #2EC97A" } : { border: "2px solid var(--border)" }}>
                {active && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {budgetLabel && (
        <div className="rounded-2xl px-4 py-3 text-sm font-medium" style={{ background: "rgba(46,201,122,0.08)", border: "1px solid rgba(46,201,122,0.2)", color: "#2EC97A" }}>
          ✓ Budget sélectionné : <strong>{budgetLabel}</strong>
        </div>
      )}
    </div>
  );
}
