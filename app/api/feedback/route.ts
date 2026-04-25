import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { slug, helpful } = await request.json();

    if (!slug || typeof helpful !== "boolean") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const column = helpful ? "helpful_yes" : "helpful_no";

    const { error } = await supabase.rpc("increment_feedback", {
      row_slug: slug,
      column_name: column,
    });

    if (error) {
      // Fallback: direct update if RPC doesn't exist yet
      const { data: current } = await supabase
        .from("explanations")
        .select(column)
        .eq("slug", slug)
        .single();

      if (current) {
        await supabase
          .from("explanations")
          .update({ [column]: (current[column] as number) + 1 })
          .eq("slug", slug);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
