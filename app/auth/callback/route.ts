import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isLocale, localePath, defaultLocale } from "@/lib/i18n/config";

// Lien de confirmation d'email : échange le code contre une session puis redirige.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/questionnaire";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/questionnaire";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${safeNext}`);
  }
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  const locale = isLocale(cookie) ? cookie : defaultLocale;
  return NextResponse.redirect(`${origin}${localePath(locale, "/login")}?erreur=lien`);
}
