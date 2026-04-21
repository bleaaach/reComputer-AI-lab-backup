"use client";

import Link from "next/link";
import type { Model } from "@/lib/types";

function formatTopLevelType(usageType?: Model["usageType"]) {
  if (!usageType) return "MODEL";
  return usageType.toUpperCase();
}

function formatDate(s?: string) {
  if (!s) return null;
  return s.replace(/-/g, "/");
}

export default function FeaturedModelCard({
  model,
  onRun,
}: {
  model: Model;
  onRun: () => void;
}) {
  const dateStr = formatDate(model.uploadedAt);
  return (
    <div className="flex h-full min-h-[280px] w-full max-w-sm flex-col rounded-xl border border-gray-200 bg-white p-6 text-left">
      <div className="flex min-w-0 flex-1 flex-col">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {formatTopLevelType(model.usageType)} / {model.categoryName}
          </p>
          <h2 className="mt-1 text-xl font-bold text-gray-900">{model.name}</h2>
          {model.description && (
            <p className="mt-2 text-sm leading-[125%] text-gray-600">{model.description}</p>
          )}
        </div>
        {dateStr != null && (
          <div className="mt-auto flex items-center gap-x-3 gap-y-1 pt-4 text-xs text-gray-500">
            <span>{dateStr}</span>
          </div>
        )}
      </div>
      <div className="mt-6 flex shrink-0 gap-2">
        <button
          type="button"
          onClick={onRun}
          className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Run
        </button>
        <Link
          href={`/models/${model.slug}`}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
