# Emails de compte avec Resend (via Vercel)

Les emails de confirmation d'inscription et de mot de passe oublié sont envoyés par le site lui-même,
avec Resend. Supabase prévient le site (« Send Email Hook »), le site rédige l'email en français ou en
anglais et l'envoie.

Fichiers : `app/api/auth/send-email/route.ts` (réception) et `lib/email.ts` (textes et envoi).

## 1. Resend

1. Créez un compte sur resend.com (ou ajoutez l'intégration Resend depuis Vercel → Integrations :
   elle crée la variable `RESEND_API_KEY` toute seule).
2. **Domains → Add Domain** : ajoutez votre domaine et copiez les lignes DNS indiquées chez l'hébergeur
   du domaine. Attendez que le statut passe à « Verified ».
3. **API Keys → Create API Key** (permission « Sending access »).

Sans domaine vérifié, Resend n'envoie que depuis `onboarding@resend.dev` et **uniquement vers l'adresse
email de votre compte Resend**. C'est suffisant pour tester, pas pour de vrais utilisateurs.
Une adresse en `vercel.app` ne peut pas être vérifiée : il faut un vrai nom de domaine.

## 2. Supabase

**Authentication → Hooks → Send Email hook → Enable** :

- Type : **HTTPS**
- URL : `https://choixpc.vercel.app/api/auth/send-email`
- Cliquez sur **Generate secret** et copiez la valeur (elle commence par `v1,whsec_`).

## 3. Vercel

**Settings → Environment Variables**, puis redéployez :

| Variable | Valeur |
|---|---|
| `RESEND_API_KEY` | la clé API Resend (`re_…`) |
| `SEND_EMAIL_HOOK_SECRET` | le secret généré par Supabase (`v1,whsec_…`) |
| `EMAIL_FROM` | `ChoixPC <noreply@votre-domaine.com>` — à ajouter une fois le domaine vérifié |

## 4. Vérifier

Inscrivez-vous sur le site. En cas de problème :

- **Supabase → Authentication → Hooks** affiche l'erreur renvoyée par le site ;
- **Vercel → Logs** : cherchez `[ChoixPC email]` ;
- **Resend → Emails** : liste des envois et de leur statut.

| Erreur | Cause |
|---|---|
| 503 « non configuré » | une des deux variables manque dans Vercel, ou le site n'a pas été redéployé |
| 401 « Signature invalide » | `SEND_EMAIL_HOOK_SECRET` ne correspond pas au secret de Supabase |
| 502 « Resend a refusé » 403 | domaine non vérifié : envoi possible seulement vers l'email du compte Resend |

Si le hook est activé mais que le site ne répond pas, **aucun email ne part**. Pour revenir en arrière,
désactivez simplement le hook dans Supabase.
