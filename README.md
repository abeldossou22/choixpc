# ChoixPC

Aide au choix d'un ordinateur selon les usages, le budget et le pays — par [HevelCare](https://hevelcare.com).
Site bilingue (français à la racine, anglais sous `/en`).

## Démarrer

```bash
npm install
cp .env.example .env.local   # puis renseigner les valeurs
npm run dev
```

## Variables d'environnement

| Variable | Rôle |
|---|---|
| `AI_PROVIDER` | `gemini` (défaut), `anthropic` ou `openai` |
| `GEMINI_API_KEY` / `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` | Clé du fournisseur choisi (secrète) |
| `GEMINI_MODEL` / `ANTHROPIC_MODEL` / `OPENAI_MODEL` | Facultatif : modèle à utiliser |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Comptes et base de données |
| `NEXT_PUBLIC_SITE_URL` | Adresse publique du site (SEO, sitemap) |
| `NEXT_PUBLIC_GTM_ID` | Conteneur Google Tag Manager (facultatif) |
| `RESEND_API_KEY`, `SEND_EMAIL_HOOK_SECRET`, `EMAIL_FROM` | Emails de compte avec Resend (voir `docs/emails-resend.md`) |

## Base de données

Exécuter dans l'ordre les scripts de `supabase/migrations/` (SQL Editor de Supabase).
Modèles d'emails : `supabase/email-templates/`.

## Repères

- Textes : `lib/i18n/fr.ts` et `lib/i18n/en.ts`
- Textes juridiques : `content/`, informations de la société : `lib/legal.ts`
- Suivi d'audience : `docs/google-tag-manager.md`
- Emails : `docs/emails-resend.md`
