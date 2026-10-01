import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isLocale, localePath, defaultLocale } from "@/lib/i18n/config";

export async function POST(request: NextRequest) {
  if (isSupabaseConfigured) await createClient().auth.signOut();
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  const locale = isLocale(cookie) ? cookie : defaultLocale;
  return NextResponse.redirect(new URL(localePath(locale, "/"), request.url), { status: 303 });
}
