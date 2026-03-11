import { Claim } from "./types";

interface SerperNewsItem {
  title: string;
  link: string;
  snippet?: string;
  source: string;
  date?: string;
}

interface SerperWebItem {
  title: string;
  link: string;
  snippet?: string;
  displayLink: string;
}

interface SerperResponse {
  news?: SerperNewsItem[];
  organic?: SerperWebItem[];
}

/** Trim claim text to a clean word boundary for better search matching */
function buildQuery(claimText: string): string {
  const trimmed = claimText.slice(0, 120);
  const lastSpace = trimmed.lastIndexOf(" ");
  return lastSpace > 40 ? trimmed.slice(0, lastSpace) : trimmed;
}

/** Authoritative domains used in the second search pass */
const AUTHORITY_SITES = [
  "who.int",
  "cdc.gov",
  "nih.gov",
  "gov.uk",
  "un.org",
  "unicef.org",
  "reuters.com",
  "apnews.com",
  "bbc.com",
  "bbc.co.uk",
  "theguardian.com",
  "nytimes.com",
  "nature.com",
  "pubmed.ncbi.nlm.nih.gov",
].map((d) => `site:${d}`).join(" OR ");

function validUrl(url: unknown): url is string {
  return (
    typeof url === "string" &&
    (url.startsWith("https://") || url.startsWith("http://"))
  );
}

async function searchForClaim(claim: Claim): Promise<Claim> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return claim;

  const query = buildQuery(claim.text);

  // ── 1. News search (no time restriction) ────────────────────
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const newsRes = await fetch("https://google.serper.dev/news", {
      method: "POST",
      headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ q: query, num: 5, hl: "en" }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (newsRes.ok) {
      const data = (await newsRes.json()) as SerperResponse;
      const sources = (data.news ?? [])
        .filter((item) => validUrl(item.link))
        .map((item) => ({ name: item.source, url: item.link, date: item.date }));

      if (sources.length > 0) {
        console.log(`✅ [Serper/news] ${sources.length} sources for: "${query.slice(0, 60)}"`);
        return { ...claim, sources };
      }
      console.log(`⚠️  [Serper/news] 0 results - trying web search for: "${query.slice(0, 60)}"`);
    } else {
      console.warn(`⚠️  [Serper/news] HTTP ${newsRes.status} for: "${query.slice(0, 60)}"`);
    }
  } catch {
    console.warn(`⚠️  [Serper/news] Timed out for: "${query.slice(0, 60)}"`);
  }

  // ── 2. Authoritative sources (WHO, CDC, Reuters, AP, BBC, etc.) ─────
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const authRes = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ q: `${query} (${AUTHORITY_SITES})`, num: 5, hl: "en" }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (authRes.ok) {
      const data = (await authRes.json()) as SerperResponse;
      const sources = (data.organic ?? [])
        .filter((item) => validUrl(item.link))
        .map((item) => ({
          name: item.displayLink.replace(/^www\./, ""),
          url: item.link,
          date: undefined,
        }));

      if (sources.length > 0) {
        console.log(`✅ [Serper/auth] ${sources.length} authoritative sources for: "${query.slice(0, 60)}"`);
        return { ...claim, sources };
      }
      console.log(`⚠️  [Serper/auth] 0 results - trying web search for: "${query.slice(0, 60)}"`);
    }
  } catch {
    console.warn(`⚠️  [Serper/auth] Timed out for: "${query.slice(0, 60)}"`);
  }

  // ── 3. Fallback: regular web search ─────────────────────────
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const webRes = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ q: query, num: 5, hl: "en" }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!webRes.ok) {
      console.warn(`⚠️  [Serper/web] HTTP ${webRes.status}`);
      return claim;
    }

    const data = (await webRes.json()) as SerperResponse;
    const sources = (data.organic ?? [])
      .filter((item) => validUrl(item.link))
      .map((item) => ({
        name: item.displayLink.replace(/^www\./, ""),
        url: item.link,
        date: undefined,
      }));

    if (sources.length > 0) {
      console.log(`✅ [Serper/web] ${sources.length} fallback sources for: "${query.slice(0, 60)}"`);
      return { ...claim, sources };
    }
  } catch {
    console.warn(`⚠️  [Serper/web] Timed out`);
  }

  console.log(`⚠️  [Serper] No sources found for: "${query.slice(0, 60)}"`);
  return claim;
}

export async function enrichClaimsWithSearch(claims: Claim[]): Promise<Claim[]> {
  if (claims.length === 0) return claims;

  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    console.warn("⚠️  [Serper] SERPER_API_KEY not set - skipping source search");
    return claims;
  }

  console.log(`🔄 [Serper] Finding sources for ${claims.length} claim(s)...`);
  const enriched = await Promise.all(claims.map(searchForClaim));
  const withSources = enriched.filter((c) => c.sources.length > 0).length;
  console.log(`✅ [Serper] Done - ${withSources}/${claims.length} claims have sources`);
  return enriched;
}
