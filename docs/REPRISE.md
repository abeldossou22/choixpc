# Reprise du projet — état au 26 octobre 2026

## Installer le projet sur un nouvel ordinateur

Sur Windows, dans PowerShell, une commande à la fois (sur Mac : `cp` au lieu de `Copy-Item`) :

```bash
git clone https://github.com/abeldossou22/choixpc.git choixpc
```

```bash
cd choixpc
```

```bash
npm install
```

```powershell
Copy-Item .env.example .env.local
```

Remplir ensuite `.env.local` (ce fichier n'est jamais envoyé sur GitHub) :

| Variable | Où trouver la valeur |
|---|---|
| `AI_PROVIDER` | `gemini` |
| `GEMINI_API_KEY` | aistudio.google.com → API keys (ou Vercel → Settings → Environment Variables) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://lqcvvrcdgqnhnffzrtqs.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → clé `anon` |
| `NEXT_PUBLIC_GTM_ID` | `GTM-KLT3G5CR` |

`ANTHROPIC_API_KEY`, `OPENAI_API_KEY` et `NEXT_PUBLIC_SITE_URL` peuvent rester vides en local.
Les variables Resend (`RESEND_API_KEY`, `SEND_EMAIL_HOOK_SECRET`, `EMAIL_FROM`) ne servent que sur Vercel.

Puis `npm run dev` et ouvrir http://localhost:3000.

## Ce qui est fait

- Site bilingue (FR / EN), responsive, thème clair/sombre, couleurs HevelCare, photos libres de droits.
- Comptes Supabase : inscription (profil, pays, WhatsApp, consentements), connexion, mot de passe oublié,
  espace « Mon compte », suppression de compte.
- Questionnaire : usages, système (Windows / Mac / les deux), préférences, budget, offres reçues.
- Recommandations selon le pays, le profil et les préférences, avec carte graphique ; propositions Windows et Mac.
- SEO (métadonnées par langue, sitemap, robots, données structurées, image de partage), favicon.
- CGU et politique de confidentialité en français et en anglais.
- Google Tag Manager avec bandeau de consentement ; 16 événements envoyés.
- Envoi des emails de compte avec Resend (code prêt).
- En ligne sur Vercel : https://choixpc.vercel.app
- **Liaison avec hevelerp** (22-24 octobre) : à la confirmation de son email, chaque inscrit part vers
  hevelerp → Clients comme prospect, origine « ChoixPC » (migrations 0006 et 0007, extension pg_net ;
  la clé se crée dans hevelerp → Mon entreprise → Sites partenaires et s'enregistre dans
  `private.hevelerp_link`). Testé en vrai : réponse 200.
- Migrations 0001 à 0007 exécutées dans Supabase (0004 et 0005 rattrapées le 24 octobre).
- Numéro WhatsApp : +229 01 29 25 58 58, défini une seule fois dans `lib/legal.ts`.
- Politique de confidentialité : mention du partage avec hevelstore (version du 22 octobre 2026).

## Ce qui reste à faire

### Par Abel (dans ses comptes)

- [ ] **Migration 0008** : exécuter `supabase/migrations/0008_feedbacks.sql` dans Supabase (avis après les résultats).
- [ ] **GTM** : ajouter `feedback_submit` et `store_click` à l'expression du déclencheur (`docs/google-tag-manager.md`), puis publier.
- [ ] **Supabase → Authentication → Emails** : recoller les modèles de `supabase/email-templates/` (nouveau numéro).
- [ ] **Anciens inscrits** : les prévenir du partage avec hevelstore, puis les envoyer à hevelerp
      (`select private.send_to_hevelerp(id) from auth.users where email_confirmed_at is not null;`).
- [ ] **Supabase → URL Configuration** : Site URL `https://choixpc.vercel.app` + Redirect URL `https://choixpc.vercel.app/auth/callback`.
- [ ] **Google Analytics** : créer la propriété GA4, puis les deux balises dans GTM et publier
      (`docs/google-tag-manager.md`). Au dernier contrôle, le conteneur publié était vide.
- [ ] **Nom de domaine** : une fois ajouté dans Vercel, mettre à jour Supabase, Resend, Analytics et Search Console.
- [ ] **Informations légales** : compléter `lib/legal.ts` (forme juridique, RCCM, IFU, adresse, emails) — les CGU
      affichent encore des « [à compléter] ». Faire relire les textes par un juriste, et vérifier la déclaration auprès de l'APDP.
- [ ] **Témoignages** : ils sont inventés (noms fictifs, photos de banque d'images). À remplacer par de vrais avis ou à retirer.

### Points techniques à surveiller

- **Durée des analyses** : jusqu'à ~1 minute quand Gemini est saturé (offre gratuite). Vérifier que Vercel ne coupe
  pas les analyses en production ; sinon activer la facturation sur la clé Gemini ou changer de fournisseur.
- **Monnaie** : les budgets sont en FCFA pour tous les pays. À adapter si le site vise le Nigeria, le Ghana, etc.
- **Barre d'adresse de la maquette du hero** : affiche `choixpc.hevelcare.com` en dur (`components/Hero.tsx`).
- **Analyse complète en production** : jamais testée de bout en bout par l'assistant (il faut être connecté).

### Idées proposées, pas encore décidées

- Connexion par code WhatsApp/SMS au lieu du mot de passe.
- Mini tableau de bord HevelCare (liste des inscrits et de leurs demandes).
- Vraie fiche PDF de recommandation (le bouton actuel imprime la page).
- Héberger les photos avec le site plutôt que de les charger depuis Unsplash.
