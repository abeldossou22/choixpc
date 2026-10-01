import Link from "next/link";
import type { LegalSection } from "@/components/LegalPage";
import { COMPANY_EN as COMPANY } from "@/lib/legal";

// English translation of the terms of use. The French version is the reference text.
export const intro = <p>These terms explain how to use ChoixPC, what we provide and what we expect from you. We have written them as simply as possible. This is a translation: if there is any difference, the French version prevails.</p>;

export const sections: LegalSection[] = [
  {
    id: "purpose", title: "Purpose",
    body: <>
      <p>These Terms of use ("Terms") govern access to and use of <strong>ChoixPC</strong>, a service that helps users choose a computer suited to how they will use it and to their budget.</p>
      <p>By creating an account, you confirm that you have read and accepted these Terms. If you do not accept them, you must not use the service.</p>
    </>,
  },
  {
    id: "publisher", title: "Publisher of the service",
    body: <>
      <p>ChoixPC is published by <strong>{COMPANY.name}</strong>, {COMPANY.legalForm}, registered in the trade register (RCCM) under number {COMPANY.rccm}, tax ID (IFU) {COMPANY.ifu}, with its registered office at {COMPANY.address}.</p>
      <ul>
        <li>Publication manager: {COMPANY.director}</li>
        <li>Email: {COMPANY.email}</li>
        <li>WhatsApp: {COMPANY.whatsapp}</li>
      </ul>
    </>,
  },
  {
    id: "access", title: "Access to the service and account",
    body: <>
      <p>The service is available free of charge to any adult. If you are under 18, you must have the consent of a parent or guardian before creating an account.</p>
      <p>To use ChoixPC, you create an account with your first name, email, WhatsApp number and a password. You agree to provide accurate information and keep it up to date.</p>
      <p>You are responsible for keeping your password confidential and for any activity carried out from your account. Let us know without delay of any unauthorised use.</p>
    </>,
  },
  {
    id: "service", title: "Description of the service",
    body: <>
      <p>ChoixPC lets you:</p>
      <ul>
        <li>describe how you will use your computer and your budget in FCFA;</li>
        <li>compare up to three computer offers you have received, or get a suitable configuration if you have no offer yet;</li>
        <li>receive a recommendation explained simply (score, strengths, points to consider, questions to ask your seller);</li>
        <li>be supported by the HevelCare team on WhatsApp, if you wish.</li>
      </ul>
      <p>Recommendations are generated automatically by an analysis tool, based on the information you provide. They may be complemented by a conversation with the HevelCare team.</p>
    </>,
  },
  {
    id: "recommendations", title: "Nature of the recommendations",
    body: <>
      <p>ChoixPC's recommendations are <strong>guidance only</strong>. They are neither an offer for sale nor a guarantee about a product, a price or a seller.</p>
      <ul>
        <li>Prices shown are estimates for the local market and may vary.</li>
        <li>The quality of a recommendation depends on the accuracy of the information you provide (uses, budget, content of the offers).</li>
        <li>The purchase decision is yours. HevelCare is not a party to transactions between you and a seller.</li>
      </ul>
      <p>We advise you to check the computer's specifications at the time of purchase, for example with the SHODA tool.</p>
    </>,
  },
  {
    id: "commitments", title: "Your commitments",
    body: <>
      <p>By using ChoixPC, you agree to:</p>
      <ul>
        <li>use the service fairly and lawfully;</li>
        <li>include in the offers only the information useful for the analysis (description of the computer, price, condition) and not include other people's personal data, such as a seller's name or number;</li>
        <li>not attempt to disrupt the service, extract its content by automated means or access other users' data.</li>
      </ul>
    </>,
  },
  {
    id: "shoda", title: "SHODA tool",
    body: <p>ChoixPC links to SHODA, a free tool for checking a computer's specifications. SHODA is a separate service: its use is governed by its own terms.</p>,
  },
  {
    id: "free", title: "Free of charge",
    body: <p>Access to ChoixPC is free, with no subscription and no credit card. If paid services were offered in the future, they would be subject to specific terms, accepted separately.</p>,
  },
  {
    id: "ip", title: "Intellectual property",
    body: <p>The ChoixPC name, the logo, texts, visuals and elements of the site belong to {COMPANY.name} or its partners. Any reproduction without written permission is prohibited. You are free to keep, print and share with your seller the recommendations given to you.</p>,
  },
  {
    id: "data", title: "Personal data",
    body: <p>How we process your personal data is described in our <Link href="/en/confidentialite">Privacy policy</Link>, which you accept separately when you sign up.</p>,
  },
  {
    id: "liability", title: "Liability",
    body: <>
      <p>HevelCare does its best to provide a reliable and available service, but cannot guarantee permanent availability or the absence of errors in the recommendations.</p>
      <p>To the extent permitted by law, HevelCare cannot be held liable for a purchase choice, a dispute with a seller, or damage resulting from inaccurate information provided by the user.</p>
    </>,
  },
  {
    id: "suspension", title: "Suspension and deletion of the account",
    body: <>
      <p>You can delete your account at any time from your account page, or by writing to {COMPANY.privacyEmail} or on WhatsApp at {COMPANY.whatsapp}.</p>
      <p>HevelCare may suspend or delete an account in the event of a serious breach of these Terms, after informing you where possible.</p>
    </>,
  },
  {
    id: "changes", title: "Changes to the Terms",
    body: <p>We may update these Terms. In the event of a significant change, you will be informed and asked to agree again. The version in force and its date are shown at the top of this page.</p>,
  },
  {
    id: "law", title: "Governing law and disputes",
    body: <p>These Terms are governed by the law of Benin. In the event of a dispute, we invite you to contact us first to find an amicable solution. Failing that, the competent courts of Cotonou will have jurisdiction.</p>,
  },
  {
    id: "contact", title: "Contact",
    body: <p>For any question: {COMPANY.email} or WhatsApp {COMPANY.whatsapp}.</p>,
  },
];
