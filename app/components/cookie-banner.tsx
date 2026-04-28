"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem("nowiget_cookies_accepted");
      if (!accepted) setVisible(true);
    } catch { /* ignore */ }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem("nowiget_cookies_accepted", "true");
    } catch { /* ignore */ }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none">
      <div className="max-w-[700px] mx-auto bg-card-bg border border-border/60 rounded-2xl shadow-xl shadow-foreground/[0.08] p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 pointer-events-auto">
        <p className="text-sm text-secondary leading-relaxed flex-1">
          We use essential cookies and local storage to remember your recent questions. No tracking, no ads.{" "}
          <a href="/privacy" className="text-primary hover:underline">Learn more</a>
        </p>
        <button
          onClick={accept}
          className="flex-shrink-0 px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
