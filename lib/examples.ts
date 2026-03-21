import { AnalysisResult } from "./types";

export interface Example {
  label: string;
  platform: "instagram" | "tiktok";
  result: AnalysisResult;
}

export const EXAMPLES: Example[] = [
  {
    label: "JJ Gabriel 'Kid Messi' at Man Utd",
    platform: "instagram",
    result: {
      overallVerdict: "MISLEADING",
      verdictReason:
        "This post is a genuine and enthusiastic celebration of a young footballer's talent, and the core story about JJ Gabriel being a remarkable prospect at Manchester United is well supported, but specific claims about first-team training and meetings with Lamine Yamal and Sir Alex Ferguson are either contradicted or entirely unverified by available evidence.",
      claims: [
        {
          text: "SV2 is a YouTuber who made a video with 9 year old JJ Gabriel calling him 'Kid Messi'",
          verdict: "UNVERIFIED",
          confidence: 0.4,
          explanation:
            "The search evidence does not confirm or deny this specific claim about SV2's video. SV2 is a known football content creator on YouTube, and the story is plausible given the wider documented interest in JJ Gabriel, but no evidence snippet directly corroborates this particular video or the 'Kid Messi' label being applied when Gabriel was 9.",
          category: "Media/Content",
          sources: [
            {
              name: "The New York Times",
              url: "https://www.nytimes.com/athletic/6877360/2025/12/10/jj-gabriel-manchester-united/",
              date: "Dec 10, 2025",
              snippet: "The teenager made his first appearance at Old Trafford on Tuesday and his performance showed why he is generating such excitement.",
            },
          ],
        },
        {
          text: "JJ Gabriel is now at Manchester United's academy",
          verdict: "TRUE",
          confidence: 0.97,
          explanation:
            "Multiple credible sources including the BBC, Sports Illustrated, Manchester Evening News, and the New York Times all confirm that JJ Gabriel is a Manchester United academy player. He is described as a 15-year-old forward playing for Darren Fletcher's Under-18 side and is widely regarded as a standout talent.",
          category: "Football/Sport",
          sources: [
            {
              name: "Manchester Evening News",
              url: "https://www.manchestereveningnews.co.uk/sport/football/football-news/man-united-ajayi-jj-gabriel-33617767",
              date: "3 days ago",
              snippet: "Man Utd U18s won 3-2 against Sunderland in the FA Youth Cup quarter-finals and Noah Ajayi notched another goal.",
            },
            {
              name: "The New York Times",
              url: "https://www.nytimes.com/athletic/7115189/2026/03/13/jj-gabriel-carrick-man-united-talent-age-news/",
              date: "1 week ago",
              snippet: "Michael Carrick has reminded Manchester United fans of the legal considerations regarding young forward JJ Gabriel's playing future.",
            },
            {
              name: "BBC",
              url: "https://www.bbc.com/sport/football/articles/c4gen28n9e4o",
              date: "4 days ago",
              snippet: "New Man Utd academy chief Stephen Torpey talks for the first time about 'world class' demands of the job, not wanting the club to be parents...",
            },
            {
              name: "Sports Illustrated",
              url: "https://www.si.com/soccer/15-year-old-jj-gabriel-claim-rewrite-man-utd-history",
              date: "2 weeks ago",
              snippet: "Manchester United look to have produced another academy gem.",
            },
            {
              name: "The Mirror",
              url: "https://www.mirror.co.uk/sport/football/news/jj-gabriel-rashford-man-utd-36880782",
              date: "3 days ago",
              snippet: "JJ Gabriel has been in sensational form for Manchester United's academy sides this season.",
            },
          ],
        },
        {
          text: "JJ Gabriel has trained with Manchester United's first team",
          verdict: "MISLEADING",
          confidence: 0.72,
          explanation:
            "Multiple sources including ESPN, Sports Illustrated, the Mirror, and the BBC confirm that Gabriel is too young to play in the Premier League this season, and Michael Carrick has publicly stated he cannot make his debut yet. While the New York Times references an appearance at Old Trafford, there is no clear corroborating evidence of formal first-team training sessions, making the claim an overstatement of what is currently documented.",
          category: "Football/Sport",
          sources: [
            {
              name: "BBC",
              url: "https://www.bbc.com/sport/football/articles/ckg8gp88m8xo",
              date: "2 days ago",
              snippet: "At 15, Manchester United's JJ Gabriel is too young to play in the Premier League but he is already showing clear signs he is a huge talent.",
            },
            {
              name: "ESPN",
              url: "https://www.espn.com/football/story/_/id/48196757/man-united-michael-carrick-jj-gabriel-too-young-play-big-talent-u18s",
              date: "1 week ago",
              snippet: "Michael Carrick has confirmed that highly-rated academy prospect JJ Gabriel is too young to make his Manchester United debut,",
            },
            {
              name: "Sports Illustrated",
              url: "https://www.si.com/soccer/why-rising-star-jj-gabriel-wont-play-man-utd-this-season",
              date: "1 week ago",
              snippet: "Manchester United manager Michael Carrick confirmed that JJ Gabriel is \"too young\" to appear in a Premier League squad this season but that...",
            },
            {
              name: "United In Focus",
              url: "https://www.unitedinfocus.com/news/jj-gabriel-sends-message-after-man-utd-first-team-training-marcus-rashford-responds/",
              date: "1 week ago",
              snippet: "Marcus Rashford has sent a message to Manchester United wonderkid JJ Gabriel after he was spotted in first-team training.",
            },
            {
              name: "The Mirror",
              url: "https://www.mirror.co.uk/sport/football/news/jj-gabriel-utd-arsenal-dowman-36887035",
              date: "16 hours ago",
              snippet: "Manchester United's JJ Gabriel cannot play in the Premier League this season due to age restrictions.",
            },
          ],
        },
        {
          text: "JJ Gabriel has linked up with Lamine Yamal and Sir Alex Ferguson at age 15",
          verdict: "UNVERIFIED",
          confidence: 0.2,
          explanation:
            "No search evidence found supports this claim. While it is not impossible that a high-profile young player could meet football figures like Yamal or Ferguson, this is a specific factual claim that requires direct evidence and none has been found. It should be treated with caution until verified.",
          category: "Football/Sport",
          sources: [],
        },
      ],
      credibilityScore: 45,
      accountSummary: "@ballerzscout",
      extractedContent: {
        text: "When you deep it it's actually crazy… SV2 genuinely found a player who could be the best in their generation at 9 years old 🤯 Throwback to when SV2, a YouTuber, made a video with 9 year old JJ Gabriel calling him \u201cKid Messi\u201d. 6 years later, that same player is at Manchester United's academy and has trained with the first team already 😱\n\nJJ Gabriel is regarded as the best academy player in the world. Man United worked hard to keep him following interest from clubs like Barcelona… The very team Messi played for 🔥 At 15, he's linked up with legends of the game such as Lamine Yamal and Sir Alex Ferguson. He could really go on to be an insane footballer. And SV2 spotted this way before many. Legendary 👏",
        source: "caption",
        platform: "instagram",
        accountHandle: "ballerzscout",
        postUrl: "https://www.instagram.com/p/DVyy2YcjZy7/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        rawCaption:
          "When you deep it it's actually crazy… SV2 genuinely found a player who could be the best in their generation at 9 years old 🤯 Throwback to when SV2, a YouTuber, made a video with 9 year old JJ Gabriel calling him \u201cKid Messi\u201d. 6 years later, that same player is at Manchester United's academy and has trained with the first team already 😱\n\nJJ Gabriel is regarded as the best academy player in the world. Man United worked hard to keep him following interest from clubs like Barcelona… The very team Messi played for 🔥 At 15, he's linked up with legends of the game such as Lamine Yamal and Sir Alex Ferguson. He could really go on to be an insane footballer. And SV2 spotted this way before many. Legendary 👏",
        thumbnailUrl:
          "https://scontent-ord5-3.cdninstagram.com/v/t51.82787-15/651186324_18025834367799234_3148379844040540412_n.jpg?stp=dst-jpg_e15_fr_p1080x1080_tt6&_nc_ht=scontent-ord5-3.cdninstagram.com&_nc_cat=1&_nc_oc=Q6cZ2gFZz4OM7Z2jsYpuICTi7spCGXWcV7VL1nxj4bWVgeSiuDsNvVqToEf9kETVpCHj6M8&_nc_ohc=g910xB9HDKUQ7kNvwGCH5my&_nc_gid=u8063YRxXjl-7yLZ5WgvgA&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfwpRA1vvw6w0awuNBIh_XyRg1Qgbu6vh-qWpS4SdlkKiQ&oe=69C4D5BC&_nc_sid=10d13b",
        postTimestamp: "2026-03-12T18:00:20.000Z",
      },
      processingTimeMs: 22998,
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
