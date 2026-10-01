"use client";
import { CheckCircle2, XCircle, AlertCircle, Download, RefreshCw } from "lucide-react";
import type { AIAnalysisResult, ProposalAnalysis } from "@/lib/types";
import { useT } from "@/components/I18nProvider";
import { track } from "@/lib/analytics";

interface Props { result: AIAnalysisResult; onRestart: () => void; }

const VERDICT = {
  recommande:  { color: "var(--green)", bg: "rgba(46,201,122,0.08)",  border: "rgba(46,201,122,0.25)",  },
  acceptable:  { color: "var(--yellow)",bg: "rgba(245,166,35,0.08)",  border: "rgba(245,166,35,0.25)",  },
  deconseille: { color: "#EF4444",      bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.25)",   },
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? "var(--green)" : score >= 40 ? "var(--yellow)" : "#EF4444";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-xs font-bold w-10 text-right" style={{ color: "var(--fg)" }}>{score}/100</span>
    </div>
  );
}

function ProposalCard({ a, best }: { a: ProposalAnalysis; best: boolean }) {
  const t = useT().questionnaire.result;
  const v = VERDICT[a.verdict] ?? VERDICT.acceptable;
  const verdictLabel = t.verdicts[a.verdict] ?? t.verdicts.acceptable;
  return (
    <div className="rounded-3xl p-4 sm:p-6" style={{ background: v.bg, border: `2px solid ${v.border}`, boxShadow: best ? `0 0 0 2px ${v.color}40` : "none" }}>
      {best && <div className="inline-block mb-3 px-3 py-1 text-xs font-bold rounded-full" style={{ background: "var(--green)", color: "#0F1026" }}>{t.best}</div>}
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 mb-4">
        <div>
          <div className="font-display font-bold text-lg" style={{ color: "var(--fg)" }}>{a.label}</div>
          {a.specs.processor && <div className="text-sm mt-0.5" style={{ color: "var(--fg-mute)" }}>{a.specs.processor}</div>}
        </div>
        <span className="px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0" style={{ background: `${v.color}20`, color: v.color }}>{verdictLabel}</span>
      </div>
      <ScoreBar score={a.score} />
      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-2 mt-4 mb-4">
        {Object.entries(a.specs).map(([k, val]) => val && (
          <div key={k} className="rounded-xl px-3 py-2" style={{ background: "var(--bg-card)" }}>
            <div className="text-xs" style={{ color: "var(--fg-faint)" }}>
              {t.specs[k as keyof typeof t.specs] ?? k}
            </div>
            <div className="text-sm font-semibold" style={{ color: "var(--fg)" }}>{val}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {a.pros.length > 0 && (
          <div>
            <div className="text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: "var(--green-ink)" }}>{t.pros}</div>
            {a.pros.map(p => <div key={p} className="text-xs flex gap-1.5 mb-1" style={{ color: "var(--fg-soft)" }}><CheckCircle2 size={11} className="flex-shrink-0 mt-0.5" style={{ color: "var(--green)" as string }} />{p}</div>)}
          </div>
        )}
        {a.cons.length > 0 && (
          <div>
            <div className="text-xs font-bold mb-1.5 uppercase tracking-wide text-red-400">{t.cons}</div>
            {a.cons.map(c => <div key={c} className="text-xs flex gap-1.5 mb-1 text-red-300"><XCircle size={11} className="flex-shrink-0 mt-0.5" />{c}</div>)}
          </div>
        )}
      </div>
      <p className="text-sm leading-relaxed rounded-xl px-4 py-3" style={{ color: "var(--fg-soft)", background: "var(--bg-card)" }}>{a.explanation}</p>
    </div>
  );
}

export default function StepResult({ result, onRestart }: Props) {
  const t = useT().questionnaire.result;
  const configs = result.generatedConfigs?.length ? result.generatedConfigs : result.generatedConfig ? [result.generatedConfig] : [];
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
          style={{ background: "rgba(46,201,122,0.12)" }}>
          <CheckCircle2 size={28} style={{ color: "var(--green)" }} />
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl mb-2 tracking-tight" style={{ color: "var(--fg)" }}>{t.title}</h2>
        <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: "var(--fg-mute)" }}>{result.summary}</p>
      </div>

      {result.mode === "vendor" && result.analyses && (
        <div className="space-y-4">
          {result.analyses.map(a => <ProposalCard key={a.proposalId} a={a} best={a.proposalId === result.bestProposalId} />)}
        </div>
      )}

      {result.mode === "generated" && configs.length > 0 && (
        <div className={`grid grid-cols-1 gap-4 ${configs.length > 1 ? "lg:grid-cols-2" : ""}`}>
          {configs.map((cfg, idx) => {
            const over = cfg.withinBudget === false;
            const accent = over ? "245,166,35" : "46,201,122";
            return (
              <div key={`${cfg.system ?? "cfg"}-${idx}`} className="rounded-3xl p-4 sm:p-6 flex flex-col"
                style={{ background: `rgba(${accent},0.08)`, border: `2px solid rgba(${accent},0.28)` }}>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {cfg.system && (
                    <span className="px-3 py-1 text-xs font-bold rounded-full text-white" style={{ background: "var(--blue)" }}>{t.systems[cfg.system] ?? cfg.system}</span>
                  )}
                  <span className="px-3 py-1 text-xs font-bold rounded-full" style={{ background: over ? "var(--yellow)" : "var(--green)", color: "#0F1026" }}>
                    {over ? t.overBudget : t.generatedBadge}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl mb-1" style={{ color: "var(--fg)" }}>{cfg.brand ?? t.generatedFallback}</h3>
                <p className="text-sm mb-5" style={{ color: "var(--fg-mute)" }}>{cfg.explanation}</p>
                <div className={`grid grid-cols-1 min-[400px]:grid-cols-2 gap-2 sm:gap-3 mb-5 ${configs.length > 1 ? "" : "sm:grid-cols-3"}`}>
                  {[cfg.processor, cfg.graphics, cfg.ram, cfg.storage, cfg.screen, cfg.estimatedPrice].map((v, i) => [t.configLabels[i], v]).filter(([, v]) => v).map(([k, v]) => (
                    <div key={k} className="rounded-xl px-3 py-2.5" style={{ background: "var(--bg-card)" }}>
                      <div className="text-xs" style={{ color: "var(--fg-faint)" }}>{k}</div>
                      <div className="text-sm font-bold" style={{ color: "var(--fg)" }}>{v}</div>
                    </div>
                  ))}
                </div>
                {cfg.whatToAskVendor?.length > 0 && (
                  <div className="rounded-2xl p-4 mt-auto" style={{ background: "var(--bg-card)" }}>
                    <div className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: "var(--fg)" }}>{t.ask}</div>
                    {cfg.whatToAskVendor.map(q => (
                      <div key={q} className="text-sm flex gap-2 mb-1.5" style={{ color: "var(--fg-soft)" }}>
                        <span style={{ color: "var(--green-ink)", fontWeight: 700 }}>→</span> {q}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-2xl px-5 py-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "var(--fg-faint)" }}>{t.advice}</div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--fg-soft)" }}>{result.generalAdvice}</p>
      </div>

      {result.redFlags && result.redFlags.length > 0 && (
        <div className="rounded-2xl px-5 py-4" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <div className="text-xs font-bold uppercase tracking-wide mb-2 text-red-400">{t.flags}</div>
          {result.redFlags.map(f => <div key={f} className="text-sm flex gap-2 mb-1 text-red-300"><AlertCircle size={13} className="flex-shrink-0 mt-0.5" />{f}</div>)}
        </div>
      )}

      {/* SHODA */}
      <div className="rounded-3xl overflow-hidden" style={{ background: "rgba(91,103,240,0.06)", border: "2px solid rgba(91,103,240,0.2)" }}>
        <div className="p-4 sm:p-6">
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: "rgba(91,103,240,0.12)", color: "var(--blue-ink)" }}>
            {t.nextStep}
          </div>
          <h3 className="font-display font-bold text-lg mb-2 tracking-tight" style={{ color: "var(--fg)" }}>
            {t.shodaTitle}
          </h3>
          <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--fg-mute)" }}>
            {t.shoda1} <strong style={{ color: "var(--fg-soft)" }}>SHODA</strong> {t.shoda2}
          </p>
          <a href="https://shoda-eight.vercel.app/" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold text-sm rounded-full transition-all hover:-translate-y-0.5"
            style={{ background: "var(--blue)", boxShadow: "0 8px 24px -8px rgba(91,103,240,0.6)" }}>
            {t.shodaCta}
          </a>
        </div>
        <div className="px-6 py-3 flex items-center gap-2" style={{ borderTop: "1px solid rgba(91,103,240,0.15)", background: "rgba(91,103,240,0.04)" }}>
          <span className="font-bold text-sm" style={{ color: "var(--yellow)" }}>!</span>
          <p className="text-xs" style={{ color: "var(--fg-faint)" }}>
            <strong style={{ color: "var(--fg-soft)" }}>{t.tipStrong}</strong> {t.tip}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button onClick={() => { track("pdf_download"); window.print(); }}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 font-bold text-sm rounded-full transition-all"
          style={{ background: "var(--fg)", color: "var(--bg)" }}>
          <Download size={16} /> {t.pdf}
        </button>
        <button onClick={() => { track("analysis_restart"); onRestart(); }}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-sm rounded-full transition-all"
          style={{ background: "var(--bg-card)", color: "var(--fg)", border: "1px solid var(--border)" }}>
          <RefreshCw size={15} /> {t.restart}
        </button>
      </div>
    </div>
  );
}
