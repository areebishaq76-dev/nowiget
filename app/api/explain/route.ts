import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are NowIGet — a clarity engine. Your job is to give a clear, helpful, human answer to anything a person asks or is confused about. This includes questions, confusions, how-to requests, opinion questions, advice, comparisons, recommendations — anything.

Rules:
- Write like a smart friend texting them an answer. Warm, direct, clear.
- Never use jargon unless you immediately explain it.
- Never start with "Great question!" or "That's a common confusion" or any filler.
- Never use bullet points or headers. Write in natural flowing paragraphs.
- Never say "it is important to note that" or any academic phrasing.
- Keep it concise — aim for 3-5 short paragraphs max.
- Use simple analogies and real-world examples where helpful.
- Adjust complexity based on the user's familiarity level.
- End with a one-sentence takeaway that captures the core insight.
- If someone asks for a recommendation or opinion, give a direct helpful answer — don't dodge it.
- If someone asks something personal, answer warmly and practically like a trusted friend would.

Familiarity levels:
- "beginner": Assume they know nothing. Use the simplest possible language and analogies.
- "some": They have basic understanding. Skip the absolute basics but still keep it simple.
- "comfortable": They understand the topic broadly. Focus on the specific nuance they're asking about.`;

function generateSlug(confusion: string): string {
  return confusion
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function needsLiveData(text: string): boolean {
  const t = text.toLowerCase();
  const signals = [
    "current", "latest", "today", "now", "right now", "this year", "this week",
    "this month", "recent", "recently", "live", "ongoing", "situation",
    "what happened", "who won", "who is winning", "what is the score",
    "2024", "2025", "2026", "2027",
    "news", "update", "result", "score", "standing", "fixture", "schedule",
    "election", "war", "conflict", "crisis", "protest", "attack",
    "psl", "ipl", "world cup", "premier league", "champions league",
    "nba", "nfl", "ufc", "cricket", "match", "tournament", "series",
    "price of", "stock price", "exchange rate", "bitcoin price", "crypto price",
    "weather", "forecast", "pakistan super league", "super league",
    "time in", "what time", "current time", "time now", "time is it",
  ];
  return signals.some((s) => t.includes(s));
}

function getCurrentTimeContext(): string {
  const now = new Date();
  // Generate time for common timezones
  const zones = [
    { name: "Pakistan (PKT)", tz: "Asia/Karachi" },
    { name: "Italy (CET/CEST)", tz: "Europe/Rome" },
    { name: "UK (GMT/BST)", tz: "Europe/London" },
    { name: "USA New York (ET)", tz: "America/New_York" },
    { name: "USA Los Angeles (PT)", tz: "America/Los_Angeles" },
    { name: "Dubai (GST)", tz: "Asia/Dubai" },
    { name: "India (IST)", tz: "Asia/Kolkata" },
    { name: "UTC", tz: "UTC" },
  ];
  const lines = zones.map((z) =>
    `${z.name}: ${now.toLocaleString("en-US", { timeZone: z.tz, hour: "2-digit", minute: "2-digit", hour12: true, weekday: "long", month: "long", day: "numeric", year: "numeric" })}`
  );
  return `Current date and time around the world:\n${lines.join("\n")}`;
}

async function fetchLiveContext(query: string): Promise<string> {
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query,
        search_depth: "basic",
        max_results: 4,
        include_answer: true,
      }),
    });
    const data = await res.json();
    if (!res.ok) return "";
    const lines: string[] = [];
    if (data.answer) lines.push(`Summary: ${data.answer}`);
    if (data.results) {
      data.results.slice(0, 3).forEach((r: { title: string; content: string }) => {
        lines.push(`${r.title}: ${r.content.slice(0, 300)}`);
      });
    }
    return lines.join("\n\n");
  } catch {
    return "";
  }
}

function classifyConfusion(confusion: string): boolean {
  const text = confusion.toLowerCase();
  const privateSignals = [
    "my wife", "my husband", "my girlfriend", "my boyfriend", "my partner",
    "my mom", "my dad", "my father", "my mother", "my sister", "my brother",
    "my boss", "my coworker", "my friend", "my ex",
    "my relationship", "my marriage", "my family",
    "my salary", "my bank", "my account", "my loan", "my debt",
    "my symptom", "my pain", "my diagnosis", "my doctor",
    "i feel like", "i think i have", "am i normal", "is it normal that i",
    "should i break up", "should i quit", "should i leave",
  ];
  return !privateSignals.some((signal) => text.includes(signal));
}

