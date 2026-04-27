# NowIGet — Finally Understand Anything

A **confusion-to-clarity engine**. Describe exactly what you're confused about in your own words. Get a clear, human explanation — like a smart friend texting back.

Live at: **[nowiget.vercel.app](https://nowiget.vercel.app)**

---

## What It Does

Most tools explain topics. NowIGet resolves **specific confusions**.

- Not: "Explain inflation"
- But: "I keep hearing about inflation but don't understand why it's bad if my salary also goes up"

Every explanation is saved as a permanent, Google-indexed page — so the next person who searches that same confusion finds the answer instantly.

---

## Features

- Describe your confusion in plain words — no prompting skill needed
- Familiarity picker (beginner / know a little / fairly comfortable) personalizes the answer
- Warm, human-language explanations — no jargon, no bullet points
- Follow-up questions with full conversation context
- Real-time data via Tavily for current events, scores, prices, time zones
- Every public explanation saved as a permanent SEO page (`/explain/slug`)
- View counter on every explanation page
- "Confusion of the Day" at `/today`
- Auto-generated sitemap at `/sitemap.xml`
- Schema.org FAQ markup for Google featured snippets
- "Now I Get It" share card — one-click copy to share anywhere
- Private question detection — personal questions never saved to database
- Yes/No feedback on every explanation
- Report button for inaccurate content
- Recent questions saved in localStorage (no account needed)
- Share buttons: X, WhatsApp, copy link, native mobile share

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 + TypeScript + Tailwind CSS v4 |
| Primary AI | Groq — `llama-3.3-70b-versatile` (14,400 req/day free) |
| Fallback AI | Google Gemini 2.5 Flash |
| Real-time search | Tavily API |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel |
| Analytics | Google Analytics (planned) |

**Total monthly cost: $0**

---

## Local Development

```bash
git clone https://github.com/areebishaq76-dev/nowiget.git
cd nowiget
npm install
```

Create `.env.local`:

```
GEMINI_API_KEY=your_key
GROQ_API_KEY=your_key
TAVILY_API_KEY=your_key
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Database (Supabase)

Table: `explanations`

| Column | Type |
|---|---|
| id | uuid |
| slug | text |
| confusion | text |
| familiarity | text |
| explanation | text |
| helpful_yes | integer |
| helpful_no | integer |
| reported | boolean |
| views | integer |
| created_at | timestamp |

Required SQL function:

```sql
CREATE OR REPLACE FUNCTION increment_views(row_slug text)
RETURNS void AS $$
  UPDATE explanations SET views = views + 1 WHERE slug = row_slug;
$$ LANGUAGE sql;
```

---

## Project Structure

```
app/
  page.tsx              # Homepage
  today/page.tsx        # Confusion of the day
  explain/[slug]/       # Permanent explanation pages
  api/explain/          # AI answer generation (Groq + Gemini + Tavily)
  api/feedback/         # Yes/No feedback
  api/report/           # Report inaccurate pages
  api/view/             # View counter increment
  api/og/               # Dynamic OG image generation
  sitemap.ts            # Auto-generated XML sitemap
lib/
  supabase.ts           # Supabase client
```

---

Built by [Areeb Ishaq](https://github.com/areebishaq76-dev) — General Manager at CodesSavvy, Karachi.
