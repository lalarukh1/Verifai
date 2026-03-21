import { AnalysisResult } from "./types";

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DB_ID = process.env.NOTION_CHECKED_LINKS_DB_ID;

function platformLabel(url: string): "Instagram" | "TikTok" | "Unknown" {
  if (url.includes("instagram.com")) return "Instagram";
  if (url.includes("tiktok.com")) return "TikTok";
  return "Unknown";
}

export async function logCheckedLink(
  url: string,
  result: AnalysisResult,
  fromCache: boolean
): Promise<void> {
  if (!NOTION_TOKEN || !DB_ID) return;

  try {
    await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: DB_ID },
        properties: {
          "URL": {
            title: [{ text: { content: url.slice(0, 2000) } }],
          },
          "Platform": {
            select: { name: platformLabel(url) },
          },
          "Verdict": {
            select: { name: result.overallVerdict },
          },
          "Account": {
            rich_text: [{ text: { content: result.accountSummary ?? "" } }],
          },
          "Credibility Score": {
            number: result.credibilityScore,
          },
          "Verdict Reason": {
            rich_text: [{ text: { content: (result.verdictReason ?? "").slice(0, 2000) } }],
          },
          "Checked At": {
            date: { start: new Date().toISOString() },
          },
          "From Cache": {
            checkbox: fromCache,
          },
        },
      }),
    });
  } catch {
    // Logging is non-critical - never let it break the main flow
  }
}