// Generate answer using Groq (primary)
async function generateWithGroq(prompt: string): Promise<string> {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1024,
    temperature: 0.7,
  });
  return response.choices[0]?.message?.content || "";
}

// Generate answer using Gemini (fallback)
async function generateWithGemini(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// Try Groq first, fall back to Gemini if Groq fails
async function generateAnswer(prompt: string): Promise<string> {
  try {
    const text = await generateWithGroq(prompt);
    if (text && text.trim().length > 0) return text;
    throw new Error("Empty response from Groq");
  } catch (e) {
    console.log("[NowIGet] Groq failed, trying Gemini fallback:", e instanceof Error ? e.message.slice(0, 80) : "");
    const text = await generateWithGemini(prompt);
    if (text && text.trim().length > 0) return text;
    throw new Error("Both Groq and Gemini failed");
  }
}

export async function POST(request: NextRequest) {
  try {
    const { confusion, familiarity, history } = await request.json();

    if (!confusion || typeof confusion !== "string" || confusion.trim().length === 0) {
      return NextResponse.json({ error: "Please describe your confusion." }, { status: 400 });
    }

    if (confusion.trim().length > 600) {
      return NextResponse.json({ error: "Your question is too long. Please keep it under 600 characters." }, { status: 400 });
    }

    const VALID_FAMILIARITY = ["beginner", "some", "comfortable"];
    const safeFamiliarity = VALID_FAMILIARITY.includes(familiarity) ? familiarity : "some";

    const conversationContext = Array.isArray(history) && history.length > 0
      ? history.map((h: { question: string; answer: string }) =>
          `Previous question: "${h.question}"\nPrevious answer: "${h.answer.slice(0, 300)}..."`
        ).join("\n\n")
      : "";

    const isPublic = classifyConfusion(confusion.trim());
    const liveContext = needsLiveData(confusion.trim())
      ? await fetchLiveContext(confusion.trim())
      : "";

    const historySection = conversationContext
      ? `\n\nConversation so far (for context — user may be asking a follow-up):\n${conversationContext}`
      : "";

    const timeContext = getCurrentTimeContext();

    const prompt = liveContext
      ? `${SYSTEM_PROMPT}${historySection}

${timeContext}
Fresh data from the web — use if relevant, ignore if not:
${liveContext}

User's question: "${confusion.trim()}"
Familiarity level: ${safeFamiliarity}

Answer clearly:`
      : `${SYSTEM_PROMPT}${historySection}

${timeContext}

User's question: "${confusion.trim()}"
Familiarity level: ${safeFamiliarity}

Answer clearly:`;

    const text = await generateAnswer(prompt);

    let slug = "";
    if (isPublic) {
      slug = generateSlug(confusion.trim());
      // Upsert to handle duplicate slugs gracefully
      const { error: dbError } = await supabase.from("explanations").upsert(
        {
          slug,
          confusion: confusion.trim(),
          familiarity: safeFamiliarity,
          explanation: text,
        },
        { onConflict: "slug", ignoreDuplicates: true }
      );
      if (dbError) console.error("Supabase upsert error:", dbError);
    }

    return NextResponse.json({
      explanation: text,
      slug: isPublic ? slug : "",
      isPublic,
    });

  } catch (error: unknown) {
    console.error("API error:", error);
    const raw = error instanceof Error ? error.message : "";

    if (raw.includes("429") || raw.includes("quota") || raw.includes("Too Many Requests") || raw.includes("rate_limit")) {
      return NextResponse.json(
        { error: "We're getting a lot of questions right now. Please wait a few seconds and try again." },
        { status: 429 }
      );
    }

    if (raw.includes("503") || raw.includes("overloaded") || raw.includes("Service Unavailable")) {
      return NextResponse.json(
        { error: "The AI is overloaded right now. Please wait a few seconds and try again." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
