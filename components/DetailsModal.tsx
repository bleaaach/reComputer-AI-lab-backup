"use client";

import { useState, useMemo, useEffect } from "react";
import type { Model } from "@/lib/types";
import { getEngineLabel } from "@/lib/model-run";
import BenchmarkChart from "./BenchmarkChart";

export default function DetailsModal({
  model,
  onClose,
}: {
  model: Model | null;
  onClose: () => void;
}) {
  const [benchmarkEngineId, setBenchmarkEngineId] = useState("");
  const [benchmarkUnit, setBenchmarkUnit] = useState("");

  const hasBenchmarkData = useMemo(
    () =>
      !!(
        model &&
        ((model.benchmarksByEngine && Object.keys(model.benchmarksByEngine).length > 0) ||
          (model.benchmarks && model.benchmarks.length > 0))
      ),
    [model]
  );

  const benchmarkEngineOptions = useMemo(() => {
    if (!model) return [];
    const byEngine = model.benchmarksByEngine;
    if (byEngine && Object.keys(byEngine).length > 0) {
      return Object.keys(byEngine).map((id) => ({
        id,
        label: getEngineLabel(model, id),
      }));
    }
    if (model.benchmarks?.length) {
      return [{ id: "default", label: getEngineLabel(model, "default") }];
    }
    return [];
  }, [model]);

  const effectiveBenchmarkEngineId =
    benchmarkEngineId || benchmarkEngineOptions[0]?.id || "";

  const benchmarkPointsForEngine = useMemo(() => {
    if (!model) return [];
    const byEngine = model.benchmarksByEngine;
    const eid = effectiveBenchmarkEngineId;
    if (byEngine?.[eid]?.length) return byEngine[eid];
    if (eid === "default" && model.benchmarks?.length) return model.benchmarks;
    return [];
  }, [model, effectiveBenchmarkEngineId]);

  const benchmarkUnits = useMemo(() => {
    const units = Array.from(
      new Set(
        benchmarkPointsForEngine.map((p) => p.unit).filter((u): u is string => !!u)
      )
    );
    return units.length ? units : [""];
  }, [benchmarkPointsForEngine]);

  const effectiveBenchmarkUnit =
    benchmarkUnit && benchmarkUnits.includes(benchmarkUnit)
      ? benchmarkUnit
      : benchmarkUnits[0] ?? "";

  const benchmarkChartData = useMemo(
    () =>
      effectiveBenchmarkUnit
        ? benchmarkPointsForEngine.filter(
            (p) => (p.unit ?? "") === effectiveBenchmarkUnit
          )
        : benchmarkPointsForEngine,
    [benchmarkPointsForEngine, effectiveBenchmarkUnit]
  );

  useEffect(() => {
    if (benchmarkEngineOptions.length > 0 && !benchmarkEngineId) {
      setBenchmarkEngineId(benchmarkEngineOptions[0].id);
    }
  }, [benchmarkEngineOptions, benchmarkEngineId]);

  useEffect(() => {
    if (
      benchmarkEngineOptions.length > 0 &&
      benchmarkEngineId &&
      !benchmarkEngineOptions.some((o) => o.id === benchmarkEngineId)
    ) {
      setBenchmarkEngineId(benchmarkEngineOptions[0].id);
    }
  }, [benchmarkEngineOptions, benchmarkEngineId]);

  useEffect(() => {
    if (benchmarkUnits.length > 0 && (!benchmarkUnit || !benchmarkUnits.includes(benchmarkUnit))) {
      setBenchmarkUnit(benchmarkUnits[0]);
    }
  }, [benchmarkUnits, benchmarkUnit]);

  if (!model) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{model.name}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {(model.size || model.ram) && (
          <div className="mt-4 flex gap-6 text-sm">
            {model.size && (
              <span className="text-gray-600">
                <strong>Size:</strong> {model.size}
              </span>
            )}
            {model.ram && (
              <span className="text-gray-600">
                <strong>RAM:</strong> {model.ram}
              </span>
            )}
          </div>
        )}

        {model.overview && (
          <section className="mt-4">
            <h3 className="text-sm font-semibold text-gray-900">Overview</h3>
            <p className="mt-1 text-gray-600">{model.overview}</p>
          </section>
        )}

        {model.usageType === "cv" && (
          <section className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900">REST API</h3>
            {model.restApiEndpoint && (
              <p className="mt-1 font-mono text-xs text-gray-700">
                {model.restApiEndpoint}
              </p>
            )}
            {model.restApiExample && (
              <pre className="mt-2 overflow-x-auto rounded bg-gray-100 p-3 text-xs text-gray-800">
                {model.restApiExample}
              </pre>
            )}
            {model.restApiResponseExample && (
              <pre className="mt-2 overflow-x-auto rounded bg-gray-100 p-3 text-xs text-gray-800">
                {model.restApiResponseExample}
              </pre>
            )}
          </section>
        )}

        {(model.usageType === "llm" || model.usageType === "vlm") && model.inputsOutputs && (
          <section className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900">
              Inputs and Outputs
            </h3>
            <p className="mt-1 text-gray-600">{model.inputsOutputs}</p>
          </section>
        )}

        {hasBenchmarkData && (
          <section className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900">Benchmarks</h3>
            <p className="mt-1 text-xs text-gray-500">
              Performance on different hardware (example data)
            </p>
            <div className="mt-2 flex flex-wrap items-end gap-4">
              <div className="min-w-[160px]">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Inference Engine
                </label>
                <select
                  value={effectiveBenchmarkEngineId}
                  onChange={(e) => setBenchmarkEngineId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {benchmarkEngineOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              {benchmarkUnits.length >= 2 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Unit
                  </span>
                  <div
                    role="group"
                    aria-label="Unit"
                    className="flex rounded-md border border-gray-300 bg-gray-50 p-0.5"
                  >
                    {benchmarkUnits.map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setBenchmarkUnit(u)}
                        className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                          effectiveBenchmarkUnit === u
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-2">
              {benchmarkChartData.length > 0 ? (
                <BenchmarkChart
                  data={benchmarkChartData}
                  unit={effectiveBenchmarkUnit || undefined}
                />
              ) : (
                <p className="py-4 text-center text-xs text-gray-500">
                  No data for this selection.
                </p>
              )}
            </div>
          </section>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
