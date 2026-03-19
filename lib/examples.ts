import { AnalysisResult } from "./types";

export interface Example {
  label: string;
  platform: "instagram" | "tiktok";
  result: AnalysisResult;
}

export const EXAMPLES: Example[] = [
  {
    label: "Saudi Crown Prince quote",
    platform: "instagram",
    result: {
      overallVerdict: "MISLEADING",
      verdictReason:
        "This post attributes a striking quote directly to the Saudi Crown Prince, but there is no credible evidence that Mohammed bin Salman ever made this statement, and given the complex and often tense history between Saudi Arabia and Iran, such a claim deserves serious scrutiny before being shared.",
      claims: [
        {
          text: "Saudi Crown Prince stated: 'Today, the entire Islamic world stands behind Iran'",
          verdict: "NO_EVIDENCE",
          confidence: 0.88,
          explanation:
            "There is no credible record of Saudi Crown Prince Mohammed bin Salman making this statement. Saudi Arabia and Iran have been regional rivals for decades, competing for influence across the Middle East, and their relationship has been marked by deep sectarian, political, and strategic tensions. Saudi Arabia and Iran only formally restored diplomatic relations in March 2023 after a seven-year break, brokered by China, but even that diplomatic thaw did not produce rhetoric suggesting full Islamic solidarity of this kind. Attributing fabricated or unverified quotes to world leaders, especially on sensitive geopolitical matters, can be genuinely harmful and misleading.",
          category: "politics",
          sources: [
            {
              name: "The New York Times",
              url: "https://www.nytimes.com/live/2025/11/18/world/trump-saudi-crown-prince-visit",
              date: "Nov 19, 2025",
            },
            {
              name: "Tehran Times",
              url: "https://www.tehrantimes.com/news/514378/Saudi-Arabia-warns-Israel-is-trying-to-drag-U-S-into-conflict",
              date: "Jun 14, 2025",
            },
            {
              name: "Middle East Council on Global Affairs",
              url: "https://mecouncil.org/publication/the-saudi-iranian-detente-a-strategic-imperative/",
              date: "Jun 2025",
            },
            {
              name: "Al Arabiya English",
              url: "https://english.alarabiya.net/News/middle-east/2025/06/22/saudi-crown-prince-holds-talks-with-regional-world-leaders-amid-iran-crisis",
              date: "Jun 22, 2025",
            },
            {
              name: "BBC",
              url: "https://www.bbc.com/news/articles/c147gkxyyrmo",
              date: "Sep 22, 2025",
            },
          ],
        },
        {
          text: "There is a significant shift in geopolitical dynamics emphasising unity within the Islamic world",
          verdict: "UNVERIFIED",
          confidence: 0.55,
          explanation:
            "While the 2023 Saudi-Iran rapprochement, facilitated by China, did represent a notable diplomatic development, describing this as the entire Islamic world uniting behind Iran significantly overstates the reality. The Islamic world is diverse and politically fragmented, with countries holding very different relationships with Iran.",
          category: "politics",
          sources: [],
        },
      ],
      credibilityScore: 20,
      accountSummary: "@lougpakistan",
      extractedContent: {
        text: "\u201cToday, the entire Islamic world stands behind Ir@n\u201d - Saudi Crown Prince. This statement highlights a significant shift in geopolitical dynamics, emphasizing unity and solidarity within the Islamic world.\n\n#IslamicUnity #Geopolitics #MiddleEast #Iran #SaudiArabia #CrownPrince #GlobalPolitics #IslamicWorld",
        source: "caption",
        platform: "instagram",
        accountHandle: "lougpakistan",
        postUrl:
          "https://www.instagram.com/p/DK7XZ1psMKu/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        rawCaption:
          "\u201cToday, the entire Islamic world stands behind Ir@n\u201d - Saudi Crown Prince. This statement highlights a significant shift in geopolitical dynamics, emphasizing unity and solidarity within the Islamic world.\n\n#IslamicUnity #Geopolitics #MiddleEast #Iran #SaudiArabia #CrownPrince #GlobalPolitics #IslamicWorld",
        postTimestamp: "2025-06-15T16:08:20.000Z",
      },
      processingTimeMs: 17407,
    },
  },
  {
    label: "Dubai drone strike",
    platform: "tiktok",
    result: {
      overallVerdict: "UNVERIFIED",
      verdictReason:
        "This post makes specific, serious geopolitical claims about an Iranian drone strike on Dubai that cannot be confirmed against available verified public record, and given the gravity of such an event, it is important to treat this with caution until credible sources can confirm the details.",
      claims: [
        {
          text: "An Iranian drone strike has hit the International Financial Centre in Dubai.",
          verdict: "NO_EVIDENCE",
          confidence: 0.15,
          explanation:
            "A confirmed Iranian drone strike on the Dubai International Financial Centre would be an extraordinary geopolitical event that major international news organisations such as Reuters, the BBC, and AP would cover extensively. No widely verified reporting of such a strike is available in the public record. This claim should not be accepted without clear confirmation from UAE authorities, credible international news agencies, or official government statements.",
          category: "politics",
          sources: [
            {
              name: "Financial Times",
              url: "https://www.ft.com/content/2dddfaa2-a163-4e59-a6ef-7d9d6e334023",
              date: "Mar 13, 2026",
            },
            {
              name: "CNBC",
              url: "https://www.cnbc.com/2026/03/13/dubai-expats-drones-missiles-uae-iran-war.html",
              date: "Mar 13, 2026",
            },
            {
              name: "Middle East Eye",
              url: "https://www.middleeasteye.net/live-blog/live-blog-update/dubai-financial-hub-hit-intercepted-drone-after-iran-threatens-banks",
              date: "Mar 13, 2026",
            },
            {
              name: "The Independent",
              url: "https://www.independent.co.uk/news/world/middle-east/dubai-iran-drone-attack-business-district-b2937895.html",
              date: "Mar 13, 2026",
            },
            {
              name: "New York Post",
              url: "https://nypost.com/2026/03/13/world-news/international-financial-centre-in-dubai-hit-by-kamikaze-drone/",
              date: "Mar 13, 2026",
            },
          ],
        },
        {
          text: "Authorities reported no injuries and only minor damage to the building.",
          verdict: "UNVERIFIED",
          confidence: 0.15,
          explanation:
            "This detail appears to be sourced from the same unverified reporting as the original claim. While it is possible for authorities to respond quickly with damage assessments, this cannot be independently confirmed without a verifiable official statement from Dubai or UAE authorities such as the Dubai Police or UAE Ministry of Interior.",
          category: "politics",
          sources: [],
        },
        {
          text: "Banks in the city have ordered their staff to not return to offices after Iran threatened to hit US and Israeli financial institutions.",
          verdict: "UNVERIFIED",
          confidence: 0.2,
          explanation:
            "Iran has at various times issued broad threats against US and Israeli interests, which is documented in statements reported by outlets such as Reuters and AP. However, the specific claim that banks in Dubai ordered staff not to return to offices in direct response to such threats in this context requires corroboration from named financial institutions or verified news reporting.",
          category: "finance",
          sources: [
            {
              name: "CBS News",
              url: "https://www.cbsnews.com/live-updates/iran-war-us-israel-strait-of-hormuz-ship-attacks-persian-gulf-drones-missiles/",
              date: "Mar 11, 2026",
            },
            {
              name: "The New York Times",
              url: "https://www.nytimes.com/live/2026/02/28/world/iran-strikes-trump",
              date: "Feb 28, 2026",
            },
          ],
        },
      ],
      credibilityScore: 30,
      accountSummary: "@metrouk · 2,700,000 followers",
      extractedContent: {
        text: "An Iranian drone strike has hit the International Financial Centre in Dubai.\n\nAuthorities reported no injuries and said there was only minor damage to the building.\n\nBanks in the city have ordered their staff to not return to the offices, after Iran threatened to hit US and Israeli financial institutions.\n\n#dubai #usa #iran",
        source: "caption",
        platform: "tiktok",
        accountHandle: "metrouk",
        accountFollowers: 2700000,
        postUrl:
          "https://www.tiktok.com/@metrouk/video/7616686552244063510?is_from_webapp=1&sender_device=pc",
        rawCaption:
          "An Iranian drone strike has hit the International Financial Centre in Dubai.\n\nAuthorities reported no injuries and said there was only minor damage to the building.\n\nBanks in the city have ordered their staff to not return to the offices, after Iran threatened to hit US and Israeli financial institutions.\n\n#dubai #usa #iran",
        postTimestamp: "2026-03-13T10:34:08.000Z",
      },
      processingTimeMs: 28531,
    },
  },
];
