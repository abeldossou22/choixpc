"use client";
import { Suspense, useState } from "react";
import { Link, useT, useLocalePath } from "@/components/I18nProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import AuthShell, { inputClass, inputStyle } from "@/components/AuthShell";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { track } from "@/lib/analytics";

function LoginForm() {
  const router = useRouter();
  const tr = useT();
  const t = tr.auth.login;
  const p = useLocalePath();
  const params = useSearchParams();
  const next = params.get("next");
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : p("/questionnaire");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(params.get("erreur") === "lien" ? t.errLink : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError(t.errRequired); return; }
    if (!isSupabaseConfigured) { setError(t.errUnavailable); return; }
    setLoading(true);
    const { error: err } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (err) {
      setError(/confirm/i.test(err.message)
        ? t.errConfirm
        : t.errInvalid);
      return;
    }
    track("login", { method: "email" });
    router.push(safeNext);
    router.refresh();
  };

  return (
    <AuthShell footer={
      <p className="text-center text-sm mt-6" style={{ color: "var(--fg-mute)" }}>
        {t.noAccount}{" "}
        <Link href="/register" className="font-semibold underline decoration-[var(--green)] decoration-2 underline-offset-4" style={{ color: "var(--fg)" }}>
          {t.create}
        </Link>
      </p>
    }>
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
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-xs font-semibold" style={{ color: "var(--fg-mute)" }}>{tr.auth.passwordLabel}</label>
            <Link href="/mot-de-passe-oublie" className="text-xs font-medium hover:underline underline-offset-4" style={{ color: "var(--blue)" }}>{t.forgot}</Link>
          </div>
          <div className="relative">
            <input id="password" type={showPwd ? "text" : "password"} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)}
              className={`${inputClass} pr-11`} style={inputStyle} />
            <button type="button" onClick={() => setShowPwd(!showPwd)} aria-label={showPwd ? tr.common.hidePassword : tr.common.showPassword}
              className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "var(--fg-faint)" }}>
              {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
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
    </AuthShell>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
