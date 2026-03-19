import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/ratelimit";
import { detectPlatform, extractFromUrl } from "@/lib/apify";
import { transcribeFromUrl } from "@/lib/deepgram";
import { extractClaimsAndGenre, assignVerdicts } from "@/lib/claude";
import { searchClaimsForEvidence } from "@/lib/search";
import { AnalysisResult, Claim, CheckResponse } from "@/lib/types";
import { getCheckCount, incrementCheckCount, isPaidUser, FREE_CHECK_LIMIT, IS_FREE_MODE } from "@/lib/redis";

export const maxDuration = 60;

function calculateCredibilityScore(params: {
  overallVerdict: string;
  hasSources: boolean;
  allClaimsUnverified: boolean;
  trueClaimCount: number;
}): number {
  let score = 50;
  if (params.overallVerdict === "FALSE" || params.overallVerdict === "MISLEADING") score -= 20;
  if (params.overallVerdict === "UNVERIFIED") score -= 10;
  if (params.hasSources && !params.allClaimsUnverified) score += 10;
  if (params.hasSources && params.allClaimsUnverified) score -= 10;
  score += Math.min(params.trueClaimCount * 5, 15);
  return Math.max(0, Math.min(100, score));
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "127.0.0.1";

  const { allowed } = await checkRateLimit(ip);
  if (!allowed) {
    const response: CheckResponse = {
      success: false,
      error: "Too many requests. Please wait a minute and try again.",
      rateLimited: true,
    };
    return NextResponse.json(response, { status: 429 });
  }

  let body: { url?: string; email?: string };
  try {
    body = (await req.json()) as { url?: string; email?: string };
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { url, email } = body;

  // ── EMAIL GATING ─────────────────────────────────────────────
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json(
      { success: false, error: "A valid email address is required." },
      { status: 400 }
    );
  }

  // Admin emails bypass all limits
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const isAdmin = adminEmails.includes(email.toLowerCase().trim());

  const [count, paid] = isAdmin || IS_FREE_MODE
    ? [0, true]
    : await Promise.all([getCheckCount(email), isPaidUser(email)]);

  if (!IS_FREE_MODE && !isAdmin && count >= FREE_CHECK_LIMIT && !paid) {
    const response: CheckResponse = {
      success: false,
      paywalled: true,
      checksRemaining: 0,
      error: `You've used all ${FREE_CHECK_LIMIT} free checks. Upgrade to continue.`,
    };
    return NextResponse.json(response, { status: 402 });
  }

  if (!url || typeof url !== "string" || url.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: "URL is required." },
      { status: 400 }
    );
  }

  const platform = detectPlatform(url.trim());
  console.log(`\n━━━ VerifAI check started - ${platform} ━━━`);
  if (platform === "unknown") {
    return NextResponse.json(
      {
        success: false,
        error: "Only Instagram and TikTok URLs are supported.",
      },
      { status: 400 }
    );
  }

  // ── EXTRACTION ──────────────────────────────────────────────
  let content = null as import("@/lib/types").ExtractedContent | null;

  try {
    const { content: apifyContent, videoUrl } = await extractFromUrl(
      url.trim()
    );

    const captionText = apifyContent?.text?.trim() ?? "";
    console.log(`📊 [Check] Caption: ${captionText.length} chars | VideoUrl: ${videoUrl ? "✅ found" : "❌ not found"}`);

    if (videoUrl) {
      // Always attempt audio transcription when we have a video URL.
      // This catches spoken content even when a caption exists (e.g. only hashtags).
      const transcript = await transcribeFromUrl(videoUrl);
      if (transcript) {
        // Combine caption + transcript for richest possible analysis.
        const combined = captionText.length > 0
          ? `${captionText}\n\n${transcript}`
          : transcript;
        content = {
          ...(apifyContent ?? {
            text: "",
            source: "audio" as const,
            platform,
            postUrl: url.trim(),
          }),
          text: combined,
          source: "audio" as const,
          transcript,
        };
        console.log(`✅ [Check] Content ready - audio transcript (${transcript.length} chars)${captionText.length > 0 ? " + caption" : ""}`);
      } else {
        // Transcript failed - fall back to caption if available.
        content = apifyContent;
        console.warn("⚠️  [Check] Transcript failed - falling back to caption only");
      }
    } else {
      // No video URL from Apify - rely on caption text alone.
      content = apifyContent;
      if (!captionText) {
        console.warn("⚠️  [Check] No videoUrl and no caption - content will be empty");
      } else {
        console.log(`✅ [Check] Content ready - caption only (${captionText.length} chars)`);
      }
    }
  } catch (err) {
    console.error("Extraction stage error:", err);
  }

  if (!content || content.text.trim().length === 0) {
    const response: CheckResponse = {
      success: false,
      error:
        "We couldn't extract content from this URL. It may be private or unsupported.",
    };
    return NextResponse.json(response, { status: 422 });
  }

  // ── ANALYSIS ─────────────────────────────────────────────────
  try {
    // Pass 1: classify genre and extract raw claims (no verdicts yet)
    const { genre, claims: rawClaims } = await extractClaimsAndGenre(content);

    // Search: find evidence snippets using genre-specific authority sites
    const claimsWithEvidence = await searchClaimsForEvidence(rawClaims, genre);

    // Pass 2: assign verdicts informed by the real evidence
    const claudeResult = await assignVerdicts(content, claimsWithEvidence);

    // Attach sources (with snippets) from search evidence to each verdict
    const enrichedClaims: Claim[] = claudeResult.claims.map((verdictedClaim, i) => ({
      ...verdictedClaim,
      sources: (claimsWithEvidence[i]?.evidence ?? []).map(
        ({ name, url, date, snippet }) => ({ name, url, date, snippet })
      ),
    }));

    const hasSources = enrichedClaims.some(
      (c) => c.sources && c.sources.length > 0
    );
    const allClaimsUnverified =
      enrichedClaims.length > 0 &&
      enrichedClaims.every(
        (c) => c.verdict === "UNVERIFIED" || c.verdict === "NO_EVIDENCE"
      );

    // Override overall verdict when claim mix contradicts Claude's assessment.
    // Claude sometimes assigns TRUSTWORTHY even when most claims are unverified.
    const overallVerdict = (() => {
      const cv = claudeResult.overallVerdict;
      if (enrichedClaims.length === 0) return cv;

      const falseOrMisleading = enrichedClaims.filter(
        (c) => c.verdict === "FALSE" || c.verdict === "MISLEADING"
      ).length;
      const unverified = enrichedClaims.filter(
        (c) => c.verdict === "UNVERIFIED" || c.verdict === "NO_EVIDENCE"
      ).length;
      const trueCount = enrichedClaims.filter((c) => c.verdict === "TRUE").length;

      // If Claude says TRUSTWORTHY but most claims are unverified/missing, downgrade
      if (cv === "TRUSTWORTHY" && unverified > trueCount) return "UNVERIFIED";
      // If Claude says TRUSTWORTHY but there are false/misleading claims, downgrade
      if (cv === "TRUSTWORTHY" && falseOrMisleading > 0) return "MISLEADING";
      return cv;
    })();

    const trueClaimCount = enrichedClaims.filter((c) => c.verdict === "TRUE").length;

    const credibilityScore = calculateCredibilityScore({
      overallVerdict,
      hasSources,
      allClaimsUnverified,
      trueClaimCount,
    });

    const result: AnalysisResult = {
      overallVerdict,
      verdictReason: claudeResult.verdictReason,
      claims: enrichedClaims,
      credibilityScore,
      accountSummary: `@${content.accountHandle ?? "unknown"}${
        content.accountFollowers != null
          ? ` · ${content.accountFollowers.toLocaleString()} followers`
          : ""
      }`,
      extractedContent: content,
      processingTimeMs: Date.now() - startTime,
    };

    console.log(`━━━ VerifAI check complete - ${result.processingTimeMs}ms | verdict: ${result.overallVerdict} | credibility: ${result.credibilityScore} ━━━\n`);

    // Increment the check counter after a successful analysis (skip in free mode, for admins, or paid users)
    const newCount = IS_FREE_MODE || isAdmin || paid ? count : await incrementCheckCount(email);
    const checksRemaining = IS_FREE_MODE || isAdmin || paid ? null : Math.max(0, FREE_CHECK_LIMIT - newCount);

    const response: CheckResponse = {
      success: true,
      result,
      ...(checksRemaining !== null && { checksRemaining }),
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error("Analysis stage error:", err);
    const response: CheckResponse = {
      success: false,
      error: "Analysis failed. Please try again.",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
