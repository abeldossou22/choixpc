"use client";
import { UsageCategory } from "@/lib/types";

const USAGE_OPTIONS: { id: UsageCategory; emoji: string; label: string; desc: string }[] = [
  { id: "etudes", emoji: "📚", label: "Études", desc: "Cours, recherches, devoirs" },
  { id: "bureautique", emoji: "📄", label: "Bureautique", desc: "Word, Excel, emails, PDF" },
  { id: "internet", emoji: "🌐", label: "Internet", desc: "Navigation, réseaux sociaux" },
  { id: "video", emoji: "🎬", label: "Vidéo", desc: "Streaming, montage, YouTube" },
  { id: "jeux", emoji: "🎮", label: "Jeux vidéo", desc: "Gaming, simulation" },
  { id: "programmation", emoji: "💻", label: "Programmation", desc: "Développement, code" },
  { id: "design", emoji: "🎨", label: "Design", desc: "Graphisme, illustration" },
  { id: "entreprise", emoji: "🏢", label: "Entreprise", desc: "Comptabilité, gestion" },
];

interface Props {
  selected: UsageCategory[];
  freeText: string;
  onChange: (usages: UsageCategory[]) => void;
  onFreeTextChange: (text: string) => void;
}

export default function StepUsage({ selected, freeText, onChange, onFreeTextChange }: Props) {
  const toggle = (id: UsageCategory) => {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-black text-2xl sm:text-3xl mb-1 tracking-tight" style={{ color: "var(--text)" }}>
          Qu'allez-vous faire avec votre ordinateur ?
        </h2>
        <p className="text-sm" style={{ color: "var(--text-mute)" }}>Sélectionnez tout ce qui s'applique à vous.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {USAGE_OPTIONS.map((opt) => {
          const active = selected.includes(opt.id);
          return (
            <button key={opt.id} onClick={() => toggle(opt.id)}
              className="flex flex-col items-start gap-1 p-4 rounded-2xl text-left transition-all duration-200"
              style={active
                ? { background: "rgba(46,201,122,0.08)", border: "2px solid #2EC97A" }
                : { background: "var(--bg-card)", border: "2px solid var(--border-soft)" }}>
              <span className="text-2xl mb-1">{opt.emoji}</span>
              <span className="font-semibold text-sm" style={{ color: active ? "#2EC97A" : "var(--text)" }}>{opt.label}</span>
              <span className="text-xs leading-snug" style={{ color: "var(--text-faint)" }}>{opt.desc}</span>
            </button>
          );
        })}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
          Vous pouvez aussi décrire librement vos besoins{" "}
          <span className="font-normal" style={{ color: "var(--text-faint)" }}>(optionnel)</span>
        </label>
        <textarea value={freeText} onChange={(e) => onFreeTextChange(e.target.value)}
          placeholder="Ex : Je veux faire de la comptabilité, regarder des films le soir, et parfois travailler depuis un cybercafé..."
          rows={4}
          className="w-full rounded-2xl px-4 py-3 text-sm resize-none transition-all focus:outline-none"
          style={{ background: "var(--input-bg)", border: "1px solid var(--border)", color: "var(--text)" }} />
      </div>
    </div>
  );
}
