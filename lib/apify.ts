import { ExtractedContent, Platform } from "./types";

export function detectPlatform(url: string): Platform {
  if (/instagram\.com/.test(url)) return "instagram";
  if (/tiktok\.com|vm\.tiktok\.com/.test(url)) return "tiktok";
  return "unknown";
}

interface ApifyInstagramPost {
  caption?: string;
  ownerUsername?: string;
  ownerFullName?: string;
  videoUrl?: string;
  displayUrl?: string;
  likesCount?: number;
  timestamp?: string;
  isVideo?: boolean;
  type?: string;
  videoPlayCount?: number;
  ownerFollowersCount?: number;
}

interface ApifyTikTokPost {
  text?: string;
  authorMeta?: {
    name?: string;
    fans?: number;
  };
  diggCount?: number;
  videoUrl?: string;
  covers?: string[];
  coverUrl?: string;
  videoMeta?: { coverUrl?: string };
  createTime?: number; // Unix timestamp in seconds
}


async function runApifyActor<T>(
  actorId: string,
  input: Record<string, unknown>,
  timeoutMs = 30000
): Promise<T[] | null> {
  const token = process.env.APIFY_API_KEY;
  if (!token) {
    console.error("APIFY_API_KEY is not set");
    return null;
  }

  const encodedActorId = actorId.replace("/", "~");
  const url = `https://api.apify.com/v2/acts/${encodedActorId}/run-sync-get-dataset-items?token=${token}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.text().catch(() => "(unreadable)");
      console.error(
        `❌ [Apify] ${actorId} returned status ${response.status}: ${errBody}`
      );
      return null;
    }

    const data = (await response.json()) as T[];
    const hasResults = Array.isArray(data) && data.length > 0;
    console.log(hasResults ? `✅ [Apify] ${actorId} - success` : `⚠️  [Apify] ${actorId} - empty results`);
    return hasResults ? data : null;
  } catch (err) {
    console.error(`❌ [Apify] ${actorId} failed:`, err);
    return null;
  }
}

export async function extractFromUrl(url: string): Promise<{
  content: ExtractedContent | null;
  videoUrl?: string;
}> {
  const platform = detectPlatform(url);

  try {
    if (platform === "instagram") {
      const results = await runApifyActor<ApifyInstagramPost>(
        "apify/instagram-scraper",
        {
          directUrls: [url],
          resultsType: "posts",
          resultsLimit: 1,
        }
      );

      if (!results || results.length === 0) return { content: null };

      const post = results[0];
      const caption = post.caption ?? "";
      const handle = post.ownerUsername ?? post.ownerFullName ?? "unknown";
      const videoUrl = post.videoUrl ?? undefined;

      console.log(`📊 [Apify] Instagram - type: ${post.type ?? "unknown"}, isVideo: ${post.isVideo ?? false}, hasVideoUrl: ${!!videoUrl}, caption: ${caption.length} chars`);

      return {
        content: {
          text: caption,
          source: "caption",
          platform,
          accountHandle: handle,
          accountFollowers: post.ownerFollowersCount,
          postUrl: url,
          rawCaption: caption,
          thumbnailUrl: post.displayUrl ?? undefined,
          postTimestamp: post.timestamp ?? undefined,
        },
        videoUrl,
      };
    }

    if (platform === "tiktok") {
      const results = await runApifyActor<ApifyTikTokPost>(
        "clockworks/tiktok-scraper",
        {
          postURLs: [url],
          resultsPerPage: 1,
        }
      );

      if (!results || results.length === 0) return { content: null };

      const post = results[0];
      const caption = post.text ?? "";
      const handle = post.authorMeta?.name ?? "unknown";
      const followers = post.authorMeta?.fans;
      const videoUrl = post.videoUrl ?? undefined;

      console.log(`📊 [Apify] TikTok - hasVideoUrl: ${!!videoUrl}, caption: ${caption.length} chars`);

      const tiktokThumb =
        post.videoMeta?.coverUrl ?? post.coverUrl ?? post.covers?.[0] ?? undefined;

      // createTime is Unix seconds - convert to ISO string
      const tiktokTimestamp = post.createTime
        ? new Date(post.createTime * 1000).toISOString()
        : undefined;

      return {
        content: {
          text: caption,
          source: "caption",
          platform,
          accountHandle: handle,
          accountFollowers: followers,
          postUrl: url,
          rawCaption: caption,
          thumbnailUrl: tiktokThumb,
          postTimestamp: tiktokTimestamp,
        },
        videoUrl,
      };
    }

    return { content: null };
  } catch (err) {
    console.error("extractFromUrl error:", err);
    return { content: null };
  }
}
