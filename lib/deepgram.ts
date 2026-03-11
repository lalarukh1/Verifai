export async function transcribeFromUrl(
  videoUrl: string
): Promise<string | null> {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    console.error("❌ [Deepgram] DEEPGRAM_API_KEY is not set");
    return null;
  }
  console.log("🔄 [Deepgram] Transcribing audio...");

  try {
    const response = await fetch(
      "https://api.deepgram.com/v1/listen?model=nova-2&detect_language=true&summarize=v2",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: videoUrl }),
      }
    );

    if (!response.ok) {
      console.error(
        `Deepgram transcription failed with status ${response.status}`
      );
      return null;
    }

    const data = (await response.json()) as {
      results?: {
        channels?: {
          alternatives?: { transcript?: string }[];
        }[];
      };
    };

    const transcript =
      data?.results?.channels?.[0]?.alternatives?.[0]?.transcript;

    if (!transcript || transcript.trim().length === 0) {
      console.warn("⚠️  [Deepgram] No transcript returned");
      return null;
    }

    console.log(`✅ [Deepgram] Transcript ready - ${transcript.length} chars`);
    return transcript;
  } catch (err) {
    console.error("❌ [Deepgram] Transcription failed:", err);
    return null;
  }
}
