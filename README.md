# Verifai

**Fact-check anything. Instantly.**

Paste an Instagram Reel or TikTok link — Verifai extracts the content, searches the web for evidence, and delivers an AI-powered verdict with sources in under 60 seconds.

**[verifai-it.app](https://verifai-it.app)**

---

## What it does

Misinformation spreads fastest through short-form video. Verifai is built to meet it there. Drop in a social media link and get back a clear verdict — TRUE, FALSE, MISLEADING, UNVERIFIED, or NO EVIDENCE — with a credibility score, explanation, and the sources that informed it.

---

## How it works

1. **Extract** — caption and audio are pulled from Instagram/TikTok via Apify scrapers; audio is transcribed by Deepgram
2. **Classify** — Claude identifies the content genre (health, politics, finance, science, humanitarian, religion, and more) and extracts the specific claims being made
3. **Search** — Serper runs three-tier web searches: news sources → authority sites (Reuters, BBC, UN, HRW) → general web; enriched by the Google Fact Check API
4. **Verdict** — Claude evaluates all evidence and returns a verdict with confidence score and plain-English explanation
5. **Cache** — Redis caches results for repeat URLs for instant re-checks

---

## Features

- Instagram Reel and TikTok support
- 11 content genres with specialised authority sources per genre
- Credibility score (0–100) factoring verdict, source quality, and claim accuracy
- Shareable result cards
- Free tier with email gating; paid tier via Stripe
- Rate limiting via Upstash
- All checks logged to Notion for analytics

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| AI analysis | Claude Sonnet (Anthropic) |
| Web search | Serper API + Google Fact Check API |
| Content scraping | Apify (Instagram & TikTok) |
| Audio transcription | Deepgram |
| Caching & rate limiting | Upstash Redis |
| Payments | Stripe |
| Logging | Notion API |
| Analytics | Vercel Analytics |

---

## Getting started

```bash
npm install
npm run dev
```

Required environment variables:

```env
ANTHROPIC_API_KEY=
SERPER_API_KEY=
APIFY_API_TOKEN=
DEEPGRAM_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
STRIPE_SECRET_KEY=
NOTION_API_KEY=
NOTION_DATABASE_ID=
```

---

## License

MIT
