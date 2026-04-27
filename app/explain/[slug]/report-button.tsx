"use client";

import { useState } from "react";

export default function ReportButton({ slug }: { slug: string }) {
  const [state, setState] = useState<"idle" | "confirm" | "done">("idle");

  const handleReport = async () => {
    setState("done");
    await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
  };

  if (state === "done") {
    return (
      <p className="mt-4 text-xs text-secondary/50 text-center">
        Thanks for the report. We&apos;ll review this page.
      </p>
    );
  }

  if (state === "confirm") {
    return (
      <div className="mt-4 flex items-center justify-center gap-3">
        <p className="text-xs text-secondary/50">Report this explanation as inaccurate or harmful?</p>
        <button
          onClick={handleReport}
          className="text-xs text-red-500 hover:underline cursor-pointer"
        >
          Yes, report it
        </button>
        <button
          onClick={() => setState("idle")}
          className="text-xs text-secondary/50 hover:underline cursor-pointer"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 text-center">
      <button
        onClick={() => setState("confirm")}
        className="text-xs text-secondary/30 hover:text-secondary/60 transition-colors cursor-pointer"
      >
        Report this page
      </button>
    </div>
  );
}
