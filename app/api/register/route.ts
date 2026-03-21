import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

async function addToNotion(email: string, marketingOptIn: boolean) {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_SIGNUPS_DB_ID;
  if (!token || !databaseId) return;

  await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        Name: { title: [{ text: { content: email } }] },
        Email: { rich_text: [{ text: { content: email } }] },
        Date: { date: { start: new Date().toISOString() } },
        Source: { rich_text: [{ text: { content: marketingOptIn ? "App (marketing opt-in)" : "App" } }] },
      },
    }),
  }).catch(() => {});
}

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

    addToNotion(normalised, marketingOptIn).catch(() => {});
    console.log(`✅ [Register] New signup: ${normalised} (marketing: ${marketingOptIn})`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ [Register] Redis error:", err);
    // Fail silently from the user's perspective — don't block signup
    return NextResponse.json({ success: true });
  }
}
