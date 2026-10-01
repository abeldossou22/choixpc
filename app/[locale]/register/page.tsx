"use client";
import { useMemo, useState } from "react";
import { Link, useT, useLocale, useLocalePath } from "@/components/I18nProvider";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, MailCheck, ChevronDown } from "lucide-react";
import { countryOptions, dialOf } from "@/lib/countries";
import { track } from "@/lib/analytics";
import AuthShell, { WA_ICON, inputClass, inputStyle } from "@/components/AuthShell";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { CONSENTS, LEGAL_VERSION, type ConsentId } from "@/lib/legal";

const EMPTY_CONSENTS: Record<ConsentId, boolean> = { cgu: false, confidentialite: false, contact_whatsapp: false, offres_whatsapp: false };

export default function RegisterPage() {
  const router = useRouter();
  const tr = useT();
  const t = tr.auth.register;
  const locale = useLocale();
  const p = useLocalePath();
  const linkCls = "font-semibold underline underline-offset-2";

  const CONSENT_LABELS: Record<ConsentId, React.ReactNode> = {
    cgu: <>{t.consentCgu[0]}<Link href="/conditions" target="_blank" className={linkCls} style={{ color: "var(--fg)" }}>{t.consentCgu[1]}</Link>{t.consentCgu[2]}</>,
    confidentialite: <>{t.consentPrivacy[0]}<Link href="/confidentialite" target="_blank" className={linkCls} style={{ color: "var(--fg)" }}>{t.consentPrivacy[1]}</Link>{t.consentPrivacy[2]}</>,
    contact_whatsapp: <>{t.consentContact}</>,
    offres_whatsapp: <>{t.consentOffers} <span style={{ color: "var(--fg-faint)" }}>{t.optional}</span>.</>,
  };

  const translateError = (message: string) => {
    if (/already registered|already been registered/i.test(message)) return t.errExists;
    if (/password/i.test(message)) return t.errWeak;
    if (/email/i.test(message)) return t.errEmail;
    if (/CGU|confidentialité/i.test(message)) return t.errLegal;
    return tr.common.genericError;
  };
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", whatsapp: "", password: "" });
  const [consents, setConsents] = useState(EMPTY_CONSENTS);
  const [country, setCountry] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const countries = useMemo(() => countryOptions(locale), [locale]);
  // Pas de pays pré-rempli : un choix explicite évite d'enregistrer un pays faux.
  const dial = country ? dialOf(country) : "";

  const requiredOk = CONSENTS.every(c => !c.required || consents[c.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.prenom || !form.email || !form.whatsapp || !form.password) {
      setError(t.errRequired);
      return;
    }
    if (!country) { setError(t.errCountry); return; }
    const digits = form.whatsapp.replace(/\D/g, "");
    if (digits.length < 6 || digits.length > 14) { setError(t.errWhatsapp); return; }
    if (form.password.length < 8) { setError(t.errPassword); return; }
    if (!requiredOk) { setError(t.errConsents); return; }
    if (!isSupabaseConfigured) { setError(t.errClosed); return; }

    setLoading(true);
    const supabase = createClient();
    const { data, error: err } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(p("/questionnaire"))}`,
        data: {
          prenom: form.prenom.trim(),
          nom: form.nom.trim(),
          whatsapp: `+${dial}${digits.replace(/^0+/, "")}`,
          country,
          locale,
          consent_version: LEGAL_VERSION,
          consents,
        },
      },
    });
    setLoading(false);

    if (err) { track("sign_up_error"); setError(translateError(err.message)); return; }
    track("sign_up", { method: "email", country, locale, offers_opt_in: consents.offres_whatsapp });
    // Si la confirmation d'email est activée dans Supabase, aucune session n'est ouverte tout de suite.
    if (data.session) router.push(p("/questionnaire"));
    else setSentTo(form.email.trim());
  };

  if (sentTo) {
    return (
      <AuthShell>
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-full flex items-center justify-center dot-green"><MailCheck size={24} /></div>
          <h1 className="font-display font-bold text-2xl tracking-tight mb-3" style={{ color: "var(--fg)" }}>{t.sentTitle}</h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--fg-mute)" }}>
            {t.sent1} <strong style={{ color: "var(--fg)" }}>{sentTo}</strong>. {t.sent2}
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell footer={
      <p className="text-center text-sm mt-6" style={{ color: "var(--fg-mute)" }}>
        {t.haveAccount}{" "}
        <Link href="/login" className="font-semibold underline decoration-[var(--green)] decoration-2 underline-offset-4" style={{ color: "var(--fg)" }}>
          {tr.common.login}
        </Link>
      </p>
    }>
      <div className="text-center mb-8">
        <h1 className="font-display font-bold text-3xl tracking-tight mb-3" style={{ color: "var(--fg)" }}>
          {t.title}
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "var(--fg-mute)" }}>
          {t.sub}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          {[["prenom", t.firstName, t.firstNamePh, "given-name"], ["nom", t.lastName, t.lastNamePh, "family-name"]].map(([name, label, ph, ac]) => (
            <div key={name}>
              <label htmlFor={name} className="block text-xs font-semibold mb-2" style={{ color: "var(--fg-mute)" }}>{label}</label>
              <input id={name} type="text" name={name} autoComplete={ac} value={form[name as keyof typeof form]} onChange={handleChange}
                placeholder={ph} className={inputClass} style={inputStyle} />
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-semibold mb-2" style={{ color: "var(--fg-mute)" }}>{t.email}</label>
          <input id="email" type="email" name="email" autoComplete="email" value={form.email} onChange={handleChange}
            placeholder={tr.auth.emailPlaceholder} className={inputClass} style={inputStyle} />
        </div>

        <div>
          <label htmlFor="country" className="block text-xs font-semibold mb-2" style={{ color: "var(--fg-mute)" }}>{t.country}</label>
          <div className="relative">
            <select id="country" value={country} onChange={e => setCountry(e.target.value)} autoComplete="country"
              className={`${inputClass} appearance-none pr-10 cursor-pointer`} style={{ ...inputStyle, color: country ? "var(--fg)" : "var(--fg-faint)" }}>
              <option value="" disabled>{t.countryPh}</option>
              {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--fg-faint)" }} />
          </div>
          <p className="text-xs mt-2" style={{ color: "var(--fg-faint)" }}>{t.countryHint}</p>
        </div>

        <div>
          <label htmlFor="whatsapp" className="block text-xs font-semibold mb-2" style={{ color: "var(--fg-mute)" }}>{t.whatsapp}</label>
          <div className="flex rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--input-bg)" }}>
            <div className="flex items-center gap-2 px-4 text-sm font-medium flex-shrink-0"
              style={{ borderRight: "1px solid var(--border)", color: "var(--fg-mute)" }}>
              <span className="text-[#25D366]">{WA_ICON}</span>
              +{dial}
            </div>
            <input id="whatsapp" type="tel" name="whatsapp" autoComplete="tel-national" inputMode="tel" value={form.whatsapp} onChange={handleChange}
              placeholder="97 00 00 00"
              className="flex-1 min-w-0 px-4 py-3 text-sm focus:outline-none bg-transparent" style={{ color: "var(--fg)" }} />
          </div>
          <p className="text-xs mt-2" style={{ color: "var(--fg-faint)" }}>
            {t.whatsappHint}
          </p>
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-semibold mb-2" style={{ color: "var(--fg-mute)" }}>{t.password}</label>
          <div className="relative">
            <input id="password" type={showPwd ? "text" : "password"} name="password" autoComplete="new-password" value={form.password} onChange={handleChange}
              placeholder={t.passwordPh}
              className={`${inputClass} pr-11`} style={inputStyle} />
            <button type="button" onClick={() => setShowPwd(!showPwd)} aria-label={showPwd ? tr.common.hidePassword : tr.common.showPassword}
              className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "var(--fg-faint)" }}>
              {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Consentements */}
        <fieldset className="rounded-2xl p-4 space-y-3" style={{ border: "1px solid var(--border)" }}>
          <legend className="px-1 text-xs font-semibold" style={{ color: "var(--fg-mute)" }}>{t.consentsLegend}</legend>
          {CONSENTS.map(c => {
            const on = consents[c.id];
            return (
              <label key={c.id} className="flex items-start gap-3 cursor-pointer text-xs leading-relaxed" style={{ color: "var(--fg-soft)" }}>
                <input type="checkbox" className="sr-only peer" checked={on}
                  onChange={e => setConsents(s => ({ ...s, [c.id]: e.target.checked }))} />
                <span aria-hidden className="mt-0.5 w-5 h-5 flex-shrink-0 rounded-md flex items-center justify-center transition-all duration-300 ease-smooth peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--green)]"
                  style={on ? { background: "var(--green)", color: "#0F1026" } : { border: "1.5px solid var(--fg-faint)" }}>
                  {on && <Check size={13} strokeWidth={3.5} />}
                </span>
                <span>{CONSENT_LABELS[c.id]}{c.required && <span style={{ color: "var(--fg-faint)" }}> *</span>}</span>
              </label>
            );
          })}
        </fieldset>

        {error && (
          <div role="alert" className="rounded-2xl px-4 py-3 text-sm text-red-500"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading || !requiredOk}
          className="w-full py-4 font-semibold text-sm rounded-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none mt-2">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              {t.submitting}
            </span>
          ) : t.submit}
        </button>
      </form>
    </AuthShell>
  );
}
