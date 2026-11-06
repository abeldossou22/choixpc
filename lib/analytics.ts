// Suivi d'audience via Google Tag Manager.
// Le site pousse des événements dans window.dataLayer ; GTM décide quoi en faire (GA4, etc.).
// ⚠️ Ne jamais y mettre de donnée personnelle (nom, email, téléphone, texte libre).

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";
/** Pixel Meta (Facebook) : chargé seulement après accord, pour mesurer l'effet des publicités. */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "2001795997165336";
/** Vrai si un outil de mesure est configuré : le bandeau de consentement doit alors s'afficher. */
export const MEASUREMENT_ON = Boolean(GTM_ID || META_PIXEL_ID);
export const CONSENT_KEY = "choixpc-consent";
export type Consent = "granted" | "denied";

type Params = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window { dataLayer?: unknown[]; fbq?: (...args: unknown[]) => void; _fbq?: unknown }
}

// Événements du site transmis au pixel Meta, sous leur nom standard Meta. Aucun paramètre n'est envoyé.
const META_EVENTS: Record<string, string> = {
  sign_up: "CompleteRegistration",
  analysis_success: "Lead",
  whatsapp_click: "Contact",
};

/** Envoie un événement à GTM, et au pixel Meta s'il est chargé (donc accepté). */
export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
  const meta = META_EVENTS[event];
  if (meta && window.fbq) window.fbq("track", meta);
}

/** Charge le pixel Meta une seule fois. À n'appeler qu'après accord de l'utilisateur. */
export function loadMetaPixel() {
  if (typeof window === "undefined" || !META_PIXEL_ID) return;
  if (window.fbq) { window.fbq("consent", "grant"); return; }
  type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue: unknown[]; push?: unknown; loaded?: boolean; version?: string };
  const n = function (...args: unknown[]) { if (n.callMethod) n.callMethod(...args); else n.queue.push(args); } as Fbq;
  n.queue = []; n.push = n; n.loaded = true; n.version = "2.0";
  window.fbq = n; window._fbq = n;
  const s = document.createElement("script");
  s.async = true; s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  window.fbq("init", META_PIXEL_ID);
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
  if (value === "granted") loadMetaPixel();
  else window.fbq?.("consent", "revoke");
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
