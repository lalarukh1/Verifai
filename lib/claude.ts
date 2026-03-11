import Anthropic from "@anthropic-ai/sdk";
import { Claim, ExtractedContent, OverallVerdict } from "./types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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

export async function analyseContent(
  content: ExtractedContent
): Promise<ClaudeAnalysisResult> {
  const userPrompt = `Analyse this social media post with both factual rigour and human empathy.

Platform: ${content.platform}
Account: @${content.accountHandle ?? "unknown"} (${content.accountFollowers != null ? content.accountFollowers.toLocaleString() + " followers" : "unknown followers"})
Post text: ${content.text}

Before analysing, ask yourself:
1. Is this content trying to deceive, or is it a person expressing grief, outrage, or a call for humanity?
2. Does this content make specific verifiable claims, or is it an emotional appeal?
3. If it is about an ongoing humanitarian crisis, conflict, or oppression, what does credible, documented evidence say about the broader context?

Return a JSON object with exactly this structure:
{
  "overallVerdict": "TRUSTWORTHY" | "MISLEADING" | "FALSE" | "UNVERIFIED",
  "verdictReason": "One warm, honest, human sentence explaining your verdict. If the content is a humanitarian appeal, acknowledge the human pain behind it. Never be cold or dismissive.",
  "claims": [
    {
      "text": "The specific verifiable claim as stated",
      "verdict": "TRUE" | "FALSE" | "MISLEADING" | "UNVERIFIED" | "NO_EVIDENCE",
      "confidence": 0.0 to 1.0,
      "explanation": "2-3 sentences explaining your verdict with compassion and context. Cite the documented reality where relevant. For religious references, cite the original scripture.",
      "category": "health" | "science" | "politics" | "finance" | "humanitarian" | "religion" | "general",
      "sources": []
    }
  ]
}

Rules for claims:
- Only extract specific verifiable factual claims (e.g. death tolls, dates, statistics, religious quotes, scientific assertions).
- Do NOT extract opinions, emotions, grief, calls for justice, or rhetorical questions as claims. These are human expressions, not facts to debunk.
- Extract between 0 and 5 claims. If the post is purely emotional or a call for humanity with no specific factual assertions, return an empty claims array.
- Always return "sources": [] for every claim. Sources are fetched separately from a live news index. Do not generate any URLs yourself.`;

  console.log("🔄 [Claude] Sending to claude-sonnet-4-6 for analysis...");
  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Strip markdown code fences that Claude sometimes adds despite instructions
    const responseText = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/, "")
      .trim();

    try {
      const parsed = JSON.parse(responseText) as ClaudeAnalysisResult;
      console.log(`✅ [Claude] Analysis complete - verdict: ${parsed.overallVerdict}, claims: ${parsed.claims?.length ?? 0}`);
      return {
        overallVerdict: parsed.overallVerdict ?? "UNVERIFIED",
        verdictReason: parsed.verdictReason ?? "No reason provided.",
        // Strip any sources Claude may have generated - sources come from Serper only
      claims: Array.isArray(parsed.claims)
        ? parsed.claims.map((c) => ({ ...c, sources: [] }))
        : [],
      };
    } catch {
      console.error("❌ [Claude] JSON parse failed - raw response:", rawText.slice(0, 200));
      return FALLBACK_RESULT;
    }
  } catch (err) {
    console.error("❌ [Claude] API error:", err);
    return FALLBACK_RESULT;
  }
}
