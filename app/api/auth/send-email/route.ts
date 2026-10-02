import { NextResponse, type NextRequest } from "next/server";
import { buildAuthEmail, sendWithResend, verifyHookSignature, type EmailLocale } from "@/lib/email";
import { SUPABASE_URL } from "@/lib/supabase/config";

export const runtime = "nodejs";

// Appelé par Supabase à chaque email de compte à envoyer (Authentication → Hooks → Send Email).
// Le site rédige l'email (français ou anglais) et l'envoie avec Resend.
const fail = (status: number, message: string) => {
  console.error("[ChoixPC email]", message);
  return NextResponse.json({ error: { http_code: status, message } }, { status });
};

export async function POST(req: NextRequest) {
  const secret = process.env.SEND_EMAIL_HOOK_SECRET;
  if (!secret || !process.env.RESEND_API_KEY) return fail(503, "Envoi d'emails non configuré (RESEND_API_KEY ou SEND_EMAIL_HOOK_SECRET manquant).");

  const body = await req.text();
  if (!verifyHookSignature(body, req.headers, secret)) return fail(401, "Signature invalide.");

  let payload: {
    user?: { email?: string; new_email?: string; user_metadata?: { locale?: string; prenom?: string } };
    email_data?: { token_hash?: string; token_hash_new?: string; redirect_to?: string; email_action_type?: string; site_url?: string };
  };
  try { payload = JSON.parse(body); } catch { return fail(400, "Requête illisible."); }

  const { user, email_data: data } = payload;
  const action = data?.email_action_type ?? "";
  const to = action === "email_change" && user?.new_email ? user.new_email : user?.email;
  // Changement d'email : Supabase fournit le jeton de la nouvelle adresse dans token_hash_new.
  const tokenHash = action === "email_change" && data?.token_hash_new ? data.token_hash_new : data?.token_hash;
  if (!to || !tokenHash || !action) return fail(400, "Données d'email incomplètes.");

  const locale: EmailLocale = user?.user_metadata?.locale === "en" ? "en" : "fr";
  const link = `${SUPABASE_URL}/auth/v1/verify?token=${encodeURIComponent(tokenHash)}&type=${encodeURIComponent(action)}&redirect_to=${encodeURIComponent(data?.redirect_to || data?.site_url || "")}`;

  const result = await sendWithResend(to, buildAuthEmail(action, locale, link, user?.user_metadata?.prenom));
  if (!result.ok) return fail(502, `Resend a refusé l'envoi (${result.status}) : ${result.message}`);

  return NextResponse.json({});
}
