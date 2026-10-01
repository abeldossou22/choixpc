import { NextRequest, NextResponse } from "next/server";
import { analyzeComputer, AnalysisConfigError, AnalysisBusyError } from "@/lib/ai";
import type { QuestionnaireData } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getDictionary } from "@/lib/i18n";
import { countryName, isCountry } from "@/lib/countries";
import { PROFESSION_PROMPT, isProfession, isPreference, isBrand } from "@/lib/profile-options";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let t = getDictionary("fr").api;
  try {
    const data: QuestionnaireData = await req.json();
    data.locale = data.locale === "en" ? "en" : "fr";
    t = getDictionary(data.locale).api;

    const supabase = isSupabaseConfigured ? createClient() : null;
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;
    if (supabase && !user) {
      return NextResponse.json({ error: t.loginRequired }, { status: 401 });
    }

    if (!data.usages && !data.freeText) {
      return NextResponse.json({ error: t.usagesRequired }, { status: 400 });
    }
    // Le pays est lu dans le profil, jamais dans la requête : il oriente les modèles recommandés.
    data.country = undefined;
    data.profession = undefined;
    data.preferences = Array.isArray(data.preferences) ? data.preferences.filter(isPreference) : [];
    data.brand = isBrand(data.brand) ? data.brand : undefined;
    if (supabase && user) {
      // select("*") : fonctionne même si une migration récente n'a pas encore été exécutée.
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (isCountry(profile?.country)) data.country = countryName(profile.country, "fr");
      const prof: unknown = profile?.profession;
      if (isProfession(prof)) {
        const other = typeof profile?.profession_other === "string" ? profile.profession_other.slice(0, 80) : "";
        data.profession = prof === "autre" ? (other || undefined) : PROFESSION_PROMPT[prof];
      }
    }
    const result = await analyzeComputer(data);

    if (supabase && user) {
      const row = {
        user_id: user.id,
        usages: data.usages,
        free_text: data.freeText || null,
        budget_label: data.budgetLabel,
        budget_min: data.budgetMin,
        budget_max: data.budgetMax,
        has_vendor: data.hasVendor,
        proposals: data.proposals,
        result,
      };
      let { error } = await supabase.from("analyses").insert({ ...row, os: data.os ?? "both", preferences: data.preferences, brand: data.brand ?? null });
      // Colonnes absentes (migration 0005 pas encore exécutée) : on enregistre au moins l'essentiel.
      if (error) ({ error } = await supabase.from("analyses").insert(row));
      // L'utilisateur reçoit son résultat même si l'enregistrement échoue.
      if (error) console.error("[ChoixPC API] Enregistrement de l'analyse :", error.message);
    }

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof AnalysisConfigError) {
      console.error("[ChoixPC API] ⚠️ Configuration :", err.message);
      return NextResponse.json({ error: t.unavailable }, { status: 503 });
    }
    if (err instanceof AnalysisBusyError) {
      console.error("[ChoixPC API] Fournisseur saturé :", err.message);
      return NextResponse.json({ error: t.unavailable }, { status: 503 });
    }
    console.error("[ChoixPC API]", err);
    return NextResponse.json({ error: t.error }, { status: 500 });
  }
}
