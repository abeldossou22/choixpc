# ChoixPC — Guide de démarrage

Un outil IA de conseil pour choisir son ordinateur, développé avec Next.js 14, Tailwind CSS et l'API Claude (Anthropic) ou OpenAI.

---

## 🚀 Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Copier le fichier d'environnement
cp .env.local .env.local
```

## ⚙️ Configuration de l'IA

Édite le fichier `.env.local` :

```env
# Choisir le provider IA : "anthropic" ou "openai"
AI_PROVIDER=anthropic

# Si tu utilises Claude (Anthropic) :
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxx

# Si tu utilises GPT-4o (OpenAI) :
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

## ▶️ Lancement en développement

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

## 🏗️ Build production

```bash
npm run build
npm start
```

## 📁 Structure du projet

```
choixpc/
├── app/
│   ├── layout.tsx            # Root layout + métadonnées SEO
│   ├── page.tsx              # Landing page (Hero, HowItWorks, TwoPaths, CTA)
│   ├── globals.css           # Styles globaux + Tailwind
│   ├── questionnaire/
│   │   └── page.tsx          # Questionnaire multi-étapes (client)
│   └── api/
│       └── analyze/
│           └── route.ts      # API Route POST — appel IA
│
├── components/
│   ├── Navbar.tsx            # Navigation sticky + responsive
│   ├── Hero.tsx              # Hero animé avec mot rotatif
│   ├── HowItWorks.tsx        # Section "4 étapes"
│   ├── TwoPaths.tsx          # Section "Avec/sans vendeur"
│   ├── Footer.tsx            # Pied de page
│   └── Questionnaire/
│       ├── StepUsage.tsx     # Étape 1 — Usages (chips + texte libre)
│       ├── StepBudget.tsx    # Étape 2 — Budget en FCFA
│       ├── StepVendor.tsx    # Étape 3 — Propositions vendeur
│       └── StepResult.tsx    # Étape 4 — Résultat IA
│
├── lib/
│   ├── ai.ts                 # Wrapper Claude + OpenAI (switcher via .env)
│   ├── types.ts              # Types TypeScript partagés
│   └── utils.ts              # cn() helper Tailwind
│
├── .env.local                # Variables d'environnement (à ne pas committer)
├── tailwind.config.ts        # Config Tailwind + couleurs ChoixPC
└── next.config.js
```

## 🎨 Charte graphique

| Couleur       | Hex       | Usage                        |
|---------------|-----------|------------------------------|
| Vert          | `#2EC97A` | Couleur principale, CTA      |
| Bleu/violet   | `#5B67F0` | Secondaire, chemin B         |
| Jaune         | `#F5A623` | Accent, soulignement hero    |
| Gris          | `#9CA3AF` | Textes secondaires           |
| Fond          | `#FAFBFC` | Background principal         |
| Sombre        | `#0F1117` | Navbar logo, CTA band        |

## 🔄 Changer de provider IA

Dans `.env.local`, change simplement :
```env
AI_PROVIDER=openai   # pour GPT-4o
AI_PROVIDER=anthropic  # pour Claude (défaut)
```

## 📦 Déploiement sur Vercel

```bash
npm i -g vercel
vercel
```

Ajoute les variables d'environnement dans le dashboard Vercel.
