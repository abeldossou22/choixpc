// Version des documents juridiques : à changer à chaque modification des CGU ou de la politique.
// Elle est enregistrée avec chaque consentement dans Supabase.
export const LEGAL_VERSION = "2026-10-01";
export const LEGAL_UPDATED_AT = "1er octobre 2026";
export const LEGAL_UPDATED = { fr: "1er octobre 2026", en: "1 October 2026" } as const;

// ⚠️ Informations à compléter par HevelCare avant la mise en ligne.
export const COMPANY = {
  name: "HevelCare",
  legalForm: "[forme juridique à compléter]",
  rccm: "[numéro RCCM à compléter]",
  ifu: "[numéro IFU à compléter]",
  address: "[adresse du siège à compléter], Cotonou, Bénin",
  email: "[email de contact à compléter]",
  privacyEmail: "[email dédié aux données personnelles à compléter]",
  whatsapp: "+229 99 08 02 02",
  website: "hevelcare.com",
  director: "[nom du responsable de la publication à compléter]",
};

export const COMPANY_EN: typeof COMPANY = {
  ...COMPANY,
  legalForm: "[legal form to be completed]",
  rccm: "[RCCM number to be completed]",
  ifu: "[IFU number to be completed]",
  address: "[registered office address to be completed], Cotonou, Benin",
  email: "[contact email to be completed]",
  privacyEmail: "[personal-data email to be completed]",
  director: "[name of publication manager to be completed]",
};

export const CONSENTS = [
  { id: "cgu",              required: true  },
  { id: "confidentialite",  required: true  },
  { id: "contact_whatsapp", required: true  },
  { id: "offres_whatsapp",  required: false },
] as const;

export type ConsentId = typeof CONSENTS[number]["id"];
