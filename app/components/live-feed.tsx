"use client";

import { useEffect, useState } from "react";

type Item = {
  slug: string;
  confusion: string;
  preview: string;
  views: number;
  label: string;
  emoji: string;
};

export default function LiveFeed() {
  const [items, setItems] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/recent")
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (loaded && items.length === 0) return null;

  return (
    <section className="py-20 px-6">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 text-sm mb-5" style={{ color: "#6B5B4E", backgroundColor: "#FFFBF5" }}>
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
            Recently explained
          </div>
          <h2 className="text-3xl md:text-[40px] font-extrabold text-foreground leading-tight">
            What people are curious about
          </h2>
          <p className="mt-4 text-base" style={{ color: "#6B5B4E" }}>
            Real questions. Clear answers. Click any to read the full explanation.
          </p>
        </div>

        {/* Cards */}
        {!loaded ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-border/20 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {items.map((item) => (
              <a
                key={item.slug}
                href={`/explain/${item.slug}`}
                className="group flex flex-col bg-card-bg rounded-2xl border border-border/40 px-7 py-6 shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Category tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "#FFF3E8", color: "#E8722A" }}>
                    <span>{item.emoji}</span>
                    {item.label}
                  </span>
                  {item.views > 0 && (
                    <span className="text-xs" style={{ color: "#9A8A7E" }}>
                      {item.views} {item.views === 1 ? "view" : "views"}
                    </span>
                  )}
                </div>

                {/* Question */}
                <p className="text-foreground font-semibold text-[15px] leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  &ldquo;{item.confusion}&rdquo;
                </p>

                {/* Answer preview */}
                <p className="text-sm leading-relaxed line-clamp-2 flex-1" style={{ color: "#6B5B4E" }}>
                  {item.preview}
                </p>

                {/* Read more */}
                <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all duration-200">
                  Read full explanation
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Bottom link */}
        <div className="mt-10 text-center">
          <a
            href="/today"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline transition-colors"
          >
            See today&apos;s featured confusion →
          </a>
        </div>
      </div>
    </section>
  );
}
