import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

function generateSlug(confusion: string): string {
  return confusion
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

async function classifyConfusion(model: ReturnType<typeof genAI.getGenerativeModel>, confusion: string): Promise<boolean> {
  try {
    const result = await model.generateContent(
      `Classify this question as either "public" or "private".

"public" = general knowledge, concepts, science, history, how things work, news, technology — useful for anyone to read.
"private" = personal situations, relationships, health symptoms, private feelings, specific people, personal finances — only relevant to the person asking.

Question: "${confusion}"

Reply with ONLY the word "public" or "private". Nothing else.`
    );
    const answer = result.response.text().trim().toLowerCase();
    return answer === "public";
  } catch {
    // If classification fails, default to public
    return true;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { confusion, familiarity } = await request.json();

    if (!confusion || typeof confusion !== "string" || confusion.trim().length === 0) {
      return NextResponse.json({ error: "Please describe your confusion." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Generate explanation and classify in parallel
    const [explanationResult, isPublic] = await Promise.all([
      model.generateContent(`${SYSTEM_PROMPT}

The user's confusion:
"${confusion.trim()}"

Their familiarity level: ${familiarity || "some"}

Now resolve their confusion clearly:`),
      classifyConfusion(model, confusion.trim()),
    ]);

    const text = explanationResult.response.text();
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
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
