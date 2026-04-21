"use client";

import Link from "next/link";
import type { Model } from "@/lib/types";

function formatDate(s?: string) {
  if (!s) return null;
  return s.replace(/-/g, "/");
}

export default function ModelCard({
  model,
  onRun,
}: {
  model: Model;
  onRun: () => void;
}) {
  const dateStr = formatDate(model.uploadedAt);
  return (
    <div className="bg-white">
      {/* 两列：左侧 模型名在上、日期在下；右侧 Run/Details */}
      <div className="flex items-center justify-start gap-x-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-gray-900">{model.name}</span>
            {model.isNew && (
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-[var(--primary)]"
                title="New"
                aria-label="New"
              />
            )}
          </div>
          {dateStr != null && (
            <div className="mt-1 flex items-center gap-x-3 gap-y-1 text-xs text-gray-500">
              <span>{dateStr}</span>
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
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
    </div>
  );
}
