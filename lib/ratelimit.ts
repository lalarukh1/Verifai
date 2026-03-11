import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: false,
  });
  console.log("✅ [Upstash] Redis connected - rate limiting active (5 req/min)");
}

export async function checkRateLimit(
  ip: string
): Promise<{ allowed: boolean; remaining: number }> {
  if (!ratelimit) {
    console.log("⚠️  [Upstash] No Redis keys set - rate limiting skipped");
    return { allowed: true, remaining: 100 };
  }

  try {
    const { success, remaining } = await ratelimit.limit(ip);
    if (!success) console.warn(`🚫 [Upstash] Rate limit hit for IP: ${ip}`);
    return { allowed: success, remaining };
  } catch (err) {
    console.error("❌ [Upstash] Rate limit check failed:", err);
    // Fail open - allow request if Redis is down
    return { allowed: true, remaining: 0 };
  }
}
