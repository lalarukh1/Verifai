import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  let body: { email?: string; marketingOptIn?: boolean };
  try {
    body = (await req.json()) as { email?: string; marketingOptIn?: boolean };
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const { email, marketingOptIn = false } = body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ success: false, error: "Valid email required." }, { status: 400 });
  }

  const normalised = email.toLowerCase().trim();

  try {
    // Add to the master signups set (idempotent — safe to call multiple times)
    await redis.sadd("verifai:emails", normalised);

    // Store signup metadata (only if not already stored — NX = only set if not exists)
    await redis.set(
      `verifai:signup:${normalised}`,
      JSON.stringify({
        email: normalised,
        marketingOptIn,
        signedUpAt: new Date().toISOString(),
      }),
      { nx: true } // don't overwrite if they re-submit
    );

    // Store marketing preference separately so it's easy to query
    if (marketingOptIn) {
      await redis.sadd("verifai:marketing_emails", normalised);
    }

    console.log(`✅ [Register] New signup: ${normalised} (marketing: ${marketingOptIn})`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ [Register] Redis error:", err);
    // Fail silently from the user's perspective — don't block signup
    return NextResponse.json({ success: true });
  }
}
