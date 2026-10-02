import { createHmac, timingSafeEqual } from "crypto";

// Envoi des emails de compte (confirmation, mot de passe oublié…) avec Resend.
// Supabase appelle /api/auth/send-email (« Send Email Hook ») ; ce fichier vérifie l'appel et rédige l'email.

export type EmailLocale = "fr" | "en";
export type EmailAction = "signup" | "recovery" | "magiclink" | "invite" | "email_change" | "email" | "reauthentication" | string;

/**
 * Vérifie que l'appel vient bien de Supabase (signature « Standard Webhooks »).
 * secret : valeur fournie par Supabase, du type "v1,whsec_xxxxx".
 */
export function verifyHookSignature(body: string, headers: Headers, secret: string): boolean {
  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signatures = headers.get("webhook-signature");
  if (!id || !timestamp || !signatures) return false;

  // Refuse les appels vieux de plus de 5 minutes (rejeu).
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const key = Buffer.from(secret.replace(/^v1,/, "").replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest();

  return signatures.split(" ").some(part => {
    const [version, sig] = part.split(",");
    if (version !== "v1" || !sig) return false;
    const given = Buffer.from(sig, "base64");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}

const COPY: Record<EmailLocale, Record<"signup" | "recovery" | "generic", { subject: string; title: string; text: string; button: string; ignore: string }>> = {
  fr: {
    signup: {
      subject: "Confirmez votre compte ChoixPC",
      title: "Bienvenue sur ChoixPC 👋",
      text: "Merci pour votre inscription. Confirmez votre adresse email pour accéder à vos recommandations.",
      button: "Confirmer mon email",
      ignore: "Vous n'êtes pas à l'origine de cette inscription ? Ignorez simplement cet email.",
    },
    recovery: {
      subject: "Nouveau mot de passe ChoixPC",
      title: "Nouveau mot de passe",
      text: "Vous avez demandé à changer votre mot de passe ChoixPC. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.",
      button: "Choisir un nouveau mot de passe",
      ignore: "Vous n'avez rien demandé ? Ignorez cet email, votre mot de passe reste inchangé.",
    },
    generic: {
      subject: "Votre lien ChoixPC",
      title: "Votre lien ChoixPC",
      text: "Cliquez sur le bouton ci-dessous pour continuer.",
      button: "Continuer",
      ignore: "Vous n'avez rien demandé ? Ignorez simplement cet email.",
    },
  },
  en: {
    signup: {
      subject: "Confirm your ChoixPC account",
      title: "Welcome to ChoixPC 👋",
      text: "Thanks for signing up. Confirm your email address to access your recommendations.",
      button: "Confirm my email",
      ignore: "Didn't sign up? Just ignore this email.",
    },
    recovery: {
      subject: "New ChoixPC password",
      title: "New password",
      text: "You asked to change your ChoixPC password. Click the button below to choose a new one.",
      button: "Choose a new password",
      ignore: "Didn't ask for this? Ignore this email, your password stays the same.",
    },
    generic: {
      subject: "Your ChoixPC link",
      title: "Your ChoixPC link",
      text: "Click the button below to continue.",
      button: "Continue",
      ignore: "Didn't ask for this? Just ignore this email.",
    },
  },
};

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export function buildAuthEmail(action: EmailAction, locale: EmailLocale, link: string, firstName?: string) {
  const kind = action === "signup" ? "signup" : action === "recovery" ? "recovery" : "generic";
  const c = COPY[locale][kind];
  const hello = firstName ? (locale === "fr" ? `Bonjour ${escapeHtml(firstName)},` : `Hello ${escapeHtml(firstName)},`) : "";
  const safeLink = escapeHtml(link);
  const fallback = locale === "fr" ? "Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :" : "If the button doesn't work, copy this link into your browser:";

  const html = `<!doctype html><html lang="${locale}"><body style="margin:0;padding:0;background:#F7F8FC">
<div style="font-family:Arial,Helvetica,sans-serif;background:#F7F8FC;padding:32px 16px;color:#0F1026">
  <div style="max-width:480px;margin:0 auto;background:#FFFFFF;border-radius:24px;padding:32px;border:1px solid #E8EBF5">
    <div style="width:44px;height:44px;border-radius:12px;background:#5B67F0;background:linear-gradient(135deg,#5B67F0,#2EC97A);margin-bottom:20px"></div>
    <h1 style="font-size:22px;margin:0 0 12px;color:#0F1026">${c.title}</h1>
    ${hello ? `<p style="font-size:15px;line-height:1.6;color:#4A4B63;margin:0 0 8px">${hello}</p>` : ""}
    <p style="font-size:15px;line-height:1.6;color:#4A4B63;margin:0 0 24px">${c.text}</p>
    <a href="${safeLink}" style="display:inline-block;background:#2EC97A;color:#0F1026;text-decoration:none;font-weight:bold;padding:14px 28px;border-radius:999px">${c.button}</a>
    <p style="font-size:12px;line-height:1.6;color:#8A8BA3;margin:24px 0 0">${fallback}<br><a href="${safeLink}" style="color:#5B67F0;word-break:break-all">${safeLink}</a></p>
    <p style="font-size:12px;line-height:1.6;color:#8A8BA3;margin:20px 0 0">${c.ignore}<br>HevelCare · WhatsApp +229 99 08 02 02</p>
  </div>
</div></body></html>`;

  const text = `${c.title}\n\n${hello ? hello + "\n" : ""}${c.text}\n\n${c.button} : ${link}\n\n${c.ignore}\nHevelCare · WhatsApp +229 99 08 02 02`;
  return { subject: c.subject, html, text };
}

/** Envoie un email via l'API Resend. Renvoie le message d'erreur de Resend en cas d'échec. */
export async function sendWithResend(to: string, email: { subject: string; html: string; text: string }): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      // Sans domaine vérifié, Resend n'autorise que l'adresse de test onboarding@resend.dev (et uniquement vers votre propre email).
      from: process.env.EMAIL_FROM || "ChoixPC <onboarding@resend.dev>",
      to: [to],
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (res.ok) return { ok: true };
  const detail = await res.text().catch(() => "");
  return { ok: false, status: res.status, message: detail.slice(0, 300) };
}
