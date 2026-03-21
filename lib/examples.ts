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
    label: "Aldi protein granola health halo",
    platform: "tiktok",
    result: {
      overallVerdict: "UNVERIFIED",
      verdictReason:
        "This post raises genuinely important and well-documented concerns about health halo marketing in the food industry, and its core message is grounded in real nutritional science, but the specific product comparisons it makes cannot be independently verified from the available evidence.",
      claims: [
        {
          text: "The high protein granola in Aldi contains more sugar than protein",
          verdict: "UNVERIFIED",
          confidence: 0.3,
          explanation:
            "None of the search evidence snippets provide the actual nutritional breakdown of the specific Aldi high protein granola referenced in this post. The snippets confirm that Aldi does sell high-protein granola products, but do not include sugar or protein figures that would allow us to verify or refute this specific claim. Without access to the product label data, this remains unverified.",
          category: "Nutrition / Food Labelling",
          sources: [
            {
              name: "Daily Meal",
              url: "https://www.thedailymeal.com/2060201/high-protein-aldi-products-diet/",
              date: "Dec 29, 2025",
              snippet: "Aldi helps customers meet nutrition goals with snacks and meals that are high in protein, including steak tips, granola, and yogurt.",
            },
            {
              name: "Yahoo",
              url: "https://www.yahoo.com/lifestyle/articles/7-best-high-protein-snacks-140000389.html",
              date: "Jan 2, 2026",
              snippet: "Add these to your cart on your next grocery run.",
            },
            {
              name: "The Takeout",
              url: "https://www.thetakeout.com/2082897/high-protein-aldi-finds/",
              date: "1 month ago",
              snippet: "If you're bulking up on protein or want to simply incorporate it more into your lifestyle, these high-protein finds from Aldi are affordable...",
            },
            {
              name: "Herald Sun",
              url: "https://www.heraldsun.com.au/health/diet/nutrition/nut-protein-yoghurt-granola-experts-reveal-the-healthiest-and-least-healthy-muesli-bars/news-story/af672f2702d7bcccf50565f3ca86f701",
              date: "1 month ago",
              snippet: "Dietitians have ranked muesli bars from major supermarkets and revealed which ones contain surprisingly high sugar levels.",
            },
            {
              name: "The Irish Independent",
              url: "https://www.independent.ie/life/food-drink/food-reviews/the-supermarket-granola-taste-test-the-winner-tastes-good-and-has-the-least-sugar-content-of-all-the-ones-we-tested/a52575309.html",
              date: "Dec 31, 2025",
              snippet: "Granola is a breakfast cereal staple, but you might prefer it as a topping for yoghurt or to eat it straight from the bag.",
            },
          ],
        },
        {
          text: "Kavanagh's Double Oat Granola has only slightly less protein than the Aldi high protein granola",
          verdict: "UNVERIFIED",
          confidence: 0.2,
          explanation:
            "No search evidence was found relating to Kavanagh's Double Oat Granola or its nutritional profile. This claim requires direct comparison of the two products' nutrition labels, which is not possible from the available evidence. It may well be accurate, as the creator appears to have reviewed both labels directly, but it cannot be independently confirmed here.",
          category: "Nutrition / Food Labelling",
          sources: [],
        },
        {
          text: "Kavanagh's Double Oat Granola has significantly more fibre per serving than the Aldi high protein granola",
          verdict: "UNVERIFIED",
          confidence: 0.2,
          explanation:
            "No search evidence was found for Kavanagh's Double Oat Granola or its fibre content. This is a specific comparative nutritional claim that would require verified product data to confirm. The creator may have reviewed the labels personally, but independent verification is not possible from the evidence available.",
          category: "Nutrition / Food Labelling",
          sources: [],
        },
      ],
      credibilityScore: 30,
      accountSummary: "@sophiemorrisofficial · 89,200 followers",
      extractedContent: {
        text: "When we see packaging like this in the supermarkets, we need to realise that these health claims are marketing tactics designed to encourage us to buy more, and while the claim they're making is often correct, it doesn't give us the overall picture of what's in the product!\n\nThe term for this is \u201cHealth Halos\u201d. Health Halos are marketing techniques used on food packaging to give the impression that a product is healthier than it actually is. These \u201chalos\u201d rely on buzzwords, imagery, or claims that highlight a single positive aspect of the product, such as \u201clow fat,\u201d \u201chigh protein,\u201d \u201csugar free,\u201d while distracting from less healthy elements like added sugars or artificial additives. Like this high protein granola in Aldi!\n\n#sophiesswaps #cleverswaps #protein #healthhalos #foodlabels",
        source: "caption",
        platform: "tiktok",
        accountHandle: "sophiemorrisofficial",
        accountFollowers: 89200,
        postUrl:
          "https://www.tiktok.com/@sophiemorrisofficial/video/7469894688481283330?is_from_webapp=1&sender_device=pc&web_id=7588215976929330710",
        rawCaption:
          "When we see packaging like this in the supermarkets, we need to realise that these health claims are marketing tactics designed to encourage us to buy more, and while the claim they're making is often correct, it doesn't give us the overall picture of what's in the product!\n\nThe term for this is \u201cHealth Halos\u201d. Health Halos are marketing techniques used on food packaging to give the impression that a product is healthier than it actually is.\n\n#sophiesswaps #cleverswaps #protein #healthhalos #foodlabels",
        postTimestamp: "2025-02-10T20:46:33.000Z",
        thumbnailUrl:
          "https://p16-common-sign.tiktokcdn-us.com/tos-no1a-p-0037-no/oAnBiAKrTC8BwOKqEBBaif04yZ1mzIAIcCgIwH~tplv-tiktokx-origin.image?dr=9636&x-expires=1774227600&x-signature=YkZL0%2BHBu988AFeR4Mkb0xXqg5s%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast8",
      },
      processingTimeMs: 33001,
    },
  },
];
