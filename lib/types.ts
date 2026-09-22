export type UsageCategory =
  | "etudes"
  | "bureautique"
  | "internet"
  | "video"
  | "jeux"
  | "programmation"
  | "design"
  | "entreprise";

export interface BudgetRange {
  label: string;
  min: number;
  max: number | null;
}

export interface ComputerProposal {
  id: string;
  label: string; // "Proposition 1", "Proposition 2"...
  rawText: string; // texte collé par l'utilisateur
}

export interface QuestionnaireData {
  // Step 1 — Usage
  usages: UsageCategory[];
  freeText: string;

  // Step 2 — Budget
  budgetMin: number;
  budgetMax: number | null;
  budgetLabel: string;

  // Step 3 — Vendor
  hasVendor: boolean | null;
  proposals: ComputerProposal[];
}

// ─── AI Response ───────────────────────────────────────────────
export interface ProposalAnalysis {
  proposalId: string;
  label: string;
  verdict: "recommande" | "acceptable" | "deconseille";
  verdictLabel: string;
  score: number; // 0–100
  specs: {
    processor?: string;
    ram?: string;
    storage?: string;
    screen?: string;
    price?: string;
    condition?: string;
  };
  pros: string[];
  cons: string[];
  explanation: string;
}

export interface GeneratedConfig {
  processor: string;
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
  // vendor mode
  analyses?: ProposalAnalysis[];
  bestProposalId?: string;
  // generated mode
  generatedConfig?: GeneratedConfig;
  // common
  generalAdvice: string;
  redFlags?: string[];
}
