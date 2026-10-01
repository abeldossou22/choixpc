// Suivi d'audience via Google Tag Manager.
// Le site pousse des événements dans window.dataLayer ; GTM décide quoi en faire (GA4, etc.).
// ⚠️ Ne jamais y mettre de donnée personnelle (nom, email, téléphone, texte libre).

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";
export const CONSENT_KEY = "choixpc-consent";
export type Consent = "granted" | "denied";

type Params = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window { dataLayer?: unknown[] }
}

/** Envoie un événement à GTM. Sans effet si GTM n'est pas configuré. */
export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

export function getConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/** Enregistre le choix de l'utilisateur et l'applique immédiatement (Consent Mode v2). */
export function setConsent(value: Consent) {
  try { localStorage.setItem(CONSENT_KEY, value); } catch { /* stockage indisponible : le choix vaut pour cette page */ }
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // Même forme que gtag("consent", "update", …) : GTM attend l'objet « arguments ».
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (function gtag(..._args: unknown[]) { window.dataLayer!.push(arguments); })("consent", "update", {
    analytics_storage: value,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  track("consent_choice", { consent: value });
  window.dispatchEvent(new Event("choixpc:consent"));
}

/**
 * Script exécuté avant GTM : tout est refusé par défaut, puis le choix déjà enregistré est appliqué.
 * Tant que l'utilisateur n'a pas accepté, aucun cookie de mesure n'est déposé.
 */
export const CONSENT_BOOTSTRAP = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 });
try { if (localStorage.getItem('${CONSENT_KEY}') === 'granted') gtag('consent', 'update', { analytics_storage: 'granted' }); } catch (e) {}
`;
