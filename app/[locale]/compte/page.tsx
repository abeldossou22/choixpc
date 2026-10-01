"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Link, useT, useLocale, useLocalePath } from "@/components/I18nProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check, ChevronDown, LogOut, Trash2 } from "lucide-react";
import { countryOptions, dialOf, isCountry, DEFAULT_COUNTRY } from "@/lib/countries";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { inputClass, inputStyle } from "@/components/AuthShell";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { LEGAL_VERSION } from "@/lib/legal";
import { track } from "@/lib/analytics";
import { PROFESSIONS, isProfession } from "@/lib/profile-options";
import type { AIAnalysisResult } from "@/lib/types";

type Profile = { prenom: string; nom: string | null; email: string; whatsapp: string; country?: string | null; profession?: string | null; profession_other?: string | null };
type Analysis = { id: string; created_at: string; budget_label: string | null; usages: string[]; has_vendor: boolean | null; result: AIAnalysisResult | null };

const card = { background: "var(--bg-card)", border: "1px solid var(--border)" };

function AnalysisItem({ a }: { a: Analysis }) {
  const [open, setOpen] = useState(false);
  const t = useT().account;
  const locale = useLocale();
  const dateFmt = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const r = a.result;
  const configs = r?.generatedConfigs?.length ? r.generatedConfigs : r?.generatedConfig ? [r.generatedConfig] : [];
  const best = r?.analyses?.find(x => x.proposalId === r.bestProposalId);
  const headline = r?.mode === "vendor"
    ? best ? `${t.bestChoice} ${best.label} (${best.score}/100)` : `${r?.analyses?.length ?? 0} ${t.offersCompared}`
    : configs.length ? configs.map(c => c.brand ?? t.configuration).join(" / ") : t.analysis;

  return (
    <li className="rounded-2xl overflow-hidden" style={card}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 p-4 sm:p-5 text-left">
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold flex-shrink-0 chip">
          {a.has_vendor ? t.tagOffers : t.tagConfig}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-semibold truncate" style={{ color: "var(--fg)" }}>{headline}</span>
          <span className="block text-xs mt-0.5" style={{ color: "var(--fg-mute)" }}>
            {dateFmt.format(new Date(a.created_at))}{a.budget_label ? ` · ${a.budget_label}` : ""}
          </span>
        </span>
        <ChevronDown size={16} className="flex-shrink-0 transition-transform duration-500 ease-smooth" style={{ color: "var(--fg-faint)", transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      <div className="grid transition-[grid-template-rows] duration-500 ease-smooth" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <div className="px-4 sm:px-5 pb-5 space-y-3 text-sm leading-relaxed" style={{ color: "var(--fg-soft)" }}>
            {r?.summary && <p>{r.summary}</p>}
            {configs.map((cfg, i) => (
              <div key={i}>
                {configs.length > 1 && <div className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "var(--blue-ink)" }}>{cfg.system === "mac" ? "Mac" : cfg.system === "windows" ? "Windows" : cfg.brand}</div>}
                <ul className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-2">
                  {[cfg.processor, cfg.graphics, cfg.ram, cfg.storage, cfg.screen, cfg.estimatedPrice].map((v, k) => [t.specLabels[k], v]).filter(([, v]) => v).map(([k, v]) => (
                    <li key={k} className="rounded-xl px-3 py-2" style={{ background: "var(--input-bg)" }}>
                      <span className="block text-xs" style={{ color: "var(--fg-mute)" }}>{k}</span>
                      <span className="font-semibold" style={{ color: "var(--fg)" }}>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {r?.analyses?.map(x => (
              <div key={x.proposalId} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "var(--input-bg)" }}>
                <span style={{ color: "var(--fg)" }}>{x.label}</span>
                <span className="font-bold" style={{ color: x.score >= 70 ? "var(--green-ink)" : x.score >= 40 ? "var(--yellow)" : "#EF4444" }}>{x.score}/100</span>
              </div>
            ))}
            {r?.generalAdvice && <p className="text-xs" style={{ color: "var(--fg-mute)" }}>{r.generalAdvice}</p>}
          </div>
        </div>
      </div>
    </li>
  );
}

function AccountContent() {
  const router = useRouter();
  const params = useSearchParams();
  const t = useT().account;
  const lp = useLocalePath();
  const locale = useLocale();
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [profession, setProfession] = useState("");
  const [professionOther, setProfessionOther] = useState("");
  const tr = useT();
  const countries = useMemo(() => countryOptions(locale), [locale]);
  const dial = dialOf(country);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({ prenom: "", nom: "", whatsapp: "" });
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [offres, setOffres] = useState(false);
  const [notice, setNotice] = useState(params.get("mdp") === "ok" ? t.okPassword : "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace(`${lp("/login")}?next=${encodeURIComponent(lp("/compte"))}`); return; }
      const [p, a, c] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("analyses").select("id, created_at, budget_label, usages, has_vendor, result").order("created_at", { ascending: false }).limit(20),
        supabase.from("consents").select("granted").eq("document", "offres_whatsapp").order("created_at", { ascending: false }).limit(1),
      ]);
      if (p.data) {
        setProfile(p.data);
        const c = isCountry(p.data.country) ? p.data.country : DEFAULT_COUNTRY;
        setCountry(c);
        if (isProfession(p.data.profession)) setProfession(p.data.profession);
        setProfessionOther(p.data.profession_other ?? "");
        setForm({ prenom: p.data.prenom, nom: p.data.nom ?? "", whatsapp: p.data.whatsapp.replace(new RegExp(`^\\+${dialOf(c)}`), "").replace(/^\+/, "") });
      }
      setAnalyses((a.data as Analysis[]) ?? []);
      setOffres(Boolean(c.data?.[0]?.granted));
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const flash = (msg: string) => { setNotice(msg); setError(""); setTimeout(() => setNotice(""), 4000); };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = form.whatsapp.replace(/\D/g, "");
    if (!form.prenom.trim()) { setError(t.errFirstName); return; }
    if (digits.length < 6 || digits.length > 14) { setError(t.errWhatsapp); return; }
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const base = { prenom: form.prenom.trim(), nom: form.nom.trim() || null, whatsapp: `+${dial}${digits.replace(/^0+/, "")}`, country };
    const prof = { profession: profession || null, profession_other: profession === "autre" ? professionOther.trim().slice(0, 80) || null : null };
    let { error: err } = await supabase.from("profiles").update({ ...base, ...prof }).eq("id", user!.id);
    // Colonnes du profil absentes (migration 0005 pas encore exécutée) : on enregistre le reste.
    if (err) ({ error: err } = await supabase.from("profiles").update(base).eq("id", user!.id));
    setSaving(false);
    if (err) setError(t.errSave);
    else flash(t.okProfile);
  };

  const toggleOffres = async () => {
    const next = !offres;
    setOffres(next);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error: err } = await supabase.from("consents").insert({ user_id: user!.id, document: "offres_whatsapp", version: LEGAL_VERSION, granted: next });
    if (err) { setOffres(!next); setError(t.errPrefs); }
    else flash(next ? t.okOffersOn : t.okOffersOff);
  };

  const deleteAccount = async () => {
    setDeleting(true);
    const supabase = createClient();
    const { error: err } = await supabase.rpc("delete_my_account");
    if (err) { setDeleting(false); setError(t.errDelete); return; }
    track("account_deleted");
    await supabase.auth.signOut();
    router.replace(lp("/"));
  };

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "var(--border)", borderTopColor: "var(--green)" }} /></div>;
  }
  if (!isSupabaseConfigured || !profile) {
    return <p className="text-center py-20" style={{ color: "var(--fg-mute)" }}>{t.unavailable}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-4">
        <div>
          <div className="text-sm font-semibold mb-3" style={{ color: "var(--fg)" }}>{t.label}</div>
          <h1 className="font-display font-bold tracking-tight leading-[1.05]" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--fg)" }}>
            {t.hello} <span className="text-gradient">{profile.prenom}</span>
          </h1>
        </div>
        <Link href="/questionnaire" className="group self-start inline-flex items-center gap-3 pl-2 pr-6 py-2 text-sm font-semibold rounded-full btn-primary">
          <span className="w-8 h-8 rounded-full flex items-center justify-center dot-green"><ArrowRight size={15} strokeWidth={2.5} /></span>
          {t.newAnalysis}
        </Link>
      </div>

      {(notice || error) && (
        <div role="status" className="rounded-2xl px-4 py-3 text-sm animate-fade-in"
          style={error ? { background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }
                       : { background: "rgba(46,201,122,0.10)", border: "1px solid rgba(46,201,122,0.3)", color: "var(--green-ink)" }}>
          {error || notice}
        </div>
      )}

      {/* Analyses */}
      <section className="rounded-[28px] p-5 sm:p-7" style={card}>
        <h2 className="font-display font-bold text-xl mb-4" style={{ color: "var(--fg)" }}>{t.analyses}</h2>
        {analyses.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--fg-mute)" }}>
            {t.noAnalyses} <Link href="/questionnaire" className="font-semibold underline underline-offset-4" style={{ color: "var(--blue)" }}>{t.firstAnalysis}</Link>
          </p>
        ) : (
          <ul className="space-y-2">{analyses.map(a => <AnalysisItem key={a.id} a={a} />)}</ul>
        )}
      </section>

      {/* Infos */}
      <section className="rounded-[28px] p-5 sm:p-7" style={card}>
        <h2 className="font-display font-bold text-xl mb-4" style={{ color: "var(--fg)" }}>{t.info}</h2>
        <form onSubmit={saveProfile} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="prenom" className="block text-xs font-semibold mb-2" style={{ color: "var(--fg-mute)" }}>{t.firstName}</label>
              <input id="prenom" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="nom" className="block text-xs font-semibold mb-2" style={{ color: "var(--fg-mute)" }}>{t.lastName}</label>
              <input id="nom" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
          </div>
          <div>
            <label htmlFor="profession" className="block text-xs font-semibold mb-2" style={{ color: "var(--fg-mute)" }}>{t.profession}</label>
            <div className="relative">
              <select id="profession" value={profession} onChange={e => setProfession(e.target.value)}
                className={`${inputClass} appearance-none pr-10 cursor-pointer`} style={{ ...inputStyle, color: profession ? "var(--fg)" : "var(--fg-faint)" }}>
                <option value="" disabled>{t.professionPh}</option>
                {PROFESSIONS.map(k => <option key={k} value={k}>{tr.professions[k]}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--fg-faint)" }} />
            </div>
            {profession === "autre" && (
              <input value={professionOther} onChange={e => setProfessionOther(e.target.value)} maxLength={80}
                placeholder={t.professionOtherPh} aria-label={t.professionOtherPh} className={`${inputClass} mt-2`} style={inputStyle} />
            )}
          </div>
          <div>
            <label htmlFor="country" className="block text-xs font-semibold mb-2" style={{ color: "var(--fg-mute)" }}>{t.country}</label>
            <div className="relative">
              <select id="country" value={country} onChange={e => setCountry(e.target.value)} autoComplete="country"
                className={`${inputClass} appearance-none pr-10 cursor-pointer`} style={inputStyle}>
                {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--fg-faint)" }} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "var(--fg-mute)" }}>{t.email}</label>
              <input value={profile.email} disabled className={`${inputClass} opacity-60`} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="whatsapp" className="block text-xs font-semibold mb-2" style={{ color: "var(--fg-mute)" }}>{t.whatsapp}</label>
              <div className="flex rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--input-bg)" }}>
                <span className="flex items-center px-4 text-sm" style={{ borderRight: "1px solid var(--border)", color: "var(--fg-mute)" }}>+{dial}</span>
                <input id="whatsapp" inputMode="tel" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                  className="flex-1 min-w-0 px-4 py-3 text-sm bg-transparent focus:outline-none" style={{ color: "var(--fg)" }} />
              </div>
            </div>
          </div>
          <button type="submit" disabled={saving} className="px-6 py-3 text-sm font-semibold rounded-full btn-primary disabled:opacity-40">
            {saving ? t.saving : t.save}
          </button>
        </form>
      </section>

      {/* Préférences */}
      <section className="rounded-[28px] p-5 sm:p-7" style={card}>
        <h2 className="font-display font-bold text-xl mb-4" style={{ color: "var(--fg)" }}>{t.prefs}</h2>
        <button onClick={toggleOffres} role="switch" aria-checked={offres} className="w-full flex items-center justify-between gap-4 text-left">
          <span className="text-sm" style={{ color: "var(--fg-soft)" }}>{t.offersToggle}</span>
          <span className="relative w-12 h-7 rounded-full flex-shrink-0 transition-colors duration-500 ease-smooth" style={{ background: offres ? "var(--green)" : "var(--border)" }}>
            <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white flex items-center justify-center transition-transform duration-500 ease-smooth shadow"
              style={{ transform: offres ? "translateX(20px)" : "none" }}>
              {offres && <Check size={11} strokeWidth={3.5} color="#0E8A50" />}
            </span>
          </span>
        </button>
        <p className="text-xs mt-3" style={{ color: "var(--fg-faint)" }}>
          {t.legal[0]}<Link href="/conditions" className="underline underline-offset-2">{t.legal[1]}</Link>{t.legal[2]}<Link href="/confidentialite" className="underline underline-offset-2">{t.legal[3]}</Link>{t.legal[4]}
        </p>
      </section>

      {/* Sécurité */}
      <section className="rounded-[28px] p-5 sm:p-7" style={card}>
        <h2 className="font-display font-bold text-xl mb-4" style={{ color: "var(--fg)" }}>{t.security}</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/nouveau-mot-de-passe" className="px-5 py-3 text-sm font-semibold rounded-full btn-ghost">{t.changePassword}</Link>
          <form action="/auth/signout" method="post">
            <button className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-full btn-ghost"><LogOut size={15} /> {t.logout}</button>
          </form>
        </div>

        <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
          <h3 className="text-sm font-bold mb-1 text-red-500">{t.deleteTitle}</h3>
          <p className="text-xs mb-4 leading-relaxed" style={{ color: "var(--fg-mute)" }}>
            {t.deleteText} <strong style={{ color: "var(--fg)" }}>{t.deleteWord}</strong> {t.deleteText2}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input value={confirmDelete} onChange={e => setConfirmDelete(e.target.value)} placeholder={t.deleteWord}
              className={`${inputClass} sm:max-w-[220px]`} style={inputStyle} aria-label={t.deleteTitle} />
            <button onClick={deleteAccount} disabled={confirmDelete !== t.deleteWord || deleting}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-full text-white bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity">
              <Trash2 size={15} /> {deleting ? t.deleting : t.deleteButton}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AccountPage() {
  return (
    <main>
      <Navbar />
      <section className="px-5 sm:px-10 pt-32 pb-24" style={{ background: "var(--bg)" }}>
        <div className="max-w-3xl mx-auto animate-fade-up">
          <Suspense><AccountContent /></Suspense>
        </div>
      </section>
      <Footer />
    </main>
  );
}
