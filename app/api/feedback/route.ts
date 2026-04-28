import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { slug, helpful } = await request.json();

    if (!slug || typeof slug !== "string" || typeof helpful !== "boolean") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const column = helpful ? "helpful_yes" : "helpful_no";

    await supabase.rpc("increment_feedback", { row_slug: slug, col_name: column });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
