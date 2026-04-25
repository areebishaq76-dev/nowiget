import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getExplanation(slug: string) {
  const { data, error } = await supabase
    .from("explanations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const explanation = await getExplanation(slug);

  if (!explanation) {
    return { title: "Not Found — NowIGet" };
  }

  const description = explanation.explanation.slice(0, 160) + "...";

  return {
    title: `${explanation.confusion} — NowIGet`,
    description,
    openGraph: {
      title: `${explanation.confusion} — NowIGet`,
      description,
      type: "article",
    },
  };
}

export default async function ExplainPage({ params }: Props) {
  const { slug } = await params;
  const explanation = await getExplanation(slug);

  if (!explanation) {
    notFound();
  }

  const familiarityLabels: Record<string, string> = {
    beginner: "Total beginner",
    some: "Someone who knows a little",
    comfortable: "Someone fairly comfortable",
  };

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
            className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-all duration-200 cursor-pointer"
          >
            Ask your own question
          </a>
        </div>
      </nav>

      {/* Explanation */}
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-[720px] mx-auto">
          {/* The confusion */}
          <div className="mb-8">
            <p className="text-primary font-semibold text-sm tracking-wide uppercase mb-3">
              Someone was confused about
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground leading-snug">
              &ldquo;{explanation.confusion}&rdquo;
            </h1>
            <p className="mt-3 text-sm text-secondary/60">
              Answered for: {familiarityLabels[explanation.familiarity] || "someone who knows a little"}
            </p>
          </div>

          {/* The answer */}
          <div className="bg-card-bg rounded-2xl shadow-xl shadow-foreground/[0.04] border border-border/40 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">N</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">NowIGet</p>
                <p className="text-xs text-secondary/60">Clear, human explanation</p>
              </div>
            </div>
            <div className="text-foreground leading-relaxed text-[15px] whitespace-pre-line">
              {explanation.explanation}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-secondary text-sm mb-4">
              Confused about something else?
            </p>
            <a
              href="/"
              className="inline-block px-8 h-[48px] leading-[48px] rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-all duration-200"
            >
              Ask NowIGet →
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-10 px-6 bg-footer-bg border-t border-border/40">
        <div className="max-w-[1100px] mx-auto text-center">
          <p className="text-xs text-secondary/40">
            &copy; {new Date().getFullYear()} Now
            <span className="text-primary font-semibold">I</span>Get. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
