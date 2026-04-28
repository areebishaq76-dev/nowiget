export default function TodayLoading() {
  return (
    <div className="flex flex-col min-h-full">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card-bg/90 backdrop-blur-md border-b border-border/50">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
          <a href="/" className="text-xl font-bold tracking-tight text-foreground">
            Now<span className="text-primary">I</span>Get
          </a>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-[720px] mx-auto animate-pulse">
          <div className="mb-10 text-center">
            <div className="h-6 w-48 bg-border/40 rounded-full mx-auto mb-5" />
            <div className="h-10 w-80 bg-border/40 rounded-xl mx-auto mb-3" />
            <div className="h-4 w-64 bg-border/30 rounded-lg mx-auto" />
          </div>
          <div className="bg-card-bg rounded-2xl border border-border/40 p-8 mb-6">
            <div className="h-4 w-32 bg-border/40 rounded mb-4" />
            <div className="h-8 w-full bg-border/30 rounded mb-6" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-border/20 rounded" />
              <div className="h-4 w-5/6 bg-border/20 rounded" />
              <div className="h-4 w-4/6 bg-border/20 rounded" />
              <div className="h-4 w-full bg-border/20 rounded" />
              <div className="h-4 w-3/4 bg-border/20 rounded" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
