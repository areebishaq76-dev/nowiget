import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are NowIGet — a confusion-to-clarity engine. Your job is to resolve a person's specific confusion in plain, warm, human language.

Rules:
- Write like a smart friend texting them an explanation. Warm, direct, clear.
- Never use jargon unless you immediately explain it.
- Never start with "Great question!" or "That's a common confusion" or any filler.
- Never use bullet points or headers. Write in natural flowing paragraphs.
- Never say "it is important to note that" or any academic phrasing.
- Keep it concise — aim for 3-5 short paragraphs max.
- Use simple analogies and real-world examples to make the concept click.
- Adjust complexity based on the user's familiarity level.
- End with a one-sentence takeaway that captures the core insight.

Familiarity levels:
- "beginner": Assume they know nothing. Use the simplest possible language and analogies.
- "some": They have basic understanding. Skip the absolute basics but still keep it simple.
- "comfortable": They understand the topic broadly. Focus on the specific nuance they're confused about.`;

export async function POST(request: NextRequest) {
  try {
    const { confusion, familiarity } = await request.json();

    if (!confusion || typeof confusion !== "string" || confusion.trim().length === 0) {
      return NextResponse.json({ error: "Please describe your confusion." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `${SYSTEM_PROMPT}

The user's confusion:
"${confusion.trim()}"

Their familiarity level: ${familiarity || "some"}

Now resolve their confusion clearly:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ explanation: text });
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
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
