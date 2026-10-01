"use client";
import { useState } from "react";
import { Link, useT, useLocalePath } from "@/components/I18nProvider";
import { MailCheck } from "lucide-react";
import AuthShell, { inputClass, inputStyle } from "@/components/AuthShell";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const tr = useT();
  const t = tr.auth.forgot;
  const p = useLocalePath();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError(t.errRequired); return; }
    if (!isSupabaseConfigured) { setError(t.errUnavailable); return; }
    setLoading(true);
    const { error: err } = await createClient().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(p("/nouveau-mot-de-passe"))}`,
    });
    setLoading(false);
    // Même message que le compte existe ou non, pour ne pas révéler les emails inscrits.
    if (err && !/rate limit/i.test(err.message)) console.error(err.message);
    if (err && /rate limit/i.test(err.message)) { setError(t.errRate); return; }
    setSent(true);
  };

  return (
    <AuthShell footer={
      <p className="text-center text-sm mt-6" style={{ color: "var(--fg-mute)" }}>
        <Link href="/login" className="font-semibold underline decoration-[var(--green)] decoration-2 underline-offset-4" style={{ color: "var(--fg)" }}>
          {t.backToLogin}
        </Link>
      </p>
    }>
      {sent ? (
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-full flex items-center justify-center dot-solid"><MailCheck size={24} /></div>
          <h1 className="font-display font-bold text-2xl tracking-tight mb-3" style={{ color: "var(--fg)" }}>{t.sentTitle}</h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--fg-mute)" }}>
            {t.sent1} <strong style={{ color: "var(--fg)" }}>{email.trim()}</strong>{t.sent2}
          </p>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-3xl tracking-tight mb-3" style={{ color: "var(--fg)" }}>{t.title}</h1>
            <p className="text-sm" style={{ color: "var(--fg-mute)" }}>{t.sub}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold mb-2" style={{ color: "var(--fg-mute)" }}>{tr.auth.emailLabel}</label>
              <input id="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder={tr.auth.emailPlaceholder} className={inputClass} style={inputStyle} />
            </div>
            {error && (
              <div role="alert" className="rounded-2xl px-4 py-3 text-sm text-red-500"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>{error}</div>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-4 font-semibold text-sm rounded-full btn-primary disabled:opacity-40 mt-2">
              {loading ? t.submitting : t.submit}
            </button>
          </form>
        </>
      )}
    </AuthShell>
  );
}
