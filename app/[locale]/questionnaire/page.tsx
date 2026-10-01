"use client";
import { useState } from "react";
import { Link, useT, useLocale } from "@/components/I18nProvider";
import { ArrowLeft, ArrowRight, Loader2, UserRound } from "lucide-react";
import type { QuestionnaireData, AIAnalysisResult, UsageCategory } from "@/lib/types";
import StepUsage from "@/components/Questionnaire/StepUsage";
import StepBudget from "@/components/Questionnaire/StepBudget";
import StepVendor from "@/components/Questionnaire/StepVendor";
import StepResult from "@/components/Questionnaire/StepResult";
import { track } from "@/lib/analytics";

const EMPTY: QuestionnaireData = {
  usages: [], freeText: "", budgetMin: 0, budgetMax: null, budgetLabel: "",
  hasVendor: null, proposals: [], os: "both", preferences: [], brand: "",
};


export default function QuestionnairePage() {
  const [step, setStep] = useState(1);
  const tr = useT();
  const t = tr.questionnaire;
  const locale = useLocale();
  const LOADING_MSGS = t.loadingMsgs;
  const [data, setData] = useState<QuestionnaireData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = (p: Partial<QuestionnaireData>) => setData(d => ({ ...d, ...p }));

  const canProceed = () => {
    if (step === 1) return data.usages.length > 0 || data.freeText.trim().length > 0;
    if (step === 2) return data.budgetLabel !== "";
    if (step === 3) {
      if (data.hasVendor === null) return false;
      if (data.hasVendor) return data.proposals.some(p => p.rawText.trim().length > 10);
      return true;
    }
    return false;
  };

  const handleNext = async () => {
    const ctx = { os: data.os ?? "both", budget_min: data.budgetMin, budget_max: data.budgetMax, usages: data.usages.join("|"), preferences: (data.preferences ?? []).join("|"), brand: data.brand || "none", has_offers: Boolean(data.hasVendor), locale };
    if (step < 3) { track("questionnaire_step", { step, ...ctx }); setStep(s => s + 1); return; }
    track("analysis_start", { ...ctx, offers_count: data.proposals.length });
    const startedAt = Date.now();
    setLoading(true); setError(null); setMsgIdx(0);
    const iv = setInterval(() => setMsgIdx(i => (i + 1) % LOADING_MSGS.length), 1800);
    try {
      const res = await fetch("/api/analyze", {
        signal: AbortSignal.timeout(65_000),
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? tr.common.genericError);
      const json = await res.json();
      track("analysis_success", { ...ctx, mode: json.mode, duration_s: Math.round((Date.now() - startedAt) / 1000) });
      setResult(json);
      setStep(4);
    } catch (e: unknown) {
      track("analysis_error", { ...ctx, duration_s: Math.round((Date.now() - startedAt) / 1000) });
      const timedOut = e instanceof DOMException && (e.name === "TimeoutError" || e.name === "AbortError");
      setError(timedOut ? tr.api.unavailable : e instanceof Error ? e.message : tr.common.genericError);
    } finally {
      clearInterval(iv);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header className="sticky top-0 z-40"
        style={{ background: "var(--glass)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: "var(--fg-faint)" }}>
            <ArrowLeft size={16} /> <span className="hidden sm:inline">{t.back}</span>
          </Link>

          {/* Step indicators */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-1.5">
                <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all"
                  style={step > s
                    ? { background: "var(--green)", color: "#0F1026" }
                    : step === s
                      ? { background: "var(--blue)", color: "#fff" }
                      : { background: "var(--border)", color: "var(--fg-faint)" }}>
                  {step > s ? "✓" : s}
                </div>
                <span className="hidden sm:inline text-xs font-medium" style={{ color: step === s ? "var(--fg)" : "var(--fg-faint)" }}>
                  {t.steps[s - 1]}
                </span>
                {s < 3 && <div className="w-6 h-0.5 rounded-full mx-1" style={{ background: "var(--border)" }} />}
              </div>
            ))}
          </div>

          <Link href="/compte" className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--fg-mute)" }} aria-label={tr.common.myAccount}>
            <UserRound size={16} /> <span className="hidden sm:inline">{tr.common.myAccount}</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full" style={{ border: "4px solid rgba(46,201,122,0.15)" }} />
              <div className="absolute inset-0 rounded-full animate-spin" style={{ border: "4px solid var(--green)", borderTopColor: "transparent" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin" style={{ color: "var(--green)" }} />
              </div>
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-lg mb-2" style={{ color: "var(--fg)" }}>{t.loadingTitle}</p>
              <p className="text-sm" style={{ color: "var(--fg-mute)" }}>{LOADING_MSGS[msgIdx]}</p>
            </div>
            <div className="flex gap-1.5">
              {LOADING_MSGS.map((_, i) => (
                <div key={i} className="rounded-full transition-all" style={{ width: i === msgIdx ? "20px" : "6px", height: "6px", background: i === msgIdx ? "var(--green)" : "var(--border)" }} />
              ))}
            </div>
          </div>
        ) : step === 4 && result ? (
          <StepResult result={result} onRestart={() => { setStep(1); setData(EMPTY); setResult(null); setError(null); }} />
        ) : (
          <div className="space-y-8">
            {/* Progress bar */}
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(step / 3) * 100}%`, background: "var(--gradient)" }} />
            </div>

            {step === 1 && <StepUsage selected={data.usages as UsageCategory[]} freeText={data.freeText} os={data.os ?? "both"} onOsChange={os => update({ os })} preferences={data.preferences ?? []} onPreferencesChange={preferences => update({ preferences })} brand={data.brand ?? ""} onBrandChange={brand => update({ brand })} onChange={usages => update({ usages })} onFreeTextChange={freeText => update({ freeText })} />}
            {step === 2 && <StepBudget budgetMin={data.budgetMin} budgetMax={data.budgetMax} budgetLabel={data.budgetLabel} onChange={(budgetMin, budgetMax, budgetLabel) => update({ budgetMin, budgetMax, budgetLabel })} />}
            {step === 3 && <StepVendor hasVendor={data.hasVendor} proposals={data.proposals} onHasVendorChange={hasVendor => update({ hasVendor })} onProposalsChange={proposals => update({ proposals })} />}

            {error && (
              <div className="rounded-2xl px-5 py-4 text-sm text-red-400" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                ⚠️ {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              {step > 1 ? (
                <button onClick={() => setStep(s => s - 1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full transition-all"
                  style={{ color: "var(--fg-faint)", border: "1px solid var(--border)" }}>
                  <ArrowLeft size={15} /> {t.back}
                </button>
              ) : <div />}

              <button onClick={handleNext} disabled={!canProceed()}
                className="inline-flex items-center gap-2 px-7 py-3 text-sm font-bold rounded-full transition-all"
                style={canProceed()
                  ? { background: "var(--green)", color: "#0F1026", boxShadow: "0 10px 28px -10px rgba(46,201,122,0.65)" }
                  : { background: "var(--border)", color: "var(--fg-faint)", cursor: "not-allowed" }}>
                {step === 3 ? <>{t.analyze}</> : <>{t.next} <ArrowRight size={15} /></>}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
