"use client";

import { useState, useMemo, useEffect } from "react";
import type { Model } from "@/lib/types";
import {
  getDevices,
  getEnginesForDevice,
  getDockerCommand,
} from "@/lib/model-run";
import CodeBlock from "./CodeBlock";

export default function RunModal({
  model,
  onClose,
}: {
  model: Model | null;
  onClose: () => void;
}) {
  const devices = getDevices(model);
  const [targetEnv, setTargetEnv] = useState(devices[0]?.id ?? "jetson-orin");
  const [engine, setEngine] = useState("vllm");

  const engines = useMemo(
    () => getEnginesForDevice(model, targetEnv),
    [model, targetEnv]
  );

  useEffect(() => {
    if (model) {
      const d = getDevices(model);
      const devId = d[0]?.id ?? "jetson-orin";
      const e = getEnginesForDevice(model, devId);
      setTargetEnv(devId);
      setEngine(e[0]?.id ?? "vllm");
    }
  }, [model]);

  useEffect(() => {
    const allowed = getEnginesForDevice(model, targetEnv);
    const currentInList = allowed.some((o) => o.id === engine);
    if (!currentInList && allowed.length > 0) setEngine(allowed[0].id);
  }, [model, targetEnv, engine]);

  const command = useMemo(
    () => getDockerCommand(model, targetEnv, engine),
    [model, targetEnv, engine]
  );
  const modalTitle =
    [model?.usageType?.toUpperCase(), model?.categoryName, model?.name]
      .filter((v) => typeof v === "string" && v.trim().length > 0)
      .join(" / ") || model?.name || "";

  if (!model) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-primary" aria-hidden>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{modalTitle}</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Body: Left config + Right command */}
        <div className="flex min-h-0 flex-1 flex-col overflow-auto lg:flex-row">
          {/* Left: Configuration */}
          <div className="border-b border-gray-200 lg:border-b-0 lg:border-r lg:w-72 flex-shrink-0 p-6">
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Platform
                </p>
                <select
                  value={targetEnv}
                  onChange={(e) => setTargetEnv(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {devices.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Inference Engine
                </p>
                <select
                  value={engine}
                  onChange={(e) => setEngine(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {engines.map((opt: { id: string; label: string }) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              {engine === "vllm" && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    VLLM Configuration
                  </p>
                  <button
                    type="button"
                    className="mt-2 flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Show Advanced
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Command output */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col p-6">
            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-gray-700">Docker command</span>
            </div>
            <div className="mt-3 flex-1">
              <CodeBlock code={command} label="Docker" language="bash" />
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Commands are auto-generated based on your configuration settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
