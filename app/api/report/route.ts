import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const { error } = await supabase
      .from("explanations")
      .update({ reported: true })
      .eq("slug", slug);

    if (error) {
      console.error("Supabase report error:", error);
      return NextResponse.json({ error: "Could not submit report." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
