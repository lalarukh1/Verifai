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
    // Failing open (allowing the request) because Redis is unreachable.
    // To get alerted when this happens:
    //   - Vercel: Dashboard > Project > Settings > Log Drains, or set up an alert on error logs
    //   - Upstash: Dashboard > Database > Alerts
    console.error("CRITICAL [Upstash] Rate limit unavailable - failing open. Set up Vercel/Upstash alerts to catch this.", err);
    return { allowed: true, remaining: 0 };
  }
}
