import type { QuestionnaireData, AIAnalysisResult } from "./types";

// ─── Prompt builder ─────────────────────────────────────────────
function buildSystemPrompt(): string {
  return `Tu es ChoixPC, un conseiller expert en informatique qui aide les utilisateurs d'Afrique de l'Ouest (principalement au Bénin) à choisir le bon ordinateur.

Tu parles TOUJOURS en français simple, sans jargon technique inutile.
Tu es précis, honnête et bienveillant.
Tu connais bien le marché informatique en Afrique de l'Ouest (prix en FCFA, disponibilité des marques : Lenovo, HP, Dell, Acer, Asus, Samsung).
Tu DOIS répondre UNIQUEMENT avec un objet JSON valide, sans texte avant ou après, sans balises markdown.`;
}

function buildUserPrompt(data: QuestionnaireData): string {
  const usageLabels: Record<string, string> = {
    etudes: "Études / Recherches",
    bureautique: "Bureautique (Word, Excel, emails)",
    internet: "Navigation internet / Réseaux sociaux",
    video: "Vidéo / Streaming / Montage",
    jeux: "Jeux vidéo",
    programmation: "Programmation / Développement",
    design: "Design graphique / Illustrateur",
    entreprise: "Travail en entreprise",
  };

  const usagesList = data.usages.map((u) => usageLabels[u] || u).join(", ");
  const budget = data.budgetMax
    ? `entre ${data.budgetMin.toLocaleString("fr-FR")} et ${data.budgetMax.toLocaleString("fr-FR")} FCFA`
    : `à partir de ${data.budgetMin.toLocaleString("fr-FR")} FCFA`;

  let prompt = `L'utilisateur veut acheter un ordinateur.

USAGES SÉLECTIONNÉS : ${usagesList || "Non précisé"}
DESCRIPTION LIBRE : "${data.freeText || "Aucune description fournie"}"
BUDGET : ${budget}
`;

  if (data.hasVendor && data.proposals.length > 0) {
    prompt += `\nMODE : L'utilisateur a reçu des propositions de son vendeur.\n`;
    data.proposals.forEach((p) => {
      prompt += `\n--- ${p.label} ---\n${p.rawText}\n`;
    });

    prompt += `
Analyse chaque proposition et réponds avec ce JSON exactement :
{
  "mode": "vendor",
  "summary": "Résumé global en 1-2 phrases simples",
  "analyses": [
    {
      "proposalId": "id de la proposition",
      "label": "Proposition X",
      "verdict": "recommande",
      "verdictLabel": "Recommandé",
      "score": 85,
      "specs": {
        "processor": "...",
        "ram": "...",
        "storage": "...",
        "screen": "...",
        "price": "...",
        "condition": "Neuf"
      },
      "pros": ["point fort 1", "point fort 2"],
      "cons": ["point faible 1"],
      "explanation": "Explication simple en 2-3 phrases"
    }
  ],
  "bestProposalId": "id de la meilleure proposition",
  "generalAdvice": "Conseil général en 2-3 phrases simples",
  "redFlags": []
}

Les valeurs possibles pour "verdict" sont UNIQUEMENT : "recommande", "acceptable", "deconseille"`;
  } else {
    prompt += `\nMODE : L'utilisateur n'a pas de vendeur. Génère une configuration idéale.

Réponds avec ce JSON exactement :
{
  "mode": "generated",
  "summary": "Résumé de la config recommandée en 1-2 phrases simples",
  "generatedConfig": {
    "processor": "Nom exact du processeur recommandé",
    "ram": "Quantité et type de RAM",
    "storage": "Type et capacité de stockage",
    "screen": "Taille et résolution recommandées",
    "estimatedPrice": "Fourchette de prix en FCFA",
    "brand": "Marques recommandées (ex: Lenovo, HP, Dell)",
    "explanation": "Explication de ce choix en 3-4 phrases simples",
    "priorities": ["critère le plus important", "second critère"],
    "whatToAskVendor": ["Question 1 à poser au vendeur", "Question 2"]
  },
  "generalAdvice": "Conseil général en 2-3 phrases",
  "redFlags": []
}`;
  }

  return prompt;
}

// ─── Gemini ─────────────────────────────────────────────────────
async function analyzeWithGemini(data: QuestionnaireData): Promise<AIAnalysisResult> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: buildSystemPrompt(),
    generationConfig: {
      responseMimeType: "application/json", // force JSON output
    },
  });

  const result = await model.generateContent(buildUserPrompt(data));
  const text = result.response.text();

  return JSON.parse(text.replace(/```json|```/g, "").trim()) as AIAnalysisResult;
}

// ─── Claude (Anthropic) ─────────────────────────────────────────
async function analyzeWithClaude(data: QuestionnaireData): Promise<AIAnalysisResult> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    system: buildSystemPrompt(),
    messages: [{ role: "user", content: buildUserPrompt(data) }],
  });

  const text = message.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  return JSON.parse(text.replace(/```json|```/g, "").trim()) as AIAnalysisResult;
}

// ─── OpenAI (GPT-4o) ────────────────────────────────────────────
async function analyzeWithOpenAI(data: QuestionnaireData): Promise<AIAnalysisResult> {
  const OpenAI = (await import("openai")).default;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 2000,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: buildUserPrompt(data) },
    ],
  });

  const text = completion.choices[0]?.message?.content ?? "{}";
  return JSON.parse(text) as AIAnalysisResult;
}

// ─── Main export ─────────────────────────────────────────────────
export async function analyzeComputer(data: QuestionnaireData): Promise<AIAnalysisResult> {
  const provider = process.env.AI_PROVIDER ?? "gemini";

  if (provider === "openai") return analyzeWithOpenAI(data);
  if (provider === "anthropic") return analyzeWithClaude(data);
  return analyzeWithGemini(data);
}
