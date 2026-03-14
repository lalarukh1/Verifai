import { NextRequest, NextResponse } from "next/server";
import { detectPlatform, extractFromUrl } from "@/lib/apify";
import { transcribeFromUrl } from "@/lib/deepgram";
import { ExtractedContent } from "@/lib/types";

export const maxDuration = 45;

export async function POST(req: NextRequest) {
  let body: { url?: string };

  try {
    body = (await req.json()) as { url?: string };
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { url } = body;

  if (!url || typeof url !== "string") {
    return NextResponse.json(
      { success: false, error: "URL is required." },
      { status: 400 }
    );
  }

  const platform = detectPlatform(url);
  if (platform === "unknown") {
    return NextResponse.json(
      {
        success: false,
        error: "Only Instagram and TikTok URLs are supported.",
      },
      { status: 400 }
    );
  }

  let content: ExtractedContent | null = null;

  try {
    const { content: apifyContent, videoUrl } = await extractFromUrl(url);

    if (apifyContent && apifyContent.text.length >= 20) {
      content = apifyContent;
    } else if (videoUrl) {
      const transcript = await transcribeFromUrl(videoUrl);
      if (transcript) {
        content = {
          ...(apifyContent ?? {
            text: "",
            source: "audio" as const,
            platform,
            postUrl: url,
          }),
          text: transcript,
          source: "audio" as const,
          transcript,
        };
      } else {
        content = apifyContent;
      }
    } else {
      content = apifyContent;
    }
  } catch (err) {
    console.error("/api/extract error:", err);
  }

  if (!content || content.text.trim().length === 0) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Could not extract content from this URL. The account may be private or the video may have no captions.",
      },
      { status: 422 }
    );
  }

  return NextResponse.json({ success: true, content });
}
