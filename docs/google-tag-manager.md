# Google Tag Manager — configuration pour ChoixPC

Le site charge votre conteneur GTM et lui envoie des événements. C'est dans GTM que vous branchez
Google Analytics 4 (ou tout autre outil). Aucune donnée personnelle (nom, email, téléphone, texte libre)
n'est envoyée.

## 1. Activer GTM sur le site

Dans `.env.local` (et dans les variables d'environnement de l'hébergeur en production) :

```
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

Puis redémarrez le serveur. Tant que la variable est vide, rien n'est chargé et aucun bandeau ne s'affiche.

## 2. Consentement (déjà géré par le site)

Le site utilise le **Consent Mode v2** de Google :

- par défaut, tout est **refusé** (`analytics_storage: denied`) : aucun cookie de mesure n'est déposé ;
- si le visiteur clique sur **Accepter**, le site envoie `consent update → granted` ;
- la publicité (`ad_storage`, `ad_user_data`, `ad_personalization`) reste toujours refusée.

Dans GTM : **Admin → Paramètres du conteneur → Activer l'aperçu du consentement**.
Les balises Google (GA4) respectent alors automatiquement ce choix, sans réglage supplémentaire.

## 3. Brancher Google Analytics 4

1. **Balises → Nouvelle → Balise Google** : ID de balise = votre `G-XXXXXXXXXX`. Déclencheur : *Initialization – All Pages*.
2. **Balises → Nouvelle → Google Analytics : événement GA4** :
   - ID de mesure : `G-XXXXXXXXXX`
   - Nom de l'événement : `{{Event}}` (variable intégrée « Event »)
   - Déclencheur : **Événement personnalisé**, nom = l'expression ci-dessous, case « Utiliser la correspondance d'expression régulière » cochée :

   ```
   ^(sign_up|sign_up_error|login|questionnaire_step|analysis_start|analysis_success|analysis_error|analysis_restart|pdf_download|whatsapp_click|shoda_click|cta_click|language_switch|account_deleted)$
   ```
3. Pour récupérer les paramètres (étape, système, budget…), créez une **variable de couche de données** par paramètre
   utile (ex. `step`, `os`, `mode`, `section`) et ajoutez-les dans « Paramètres d'événement » de la balise.
4. **Aperçu** (bouton en haut à droite de GTM) pour vérifier, puis **Envoyer** pour publier.

Les pages vues sont comptées par GA4 lui-même (mesure améliorée, « modifications de l'historique du navigateur ») :
ne créez pas de balise `page_view` en plus, sinon elles seront comptées deux fois.

## 4. Événements envoyés par le site

| Événement | Quand | Paramètres |
|---|---|---|
| `page_context` | à chaque page | `locale`, `page_path` |
| `consent_choice` | choix dans le bandeau | `consent` (granted / denied) |
| `cta_click` | clic sur un bouton menant à l'inscription | `section` |
| `sign_up` | compte créé | `method`, `country`, `profession`, `locale`, `offers_opt_in` |
| `sign_up_error` | inscription refusée | — |
| `login` | connexion réussie | `method` |
| `questionnaire_step` | étape 1 ou 2 validée | `step`, `os`, `budget_min`, `budget_max`, `usages`, `preferences`, `brand`, `has_offers`, `locale` |
| `analysis_start` | analyse lancée | idem + `offers_count` |
| `analysis_success` | recommandation affichée | idem + `mode`, `duration_s` |
| `analysis_error` | analyse en échec | idem + `duration_s` |
| `analysis_restart` | clic sur « Recommencer » | — |
| `pdf_download` | clic sur « Télécharger en PDF » | — |
| `whatsapp_click` | clic sur un lien WhatsApp | `section` |
| `shoda_click` | clic sur un lien SHODA | `section` |
| `language_switch` | changement de langue | `to` |
| `account_deleted` | compte supprimé | — |

`usages` est une liste séparée par `|` (ex. `etudes|bureautique`). `os` vaut `windows`, `mac` ou `both`.

## 5. Entonnoir conseillé dans GA4

`cta_click` → `sign_up` → `questionnaire_step` (1) → `questionnaire_step` (2) → `analysis_start` → `analysis_success` → `whatsapp_click`.

Marquez `sign_up` et `analysis_success` comme **événements clés** dans GA4 (Admin → Événements).
