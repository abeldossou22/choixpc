# ChoixPC — règles du projet

Site Next.js 14 (app router) de HevelCare qui aide à choisir un ordinateur. En ligne : https://choixpc.vercel.app
Dépôt : https://github.com/abeldossou22/choixpc — chaque push sur `main` redéploie sur Vercel.

## Règles fixées par le propriétaire (Abel)

- **Jamais le mot « IA »** (ni « AI ») dans les textes visibles par l'utilisateur. Les pages juridiques parlent
  d'« analyse automatisée ».
- **Ton** : on aide l'utilisateur à choisir. Jamais de discours contre les vendeurs (« arnaque », « se faire avoir »…).
- **Pas de mention « Afrique de l'Ouest » / « Bénin »** dans les textes marketing (retirées volontairement).
  Le pays de l'utilisateur est collecté à l'inscription et sert à adapter les recommandations.
- **Bilingue** : français à la racine, anglais sous `/en`. Tout texte visible va dans `lib/i18n/fr.ts` ET
  `lib/i18n/en.ts`, jamais en dur dans un composant. Le français s'affiche par défaut pour tout le monde
  (pas de redirection selon la langue du navigateur).
- **Couleurs HevelCare uniquement** : vert `#2EC97A` (actions), bleu `#5B67F0` (interactif, dégradés),
  jaune `#F5A623` (attention), blanc. Texte sur bouton vert : `#0F1026`. La mise en page s'inspire
  d'open-design.ai, pas ses couleurs.
- **Police** : Creato Display (fichiers locaux dans `public/fonts`).
- **Thème** : suit l'appareil ; le bouton bascule seulement clair ↔ sombre.
- Répondre à Abel **en français**, simplement, sans jargon.

## Repères techniques

- Pages sous `app/[locale]/` ; `middleware.ts` gère la langue et les pages protégées.
- Comptes et données : Supabase (`lib/supabase/`, migrations dans `supabase/migrations/`, à exécuter dans l'ordre).
- Moteur d'analyse : `lib/ai.ts` (Gemini par défaut, modèles de secours, délais maximum).
- Emails de compte : Resend via `app/api/auth/send-email` (voir `docs/emails-resend.md`).
- Suivi : Google Tag Manager, `lib/analytics.ts` (voir `docs/google-tag-manager.md`). Aucune donnée personnelle dans les événements.
- Tester sans compte : `NEXT_DIST_DIR=.next-test NEXT_PUBLIC_SUPABASE_URL="" NEXT_PUBLIC_SUPABASE_ANON_KEY="" npx next dev -p 3100`
  (puis supprimer `.next-test` et la ligne ajoutée dans `tsconfig.json`).
- Vérifier avant de pousser : `npx tsc --noEmit` et un build (`NEXT_DIST_DIR=.next-build npx next build`).

État d'avancement et tâches en attente : `docs/REPRISE.md`.
