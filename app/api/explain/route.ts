import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

// Classify without a second API call — keyword-based heuristic
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

export async function POST(request: NextRequest) {
  try {
    const { confusion, familiarity } = await request.json();

    if (!confusion || typeof confusion !== "string" || confusion.trim().length === 0) {
      return NextResponse.json({ error: "Please describe your confusion." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const isPublic = classifyConfusion(confusion.trim());

    const explanationResult = await model.generateContent(`${SYSTEM_PROMPT}

The user's confusion:
"${confusion.trim()}"

Their familiarity level: ${familiarity || "some"}

Now resolve their confusion clearly:`);

    let text = "";
    try {
      text = explanationResult.response.text();
    } catch {
      // Gemini blocked the response (safety filter)
      return NextResponse.json(
        { error: "We weren't able to generate an explanation for that. Try rephrasing what specifically confuses you." },
        { status: 422 }
      );
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "We weren't able to generate an explanation for that. Try rephrasing what specifically confuses you." },
        { status: 422 }
      );
    }

    let slug = "";

    // Only save to database if the confusion is public/general knowledge
    if (isPublic) {
      slug = generateSlug(confusion.trim());

      const { error: dbError } = await supabase.from("explanations").insert({
        slug,
        confusion: confusion.trim(),
        familiarity: familiarity || "some",
        explanation: text,
      });

      if (dbError) {
        console.error("Supabase insert error:", dbError);
      }
    }

    return NextResponse.json({
      explanation: text,
      slug: isPublic ? slug : "",
      isPublic,
    });
  } catch (error: unknown) {
    console.error("Gemini API error:", error);
    const raw = error instanceof Error ? error.message : "";

    if (raw.includes("429") || raw.includes("quota") || raw.includes("Too Many Requests")) {
      return NextResponse.json(
        { error: "We're getting a lot of questions right now. Please wait a few seconds and try again." },
        { status: 429 }
      );
    }

    if (raw.includes("API_KEY_INVALID") || raw.includes("API key not valid")) {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Hmm, we couldn't generate a clear explanation for that. Try rephrasing your confusion — describe what specifically you don't understand." },
      { status: 500 }
    );
  }
}
