"use client";
import { useT } from "@/components/I18nProvider";

const RANGES: { min: number; max: number | null }[] = [
  { min: 0, max: 100000 }, { min: 100000, max: 200000 }, { min: 200000, max: 350000 },
  { min: 350000, max: 500000 }, { min: 500000, max: 800000 }, { min: 800000, max: null },
];

interface Props {
  budgetMin: number; budgetMax: number | null; budgetLabel: string;
  onChange: (min: number, max: number | null, label: string) => void;
}

export default function StepBudget({ budgetMin, budgetMax, budgetLabel, onChange }: Props) {
  const t = useT().questionnaire.budget;
  const OPTIONS = RANGES.map((r, i) => ({ ...r, ...t.options[i] }));
  // budgetLabel non vide = un choix a été fait (sinon min=0 correspondrait à la première tranche)
  const isSelected = (o: { min: number; max: number | null }) => budgetLabel !== "" && o.min === budgetMin && o.max === budgetMax;
  const current = OPTIONS.find(isSelected);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-black text-2xl sm:text-3xl mb-1 tracking-tight" style={{ color: "var(--fg)" }}>
          {t.title}
        </h2>
        <p className="text-sm" style={{ color: "var(--fg-mute)" }}>{t.sub}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OPTIONS.map(opt => {
          const active = isSelected(opt);
          return (
            <button key={opt.min} onClick={() => onChange(opt.min, opt.max, opt.label)}
              className="flex items-center justify-between p-4 rounded-2xl text-left transition-all duration-200"
              style={active
                ? { background: "rgba(46,201,122,0.08)", border: "2px solid rgba(46,201,122,0.5)" }
                : { background: "var(--bg-card)", border: "2px solid var(--border)" }}>
              <div>
                <div className="font-semibold text-sm" style={{ color: active ? "var(--green-ink)" : "var(--fg)" }}>{opt.label}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--fg-faint)" }}>{opt.desc}</div>
              </div>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ml-3 transition-all"
                style={active ? { background: "var(--green)", border: "2px solid var(--green)" } : { border: "2px solid var(--border)" }}>
                {active && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {current && (
        <div className="rounded-2xl px-4 py-3 text-sm font-medium"
          style={{ background: "rgba(46,201,122,0.08)", border: "1px solid rgba(46,201,122,0.2)", color: "var(--green-ink)" }}>
          ✓ {t.selected} <strong>{current.label}</strong>
        </div>
      )}
    </div>
  );
}
