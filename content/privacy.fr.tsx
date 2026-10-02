import type { LegalSection } from "@/components/LegalPage";
import { COMPANY } from "@/lib/legal";

export const intro = <p>Vos données vous appartiennent. Cette page explique, simplement, quelles informations nous collectons, pourquoi, avec qui elles sont partagées et comment exercer vos droits.</p>;

export const sections: LegalSection[] = [
  {
    id: "responsable", title: "Responsable du traitement",
    body: <>
      <p>Le responsable du traitement de vos données est <strong>{COMPANY.name}</strong>, {COMPANY.legalForm}, {COMPANY.address}.</p>
      <p>Pour toute question relative à vos données : <strong>{COMPANY.privacyEmail}</strong> ou WhatsApp {COMPANY.whatsapp}.</p>
      <p>Les traitements décrits ici respectent la loi n° 2017-20 du 20 avril 2018 portant Code du numérique en République du Bénin, notamment son livre consacré à la protection des données à caractère personnel.</p>
    </>,
  },
  {
    id: "donnees", title: "Données collectées",
    body: <>
      <ul>
        <li><strong>Compte</strong> : prénom, nom (facultatif), adresse email, profil (métier), pays, numéro WhatsApp, mot de passe (stocké sous forme chiffrée, nous n'y avons jamais accès), langue préférée.</li>
        <li><strong>Questionnaire</strong> : vos usages, le système et les préférences choisis, votre description libre, votre tranche de budget, les offres d'ordinateurs que vous collez, et la recommandation obtenue.</li>
        <li><strong>Consentements</strong> : les documents acceptés, leur version et la date d'acceptation.</li>
        <li><strong>Données techniques</strong> : cookies de connexion nécessaires au maintien de votre session, et vos préférences de thème (clair ou sombre) et de langue.</li>
      </ul>
      <p>Nous ne collectons pas de données bancaires. Merci de ne pas inclure de données personnelles de tiers (nom ou numéro d'un vendeur) dans les offres que vous transmettez.</p>
    </>,
  },
  {
    id: "finalites", title: "Pourquoi nous utilisons vos données",
    body: <>
      <ul>
        <li><strong>Vous fournir vos recommandations</strong> et conserver votre historique — sur la base de votre acceptation des CGU.</li>
        <li><strong>Vous recontacter sur WhatsApp au sujet de votre demande</strong> pour finaliser votre choix — sur la base de votre consentement.</li>
        <li><strong>Vous envoyer des conseils et bons plans</strong> sur WhatsApp — uniquement si vous l'avez accepté (case facultative).</li>
        <li><strong>Prouver votre consentement</strong> et respecter nos obligations légales.</li>
        <li><strong>Améliorer le service</strong> à partir de statistiques agrégées, sans vous identifier.</li>
      </ul>
      <p>Nous ne vendons jamais vos données.</p>
    </>,
  },
  {
    id: "destinataires", title: "Qui a accès à vos données",
    body: <>
      <ul>
        <li><strong>L'équipe HevelCare</strong>, pour le suivi de votre demande.</li>
        <li><strong>Supabase</strong>, notre hébergeur de base de données et d'authentification.</li>
        <li><strong>Notre prestataire d'analyse automatisée de texte</strong> (Google, OpenAI ou Anthropic selon la configuration du service) reçoit le contenu de votre questionnaire — usages, budget et offres — afin de générer la recommandation. Votre nom, votre email et votre numéro ne lui sont pas transmis.</li>
        <li><strong>Notre hébergeur web</strong>, pour la mise à disposition du site.</li>
        <li><strong>Resend</strong>, notre service d'envoi d'emails, qui reçoit votre adresse email pour vous envoyer les messages liés à votre compte.</li>
        <li><strong>Google</strong> (Google Analytics et Google Tag Manager), pour la mesure d'audience, uniquement si vous l'avez acceptée.</li>
      </ul>
      <p>Ces prestataires agissent selon nos instructions et ne peuvent pas utiliser vos données pour leur propre compte.</p>
    </>,
  },
  {
    id: "transferts", title: "Transferts hors du Bénin",
    body: <p>Certains de nos prestataires hébergent les données hors du Bénin (par exemple dans l'Union européenne ou aux États-Unis). Ces transferts sont encadrés par des garanties contractuelles et réalisés dans le respect des formalités prévues par le Code du numérique auprès de l'Autorité de Protection des Données à caractère Personnel (APDP).</p>,
  },
  {
    id: "conservation", title: "Durée de conservation",
    body: <ul>
      <li><strong>Compte et analyses</strong> : tant que votre compte est actif, puis 3 ans après votre dernière connexion. Ils sont ensuite supprimés.</li>
      <li><strong>Preuves de consentement</strong> : 5 ans après la fin de la relation, pour répondre à nos obligations légales.</li>
      <li><strong>Suppression de compte</strong> : vos données sont effacées dans un délai de 30 jours après votre demande, sauf obligation légale de conservation.</li>
    </ul>,
  },
  {
    id: "droits", title: "Vos droits",
    body: <>
      <p>Vous disposez à tout moment des droits suivants :</p>
      <ul>
        <li>accéder à vos données et en obtenir une copie ;</li>
        <li>les faire corriger ou compléter ;</li>
        <li>demander leur suppression ;</li>
        <li>vous opposer à leur traitement pour un motif légitime ;</li>
        <li>retirer votre consentement, notamment aux messages WhatsApp, sans que cela n'affecte les traitements déjà réalisés.</li>
      </ul>
      <p>Pour exercer vos droits, écrivez à <strong>{COMPANY.privacyEmail}</strong> ou sur WhatsApp au {COMPANY.whatsapp}. Nous répondons dans un délai d'un mois. Vous pouvez aussi modifier vos informations, changer vos préférences et supprimer votre compte vous-même depuis votre espace « Mon compte ».</p>
      <p>Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir l'<strong>APDP</strong> (Autorité de Protection des Données à caractère Personnel du Bénin).</p>
    </>,
  },
  {
    id: "securite", title: "Sécurité",
    body: <p>Vos données sont hébergées chez des prestataires reconnus, transmises via une connexion chiffrée (HTTPS) et protégées par des règles d'accès strictes : chaque utilisateur ne peut consulter que ses propres informations. Les mots de passe ne sont jamais stockés en clair.</p>,
  },
  {
    id: "cookies", title: "Cookies",
    body: <p>ChoixPC utilise des cookies strictement nécessaires : ceux qui maintiennent votre connexion et celui qui mémorise votre langue. Avec votre accord uniquement, nous utilisons aussi des cookies de mesure d'audience (Google Analytics, via Google Tag Manager) pour savoir quelles pages sont consultées et où le parcours peut être amélioré. Ces statistiques ne contiennent ni votre nom, ni votre email, ni votre numéro. Vous pouvez accepter, refuser ou changer d'avis à tout moment grâce au lien « Cookies » en bas de chaque page. Aucun cookie publicitaire n'est déposé. Votre préférence de thème est enregistrée dans le stockage local de votre navigateur.</p>,
  },
  {
    id: "modification", title: "Modification de cette politique",
    body: <p>Nous pouvons mettre à jour cette politique. En cas de changement important, vous en serez informé et votre accord vous sera demandé à nouveau lorsque la loi l'exige.</p>,
  },
];
