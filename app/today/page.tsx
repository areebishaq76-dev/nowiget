import { supabase } from "@/lib/supabase";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Confusion of the Day — NowIGet",
  description: "One interesting confusion, clearly explained. Come back every day.",
};

export const revalidate = 3600; // revalidate every hour

async function getTodayConfusion() {
  // Pick a "confusion of the day" based on day-of-year so it's consistent all day
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );

  const { count } = await supabase
    .from("explanations")
    .select("*", { count: "exact", head: true })
    .eq("reported", false);

  if (!count || count === 0) return null;

  const offset = dayOfYear % count;

  const { data } = await supabase
    .from("explanations")
    .select("slug, confusion, explanation, familiarity, views, created_at")
    .eq("reported", false)
    .order("created_at", { ascending: true })
    .range(offset, offset)
    .single();

  return data;
}

async function getRecentConfusions() {
  const { data } = await supabase
    .from("explanations")
    .select("slug, confusion, explanation")
    .eq("reported", false)
    .order("created_at", { ascending: false })
    .limit(5);
  return data || [];
}

export default async function TodayPage() {
  const [today, recent] = await Promise.all([getTodayConfusion(), getRecentConfusions()]);

  return (
    <div className="flex flex-col min-h-full">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card-bg/90 backdrop-blur-md border-b border-border/50">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
          <a href="/" className="text-xl font-bold tracking-tight text-foreground">
            Now<span className="text-primary">I</span>Get
          </a>
          <a
            href="/"
            className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-all duration-200"
          >
            Ask your own →
          </a>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-[720px] mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
              Confusion of the Day
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
              One confusion. Clearly explained.
            </h1>
            <p className="mt-3 text-secondary text-base">
              A new confusion every day. Bookmark this page and come back.
            </p>
          </div>

          {today ? (
            <>
              {/* Today's confusion */}
              <div className="bg-card-bg rounded-2xl shadow-xl shadow-foreground/[0.04] border border-border/40 p-6 md:p-8 mb-6">
                <p className="text-primary font-semibold text-xs tracking-wide uppercase mb-3">
                  Today&apos;s confusion
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-foreground leading-snug mb-6">
                  &ldquo;{today.confusion}&rdquo;
                </h2>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">N</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">NowIGet</p>
                    <p className="text-xs text-secondary/60">Clear, human explanation</p>
                  </div>
                </div>
                <div className="text-foreground leading-relaxed text-[15px] whitespace-pre-line">
                  {today.explanation}
                </div>
                <div className="mt-6 pt-5 border-t border-border/30 flex items-center justify-between">
                  <Link
                    href={`/explain/${today.slug}`}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    Permanent link →
                  </Link>
                  <span className="text-xs text-secondary/40">
                    {today.views ?? 0} views
                  </span>
                </div>
              </div>

              {/* Share nudge */}
              <div className="bg-primary/5 rounded-2xl border border-primary/10 p-5 mb-10 text-center">
                <p className="text-sm text-foreground font-medium mb-1">Share today&apos;s confusion</p>
                <p className="text-xs text-secondary/60 mb-4">Help a friend finally understand something</p>
                <div className="flex items-center justify-center gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Today's confusion on NowIGet: "${today.confusion.slice(0, 80)}"\n\nhttps://nowiget.vercel.app/today`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs border border-border/50 text-secondary hover:text-foreground hover:border-border transition-colors"
                  >
                    Share on X
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Check out today's confusion on NowIGet: "${today.confusion.slice(0, 80)}"\n\nhttps://nowiget.vercel.app/today`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs border border-border/50 text-secondary hover:text-foreground hover:border-border transition-colors"
                  >
                    Share on WhatsApp
                  </a>
                </div>
              </div>

              {/* Recent confusions */}
              {recent.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-secondary/50 uppercase tracking-wide mb-4">
                    Recent confusions
                  </p>
                  <div className="flex flex-col gap-3">
                    {recent.map((r) => (
                      <Link
                        key={r.slug}
                        href={`/explain/${r.slug}`}
                        className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl bg-card-bg border border-border/40 hover:border-primary/30 hover:shadow-sm transition-all duration-200 group"
                      >
                        <p className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {r.confusion}
                        </p>
                        <span className="text-primary text-sm flex-shrink-0">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-secondary text-base mb-6">No confusions yet. Be the first!</p>
              <a
                href="/"
                className="inline-block px-8 h-[48px] leading-[48px] rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-all"
              >
                Ask NowIGet →
              </a>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto py-10 px-6 bg-footer-bg border-t border-border/40">
        <div className="max-w-[1100px] mx-auto text-center">
          <p className="text-xs text-secondary/40">
            &copy; {new Date().getFullYear()} Now<span className="text-primary font-semibold">I</span>Get. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
