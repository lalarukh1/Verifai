import { NextRequest, NextResponse } from "next/server";

const NOTION_VERSION = "2022-06-28";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const feedback: string = (body.feedback ?? "").trim();
    const source: string = (body.source ?? "App").trim();

    if (!feedback || feedback.length < 3) {
      return NextResponse.json({ error: "Please write something before submitting." }, { status: 400 });
    }

    if (feedback.length > 2000) {
      return NextResponse.json({ error: "Feedback must be under 2000 characters." }, { status: 400 });
    }

    const token = process.env.NOTION_TOKEN;
    const databaseId = process.env.NOTION_FEEDBACK_DATABASE_ID;

    if (!token || !databaseId) {
      console.warn("Notion feedback credentials not set.");
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Notion-Version": NOTION_VERSION,
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          Feedback: {
            title: [{ text: { content: feedback } }],
          },
          Source: {
            rich_text: [{ text: { content: source } }],
          },
          Date: {
            date: { start: new Date().toISOString() },
          },
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Notion error ${res.status}: ${text}`);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Feedback error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
