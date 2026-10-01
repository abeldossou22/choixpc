export type UsageCategory = "etudes" | "bureautique" | "internet" | "video" | "jeux" | "programmation" | "design" | "entreprise";

export type OsPreference = "windows" | "mac" | "both";

export interface ComputerProposal {
  id: string;
  label: string;
  rawText: string;
}

export interface QuestionnaireData {
  usages: UsageCategory[];
  freeText: string;
  budgetMin: number;
  budgetMax: number | null;
  budgetLabel: string;
  hasVendor: boolean | null;
  proposals: ComputerProposal[];
  /** Système souhaité : Windows, Mac, ou les deux pour comparer. */
  os?: OsPreference;
  /** Langue dans laquelle rédiger la recommandation. */
  locale?: "fr" | "en";
  /** Nom du pays de l'utilisateur (renseigné côté serveur depuis son profil). */
  country?: string;
}

export interface ProposalAnalysis {
  proposalId: string;
  label: string;
  verdict: "recommande" | "acceptable" | "deconseille";
  verdictLabel: string;
  score: number;
  specs: { processor?: string; graphics?: string; ram?: string; storage?: string; screen?: string; price?: string; condition?: string; };
  pros: string[];
  cons: string[];
  explanation: string;
}

export interface GeneratedConfig {
  /** Système de cette proposition. */
  system?: "windows" | "mac";
  /** false si le budget ne permet pas cette option (expliqué dans explanation). */
  withinBudget?: boolean;
  processor: string;
  graphics?: string;
  ram: string;
  storage: string;
  screen: string;
  estimatedPrice: string;
  brand?: string;
  explanation: string;
  priorities: string[];
  whatToAskVendor: string[];
}

export interface AIAnalysisResult {
  mode: "vendor" | "generated";
  summary: string;
  analyses?: ProposalAnalysis[];
  bestProposalId?: string;
  generatedConfig?: GeneratedConfig;
  /** Une proposition par système demandé (Windows et/ou Mac). */
  generatedConfigs?: GeneratedConfig[];
  generalAdvice: string;
  redFlags?: string[];
}
