"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import AuthShell, { inputClass, inputStyle } from "@/components/AuthShell";
import { useT, useLocalePath } from "@/components/I18nProvider";
import { createClient } from "@/lib/supabase/client";

// On arrive ici via le lien reçu par email (la session de récupération est déjà ouverte par /auth/callback).
export default function NewPasswordPage() {
  const router = useRouter();
  const tr = useT();
  const t = tr.auth.newPassword;
  const p = useLocalePath();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError(t.errShort); return; }
    if (password !== confirm) { setError(t.errMismatch); return; }
    setLoading(true);
    const { error: err } = await createClient().auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(/different/i.test(err.message) ? t.errSame : t.errExpired);
      return;
    }
    router.push(p("/compte") + "?mdp=ok");
  };

  return (
    <AuthShell>
      <div className="text-center mb-8">
        <h1 className="font-display font-bold text-3xl tracking-tight mb-3" style={{ color: "var(--fg)" }}>{t.title}</h1>
        <p className="text-sm" style={{ color: "var(--fg-mute)" }}>{t.sub}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {[["password", t.password, password, setPassword], ["confirm", t.confirm, confirm, setConfirm]].map(([id, label, value, set]) => (
          <div key={id as string}>
            <label htmlFor={id as string} className="block text-xs font-semibold mb-2" style={{ color: "var(--fg-mute)" }}>{label as string}</label>
            <div className="relative">
              <input id={id as string} type={show ? "text" : "password"} autoComplete="new-password" value={value as string}
                onChange={e => (set as (v: string) => void)(e.target.value)} className={`${inputClass} pr-11`} style={inputStyle} />
              {id === "password" && (
                <button type="button" onClick={() => setShow(!show)} aria-label={show ? tr.common.hidePassword : tr.common.showPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "var(--fg-faint)" }}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              )}
            </div>
          </div>
        ))}
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
