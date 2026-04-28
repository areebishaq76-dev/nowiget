export default function NotFound() {
  return (
    <div className="flex flex-col min-h-full">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card-bg/90 backdrop-blur-md border-b border-border/50">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
          <a href="/" className="text-xl font-bold tracking-tight text-foreground">
            Now<span className="text-primary">I</span>Get
          </a>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-16">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <span className="text-primary text-2xl font-extrabold">?</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
          Page not found
        </h1>
        <p className="text-secondary text-base max-w-sm leading-relaxed mb-8">
          This page doesn&apos;t exist. But if you&apos;re confused about something, we can help with that.
        </p>
        <a
          href="/"
          className="px-8 h-[48px] leading-[48px] inline-block rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-all duration-200"
        >
          Ask NowIGet →
        </a>
      </main>

      <footer className="py-10 px-6 border-t border-border/40 text-center">
        <p className="text-xs text-secondary/40">
          &copy; {new Date().getFullYear()} Now<span className="text-primary font-semibold">I</span>Get. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
