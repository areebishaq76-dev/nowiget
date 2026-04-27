"use client";

import { useEffect } from "react";

export default function ViewCounter({ slug, initialViews }: { slug: string; initialViews: number }) {
  useEffect(() => {
    fetch("/api/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
  }, [slug]);

  return (
    <span className="text-xs text-secondary/40">
      {initialViews + 1} {initialViews + 1 === 1 ? "view" : "views"}
    </span>
  );
}
