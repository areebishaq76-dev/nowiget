import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { slug, helpful } = await request.json();

    if (!slug || typeof helpful !== "boolean") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const column = helpful ? "helpful_yes" : "helpful_no";

    // Get current value
    const { data: current } = await supabase
      .from("explanations")
      .select("helpful_yes, helpful_no")
      .eq("slug", slug)
      .single();

    if (current) {
      const currentValue = helpful ? current.helpful_yes : current.helpful_no;
      await supabase
        .from("explanations")
        .update({ [column]: (currentValue as number) + 1 })
        .eq("slug", slug);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
