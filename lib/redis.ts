import { Redis } from "@upstash/redis";
import { createHash } from "crypto";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const FREE_CHECK_LIMIT = Number(
  process.env.NEXT_PUBLIC_FREE_CHECK_LIMIT ?? 10
);

// Free mode: email-only gate, unlimited checks. Flip to "paid" in .env to enable paywall.
export const IS_FREE_MODE = process.env.NEXT_PUBLIC_MODE !== "paid";

function key(email: string) {
  return email.toLowerCase().trim();
}

export async function getCheckCount(email: string): Promise<number> {
  const count = await redis.get<number>(`verifai:count:${key(email)}`);
  return count ?? 0;
}

export async function incrementCheckCount(email: string): Promise<number> {
  return redis.incr(`verifai:count:${key(email)}`);
}

export async function isPaidUser(email: string): Promise<boolean> {
  const paid = await redis.get(`verifai:paid:${key(email)}`);
  return paid === "true" || paid === true || paid === 1;
}

export async function markAsPaid(email: string): Promise<void> {
  await redis.set(`verifai:paid:${key(email)}`, "true");
}

// ── Result cache (keyed by URL, TTL 7 days) ───────────────────────────────
const CACHE_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function cacheKey(url: string) {
  const hash = createHash("sha256").update(url.toLowerCase().trim()).digest("hex");
  return `verifai:result:${hash}`;
}

export async function getCachedResult(url: string) {
  return redis.get<import("./types").AnalysisResult>(cacheKey(url));
}

export async function setCachedResult(url: string, result: import("./types").AnalysisResult) {
  await redis.set(cacheKey(url), result, { ex: CACHE_TTL_SECONDS });
}
