import type { LegalSection } from "@/components/LegalPage";
import { COMPANY_EN as COMPANY } from "@/lib/legal";

// English translation of the privacy policy. The French version is the reference text.
export const intro = <p>Your data belongs to you. This page explains, simply, what information we collect, why, who it is shared with and how to exercise your rights. This is a translation: if there is any difference, the French version prevails.</p>;

export const sections: LegalSection[] = [
  {
    id: "controller", title: "Data controller",
    body: <>
      <p>The controller of your data is <strong>{COMPANY.name}</strong>, {COMPANY.legalForm}, {COMPANY.address}.</p>
      <p>For any question about your data: <strong>{COMPANY.privacyEmail}</strong> or WhatsApp {COMPANY.whatsapp}.</p>
      <p>The processing described here complies with Law No. 2017-20 of 20 April 2018 establishing the Digital Code of the Republic of Benin, in particular its book on the protection of personal data.</p>
    </>,
  },
  {
    id: "data", title: "Data we collect",
    body: <>
      <ul>
        <li><strong>Account</strong>: first name, last name (optional), email address, profile (occupation), country, WhatsApp number, password (stored in encrypted form; we never have access to it), preferred language.</li>
        <li><strong>Questionnaire</strong>: your uses, the system and preferences you choose, your free-text description, your budget range, the computer offers you paste, and the recommendation you receive.</li>
        <li><strong>Consents</strong>: the documents you accepted, their version and the date of acceptance.</li>
        <li><strong>Technical data</strong>: the sign-in cookies needed to keep your session open, and your theme (light or dark) and language preferences.</li>
      </ul>
      <p>We do not collect any banking data. Please do not include other people's personal data (a seller's name or number) in the offers you send.</p>
    </>,
  },
  {
    id: "purposes", title: "Why we use your data",
    body: <>
      <ul>
        <li><strong>To provide your recommendations</strong> and keep your history — on the basis of your acceptance of the Terms of use.</li>
        <li><strong>To contact you on WhatsApp about your request</strong>, to help you finalise your choice — on the basis of your consent.</li>
        <li><strong>To send you tips and deals</strong> on WhatsApp — only if you agreed to it (optional box).</li>
        <li><strong>To prove your consent</strong> and comply with our legal obligations.</li>
        <li><strong>To improve the service</strong> using aggregated statistics that do not identify you.</li>
      </ul>
      <p>We never sell your data.</p>
    </>,
  },
  {
    id: "recipients", title: "Who has access to your data",
    body: <>
      <ul>
        <li><strong>The HevelCare team</strong>, to follow up on your request.</li>
        <li><strong>Supabase</strong>, our database and authentication host.</li>
        <li><strong>Our automated text analysis provider</strong> (Google, OpenAI or Anthropic depending on how the service is configured) receives the content of your questionnaire — uses, budget and offers — in order to generate the recommendation. Your name, email and phone number are not sent to it.</li>
        <li><strong>Our web host</strong>, to make the site available.</li>
        <li><strong>Google</strong> (Google Analytics and Google Tag Manager), for audience measurement, only if you accepted it.</li>
      </ul>
      <p>These providers act on our instructions and may not use your data for their own purposes.</p>
    </>,
  },
  {
    id: "transfers", title: "Transfers outside Benin",
    body: <p>Some of our providers host data outside Benin (for example in the European Union or the United States). These transfers are covered by contractual safeguards and carried out in compliance with the formalities required by the Digital Code before the Personal Data Protection Authority (APDP).</p>,
  },
  {
    id: "retention", title: "How long we keep your data",
    body: <ul>
      <li><strong>Account and analyses</strong>: for as long as your account is active, then 3 years after your last sign-in. They are then deleted.</li>
      <li><strong>Proof of consent</strong>: 5 years after the end of the relationship, to meet our legal obligations.</li>
      <li><strong>Account deletion</strong>: your data is erased within 30 days of your request, unless the law requires us to keep it.</li>
    </ul>,
  },
  {
    id: "rights", title: "Your rights",
    body: <>
      <p>At any time, you have the right to:</p>
      <ul>
        <li>access your data and obtain a copy;</li>
        <li>have it corrected or completed;</li>
        <li>request its deletion;</li>
        <li>object to its processing on legitimate grounds;</li>
        <li>withdraw your consent, in particular to WhatsApp messages, without affecting processing already carried out.</li>
      </ul>
      <p>To exercise your rights, write to <strong>{COMPANY.privacyEmail}</strong> or on WhatsApp at {COMPANY.whatsapp}. We reply within one month. You can also update your details, change your preferences and delete your account yourself from your account page.</p>
      <p>If you believe your rights are not being respected, you can lodge a complaint with the <strong>APDP</strong> (Personal Data Protection Authority of Benin).</p>
    </>,
  },
  {
    id: "security", title: "Security",
    body: <p>Your data is hosted by recognised providers, transmitted over an encrypted connection (HTTPS) and protected by strict access rules: each user can only see their own information. Passwords are never stored in plain text.</p>,
  },
  {
    id: "cookies", title: "Cookies",
    body: <p>ChoixPC uses strictly necessary cookies: those that keep you signed in and the one that remembers your language. Only with your consent, we also use audience measurement cookies (Google Analytics, via Google Tag Manager) to see which pages are viewed and where the journey can be improved. These statistics contain neither your name, nor your email, nor your phone number. You can accept, decline or change your mind at any time using the "Cookies" link at the bottom of every page. No advertising cookie is set. Your theme preference is saved in your browser's local storage.</p>,
  },
  {
    id: "changes", title: "Changes to this policy",
    body: <p>We may update this policy. In the event of a significant change, you will be informed and asked to agree again where the law requires it.</p>,
  },
];
