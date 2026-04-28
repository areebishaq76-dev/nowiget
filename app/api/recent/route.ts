import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const CATEGORIES: { keywords: string[]; label: string; emoji: string }[] = [
  { keywords: ["plane", "fly", "gravity", "physics", "atom", "molecule", "dna", "evolution", "space", "planet", "star", "black hole", "quantum", "light", "sound", "energy", "force", "pressure", "temperature", "battery", "electricity", "magnet"], label: "Science", emoji: "🔬" },
  { keywords: ["crypto", "bitcoin", "blockchain", "stock", "inflation", "economy", "gdp", "dollar", "tax", "bank", "loan", "interest", "investment", "market", "recession", "debt", "pkr", "rate"], label: "Finance", emoji: "💰" },
  { keywords: ["ai", "machine learning", "algorithm", "code", "programming", "software", "internet", "data", "server", "cloud", "app", "computer", "neural", "model", "api", "javascript", "python"], label: "Technology", emoji: "💻" },
  { keywords: ["virus", "bacteria", "vaccine", "symptom", "disease", "cancer", "brain", "heart", "blood", "medicine", "doctor", "health", "mental", "anxiety", "immune", "protein", "cell", "surgery"], label: "Health", emoji: "🏥" },
  { keywords: ["election", "government", "president", "parliament", "war", "pakistan", "democracy", "policy", "law", "court", "constitution", "tax", "protest", "political", "vote"], label: "Politics", emoji: "🏛️" },
  { keywords: ["cricket", "football", "soccer", "worldcup", "psl", "ipl", "nba", "match", "team", "player", "score", "tournament", "sport", "game", "champion", "league"], label: "Sports", emoji: "🏆" },
  { keywords: ["history", "ancient", "war", "empire", "civilization", "revolution", "century", "historical", "past", "culture", "religion", "philosophy"], label: "History", emoji: "📜" },
];

function detectCategory(confusion: string): { label: string; emoji: string } {
  const t = confusion.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.keywords.some((k) => t.includes(k))) {
      return { label: cat.label, emoji: cat.emoji };
    }
  }
  return { label: "General", emoji: "💡" };
}

export async function GET() {
  try {
    const { data } = await supabase
      .from("explanations")
      .select("slug, confusion, explanation, views")
      .eq("reported", false)
      .order("created_at", { ascending: false })
      .limit(4);

    const items = (data || []).map((row) => ({
      slug: row.slug,
      confusion: row.confusion,
      preview: row.explanation.split(".")[0].trim() + ".",
      views: row.views ?? 0,
      ...detectCategory(row.confusion),
    }));

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
