import type { QuestionnaireData, AIAnalysisResult } from "./types";
import { PREFERENCE_PROMPT, isPreference, isBrand } from "./profile-options";
import { getDictionary } from "./i18n";
import { pickStoreItems } from "./hevelstore";

/** Les jeux exigent une carte graphique dédiée : c'est une règle ferme, pas une simple préférence. */
const needsDedicatedGpu = (data: QuestionnaireData) => data.usages.includes("jeux");

const INTEGRATED_GPU = /int[ée]gr[ée]e?|integrated|\biris\b|\buhd\b|\bvega\b|\bapple\b|aucune|\bnone\b|sans carte|non d[ée]di|not dedicated|no dedicated/i;
const DEDICATED_GPU = /nvidia|geforce|\b(rtx|gtx|mx\s?\d)|\brx\s?\d|\barc\s+a\d|d[ée]di[ée]e?|dedicated/i;
/** Lit le champ "graphics" d'une proposition. */
export const hasDedicatedGpu = (graphics?: string) => !!graphics && DEDICATED_GPU.test(graphics) && !INTEGRATED_GPU.test(graphics);

function buildSystemPrompt(locale: "fr" | "en" = "fr"): string {
  const language = locale === "en"
    ? "Tu rédiges TOUTES les valeurs textuelles du JSON en anglais simple (plain English), sans jargon technique inutile, y compris les libellés de caractéristiques (écris \"8 GB\", \"dedicated\", \"integrated\", \"used\", \"new\" et non \"8 Go\", \"dédiée\", \"intégrée\", \"occasion\", \"neuf\"). Les clés du JSON et les valeurs de \"verdict\" et \"system\" restent exactement celles du modèle fourni."
    : "Tu parles TOUJOURS en français simple, sans jargon technique inutile.";
  return `Tu es ChoixPC, un conseiller expert en informatique qui aide les utilisateurs à choisir le bon ordinateur.
${language}
Tu connais bien le marché informatique (prix en FCFA, marques : Lenovo, HP, Dell, Acer, Asus, Samsung).
Ton rôle est d'aider l'utilisateur à faire le bon choix, pas de le mettre en garde contre les vendeurs.
Ton ton est bienveillant, rassurant et pédagogique. N'accuse jamais un vendeur ni ne suppose de mauvaise intention.
Présente les limites d'une offre comme des points à considérer, en expliquant pourquoi elles comptent pour les usages de l'utilisateur.
Formule les points d'attention (redFlags) comme des vérifications utiles à faire, de façon neutre et constructive.
Indique TOUJOURS la carte graphique dans le champ "graphics" : uniquement son nom et son type, sans phrase (ex. "Intel Iris Xe (intégrée)", "NVIDIA RTX 4050 6 Go (dédiée)"). Pour les jeux, le montage vidéo, le design ou la 3D, explique dans "explanation" si une carte dédiée est nécessaire et pourquoi.
Les champs de caractéristiques (processor, graphics, ram, storage, screen, price, estimatedPrice, condition) sont des libellés courts de 8 mots maximum, jamais des phrases : les explications vont dans "explanation". Si une offre ne mentionne pas la carte graphique, déduis-la du processeur quand c'est possible et signale qu'elle est à confirmer auprès du vendeur.
Tu DOIS répondre UNIQUEMENT avec un objet JSON valide, sans texte avant ou après, sans balises markdown.`;
}

