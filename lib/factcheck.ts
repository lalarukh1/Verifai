import { Claim } from "./types";

interface GoogleFactCheckResponse {
  claims?: {
    text?: string;
    claimReview?: {
      publisher?: { name?: string; site?: string };
      url?: string;
      title?: string;
      textualRating?: string;
    }[];
  }[];
}

async function enrichClaim(claim: Claim): Promise<Claim> {
  const apiKey = process.env.GOOGLE_FACT_CHECK_KEY;
  if (!apiKey) return claim;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(
      claim.text
    )}&key=${apiKey}&languageCode=en&pageSize=3`;

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) return claim;

    const data = (await response.json()) as GoogleFactCheckResponse;

    if (!data.claims || data.claims.length === 0) return claim;

    const review = data.claims[0]?.claimReview?.[0];
    if (!review) return claim;

    return {
      ...claim,
      explanation:
        claim.explanation +
        (review.textualRating
          ? ` [Fact check rating: ${review.textualRating}]`
          : ""),
      sources: [
        ...(claim.sources ?? []),
        ...(review.publisher?.name && review.url
          ? [{ name: review.publisher.name, url: review.url }]
          : []),
      ],
    };
  } catch (err) {
    clearTimeout(timeoutId);
    console.error(
      "Google Fact Check error for claim:",
      claim.text.slice(0, 50),
      err
    );
    return claim;
  }
}

export async function enrichClaimsWithFactCheck(
  claims: Claim[]
): Promise<Claim[]> {
  if (claims.length === 0) return claims;
  console.log(`🔄 [Google Fact Check] Checking ${claims.length} claim(s)...`);
  const enriched = await Promise.all(claims.map(enrichClaim));
  const withSources = enriched.filter(c => c.sources && c.sources.length > 0).length;
  console.log(`✅ [Google Fact Check] Done - ${withSources}/${claims.length} claims enriched with sources`);
  return enriched;
}
