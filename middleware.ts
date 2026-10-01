import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "@/lib/supabase/config";
import { defaultLocale, localePath, splitLocale, type Locale } from "@/lib/i18n/config";

const PROTECTED = ["/questionnaire", "/compte", "/nouveau-mot-de-passe"];
const GUEST_ONLY = ["/register", "/login", "/mot-de-passe-oublie"];
const LOCALE_COOKIE = "NEXT_LOCALE";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Langue ────────────────────────────────────────────────────────────────
  // Français à la racine (/), anglais sous /en. "/fr/…" est redirigé vers la version sans préfixe.
  if (pathname === "/fr" || pathname.startsWith("/fr/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/fr/, "") || "/";
    return NextResponse.redirect(url, 308);
  }
  const { locale, path } = splitLocale(pathname);

  const redirectTo = (target: string, search = "") => {
    const url = request.nextUrl.clone();
    url.pathname = localePath(locale, target);
    url.search = search;
    return NextResponse.redirect(url);
  };

  // Les pages françaises n'ont pas de préfixe dans l'URL : on les réécrit en interne vers /fr/…
  const makeResponse = () => {
    if (locale !== defaultLocale) return NextResponse.next({ request });
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url, { request });
  };
  let response = makeResponse();

  // ─── Session Supabase + pages protégées ────────────────────────────────────
  const needsAuth = PROTECTED.some(p => path.startsWith(p)) || GUEST_ONLY.some(p => path.startsWith(p));
  if (isSupabaseConfigured && needsAuth) {
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (toSet) => {
          toSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = makeResponse();
          toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user && PROTECTED.some(p => path.startsWith(p))) {
      return redirectTo("/login", `?next=${encodeURIComponent(localePath(locale, path))}`);
    }
    if (user && GUEST_ONLY.some(p => path.startsWith(p))) {
      return redirectTo("/questionnaire");
    }
  }

  // Mémorise la langue affichée (utilisée par /auth/* et à la prochaine visite).
  if (request.cookies.get(LOCALE_COOKIE)?.value !== locale) {
    response.cookies.set(LOCALE_COOKIE, locale satisfies Locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  return response;
}

export const config = {
  // Tout sauf l'API, les routes d'authentification, les fichiers internes de Next et les fichiers statiques.
  matcher: ["/((?!api|auth|og|_next|.*\\.[\\w]+$).*)"],
};