function buildUserPrompt(data: QuestionnaireData): string {
  const usageLabels: Record<string, string> = {
    etudes: "Études", bureautique: "Bureautique", internet: "Internet",
    video: "Vidéo / Montage", jeux: "Jeux vidéo", programmation: "Programmation",
    design: "Design graphique", entreprise: "Travail en entreprise",
  };
  const usagesList = data.usages.map(u => usageLabels[u] || u).join(", ");
  const budget = data.budgetMax
    ? `entre ${data.budgetMin.toLocaleString("fr-FR")} et ${data.budgetMax.toLocaleString("fr-FR")} FCFA`
    : `à partir de ${data.budgetMin.toLocaleString("fr-FR")} FCFA`;

  const country = data.country
    ? `PAYS DE L'UTILISATEUR : ${data.country}\nRecommande uniquement des modèles, processeurs et cartes graphiques réellement disponibles à l'achat dans ce pays aujourd'hui (boutiques locales, neuf ou occasion). Évite les générations très récentes qui n'y sont pas encore distribuées : préfère des références éprouvées et faciles à trouver sur place, et tiens compte des prix pratiqués localement.\n`
    : "";

  const gaming = needsDedicatedGpu(data);
  const requestedOs = data.os ?? "both";
  // Aucun Mac n'a de carte graphique dédiée : pour les jeux, on ne propose que Windows.
  const os = gaming ? "windows" : requestedOs;
  const osLine = gaming && requestedOs !== "windows"
    ? "SYSTÈME SOUHAITÉ : Windows, car aucun Mac n'a de carte graphique dédiée. Ne propose aucun Mac et explique ce choix simplement dans \"summary\".\n"
    : os === "mac"
    ? "SYSTÈME SOUHAITÉ : Mac (macOS) uniquement.\n"
    : os === "windows"
      ? "SYSTÈME SOUHAITÉ : Windows uniquement.\n"
      : "SYSTÈME SOUHAITÉ : l'utilisateur veut comparer Windows et Mac.\n";
  const gamingLine = gaming
    ? `RÈGLE ABSOLUE POUR LES JEUX : l'utilisateur joue. Ne propose JAMAIS un ordinateur sans carte graphique dédiée (NVIDIA GeForce ou AMD Radeon RX), même si le budget est serré. Une carte intégrée (Intel UHD, Iris Xe, Radeon intégrée, puce Apple) n'est pas acceptée. Le champ "graphics" doit citer le modèle exact suivi de ${data.locale === "en" ? '"(dedicated)"' : '"(dédiée)"'}.\n`
    : "";
  const retryLine = data.gpuRetry
    ? "ATTENTION : ta réponse précédente proposait un ordinateur sans carte graphique dédiée, ce qui est refusé. Corrige-la.\n"
    : "";

  const profession = data.profession
    ? `PROFIL DE L'UTILISATEUR : ${data.profession}\nTiens compte des logiciels et des habitudes de travail typiques de ce profil (par exemple AutoCAD/Revit/SketchUp pour un architecte, Excel et logiciels comptables avec pavé numérique pour un comptable, logiciels bancaires et sécurité pour un banquier), même s'ils ne sont pas cités dans les usages.\n`
    : "";
  const prefs = (data.preferences ?? []).filter(isPreference).map(p => PREFERENCE_PROMPT[p]);
  const prefsLine = prefs.length || isBrand(data.brand)
    ? `PRÉFÉRENCES : ${[...prefs, isBrand(data.brand) ? `marque préférée ${data.brand}` : ""].filter(Boolean).join(" ; ")}\nRespecte ces préférences autant que le budget le permet. Si l'une d'elles est impossible à satisfaire ou en contradiction avec une autre, dis-le simplement et propose le meilleur compromis.\n`
    : "";

  let prompt = `${country}${profession}${osLine}${gamingLine}${retryLine}${prefsLine}USAGES : ${usagesList || "Non précisé"}\nDESCRIPTION : "${data.freeText || "Aucune"}"\nBUDGET : ${budget}\n`;

  if (data.hasVendor && data.proposals.length > 0) {
    data.proposals.forEach(p => { prompt += `\n--- ${p.label} ---\n${p.rawText}\n`; });
    prompt += `\nAnalyse chaque proposition. Tiens compte du système souhaité : si une offre n'est pas sous ce système, signale-le simplement dans son analyse.
${gaming ? `Une offre sans carte graphique dédiée reçoit le verdict "deconseille", un score de 39 au maximum, et ne peut jamais être "bestProposalId". Si aucune offre n'a de carte dédiée, mets "bestProposalId": null et dis-le dans "summary", avec le type de carte à rechercher.\n` : ""}Réponds avec ce JSON :
{"mode":"vendor","summary":"string","analyses":[{"proposalId":"string","label":"string","verdict":"recommande|acceptable|deconseille","verdictLabel":"string","score":0,"specs":{"processor":"","graphics":"","ram":"","storage":"","screen":"","price":"","condition":""},"pros":[""],"cons":[""],"explanation":"string"}],"bestProposalId":"string|null","generalAdvice":"string","redFlags":[]}`;
  } else {
    const wanted = os === "both" ? ["windows", "mac"] : [os];
    const item = `{"system":"windows|mac","withinBudget":true,"brand":"","processor":"","graphics":"","ram":"","storage":"","screen":"","estimatedPrice":"","explanation":"","priorities":[""],"whatToAskVendor":[""]}`;
    prompt += `\nGénère ${wanted.length === 2 ? "DEUX propositions : une sous Windows puis une sous Mac" : `UNE proposition sous ${os === "mac" ? "Mac" : "Windows"}`}, dans le tableau "generatedConfigs" (valeurs de "system" attendues, dans cet ordre : ${wanted.join(", ")}).
Pour une proposition Mac : "brand" est le modèle Apple précis (ex. "MacBook Air 13 M1"), "processor" la puce Apple (ex. "Apple M1"), "graphics" la partie graphique de la puce (ex. "GPU 7 cœurs (intégré à la puce M1)"). Propose un modèle neuf ou d'occasion/reconditionné selon ce que le budget permet.
Si le budget ne permet pas un Mac convenable, même d'occasion, mets "withinBudget": false, propose quand même le Mac le plus accessible avec son prix réel dans "estimatedPrice", et explique simplement dans "explanation" le budget à prévoir. Ne force jamais une option irréaliste.
Si un usage est mal adapté à un système (par exemple beaucoup de jeux vidéo sur Mac, ou un logiciel qui n'existe que sur un système), dis-le clairement dans "explanation".
${gaming ? `Si le budget ne permet pas un ordinateur avec carte dédiée, même d'occasion, mets "withinBudget": false, propose quand même le moins cher qui en a une, avec son prix réel dans "estimatedPrice", et explique le budget à prévoir.\n` : ""}Dans "summary", dis en une ou deux phrases laquelle des propositions convient le mieux à cet utilisateur et pourquoi.
Réponds avec ce JSON :
{"mode":"generated","summary":"string","generatedConfigs":[${item}],"generalAdvice":"string","redFlags":[]}`;
  }
  if (data.catalog?.length) {
    const lines = data.catalog.map((p, i) => `${i + 1}. ${p.title} (${p.category}) — ${p.price} FCFA`).join("\n");
    prompt += `\n\nBOUTIQUE : voici les équipements disponibles.\n${lines}\nAjoute au JSON la clé "storeItems" : [{"ref":1,"reason":""}]. Choisis au maximum 3 équipements de cette liste réellement utiles à cet utilisateur et à son ordinateur (sac ou sacoche pour le transport, souris, etc.). "ref" est le numéro de l'article dans la liste et "reason" explique en une phrase courte pourquoi il lui sera utile. N'invente jamais d'article. Si rien ne convient, mets un tableau vide. Quand tu parles d'un équipement dans "generalAdvice", reste général : ne cite ni marque ni prix.`;
  }
  return prompt;
}

/** Lit la réponse du modèle en tolérant les petits défauts courants (balises markdown, texte autour, virgules en trop). */
function parseResult(raw: string): AIAnalysisResult {
  let text = raw.replace(/```json|```/g, "").trim();
  const start = text.indexOf("{"), end = text.lastIndexOf("}");
  if (start !== -1 && end > start) text = text.slice(start, end + 1);
  try {
    return JSON.parse(text) as AIAnalysisResult;
  } catch {
    return JSON.parse(text.replace(/,\s*([}\]])/g, "$1")) as AIAnalysisResult;
  }
}

// Modèles essayés dans l'ordre : si le premier est surchargé (503) ou limité (429), on passe au suivant.
const GEMINI_MODELS = [process.env.GEMINI_MODEL || "gemini-flash-latest", "gemini-3.8-flash", "gemini-flash-lite-latest"];
const isOverloaded = (msg: string) => /503|429|500|overloaded|high demand|unavailable|resource.?exhausted|rate limit|timed? ?out|timeout|aborted|fetch failed/i.test(msg);
// Délai maximum par tentative : au-delà, on passe au modèle suivant au lieu de laisser l'utilisateur attendre.
const ATTEMPT_TIMEOUT_MS = 20_000;
// Durée maximale de toute l'analyse, tentatives comprises. Vercel coupe la requête à 60 s avec une page
// d'erreur : on s'arrête avant pour afficher un vrai message (la lecture de la boutique prend jusqu'à 5 s).
const TOTAL_BUDGET_MS = 48_000;
// En dessous, une nouvelle tentative n'a aucune chance d'aboutir.
const MIN_ATTEMPT_MS = 5_000;

/** Le fournisseur est saturé : l'utilisateur peut réessayer dans un instant. */
export class AnalysisBusyError extends Error {}

async function analyzeWithGemini(data: QuestionnaireData, deadline: number): Promise<AIAnalysisResult> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const models = GEMINI_MODELS.filter((m, i, all) => all.indexOf(m) === i);
  let lastError = "";

  for (let round = 0; round < 2; round++) {
    for (const name of models) {
      const remaining = deadline - Date.now();
      if (remaining < MIN_ATTEMPT_MS) throw new AnalysisBusyError(lastError.slice(0, 200));
      try {
        const model = genAI.getGenerativeModel({
          model: name,
          systemInstruction: buildSystemPrompt(data.locale),
          generationConfig: { responseMimeType: "application/json" },
        }, { timeout: Math.min(ATTEMPT_TIMEOUT_MS, remaining) });
        const result = await model.generateContent(buildUserPrompt(data));
        return parseResult(result.response.text());
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
        // Surcharge ou réponse illisible : on tente le modèle suivant. Toute autre erreur remonte.
        if (!isOverloaded(lastError) && !(err instanceof SyntaxError)) throw err;
        console.warn(`[ChoixPC] ${name} indisponible (${lastError.slice(0, 90)}), essai suivant…`);
      }
    }
    await new Promise(r => setTimeout(r, 1500));
  }
  throw new AnalysisBusyError(lastError.slice(0, 200));
}

async function analyzeWithClaude(data: QuestionnaireData, deadline: number): Promise<AIAnalysisResult> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const message = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5", max_tokens: 2000,
    system: buildSystemPrompt(data.locale),
    messages: [{ role: "user", content: buildUserPrompt(data) }],
  }, { timeout: Math.max(deadline - Date.now(), MIN_ATTEMPT_MS), maxRetries: 0 });
  const text = message.content.filter(b => b.type === "text").map(b => (b as { type: "text"; text: string }).text).join("");
  return parseResult(text);
}

async function analyzeWithOpenAI(data: QuestionnaireData, deadline: number): Promise<AIAnalysisResult> {
  const OpenAI = (await import("openai")).default;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o", max_tokens: 2000,
    response_format: { type: "json_object" },
    messages: [{ role: "system", content: buildSystemPrompt(data.locale) }, { role: "user", content: buildUserPrompt(data) }],
  }, { timeout: Math.max(deadline - Date.now(), MIN_ATTEMPT_MS), maxRetries: 0 });
  return parseResult(completion.choices[0]?.message?.content ?? "{}");
}

/** Erreur de configuration (clé absente ou refusée) : à corriger dans .env.local, pas par l'utilisateur. */
export class AnalysisConfigError extends Error {}

const KEY_ENV = { gemini: "GEMINI_API_KEY", anthropic: "ANTHROPIC_API_KEY", openai: "OPENAI_API_KEY" } as const;

export async function analyzeComputer(data: QuestionnaireData): Promise<AIAnalysisResult> {
  const raw = process.env.AI_PROVIDER ?? "gemini";
  const provider = raw === "openai" || raw === "anthropic" ? raw : "gemini";
  if (!process.env[KEY_ENV[provider]]) {
    throw new AnalysisConfigError(`${KEY_ENV[provider]} est vide dans .env.local (AI_PROVIDER=${provider}).`);
  }
  const deadline = Date.now() + TOTAL_BUDGET_MS;
  try {
    let result = normalize(await run(provider, data, deadline), data);
    // Jeux : toutes les propositions ont été écartées faute de carte dédiée. On redemande une fois si le temps le permet.
    if (result.mode === "generated" && !result.generatedConfigs?.length && needsDedicatedGpu(data)) {
      if (deadline - Date.now() < ATTEMPT_TIMEOUT_MS) throw new AnalysisBusyError("Aucune proposition avec carte dédiée.");
      result = normalize(await run(provider, { ...data, gpuRetry: true }, deadline), data);
      if (!result.generatedConfigs?.length) throw new AnalysisBusyError("Aucune proposition avec carte dédiée après la seconde tentative.");
    }
    return { ...result, storeItems: pickStoreItems(result.storeItems, data.catalog ?? []) };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/api key|api_key|authentication|unauthorized|401|403|permission/i.test(msg)) {
      throw new AnalysisConfigError(`La clé ${KEY_ENV[provider]} est refusée par le fournisseur : ${msg.slice(0, 200)}`);
    }
    throw err;
  }
}

/** Pour les jeux, déclasse côté serveur toute offre sans carte dédiée, même si le modèle ignore la règle. */
function enforceVendorGpu(result: AIAnalysisResult, data: QuestionnaireData): AIAnalysisResult {
  const note = getDictionary(data.locale ?? "fr").api.noDedicatedGpu;
  const analyses = (result.analyses ?? []).map(a => hasDedicatedGpu(a.specs?.graphics) ? a : {
    ...a, verdict: "deconseille" as const, score: Math.min(a.score, 39), cons: [...(a.cons ?? []), note],
  });
  const best = analyses.find(a => a.proposalId === result.bestProposalId);
  return { ...result, analyses, bestProposalId: best?.verdict === "deconseille" ? undefined : result.bestProposalId };
}

/** Garantit generatedConfigs (tableau) et generatedConfig (première proposition, pour l'historique). */
function normalize(result: AIAnalysisResult, data: QuestionnaireData): AIAnalysisResult {
  if (result.mode !== "generated") return needsDedicatedGpu(data) ? enforceVendorGpu(result, data) : result;
  const list = Array.isArray(result.generatedConfigs) && result.generatedConfigs.length
    ? result.generatedConfigs
    : result.generatedConfig ? [result.generatedConfig] : [];
  const configs = list
    .filter(c => !needsDedicatedGpu(data) || hasDedicatedGpu(c.graphics))
    .map(c => ({ ...c, priorities: c.priorities ?? [], whatToAskVendor: c.whatToAskVendor ?? [] }));
  return { ...result, generatedConfigs: configs, generatedConfig: configs[0] };
}

async function run(provider: "gemini" | "anthropic" | "openai", data: QuestionnaireData, deadline: number): Promise<AIAnalysisResult> {
  if (provider === "openai") return analyzeWithOpenAI(data, deadline);
  if (provider === "anthropic") return analyzeWithClaude(data, deadline);
  return analyzeWithGemini(data, deadline);
}
