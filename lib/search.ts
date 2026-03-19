import { ClaimWithEvidence } from "./types";
import { Genre, GENRE_AUTHORITY_SITES } from "./genres";

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

function buildAuthoritySites(genre: Genre): string {
  return GENRE_AUTHORITY_SITES[genre].map((d) => `site:${d}`).join(" OR ");
}

function validUrl(url: unknown): url is string {
  return (
    typeof url === "string" &&
    (url.startsWith("https://") || url.startsWith("http://"))
  );
}

async function searchClaimForEvidence(
  claimText: string,
  category: string,
  genre: Genre
): Promise<ClaimWithEvidence> {
  const apiKey = process.env.SERPER_API_KEY;
  const base: ClaimWithEvidence = { text: claimText, category, evidence: [] };
  if (!apiKey) return base;

  const query = buildQuery(claimText);
  const authoritySites = buildAuthoritySites(genre);

  // ── 1. News search ────────────────────────────────────────────
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch("https://google.serper.dev/news", {
      method: "POST",
      headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ q: query, num: 8, hl: "en" }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = (await res.json()) as SerperResponse;
      const evidence = (data.news ?? [])
        .filter((item) => validUrl(item.link))
        .map((item) => ({
          name: item.source,
          url: item.link,
          snippet: item.snippet ?? "",
          date: item.date,
        }));

      if (evidence.length > 0) {
        console.log(`✅ [Serper/news] ${evidence.length} results for: "${query.slice(0, 60)}"`);
        return { ...base, evidence };
      }
      console.log(`⚠️  [Serper/news] 0 results - trying authority search for: "${query.slice(0, 60)}"`);
    } else {
      console.warn(`⚠️  [Serper/news] HTTP ${res.status} for: "${query.slice(0, 60)}"`);
    }
  } catch {
    console.warn(`⚠️  [Serper/news] Timed out for: "${query.slice(0, 60)}"`);
  }

  // ── 2. Genre-specific authority search ───────────────────────
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ q: `${query} (${authoritySites})`, num: 8, hl: "en" }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = (await res.json()) as SerperResponse;
      const evidence = (data.organic ?? [])
        .filter((item) => validUrl(item.link))
        .map((item) => ({
          name: item.displayLink.replace(/^www\./, ""),
          url: item.link,
          snippet: item.snippet ?? "",
        }));

      if (evidence.length > 0) {
        console.log(`✅ [Serper/auth:${genre}] ${evidence.length} results for: "${query.slice(0, 60)}"`);
        return { ...base, evidence };
      }
      console.log(`⚠️  [Serper/auth] 0 results - falling back to web search for: "${query.slice(0, 60)}"`);
    }
  } catch {
    console.warn(`⚠️  [Serper/auth] Timed out for: "${query.slice(0, 60)}"`);
  }

  // ── 3. Fallback: general web search ──────────────────────────
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ q: query, num: 8, hl: "en" }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`⚠️  [Serper/web] HTTP ${res.status}`);
      return base;
    }

    const data = (await res.json()) as SerperResponse;
    const evidence = (data.organic ?? [])
      .filter((item) => validUrl(item.link))
      .map((item) => ({
        name: item.displayLink.replace(/^www\./, ""),
        url: item.link,
        snippet: item.snippet ?? "",
      }));

    if (evidence.length > 0) {
      console.log(`✅ [Serper/web] ${evidence.length} fallback results for: "${query.slice(0, 60)}"`);
      return { ...base, evidence };
    }
  } catch {
    console.warn(`⚠️  [Serper/web] Timed out`);
  }

  console.log(`⚠️  [Serper] No evidence found for: "${query.slice(0, 60)}"`);
  return base;
}

export async function searchClaimsForEvidence(
  claims: Array<{ text: string; category: string }>,
  genre: Genre
): Promise<ClaimWithEvidence[]> {
  if (claims.length === 0) return [];

  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    console.warn("⚠️  [Serper] SERPER_API_KEY not set - skipping evidence search");
    return claims.map((c) => ({ ...c, evidence: [] }));
  }

  console.log(`🔄 [Serper] Searching ${claims.length} claim(s) with genre: ${genre}`);
  const results = await Promise.all(
    claims.map((c) => searchClaimForEvidence(c.text, c.category, genre))
  );
  const withEvidence = results.filter((r) => r.evidence.length > 0).length;
  console.log(`✅ [Serper] Done - ${withEvidence}/${claims.length} claims have evidence`);
  return results;
}
