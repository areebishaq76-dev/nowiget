import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — NowIGet",
  description: "How NowIGet handles your data and protects your privacy.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-full">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card-bg/90 backdrop-blur-md border-b border-border/50">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
          <a href="/" className="text-xl font-bold tracking-tight text-foreground">
            Now<span className="text-primary">I</span>Get
          </a>
          <a href="/" className="text-sm text-secondary hover:text-foreground transition-colors">
            ← Back to home
          </a>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-[720px] mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-secondary/60 text-sm mb-12">Last updated: April 2026</p>

          <div className="space-y-10 text-[15px] text-foreground leading-relaxed">

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">What we collect</h2>
              <p className="text-secondary">
                When you submit a question, we store the question text and the AI-generated answer in our database. This is how we create permanent pages that others can benefit from. We do not collect your name, email address, IP address, or any personally identifying information.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">Private questions</h2>
              <p className="text-secondary">
                Questions that appear personal in nature — such as those mentioning your relationships, health symptoms, salary, or specific people in your life — are automatically detected and never saved to our database. These answers are shown to you only and deleted immediately after your session ends.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">Public explanations</h2>
              <p className="text-secondary">
                General knowledge questions become permanent public pages on NowIGet and are indexed by Google. These pages contain only the question text and the AI-generated answer — no personal information is ever attached to them.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">Local storage</h2>
              <p className="text-secondary">
                We store your recent questions locally on your device using browser localStorage so you can quickly access them again. This data never leaves your device and is not sent to our servers.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">Cookies</h2>
              <p className="text-secondary">
                NowIGet uses only essential cookies required for the website to function. We do not use advertising cookies or tracking cookies. If we add analytics in the future, we will update this policy and ask for your consent.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">Third-party services</h2>
              <p className="text-secondary">
                We use the following third-party services to power NowIGet:
              </p>
              <ul className="mt-3 space-y-2 text-secondary">
                <li className="flex items-start gap-2"><span className="text-primary mt-1">·</span> <span><strong className="text-foreground">Groq</strong> — AI model hosting for generating explanations</span></li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">·</span> <span><strong className="text-foreground">Google Gemini</strong> — Backup AI model</span></li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">·</span> <span><strong className="text-foreground">Tavily</strong> — Real-time web search for current events questions</span></li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">·</span> <span><strong className="text-foreground">Supabase</strong> — Database for storing public explanations</span></li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">·</span> <span><strong className="text-foreground">Vercel</strong> — Website hosting</span></li>
              </ul>
              <p className="mt-3 text-secondary">Each of these services has their own privacy policy governing how they handle data.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">Your rights</h2>
              <p className="text-secondary">
                Since we do not collect personal information, there is no personal data to delete or export. If you submitted a question that you would like removed from our public pages, contact us and we will remove it promptly.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">Contact</h2>
              <p className="text-secondary">
                Questions about this policy? Reach out at <span className="text-primary">hello@nowiget.com</span> — or use the report button on any explanation page to flag specific content for removal.
              </p>
            </section>

          </div>
        </div>
      </main>

      <footer className="py-10 px-6 border-t border-border/40 text-center">
        <p className="text-xs text-secondary/40">
          &copy; {new Date().getFullYear()} Now<span className="text-primary font-semibold">I</span>Get. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
