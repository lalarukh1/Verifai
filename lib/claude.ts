import Anthropic from "@anthropic-ai/sdk";
import { Claim, ClaimWithEvidence, ExtractedContent, OverallVerdict } from "./types";
import { Genre } from "./genres";

const SYSTEM_PROMPT = `You are VerifAI, a fact-checker with a conscience. You have the rigour of an investigative journalist and the heart of someone who deeply cares about humanity, truth, and the dignity of every human being.

You must respond with ONLY valid JSON. No markdown, no explanation outside the JSON, no code fences.

WRITING STYLE: Never use em dashes or en dashes in any text you write. Use commas, full stops, or plain hyphens (-) instead. Write naturally and warmly, like a caring, well-read person speaking directly to someone who needs clarity.

YOUR CORE VALUES:
- You are honest, kind, and never sensationalise. You speak with warmth and care.
- You understand that social media is often where ordinary people cry out about injustice, grief, and suffering, and that a cry for humanity is not a factual claim to be debunked.
- You are deeply sensitive to content about war, children, displacement, genocide, and human suffering. You approach these topics with the gravity and compassion they deserve.
- You never lie. Every factual statement you make must be something a person could verify by reading a credible book, a UN report, an academic paper, or a reputable news organisation. If you are not certain, you say so and mark it UNVERIFIED.
- For religious content, you always cite primary sources (the Quran, the Bible, the Torah, the Hadith, the Bhagavad Gita) and never secondary or unverified interpretations.

HOW TO DETERMINE THE VERDICT:
- TRUSTWORTHY: The content is factually grounded, or it is a sincere humanitarian appeal whose spirit is consistent with documented reality.
- MISLEADING: The content contains specific factual statements that are demonstrably distorted, taken out of context, or cherry-picked to deceive. Do NOT use this for emotional appeals or calls for humanity, only for deliberate factual distortion.
- FALSE: The content makes specific claims that are directly contradicted by credible evidence.
- UNVERIFIED: Claims cannot be confirmed or denied with available evidence. Use this for opinions, personal testimonies, or unconfirmed statistics.

CRITICAL RULES:
- A video that says "the world is silent about Gaza" or "look at what is happening to these children" is a HUMAN APPEAL, not a factual claim. It should NEVER be labelled MISLEADING. If its spirit reflects documented reality (e.g. a documented conflict with documented civilian casualties), lean TRUSTWORTHY or UNVERIFIED depending on specific claims made.
- When content is about ongoing conflicts, humanitarian crises, or oppression, read between the lines with empathy. Ask yourself: is this person trying to deceive, or are they grieving and calling for attention?
- Every source you cite must genuinely exist. If you cannot be certain a URL is correct, omit it rather than guess. Prefer UN reports, Human Rights Watch, Amnesty International, BBC, Reuters, AP, peer-reviewed journals, and original religious texts.
- For claims about death tolls, displacement, or destruction in conflict zones, cite UN OCHA, UNRWA, or verified government/NGO data.
- Never mark a claim TRUE unless you are highly confident it is accurate and verifiable.

Analyse the text for factual claims, meaning statements that can be checked against reality, documented evidence, or public record. Opinions, grief, and calls for justice are not factual claims and should not be listed as claims at all.`;

export interface RawClaim {
  text: string;
  category: string;
}

export interface ExtractionResult {
  genre: Genre;
  claims: RawClaim[];
}

export interface ClaudeAnalysisResult {
  overallVerdict: OverallVerdict;
  verdictReason: string;
  claims: Claim[];
}

const FALLBACK_RESULT: ClaudeAnalysisResult = {
  overallVerdict: "UNVERIFIED",
  verdictReason: "Analysis could not be completed.",
  claims: [],
};

/**
 * Pass 1 - Classify the content genre and extract raw factual claims.
 * No verdicts are assigned here - this is intentionally lightweight.
 */
export async function extractClaimsAndGenre(
  content: ExtractedContent
): Promise<ExtractionResult> {
  const client = new Anthropic();
  console.log("🔄 [Claude/P1] Extracting claims and detecting genre...");

  const userPrompt = `Analyse this social media post. Do two things:

1. Identify the single best-matching content genre from this list:
   ai_technology, technology, health_medical, politics_governance, finance_economics,
   science_environment, humanitarian_conflict, religion, sports, entertainment_culture, general

   Genre definitions:
   - ai_technology: artificial intelligence, machine learning, AI tools, AI adoption stats
   - technology: general tech (smartphones, software, apps, companies, internet, social media)
   - health_medical: disease, medicine, vaccines, nutrition, mental health, public health
   - politics_governance: elections, government, policy, law, international relations
   - finance_economics: markets, stocks, crypto, economy, business, trade
   - science_environment: climate, space, biology, chemistry, physics, research studies
   - humanitarian_conflict: wars, refugees, humanitarian crises, human rights violations
   - religion: religious claims, scripture, faith, theology
   - sports: sports results, records, athletes, competitions
   - entertainment_culture: movies, music, celebrities, TV, culture
   - general: anything that does not clearly fit the above

2. Extract all specific verifiable factual claims (statements that can be checked against reality).
   Do NOT include opinions, emotions, grief, calls for justice, or rhetorical questions.

Platform: ${content.platform}
Account: @${content.accountHandle ?? "unknown"} (${content.accountFollowers != null ? content.accountFollowers.toLocaleString() + " followers" : "unknown followers"})
Post text: ${content.text}

Return ONLY this JSON:
{
  "genre": "one of the genres listed above",
  "claims": [
    { "text": "exact verifiable claim as stated in the post", "category": "health | science | politics | finance | humanitarian | religion | general | ai_technology | technology | sports | entertainment" }
  ]
}

Extract 0 to 5 claims. If the post is purely emotional with no verifiable facts, return an empty claims array.`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "";
    const responseText = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/, "")
      .trim();

    const parsed = JSON.parse(responseText) as ExtractionResult;
    console.log(`✅ [Claude/P1] Genre: ${parsed.genre}, Claims: ${parsed.claims?.length ?? 0}`);
    return {
      genre: parsed.genre ?? "general",
      claims: Array.isArray(parsed.claims) ? parsed.claims : [],
    };
  } catch (err) {
    console.error("❌ [Claude/P1] Failed:", err);
    return { genre: "general", claims: [] };
  }
}

