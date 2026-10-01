"use client";
import type { UsageCategory, OsPreference } from "@/lib/types";
import { Monitor, Apple, Layers, Check, ChevronDown } from "lucide-react";
import { PREFERENCES, BRANDS } from "@/lib/profile-options";
import { useT } from "@/components/I18nProvider";

const OPTIONS: { id: UsageCategory; emoji: string }[] = [
  { id: "etudes", emoji: "📚" }, { id: "bureautique", emoji: "📄" }, { id: "internet", emoji: "🌐" }, { id: "video", emoji: "🎬" },
  { id: "jeux", emoji: "🎮" }, { id: "programmation", emoji: "💻" }, { id: "design", emoji: "🎨" }, { id: "entreprise", emoji: "🏢" },
];

interface Props {
  selected: UsageCategory[];
  freeText: string;
  os: OsPreference;
  preferences: string[];
  brand: string;
  onPreferencesChange: (v: string[]) => void;
  onBrandChange: (v: string) => void;
  onOsChange: (v: OsPreference) => void;
  onChange: (v: UsageCategory[]) => void;
  onFreeTextChange: (v: string) => void;
}

const OS_OPTIONS: { id: OsPreference; Icon: typeof Monitor }[] = [
  { id: "both", Icon: Layers }, { id: "windows", Icon: Monitor }, { id: "mac", Icon: Apple },
];

export default function StepUsage({ selected, freeText, os, preferences, brand, onChange, onFreeTextChange, onOsChange, onPreferencesChange, onBrandChange }: Props) {
  // « Neuf uniquement » et « Occasion acceptée » s'excluent.
  const EXCLUSIVE: Record<string, string> = { neuf: "occasion", occasion: "neuf", grand_ecran: "compact", compact: "grand_ecran" };
  const togglePref = (id: string) => onPreferencesChange(
    preferences.includes(id) ? preferences.filter(p => p !== id) : [...preferences.filter(p => p !== EXCLUSIVE[id]), id],
  );
  const t = useT().questionnaire.usage;
  const toggle = (id: UsageCategory) =>
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-black text-2xl sm:text-3xl mb-1 tracking-tight" style={{ color: "var(--fg)" }}>
          {t.title}
        </h2>
        <p className="text-sm" style={{ color: "var(--fg-mute)" }}>{t.sub}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {OPTIONS.map(opt => {
          const active = selected.includes(opt.id);
          return (
            <button key={opt.id} onClick={() => toggle(opt.id)}
              className="flex flex-col items-start gap-1 p-4 rounded-2xl text-left transition-all duration-200"
              style={active
                ? { background: "rgba(46,201,122,0.08)", border: "2px solid rgba(46,201,122,0.5)" }
                : { background: "var(--bg-card)", border: "2px solid var(--border)" }}>
              <span className="text-2xl mb-1">{opt.emoji}</span>
              <span className="font-semibold text-sm" style={{ color: active ? "var(--green-ink)" : "var(--fg)" }}>{t.options[opt.id].label}</span>
              <span className="text-xs leading-snug" style={{ color: "var(--fg-faint)" }}>{t.options[opt.id].desc}</span>
            </button>
          );
        })}
      </div>

      <div>
        <h3 className="font-display font-bold text-lg mb-1 tracking-tight" style={{ color: "var(--fg)" }}>{t.osTitle}</h3>
        <p className="text-sm mb-3" style={{ color: "var(--fg-mute)" }}>{t.osSub}</p>
        <div className="grid grid-cols-1 min-[420px]:grid-cols-3 gap-3" role="radiogroup" aria-label={t.osTitle}>
          {OS_OPTIONS.map(({ id, Icon }) => {
            const active = os === id;
            return (
              <button key={id} type="button" role="radio" aria-checked={active} onClick={() => onOsChange(id)}
                className="flex min-[420px]:flex-col items-center min-[420px]:items-start gap-3 min-[420px]:gap-1 p-4 rounded-2xl text-left transition-all duration-200"
                style={active
                  ? { background: "rgba(91,103,240,0.08)", border: "2px solid rgba(91,103,240,0.55)" }
                  : { background: "var(--bg-card)", border: "2px solid var(--border)" }}>
                <Icon size={22} className="flex-shrink-0 min-[420px]:mb-1" style={{ color: active ? "var(--blue)" : "var(--fg-mute)" }} />
                <span>
                  <span className="block font-semibold text-sm" style={{ color: active ? "var(--blue-ink)" : "var(--fg)" }}>{t.os[id].label}</span>
                  <span className="block text-xs leading-snug" style={{ color: "var(--fg-faint)" }}>{t.os[id].desc}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-display font-bold text-lg mb-1 tracking-tight" style={{ color: "var(--fg)" }}>{t.prefsTitle}</h3>
        <p className="text-sm mb-3" style={{ color: "var(--fg-mute)" }}>{t.prefsSub}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {PREFERENCES.map(id => {
            const active = preferences.includes(id);
            return (
              <button key={id} type="button" aria-pressed={active} onClick={() => togglePref(id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={active
                  ? { background: "rgba(46,201,122,0.12)", border: "1.5px solid rgba(46,201,122,0.6)", color: "var(--green-ink)" }
                  : { background: "var(--bg-card)", border: "1.5px solid var(--border)", color: "var(--fg-soft)" }}>
                {active && <Check size={13} strokeWidth={3} />}{t.prefs[id]}
              </button>
            );
          })}
        </div>
        <label htmlFor="brand" className="block text-sm font-semibold mb-2" style={{ color: "var(--fg)" }}>{t.brandLabel}</label>
        <div className="relative mb-4 sm:max-w-xs">
          <select id="brand" value={brand} onChange={e => onBrandChange(e.target.value)}
            className="w-full appearance-none rounded-2xl px-4 py-3 pr-10 text-sm cursor-pointer focus:outline-none"
            style={{ background: "var(--input-bg)", border: "1px solid var(--border)", color: brand ? "var(--fg)" : "var(--fg-mute)" }}>
            <option value="">{t.brandNone}</option>
            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--fg-faint)" }} />
        </div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--fg)" }}>
          {t.freeLabel}{" "}
          <span className="font-normal" style={{ color: "var(--fg-faint)" }}>{t.optional}</span>
        </label>
        <textarea value={freeText} onChange={e => onFreeTextChange(e.target.value)}
          placeholder={t.freePh}
          rows={3}
          className="w-full rounded-2xl px-4 py-3 text-sm resize-none transition-all focus:outline-none"
          style={{ background: "var(--input-bg)", border: "1px solid var(--border)", color: "var(--fg)" }} />
      </div>
    </div>
  );
}
