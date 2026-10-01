import Link from "next/link";
import type { LegalSection } from "@/components/LegalPage";
import { COMPANY } from "@/lib/legal";

export const intro = <p>Ces conditions expliquent comment utiliser ChoixPC, ce que nous vous apportons et ce que nous attendons de vous. Nous les avons écrites le plus simplement possible.</p>;

export const sections: LegalSection[] = [
  {
    id: "objet", title: "Objet",
    body: <>
      <p>Les présentes Conditions générales d'utilisation (« CGU ») encadrent l'accès et l'utilisation du service <strong>ChoixPC</strong>, qui aide les utilisateurs à choisir un ordinateur adapté à leurs usages et à leur budget.</p>
      <p>En créant un compte, vous confirmez avoir lu et accepté les présentes CGU. Si vous ne les acceptez pas, vous ne devez pas utiliser le service.</p>
    </>,
  },
  {
    id: "editeur", title: "Éditeur du service",
    body: <>
      <p>ChoixPC est édité par <strong>{COMPANY.name}</strong>, {COMPANY.legalForm}, immatriculée au RCCM sous le numéro {COMPANY.rccm}, IFU {COMPANY.ifu}, dont le siège est situé {COMPANY.address}.</p>
      <ul>
        <li>Responsable de la publication : {COMPANY.director}</li>
        <li>Email : {COMPANY.email}</li>
        <li>WhatsApp : {COMPANY.whatsapp}</li>
      </ul>
    </>,
  },
  {
    id: "acces", title: "Accès au service et compte",
    body: <>
      <p>Le service est accessible gratuitement à toute personne majeure. Si vous avez moins de 18 ans, vous devez obtenir l'accord d'un parent ou tuteur avant de créer un compte.</p>
      <p>Pour utiliser ChoixPC, vous créez un compte en indiquant votre prénom, votre email, votre numéro WhatsApp et un mot de passe. Vous vous engagez à fournir des informations exactes et à les tenir à jour.</p>
      <p>Vous êtes responsable de la confidentialité de votre mot de passe et de toute activité réalisée depuis votre compte. Prévenez-nous sans délai en cas d'utilisation non autorisée.</p>
    </>,
  },
  {
    id: "service", title: "Description du service",
    body: <>
      <p>ChoixPC vous permet de :</p>
      <ul>
        <li>décrire vos usages et votre budget en FCFA ;</li>
        <li>comparer jusqu'à trois offres d'ordinateurs que vous avez reçues, ou obtenir une configuration adaptée si vous n'avez pas encore d'offre ;</li>
        <li>recevoir une recommandation expliquée simplement (note, points forts, points à considérer, questions à poser à votre vendeur) ;</li>
        <li>être accompagné par l'équipe HevelCare sur WhatsApp, si vous le souhaitez.</li>
      </ul>
      <p>Les recommandations sont générées automatiquement par un outil d'analyse, à partir des informations que vous fournissez. Elles peuvent être complétées par un échange avec l'équipe HevelCare.</p>
    </>,
  },
  {
    id: "recommandations", title: "Nature des recommandations",
    body: <>
      <p>Les recommandations de ChoixPC sont des <strong>conseils indicatifs</strong>. Elles ne constituent ni une offre de vente, ni une garantie sur un produit, un prix ou un vendeur.</p>
      <ul>
        <li>Les prix indiqués sont des estimations du marché local et peuvent varier.</li>
        <li>La qualité d'une recommandation dépend de l'exactitude des informations que vous transmettez (usages, budget, contenu des offres).</li>
        <li>La décision d'achat vous appartient. HevelCare n'est pas partie aux transactions conclues entre vous et un vendeur.</li>
      </ul>
      <p>Nous vous conseillons de vérifier les caractéristiques de l'ordinateur au moment de l'achat, par exemple avec l'outil SHODA.</p>
    </>,
  },
  {
    id: "engagements", title: "Vos engagements",
    body: <>
      <p>En utilisant ChoixPC, vous vous engagez à :</p>
      <ul>
        <li>utiliser le service de manière loyale et conforme à la loi ;</li>
        <li>ne transmettre dans les offres que les informations utiles à l'analyse (description de l'ordinateur, prix, état) et ne pas y inclure de données personnelles de tiers, comme le numéro ou le nom d'un vendeur ;</li>
        <li>ne pas tenter de perturber le service, d'en extraire le contenu de façon automatisée ou d'accéder aux données d'autres utilisateurs.</li>
      </ul>
    </>,
  },
  {
    id: "shoda", title: "Outil SHODA",
    body: <p>ChoixPC propose un lien vers SHODA, un outil gratuit de vérification des caractéristiques d'un ordinateur. SHODA est un service distinct : son utilisation est régie par ses propres conditions.</p>,
  },
  {
    id: "gratuite", title: "Gratuité",
    body: <p>L'accès à ChoixPC est gratuit, sans abonnement et sans carte bancaire. Si des services payants étaient proposés à l'avenir, ils feraient l'objet de conditions spécifiques, acceptées séparément.</p>,
  },
  {
    id: "propriete", title: "Propriété intellectuelle",
    body: <p>Le nom ChoixPC, le logo, les textes, visuels et éléments du site sont la propriété de {COMPANY.name} ou de ses partenaires. Toute reproduction sans autorisation écrite est interdite. Vous pouvez librement conserver, imprimer et partager avec votre vendeur les recommandations qui vous sont remises.</p>,
  },
  {
    id: "donnees", title: "Données personnelles",
    body: <p>Le traitement de vos données personnelles est décrit dans notre <Link href="/confidentialite">Politique de confidentialité</Link>, que vous acceptez séparément lors de votre inscription.</p>,
  },
  {
    id: "responsabilite", title: "Responsabilité",
    body: <>
      <p>HevelCare met tout en œuvre pour fournir un service fiable et disponible, sans pouvoir garantir une disponibilité permanente ni l'absence d'erreur dans les recommandations.</p>
      <p>Dans les limites permises par la loi, la responsabilité de HevelCare ne saurait être engagée pour un choix d'achat, un litige avec un vendeur, ou un dommage résultant d'informations inexactes transmises par l'utilisateur.</p>
    </>,
  },
  {
    id: "suspension", title: "Suspension et suppression du compte",
    body: <>
      <p>Vous pouvez supprimer votre compte à tout moment depuis votre espace « Mon compte », ou en écrivant à {COMPANY.privacyEmail} ou sur WhatsApp au {COMPANY.whatsapp}.</p>
      <p>HevelCare peut suspendre ou supprimer un compte en cas de manquement grave aux présentes CGU, après vous en avoir informé lorsque c'est possible.</p>
    </>,
  },
  {
    id: "modification", title: "Modification des CGU",
    body: <p>Nous pouvons faire évoluer les présentes CGU. En cas de modification importante, vous en serez informé et votre accord vous sera à nouveau demandé. La version en vigueur et sa date figurent en haut de cette page.</p>,
  },
  {
    id: "droit", title: "Droit applicable et litiges",
    body: <p>Les présentes CGU sont soumises au droit béninois. En cas de différend, nous vous invitons à nous contacter d'abord pour trouver une solution amiable. À défaut, les juridictions compétentes de Cotonou seront saisies.</p>,
  },
  {
    id: "contact", title: "Contact",
    body: <p>Pour toute question : {COMPANY.email} ou WhatsApp {COMPANY.whatsapp}.</p>,
  },
];