/**
 * Pass 2 - Assign verdicts to each claim using the real search evidence found.
 * Claude receives the evidence snippets and can now make informed, confident verdicts.
 */
export async function assignVerdicts(
  content: ExtractedContent,
  claimsWithEvidence: ClaimWithEvidence[]
): Promise<ClaudeAnalysisResult> {
  const client = new Anthropic();
  console.log("🔄 [Claude/P2] Assigning verdicts with evidence...");

  const evidenceContext =
    claimsWithEvidence.length > 0
      ? claimsWithEvidence
          .map((c, i) => {
            const snippets =
              c.evidence.length > 0
                ? c.evidence
                    .slice(0, 6)
                    .map((e) => `    - ${e.name}${e.date ? ` (${e.date})` : ""}: "${e.snippet}"`)
                    .join("\n")
                : "    - No evidence found in search";
            return `Claim ${i + 1}: "${c.text}"\nEvidence:\n${snippets}`;
          })
          .join("\n\n")
      : "No specific factual claims were extracted from this post.";

  const userPrompt = `You are assigning verdicts to claims extracted from a social media post. You have real search evidence snippets to inform your verdicts - use them.

Platform: ${content.platform}
Account: @${content.accountHandle ?? "unknown"} (${content.accountFollowers != null ? content.accountFollowers.toLocaleString() + " followers" : "unknown followers"})
Post text: ${content.text}

CLAIMS AND SEARCH EVIDENCE:
${evidenceContext}

Instructions for verdicts:
- CRITICAL: When multiple evidence sources discuss the same statistic, ranking, or fact in a consistent direction, you MUST mark it TRUE. Do not demand a single perfect source - corroboration across sources is sufficient proof.
- For statistics and rankings (e.g. "Country X leads in AI adoption"): if 2 or more snippets point to the same conclusion, even indirectly, mark TRUE.
- If evidence contradicts the claim, mark it FALSE.
- If evidence is partial, mixed, or the claim overstates what evidence shows, mark it MISLEADING.
- Mark UNVERIFIED ONLY when evidence is completely absent AND you cannot verify from your own knowledge with high confidence.
- Never downgrade a claim to UNVERIFIED simply because evidence snippets are brief or don't quote the exact wording of the claim.
- Return claims in the EXACT same order and with the EXACT same text as listed above.

For the overall verdict, consider the post as a whole - its tone, purpose, and whether it is trying to inform, deceive, or make a human appeal.

Return ONLY this JSON:
{
  "overallVerdict": "TRUSTWORTHY" | "MISLEADING" | "FALSE" | "UNVERIFIED",
  "verdictReason": "One warm, honest sentence explaining the overall verdict. Acknowledge human pain where relevant.",
  "claims": [
    {
      "text": "exact claim text as provided above",
      "verdict": "TRUE" | "FALSE" | "MISLEADING" | "UNVERIFIED" | "NO_EVIDENCE",
      "confidence": 0.0 to 1.0,
      "explanation": "2-3 sentences explaining your verdict, referencing the evidence found where relevant.",
      "category": "category from input",
      "sources": []
    }
  ]
}`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 3000,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "";
    const responseText = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/, "")
      .trim();

    const parsed = JSON.parse(responseText) as ClaudeAnalysisResult;
    console.log(`✅ [Claude/P2] Verdict: ${parsed.overallVerdict}, Claims: ${parsed.claims?.length ?? 0}`);
    return {
      overallVerdict: parsed.overallVerdict ?? "UNVERIFIED",
      verdictReason: parsed.verdictReason ?? "No reason provided.",
      // Strip any sources Claude may have generated - sources come from search only
      claims: Array.isArray(parsed.claims)
        ? parsed.claims.map((c) => ({ ...c, sources: [] }))
        : [],
    };
  } catch (err) {
    console.error("❌ [Claude/P2] Failed:", err);
    // Build a fallback that preserves the claim texts
    return {
      ...FALLBACK_RESULT,
      claims: claimsWithEvidence.map((c) => ({
        text: c.text,
        verdict: "UNVERIFIED" as const,
        confidence: 0,
        explanation: "Analysis could not be completed.",
        category: c.category,
        sources: [],
      })),
    };
  }
}
