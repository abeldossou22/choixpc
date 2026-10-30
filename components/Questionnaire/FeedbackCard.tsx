"use client";
import { useState } from "react";
import { Loader2, Star } from "lucide-react";
import { useT } from "@/components/I18nProvider";
import { track } from "@/lib/analytics";
import { createClient } from "@/lib/supabase/client";

export default function FeedbackCard({ analysisId }: { analysisId: string }) {
  const t = useT().questionnaire.result.feedback;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);

  const send = async () => {
    setSending(true); setFailed(false);
    const { error } = await createClient().from("feedbacks").insert({ analysis_id: analysisId, rating, comment: comment.trim() || null });
    setSending(false);
    // 23505 : un avis existe déjà pour cette analyse.
    if (error && error.code !== "23505") { console.error("[ChoixPC avis]", error.message); setFailed(true); return; }
    track("feedback_submit", { rating, has_comment: comment.trim().length > 0 });
    setSent(true);
  };

  const cardStyle = { background: "var(--bg-card)", border: "1px solid var(--border)" };
  if (sent) {
    return (
      <div className="rounded-2xl px-5 py-4 text-sm font-semibold text-center print:hidden" style={{ ...cardStyle, color: "var(--fg)" }}>{t.thanks}</div>
    );
  }

  return (
    <div className="rounded-2xl px-5 py-5 print:hidden" style={cardStyle}>
      <h3 className="font-display font-bold text-lg mb-1 tracking-tight" style={{ color: "var(--fg)" }}>{t.title}</h3>
      <p className="text-sm mb-3" style={{ color: "var(--fg-mute)" }}>{t.subtitle}</p>
      <div className="flex gap-1 mb-4" role="group" aria-label={t.title}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n}/5`} aria-pressed={rating === n} className="p-1 transition-transform hover:scale-110">
            <Star size={28} style={{ color: n <= rating ? "var(--yellow)" : "var(--fg-faint)" }} fill={n <= rating ? "currentColor" : "none"} />
          </button>
        ))}
      </div>
      {rating > 0 && (
        <>
          <label htmlFor="feedback-comment" className="block text-xs font-semibold mb-2" style={{ color: "var(--fg-mute)" }}>{t.commentLabel}</label>
          <textarea id="feedback-comment" value={comment} onChange={e => setComment(e.target.value)} rows={3} maxLength={1000} placeholder={t.commentPh}
            className="w-full rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none mb-3"
            style={{ background: "var(--input-bg)", border: "1px solid var(--border)", color: "var(--fg)" }} />
          {failed && <p className="text-sm text-red-400 mb-3">{t.error}</p>}
          <button type="button" onClick={send} disabled={sending}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-full transition-all"
            style={{ background: "var(--green)", color: "#0F1026" }}>
            {sending && <Loader2 size={15} className="animate-spin" />} {t.send}
          </button>
        </>
      )}
    </div>
  );
}
