"use client";

import { useState } from "react";

export default function Banner() {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div className="flex h-10 items-center justify-between gap-4 bg-primary px-4 text-sm text-white">
      <span>
        Welcome to reComputer AI Lab! Explore models, tools, and tutorials for
        edge AI. Looking for docs? Browse Tutorials →
      </span>
      <button
        type="button"
        onClick={() => {
          setClosed(true);
          document.documentElement.style.setProperty("--header-height", "64px");
        }}
        className="shrink-0 rounded p-1 hover:bg-white/20"
        aria-label="Close banner"
      >
        ×
      </button>
    </div>
  );
}
