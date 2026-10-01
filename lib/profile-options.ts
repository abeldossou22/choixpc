// Options partagées entre l'inscription, « Mon compte », le questionnaire et le moteur d'analyse.

/** Profils proposés à l'inscription. "autre" ouvre un champ libre. */
export const PROFESSIONS = [
  "etudiant", "enseignant", "comptable", "banquier", "architecte", "ingenieur",
  "developpeur", "designer", "sante", "juriste", "commercant", "administratif", "autre",
] as const;
export type Profession = typeof PROFESSIONS[number];
export const isProfession = (v: unknown): v is Profession => typeof v === "string" && (PROFESSIONS as readonly string[]).includes(v);

/** Préférences cochables à l'étape 1 du questionnaire. */
export const PREFERENCES = [
  "neuf", "occasion", "leger", "autonomie", "grand_ecran", "compact", "clavier_retro", "tactile", "robuste",
] as const;
export type Preference = typeof PREFERENCES[number];
export const isPreference = (v: unknown): v is Preference => typeof v === "string" && (PREFERENCES as readonly string[]).includes(v);

export const BRANDS = ["HP", "Dell", "Lenovo", "Asus", "Acer", "Apple", "Samsung", "MSI", "Microsoft", "Huawei"] as const;
export const isBrand = (v: unknown): v is string => typeof v === "string" && (BRANDS as readonly string[]).includes(v);

// Libellés français envoyés au moteur d'analyse (le prompt est rédigé en français).
export const PROFESSION_PROMPT: Record<Profession, string> = {
  etudiant: "Étudiant(e)", enseignant: "Enseignant(e)", comptable: "Comptable", banquier: "Banquier / finance",
  architecte: "Architecte", ingenieur: "Ingénieur(e)", developpeur: "Développeur / informaticien", designer: "Designer / graphiste",
  sante: "Professionnel(le) de santé", juriste: "Juriste / avocat(e)", commercant: "Commerçant(e) / entrepreneur(e)",
  administratif: "Secrétaire / administratif", autre: "Autre",
};
export const PREFERENCE_PROMPT: Record<Preference, string> = {
  neuf: "ordinateur neuf uniquement", occasion: "occasion ou reconditionné accepté", leger: "léger et facile à transporter",
  autonomie: "grande autonomie de batterie", grand_ecran: "grand écran (15 pouces et plus)", compact: "format compact (13-14 pouces)",
  clavier_retro: "clavier rétroéclairé", tactile: "écran tactile", robuste: "robuste et durable",
};
