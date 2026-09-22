"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuestionnaireData, AIAnalysisResult, UsageCategory } from "@/lib/types";
import StepUsage from "@/components/Questionnaire/StepUsage";
import StepBudget from "@/components/Questionnaire/StepBudget";
import StepVendor from "@/components/Questionnaire/StepVendor";
import StepResult from "@/components/Questionnaire/StepResult";

const STEPS = [
  { id: 1, label: "Vos usages" },
  { id: 2, label: "Votre budget" },
  { id: 3, label: "Votre vendeur" },
  { id: 4, label: "Résultat" },
];

const EMPTY_DATA: QuestionnaireData = {
  usages: [],
  freeText: "",
  budgetMin: 0,
  budgetMax: null,
  budgetLabel: "",
  hasVendor: null,
  proposals: [],
};

const LOADING_MESSAGES = [
  "Analyse de vos besoins en cours...",
  "Évaluation des configurations...",
  "Vérification des rapports qualité/prix...",
  "Préparation de vos recommandations...",
];

export default function QuestionnairePage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<QuestionnaireData>(EMPTY_DATA);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canProceed = () => {
    if (step === 1) return data.usages.length > 0 || data.freeText.trim().length > 0;
    if (step === 2) return data.budgetLabel !== "";
    if (step === 3) {
      if (data.hasVendor === null) return false;
      if (data.hasVendor) return data.proposals.some((p) => p.rawText.trim().length > 10);
      return true;
    }
    return false;
  };

  const handleNext = async () => {
    if (step < 3) { setStep(step + 1); return; }
    setLoading(true);
    setError(null);
    setLoadingMsg(0);
    const interval = setInterval(() => setLoadingMsg((i) => (i + 1) % LOADING_MESSAGES.length), 1800);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Erreur inconnue");
      }
      const analysisResult: AIAnalysisResult = await res.json();
      setResult(analysisResult);
      setStep(4);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setStep(1);
    setData(EMPTY_DATA);
    setResult(null);
    setError(null);
  };

  const updateData = (partial: Partial<QuestionnaireData>) => setData((prev) => ({ ...prev, ...partial }));

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Top bar */}
      <header className="sticky top-0 z-40" style={{ background: "var(--bg)", opacity: 0.95, backdropFilter: "blur(24px)", borderBottom: "1px solid var(--border-soft)" }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 transition-colors text-sm font-medium" style={{ color: "var(--text-faint)" }}>
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Retour</span>
          </Link>

          <div className="flex items-center gap-1.5">
            {STEPS.slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center gap-1.5">
                <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all"
                  style={step > s.id
                    ? { background: "#2EC97A", color: "#fff" }
                    : step === s.id
                      ? { background: "var(--text)", color: "var(--bg)" }
                      : { background: "var(--border)", color: "var(--text-faint)" }}>
                  {step > s.id ? "✓" : s.id}
                </div>
                <span className="hidden sm:inline text-xs font-medium transition-colors"
                  style={{ color: step === s.id ? "var(--text)" : "var(--text-faint)" }}>
                  {s.label}
                </span>
                {s.id < 3 && <div className="w-6 h-0.5 rounded-full mx-1" style={{ background: "var(--border)" }} />}
              </div>
            ))}
          </div>

          <div className="w-16 text-right text-xs font-medium" style={{ color: "var(--text-faint)" }}>
            {step <= 3 ? `${step}/3` : "✓ Fait"}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full" style={{ border: "4px solid rgba(46,201,122,0.15)" }} />
              <div className="absolute inset-0 w-20 h-20 rounded-full animate-spin" style={{ border: "4px solid #2EC97A", borderTopColor: "transparent" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={24} className="text-[#2EC97A] animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-lg mb-2" style={{ color: "var(--text)" }}>Notre IA analyse votre demande</p>
              <p className="text-sm transition-all" style={{ color: "var(--text-mute)" }}>{LOADING_MESSAGES[loadingMsg]}</p>
            </div>
            <div className="flex gap-1.5">
              {LOADING_MESSAGES.map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full transition-all"
                  style={{ background: i === loadingMsg ? "#2EC97A" : "var(--border)", transform: i === loadingMsg ? "scale(1.25)" : "scale(1)" }} />
              ))}
            </div>
          </div>
        ) : step === 4 && result ? (
          <StepResult result={result} onRestart={handleRestart} />
        ) : (
          <div className="space-y-8">
            {step <= 3 && (
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(step / 3) * 100}%`, background: "#2EC97A" }} />
              </div>
            )}

            {step === 1 && (
              <StepUsage selected={data.usages as UsageCategory[]} freeText={data.freeText}
                onChange={(usages) => updateData({ usages })} onFreeTextChange={(freeText) => updateData({ freeText })} />
            )}
            {step === 2 && (
              <StepBudget budgetMin={data.budgetMin} budgetMax={data.budgetMax} budgetLabel={data.budgetLabel}
                onChange={(budgetMin, budgetMax, budgetLabel) => updateData({ budgetMin, budgetMax, budgetLabel })} />
            )}
            {step === 3 && (
              <StepVendor hasVendor={data.hasVendor} proposals={data.proposals}
                onHasVendorChange={(hasVendor) => updateData({ hasVendor })} onProposalsChange={(proposals) => updateData({ proposals })} />
            )}

            {error && (
              <div className="rounded-2xl px-5 py-4 text-sm text-red-400" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                ⚠️ {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              {step > 1 ? (
                <button onClick={() => setStep(step - 1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full transition-all"
                  style={{ color: "var(--text-faint)", border: "1px solid var(--border)" }}>
                  <ArrowLeft size={15} />
                  Retour
                </button>
              ) : <div />}

              <button onClick={handleNext} disabled={!canProceed()}
                className="inline-flex items-center gap-2 px-7 py-3 text-sm font-bold rounded-full transition-all"
                style={canProceed()
                  ? { background: "linear-gradient(135deg, #2EC97A, #1da866)", color: "#fff", boxShadow: "0 4px 20px rgba(46,201,122,0.35)" }
                  : { background: "var(--border)", color: "var(--text-faint)", cursor: "not-allowed" }}>
                {step === 3 ? (<>Analyser maintenant <span className="text-base">✨</span></>) : (<>Continuer <ArrowRight size={15} /></>)}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
