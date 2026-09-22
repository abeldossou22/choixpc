"use client";
import { CheckCircle2, XCircle, AlertCircle, Download, RefreshCw } from "lucide-react";
import type { AIAnalysisResult, ProposalAnalysis } from "@/lib/types";

interface Props {
  result: AIAnalysisResult;
  onRestart: () => void;
}

const verdictConfig = {
  recommande: { icon: CheckCircle2, color: "#2EC97A", bg: "rgba(46,201,122,0.08)", border: "rgba(46,201,122,0.25)", badgeBg: "rgba(46,201,122,0.15)", label: "Recommandé" },
  acceptable: { icon: AlertCircle, color: "#F5A623", bg: "rgba(245,166,35,0.08)", border: "rgba(245,166,35,0.25)", badgeBg: "rgba(245,166,35,0.15)", label: "Acceptable" },
  deconseille: { icon: XCircle, color: "#EF4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", badgeBg: "rgba(239,68,68,0.15)", label: "Déconseillé" },
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? "#2EC97A" : score >= 40 ? "#F5A623" : "#EF4444";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-xs font-bold w-8 text-right" style={{ color: "var(--text)" }}>{score}/100</span>
    </div>
  );
}

function ProposalCard({ analysis, isBest }: { analysis: ProposalAnalysis; isBest: boolean }) {
  const vc = verdictConfig[analysis.verdict];

  return (
    <div className="rounded-3xl p-6 transition-all" style={{ background: vc.bg, border: `2px solid ${vc.border}`, boxShadow: isBest ? `0 0 0 2px ${vc.color}40` : "none" }}>
      {isBest && (
        <div className="inline-block mb-3 px-3 py-1 text-white text-xs font-bold rounded-full" style={{ background: "#2EC97A" }}>
          ⭐ Meilleur choix
        </div>
      )}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="font-display font-bold text-lg" style={{ color: "var(--text)" }}>{analysis.label}</div>
          {analysis.specs.processor && <div className="text-sm mt-0.5" style={{ color: "var(--text-mute)" }}>{analysis.specs.processor}</div>}
        </div>
        <span className="px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0" style={{ background: vc.badgeBg, color: vc.color }}>
          {vc.label}
        </span>
      </div>

      <ScoreBar score={analysis.score} />

      <div className="grid grid-cols-2 gap-2 mt-4 mb-4">
        {Object.entries(analysis.specs).map(([k, v]) => v && (
          <div key={k} className="rounded-xl px-3 py-2" style={{ background: "var(--bg-card)" }}>
            <div className="text-xs" style={{ color: "var(--text-faint)" }}>{k === "processor" ? "Processeur" : k === "ram" ? "RAM" : k === "storage" ? "Stockage" : k === "screen" ? "Écran" : k === "price" ? "Prix" : k}</div>
            <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{v}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {analysis.pros.length > 0 && (
          <div>
            <div className="text-xs font-bold mb-1.5 uppercase tracking-wide text-[#2EC97A]">Points forts</div>
            <ul className="space-y-1">
              {analysis.pros.map((p) => (
                <li key={p} className="text-xs flex items-start gap-1.5" style={{ color: "var(--text-soft)" }}>
                  <CheckCircle2 size={12} className="text-[#2EC97A] flex-shrink-0 mt-0.5" /> {p}
                </li>
              ))}
            </ul>
          </div>
        )}
        {analysis.cons.length > 0 && (
          <div>
            <div className="text-xs font-bold mb-1.5 uppercase tracking-wide text-red-400">Points faibles</div>
            <ul className="space-y-1">
              {analysis.cons.map((c) => (
                <li key={c} className="text-xs flex items-start gap-1.5" style={{ color: "var(--text-soft)" }}>
                  <XCircle size={12} className="text-red-400 flex-shrink-0 mt-0.5" /> {c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="text-sm leading-relaxed rounded-xl px-4 py-3" style={{ color: "var(--text-soft)", background: "var(--bg-card)" }}>
        {analysis.explanation}
      </p>
    </div>
  );
}

export default function StepResult({ result, onRestart }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ background: "rgba(46,201,122,0.12)" }}>
          <CheckCircle2 size={28} className="text-[#2EC97A]" />
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl mb-2 tracking-tight" style={{ color: "var(--text)" }}>
          Analyse terminée !
        </h2>
        <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: "var(--text-mute)" }}>{result.summary}</p>
      </div>

      {result.mode === "vendor" && result.analyses && (
        <div className="space-y-4">
          {result.analyses.map((a) => (
            <ProposalCard key={a.proposalId} analysis={a} isBest={a.proposalId === result.bestProposalId} />
          ))}
        </div>
      )}

      {result.mode === "generated" && result.generatedConfig && (
        <div className="rounded-3xl p-6" style={{ background: "rgba(46,201,122,0.08)", border: "2px solid rgba(46,201,122,0.25)" }}>
          <div className="inline-block mb-4 px-3 py-1 text-white text-xs font-bold rounded-full" style={{ background: "#2EC97A" }}>
            ✨ Configuration idéale générée
          </div>
          <h3 className="font-display font-bold text-xl mb-1" style={{ color: "var(--text)" }}>
            {result.generatedConfig.brand ?? "Configuration recommandée"}
          </h3>
          <p className="text-sm mb-5" style={{ color: "var(--text-mute)" }}>{result.generatedConfig.explanation}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            {[
              { k: "Processeur", v: result.generatedConfig.processor },
              { k: "RAM", v: result.generatedConfig.ram },
              { k: "Stockage", v: result.generatedConfig.storage },
              { k: "Écran", v: result.generatedConfig.screen },
              { k: "Budget estimé", v: result.generatedConfig.estimatedPrice },
            ].map(({ k, v }) => (
              <div key={k} className="rounded-xl px-3 py-2.5" style={{ background: "var(--bg-card)" }}>
                <div className="text-xs" style={{ color: "var(--text-faint)" }}>{k}</div>
                <div className="text-sm font-bold" style={{ color: "var(--text)" }}>{v}</div>
              </div>
            ))}
          </div>

          {result.generatedConfig.whatToAskVendor.length > 0 && (
            <div className="rounded-2xl p-4" style={{ background: "var(--bg-card)" }}>
              <div className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: "var(--text)" }}>📋 Ce qu'il faut demander à votre vendeur</div>
              <ul className="space-y-1.5">
                {result.generatedConfig.whatToAskVendor.map((q) => (
                  <li key={q} className="text-sm flex items-start gap-2" style={{ color: "var(--text-soft)" }}>
                    <span className="text-[#2EC97A] font-bold">→</span> {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="rounded-2xl px-5 py-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "var(--text-faint)" }}>Conseil général</div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-soft)" }}>{result.generalAdvice}</p>
      </div>

      {result.redFlags && result.redFlags.length > 0 && (
        <div className="rounded-2xl px-5 py-4" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <div className="text-xs font-bold uppercase tracking-wide mb-2 text-red-400">⚠️ Points d'attention</div>
          <ul className="space-y-1">
            {result.redFlags.map((flag) => (
              <li key={flag} className="text-sm flex items-start gap-2 text-red-300">
                <AlertCircle size={13} className="flex-shrink-0 mt-0.5" /> {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* SHODA */}
      <div className="rounded-3xl overflow-hidden" style={{ background: "rgba(91,103,240,0.06)", border: "2px solid rgba(91,103,240,0.2)" }}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
                style={{ background: "rgba(91,103,240,0.15)", color: "#8B93F8" }}>
                Étape suivante recommandée
              </div>
              <h3 className="font-display font-bold text-lg mb-2 tracking-tight" style={{ color: "var(--text)" }}>
                Vérifiez votre ordinateur avec SHODA
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-mute)" }}>
                Une fois votre ordinateur acheté, utilisez <strong style={{ color: "var(--text-soft)" }}>SHODA</strong> pour tester
                tous ses composants — processeur, RAM, disque dur, écran — et vous assurer
                qu'il est <strong style={{ color: "var(--text-soft)" }}>exactement conforme</strong> à ce qu'on vous a vendu.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {["Processeur", "RAM", "Disque dur", "Écran"].map((f) => (
                  <div key={f} className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}>
                    <span className="text-[#5B67F0] font-bold">⬡</span>
                    <span className="text-xs font-medium" style={{ color: "var(--text-soft)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <a href="https://shoda-eight.vercel.app/" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-bold text-sm rounded-full transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #5B67F0, #4451e0)", boxShadow: "0 4px 16px rgba(91,103,240,0.30)" }}>
                Télécharger SHODA gratuitement
              </a>
            </div>
          </div>
        </div>
        <div className="px-6 py-3 flex items-center gap-2" style={{ borderTop: "1px solid rgba(91,103,240,0.15)", background: "rgba(91,103,240,0.04)" }}>
          <span className="text-[#F5A623] font-bold text-sm">!</span>
          <p className="text-xs" style={{ color: "var(--text-faint)" }}>
            <strong style={{ color: "var(--text-soft)" }}>Conseil HevelCare :</strong> Lancez SHODA dans les 24h après l'achat.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button onClick={() => window.print()}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-sm rounded-full transition-all"
          style={{ background: "var(--text)", color: "var(--bg)" }}>
          <Download size={16} /> Télécharger en PDF
        </button>
        <button onClick={onRestart}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-sm rounded-full transition-all"
          style={{ background: "var(--bg-card)", color: "var(--text)", border: "1px solid var(--border)" }}>
          <RefreshCw size={15} /> Recommencer
        </button>
      </div>
    </div>
  );
}
