"use client";

import { useState, useRef, useEffect } from "react";

const EXAMPLE_CONFUSIONS = [
  "I keep hearing about inflation but don't understand why it's bad if my salary also goes up",
  "What's the difference between a virus and a bacteria? I always mix them up",
  "Why do planes actually stay in the air? I know it's physics but I never really got it",
  "I don't understand how crypto has value — it's not backed by anything physical",
  "Why does my phone battery die faster when it's cold outside?",
  "I hear 'machine learning' everywhere but I genuinely don't know what it means",
];

export default function Home() {
  const [confusion, setConfusion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showFamiliarity, setShowFamiliarity] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");
  const [currentSlug, setCurrentSlug] = useState("");
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const familiarityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const handleSubmit = () => {
    if (!confusion.trim() || isLoading) return;
    setShowFamiliarity(true);
    setExplanation("");
    setError("");
    setTimeout(() => {
      familiarityRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleFamiliaritySelect = async (level: string) => {
    setShowFamiliarity(false);
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confusion: confusion.trim(), familiarity: level }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setExplanation(data.explanation);
        setCurrentSlug(data.slug || "");
        setFeedbackGiven(false);
        setTimeout(() => {
          answerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } catch {
      setError("Could not connect. Please check your internet and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setConfusion(example);
    setShowFamiliarity(false);
    setExplanation("");
    setError("");
    textareaRef.current?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card-bg/90 backdrop-blur-md border-b border-border/50">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
          <a href="/" className="text-xl font-bold tracking-tight text-foreground">
            Now<span className="text-primary">I</span>Get
          </a>
          <div className="flex items-center gap-8">
            <a href="#how-it-works" className="hidden md:block text-sm text-secondary hover:text-foreground transition-colors">How it works</a>
            <a href="#examples" className="hidden md:block text-sm text-secondary hover:text-foreground transition-colors">Examples</a>
            <a href="#faq" className="hidden md:block text-sm text-secondary hover:text-foreground transition-colors">FAQ</a>
            <button className="hidden md:block px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-all duration-200 cursor-pointer hover:shadow-md hover:shadow-primary/20">
              Sign In
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col gap-1.5 cursor-pointer p-1"
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-card-bg border-t border-border/50 px-6 py-6 space-y-4">
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-base text-secondary hover:text-foreground">How it works</a>
            <a href="#examples" onClick={() => setMobileMenuOpen(false)} className="block text-base text-secondary hover:text-foreground">Examples</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-base text-secondary hover:text-foreground">FAQ</a>
            <button className="w-full px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium cursor-pointer">Sign In</button>
          </div>
        )}
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative flex flex-col items-center text-center pt-36 pb-24 px-6 md:pt-48 md:pb-32 overflow-hidden">
        {/* Soft radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(232,114,42,0.06) 0%, transparent 65%)" }} />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card-bg border border-border/60 text-sm text-secondary mb-10 shadow-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-primary" />
            Trusted by curious minds worldwide
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-[68px] font-extrabold tracking-tight text-foreground max-w-4xl leading-[1.08] mx-auto">
            Finally understand{" "}
            <span className="text-primary">anything.</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-secondary max-w-xl leading-relaxed mx-auto">
            Describe exactly what&apos;s confusing you. Get a clear, human
            explanation — like a smart friend texting back.
          </p>
        </div>

        <div className="relative w-full max-w-[700px] mt-12">
          <div className="bg-card-bg rounded-2xl shadow-xl shadow-foreground/[0.04] border border-border/40 p-1.5">
            <textarea
              ref={textareaRef}
              value={confusion}
              onChange={(e) => setConfusion(e.target.value)}
              placeholder="What are you confused about? Describe it in your own words..."
              rows={4}
              className="w-full min-h-[130px] px-5 py-4 text-base md:text-[17px] rounded-xl bg-transparent text-foreground placeholder:text-secondary/45 resize-none transition-all duration-200 focus:outline-none border-0 leading-relaxed"
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 pb-2 pt-1 gap-2">
              <p className="text-xs text-secondary/40 hidden sm:block">
                Free · No sign-up required
              </p>
              <button
                onClick={handleSubmit}
                disabled={!confusion.trim() || isLoading}
                className="w-full sm:w-auto px-8 h-[46px] rounded-xl bg-primary text-white font-semibold text-sm transition-all duration-200 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Thinking...
                  </>
                ) : (
                  "Get Clarity →"
                )}
              </button>
            </div>
          </div>

          {/* Familiarity picker */}
          {showFamiliarity && (
            <div ref={familiarityRef} className="mt-6 bg-card-bg rounded-2xl shadow-xl shadow-foreground/[0.04] border border-border/40 p-6 text-left scroll-mt-24">
              <p className="text-foreground font-semibold text-[15px] mb-1">
                One quick question before we answer:
              </p>
              <p className="text-secondary text-sm mb-5">
                How familiar are you with this topic?
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                {[
                  { level: "beginner", label: "Total beginner", desc: "I know nothing about this" },
                  { level: "some", label: "Know a little", desc: "I have some basic idea" },
                  { level: "comfortable", label: "Fairly comfortable", desc: "I just need one thing clarified" },
                ].map(({ level, label, desc }) => (
                  <button
                    key={level}
                    onClick={() => handleFamiliaritySelect(level)}
                    className="flex-1 text-left px-5 py-4 rounded-xl border border-border/50 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                  >
                    <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{label}</p>
                    <p className="text-secondary/60 text-xs mt-1">{desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mt-6 bg-red-50 rounded-2xl border border-red-100 p-5 text-left">
              <p className="text-red-800 text-sm">{error}</p>
              <button
                onClick={() => { setError(""); setShowFamiliarity(true); }}
                className="mt-3 text-sm text-primary font-medium hover:underline cursor-pointer"
              >
                Try again
              </button>
            </div>
          )}

          {/* Answer display */}
          {explanation && (
            <div ref={answerRef} className="mt-6 bg-card-bg rounded-2xl shadow-xl shadow-foreground/[0.04] border border-border/40 p-6 md:p-8 text-left scroll-mt-24">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">N</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">NowIGet</p>
                  <p className="text-xs text-secondary/60">Here&apos;s your explanation</p>
                </div>
              </div>
              <div className="text-foreground leading-relaxed text-[15px] whitespace-pre-line">
                {explanation}
              </div>
              <div className="mt-6 pt-5 border-t border-border/30 flex items-center gap-3">
                {feedbackGiven ? (
                  <span className="text-xs text-emerald-600">Thanks for your feedback!</span>
                ) : (
                  <>
                    <span className="text-xs text-secondary/60">Did this help?</span>
                    <button
                      onClick={async () => {
                        setFeedbackGiven(true);
                        await fetch("/api/feedback", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ slug: currentSlug, helpful: true }),
                        });
                      }}
                      className="px-3 py-1.5 rounded-full text-xs border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                    >
                      Yes
                    </button>
                    <button
                      onClick={async () => {
                        setFeedbackGiven(true);
                        await fetch("/api/feedback", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ slug: currentSlug, helpful: false }),
                        });
                      }}
                      className="px-3 py-1.5 rounded-full text-xs border border-red-200 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      No
                    </button>
                  </>
                )}
              </div>
              {/* Share & Link section */}
              <div className="mt-4 pt-4 border-t border-border/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-secondary/60 font-medium">Share this explanation</span>
                  {currentSlug && (
                    <a
                      href={`/explain/${currentSlug}`}
                      className="text-xs text-primary hover:underline"
                    >
                      Permanent link →
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Twitter/X */}
                  <button
                    onClick={() => {
                      const text = `I finally understood: "${confusion.slice(0, 100)}${confusion.length > 100 ? "..." : ""}"`;
                      const url = currentSlug ? `${(process.env.NEXT_PUBLIC_SITE_URL || "https://nowiget.vercel.app")}/explain/${currentSlug}` : (process.env.NEXT_PUBLIC_SITE_URL || "https://nowiget.vercel.app");
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-border/50 text-secondary hover:text-foreground hover:border-border transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    Post
                  </button>
                  {/* WhatsApp */}
                  <button
                    onClick={() => {
                      const text = `I finally understood: "${confusion.slice(0, 100)}${confusion.length > 100 ? "..." : ""}"\n\nCheck it out: ${currentSlug ? `${(process.env.NEXT_PUBLIC_SITE_URL || "https://nowiget.vercel.app")}/explain/${currentSlug}` : (process.env.NEXT_PUBLIC_SITE_URL || "https://nowiget.vercel.app")}`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-border/50 text-secondary hover:text-foreground hover:border-border transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </button>
                  {/* Copy Link */}
                  <button
                    onClick={() => {
                      const url = currentSlug ? `${(process.env.NEXT_PUBLIC_SITE_URL || "https://nowiget.vercel.app")}/explain/${currentSlug}` : (process.env.NEXT_PUBLIC_SITE_URL || "https://nowiget.vercel.app");
                      navigator.clipboard.writeText(url);
                      setLinkCopied(true);
                      setTimeout(() => setLinkCopied(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-border/50 text-secondary hover:text-foreground hover:border-border transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                    {linkCopied ? "Copied!" : "Copy link"}
                  </button>
                  {/* Native Share (mobile) */}
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: "NowIGet — I finally understood this",
                          text: `"${confusion.slice(0, 100)}${confusion.length > 100 ? "..." : ""}"`,
                          url: currentSlug ? `${(process.env.NEXT_PUBLIC_SITE_URL || "https://nowiget.vercel.app")}/explain/${currentSlug}` : (process.env.NEXT_PUBLIC_SITE_URL || "https://nowiget.vercel.app"),
                        });
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-border/50 text-secondary hover:text-foreground hover:border-border transition-colors cursor-pointer md:hidden"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="py-16 px-6 border-y border-border/40">
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-4">
          {[
            { number: "10,000+", label: "Confusions cleared" },
            { number: "120+", label: "Countries reached" },
            { number: "4.9/5", label: "Clarity rating" },
            { number: "< 10s", label: "Average answer time" },
          ].map(({ number, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                {number}
              </p>
              <p className="mt-2 text-sm text-secondary/70">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-24 md:py-32 px-6 scroll-mt-20">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm tracking-wide uppercase mb-3">Simple process</p>
            <h2 className="text-3xl md:text-[44px] font-extrabold text-foreground leading-tight">
              How it works
            </h2>
            <p className="mt-4 text-lg text-secondary">
              Three steps to clarity — no account needed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                step: 1,
                title: "Describe your confusion",
                description: "Don't search for a topic. Tell us exactly what's confusing you, in your own words. No prompting skill needed.",
              },
              {
                step: 2,
                title: "We personalize it",
                description: "One quick question helps us understand your level — beginner, intermediate, or comfortable — so the answer actually clicks.",
              },
              {
                step: 3,
                title: "Get crystal-clear clarity",
                description: "A warm, human explanation written like a smart friend texting you. No jargon, no textbook language.",
              },
            ].map(({ step, title, description }) => (
              <div
                key={step}
                className="bg-card-bg rounded-2xl p-8 md:p-10 shadow-sm shadow-foreground/[0.03] border border-border/40 hover:shadow-md hover:border-border/60 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mb-6">
                  {step}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {title}
                </h3>
                <p className="text-secondary leading-relaxed text-[15px]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Example Confusions ─── */}
      <section id="examples" className="py-24 md:py-32 px-6 bg-primary-light/30 scroll-mt-20">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm tracking-wide uppercase mb-3">Try it yourself</p>
            <h2 className="text-3xl md:text-[44px] font-extrabold text-foreground leading-tight">
              People are asking things like...
            </h2>
            <p className="mt-4 text-lg text-secondary">
              Click any question to try it instantly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {EXAMPLE_CONFUSIONS.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="w-full text-left bg-card-bg rounded-2xl px-7 py-6 border border-border/40 shadow-sm shadow-foreground/[0.02] hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-foreground leading-relaxed text-[15px]">{example}</p>
                  <span className="text-border group-hover:text-primary transition-all duration-300 mt-0.5 flex-shrink-0 text-lg group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Before vs After ─── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[950px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm tracking-wide uppercase mb-3">The difference</p>
            <h2 className="text-3xl md:text-[44px] font-extrabold text-foreground leading-tight">
              Night and day
            </h2>
            <p className="mt-4 text-lg text-secondary">
              What understanding actually feels like
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-8 md:p-10 bg-red-50/80 border border-red-100/60">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-400 text-sm font-bold">✕</span>
                </div>
                <h3 className="text-lg font-bold text-red-900/70">Before NowIGet</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Google gives you 10 blue links — none answer YOUR question",
                  "Wikipedia is 5,000 words of jargon you don't understand",
                  "ChatGPT needs you to know how to prompt it properly",
                  "YouTube takes 10 minutes to say what could be said in 30 seconds",
                  "You pretend you understand and move on",
                ].map((item, i) => (
                  <li key={i} className="text-red-900/50 text-[15px] leading-relaxed flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-200 mt-2.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl p-8 md:p-10 bg-emerald-50/80 border border-emerald-100/60">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-500 text-sm font-bold">✓</span>
                </div>
                <h3 className="text-lg font-bold text-emerald-900/70">After NowIGet</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "You describe your confusion in plain words — no prompting skill needed",
                  "You get ONE clear explanation that actually makes sense",
                  "Written like a smart friend texting you — warm, human, direct",
                  "Takes 10 seconds, not 10 minutes",
                  "You walk away genuinely understanding it",
                ].map((item, i) => (
                  <li key={i} className="text-emerald-900/50 text-[15px] leading-relaxed flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 mt-2.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-24 md:py-32 px-6 bg-primary-light/30">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm tracking-wide uppercase mb-3">Testimonials</p>
            <h2 className="text-3xl md:text-[44px] font-extrabold text-foreground leading-tight">
              What people are saying
            </h2>
            <p className="mt-4 text-lg text-secondary">
              Real reactions from real curious minds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "I finally understood how the stock market works after years of pretending I knew. This thing explained it in 30 seconds flat.",
                name: "Sarah K.",
                role: "Marketing Manager · London",
              },
              {
                quote: "I asked something I was too embarrassed to ask my professor. Got a better answer than any lecture I've sat through.",
                name: "James R.",
                role: "University Student · Toronto",
              },
              {
                quote: "My 12-year-old asked me why the sky is blue and I didn't actually know. NowIGet gave me an answer I could confidently explain back to her.",
                name: "Priya M.",
                role: "Parent & Teacher · Mumbai",
              },
            ].map(({ quote, name, role }) => (
              <div
                key={name}
                className="bg-card-bg rounded-2xl p-8 md:p-10 shadow-sm shadow-foreground/[0.03] border border-border/40"
              >
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-accent text-base">★</span>
                  ))}
                </div>
                <p className="text-foreground leading-relaxed text-[15px]">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="mt-7 pt-5 border-t border-border/30 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/8 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{name}</p>
                    <p className="text-secondary/60 text-xs mt-0.5">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-24 md:py-32 px-6 scroll-mt-20">
        <div className="max-w-[720px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm tracking-wide uppercase mb-3">FAQ</p>
            <h2 className="text-3xl md:text-[44px] font-extrabold text-foreground leading-tight">
              Got questions?
            </h2>
            <p className="mt-4 text-lg text-secondary">
              Everything you need to know
            </p>
          </div>

          <div className="space-y-3">
            {[
              { q: "Is NowIGet really free?", a: "Yes, completely free. No credit card, no sign-up required. Just type your confusion and get clarity. We plan to offer a Pro tier in the future, but the core experience will always be free." },
              { q: "How is this different from ChatGPT?", a: "ChatGPT is a general-purpose AI that requires you to know how to prompt it. NowIGet is purpose-built for one thing: resolving your specific confusion. You don't need prompting skills — just describe what's confusing you in plain words. Plus, every explanation becomes a permanent page others can find and benefit from." },
              { q: "Where do the answers come from?", a: "NowIGet uses advanced AI models trained on vast amounts of human knowledge. The AI reads your confusion, understands your level, and generates a clear explanation written in warm, human language — not robotic text." },
              { q: "Is my data private?", a: "Your confusions are used only to generate your explanation. We don't sell your data or share it with third parties. The explanations themselves become permanent public pages (without your personal information) so others can benefit from the same clarity." },
              { q: "Can I use it for school or work?", a: "Absolutely. Whether you're a student trying to understand a concept, a professional who encountered unfamiliar jargon, or a parent helping your child with homework — NowIGet is built for exactly these moments." },
              { q: "What topics can I ask about?", a: "Anything. Science, finance, technology, history, health, politics, everyday life — if you're confused about it, you can ask it. There are no topic limits." },
            ].map(({ q, a }, index) => (
              <div key={index} className="bg-card-bg rounded-2xl border border-border/40 shadow-sm shadow-foreground/[0.02] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between px-7 py-5 text-left cursor-pointer"
                >
                  <span className="font-semibold text-foreground pr-4 text-[15px]">{q}</span>
                  <span className={`w-7 h-7 rounded-full bg-primary/8 text-primary flex items-center justify-center flex-shrink-0 text-sm font-medium transition-transform duration-300 ${openFaq === index ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-7 pb-6">
                    <p className="text-secondary text-[15px] leading-relaxed">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-24 md:py-32 px-6 bg-primary-light/30">
        <div className="max-w-[600px] mx-auto text-center">
          <h2 className="text-3xl md:text-[44px] font-extrabold text-foreground leading-tight">
            Still confused about something?
          </h2>
          <p className="mt-5 text-lg text-secondary leading-relaxed">
            There are no stupid questions — only things nobody explained
            properly yet. Get clarity in seconds.
          </p>
          <button
            onClick={() => {
              textareaRef.current?.focus();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="mt-10 px-10 h-[52px] rounded-xl bg-primary text-white font-semibold text-base transition-all duration-200 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25 cursor-pointer"
          >
            Try it now — it&apos;s free →
          </button>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-14 px-6 bg-footer-bg border-t border-border/40">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <a href="/" className="text-lg font-bold text-foreground">
                Now<span className="text-primary">I</span>Get
              </a>
              <p className="mt-1 text-sm text-secondary/60">Built for curious minds everywhere.</p>
            </div>
            <div className="flex items-center gap-8 text-sm text-secondary/60">
              <a href="#" className="hover:text-foreground transition-colors">About</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-border/30 text-center">
            <p className="text-xs text-secondary/40">
              &copy; {new Date().getFullYear()} Now<span className="text-primary font-semibold">I</span>Get. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
