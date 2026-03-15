import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const FREE_CHECK_LIMIT = Number(
  process.env.NEXT_PUBLIC_FREE_CHECK_LIMIT ?? 10
);

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
