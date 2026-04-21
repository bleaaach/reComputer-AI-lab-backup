"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Model } from "@/lib/types";
import {
  getDevices,
  getEnginesForDevice,
  getDockerCommand,
  getEngineLabel,
} from "@/lib/model-run";
import BenchmarkChart from "./BenchmarkChart";
import CodeBlock from "./CodeBlock";

const defaultCurlLlm = (slug: string) => `curl http://localhost:8080/v1/chat/completions -d '{
  "model": "${slug}",
  "messages": [{"role": "user", "content": "Hello"}]
}'`;

const defaultPythonLlm = (slug: string) => `import requests

resp = requests.post(
    "http://localhost:8080/v1/chat/completions",
    json={"model": "${slug}", "messages": [{"role": "user", "content": "Hello"}]},
)
print(resp.json())`;

function normalizeCodeLanguage(lang?: string): string {
  const value = (lang || "").toLowerCase();
  if (!value) return "bash";
  if (value === "sh" || value === "shell" || value === "zsh" || value === "docker") {
    return "bash";
  }
  if (value === "py") return "python";
  if (value === "yml") return "yaml";
  return value;
}

export default function ModelDetailView({ model }: { model: Model }) {
  const curlCode = model.curlExample ?? defaultCurlLlm(model.slug);
  const pythonCode = model.pythonExample ?? defaultPythonLlm(model.slug);
  const wikiPlatformOptions = useMemo(
    () =>
      (model.wikiPlatforms ?? []).filter(
        (p) => p.id && p.label && typeof p.markdown === "string" && p.markdown.trim().length > 0
      ),
    [model]
  );
  const [selectedWikiPlatformId, setSelectedWikiPlatformId] = useState("");
  const hasRestApiContent =
    !!(
      model.restApiEndpoint ||
      model.restApiExample ||
      model.restApiResponseExample ||
      model.curlExample ||
      model.pythonExample
    );

  const devices = useMemo(() => getDevices(model), [model]);
  const [selectedDevice, setSelectedDevice] = useState(devices[0]?.id ?? "jetson-orin");
  const [selectedEngine, setSelectedEngine] = useState("vllm");
  const engines = useMemo(
    () => getEnginesForDevice(model, selectedDevice),
    [model, selectedDevice]
  );
  const dockerCommand = useMemo(
    () => getDockerCommand(model, selectedDevice, selectedEngine),
    [model, selectedDevice, selectedEngine]
  );

  useEffect(() => {
    const d = getDevices(model);
    const devId = d[0]?.id ?? "jetson-orin";
    const e = getEnginesForDevice(model, devId);
    setSelectedDevice(devId);
    setSelectedEngine(e[0]?.id ?? "vllm");
  }, [model]);

  useEffect(() => {
    const allowed = getEnginesForDevice(model, selectedDevice);
    const currentInList = allowed.some((o) => o.id === selectedEngine);
    if (!currentInList && allowed.length > 0) setSelectedEngine(allowed[0].id);
  }, [model, selectedDevice, selectedEngine]);

  const [benchmarkEngineId, setBenchmarkEngineId] = useState("");
  const [benchmarkUnit, setBenchmarkUnit] = useState("");

  // Benchmark: engine options and points (from benchmarksByEngine or legacy benchmarks)
  const benchmarkEngineOptions = useMemo(() => {
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

  useEffect(() => {
    if (benchmarkEngineOptions.length > 0 && !benchmarkEngineId) {
      setBenchmarkEngineId(benchmarkEngineOptions[0].id);
    }
  }, [benchmarkEngineOptions, benchmarkEngineId]);

  useEffect(() => {
    if (benchmarkEngineOptions.length > 0 && benchmarkEngineId && !benchmarkEngineOptions.some((o) => o.id === benchmarkEngineId)) {
      setBenchmarkEngineId(benchmarkEngineOptions[0].id);
    }
  }, [benchmarkEngineOptions, benchmarkEngineId]);

  useEffect(() => {
    if (benchmarkUnits.length > 0) {
      if (!benchmarkUnit || !benchmarkUnits.includes(benchmarkUnit)) {
        setBenchmarkUnit(benchmarkUnits[0]);
      }
    }
  }, [benchmarkUnits, benchmarkUnit]);

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

  const hasBenchmarkData =
    (model.benchmarksByEngine && Object.keys(model.benchmarksByEngine).length > 0) ||
    (model.benchmarks && model.benchmarks.length > 0);

  useEffect(() => {
    if (wikiPlatformOptions.length === 0) {
      setSelectedWikiPlatformId("");
      return;
    }
    if (!wikiPlatformOptions.some((p) => p.id === selectedWikiPlatformId)) {
      setSelectedWikiPlatformId(wikiPlatformOptions[0].id);
    }
  }, [wikiPlatformOptions, selectedWikiPlatformId]);

  const selectedWikiPlatform =
    wikiPlatformOptions.find((p) => p.id === selectedWikiPlatformId) ?? wikiPlatformOptions[0];
  const modelDetailsMarkdown = selectedWikiPlatform?.markdown ?? model.wikiMarkdown;

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      {/* Top banner: 左 模型类+模型名+简介 | 右 三项参数 */}
      <section className="border-b [border-bottom-color:rgba(230,230,230,1)] bg-[#f7f7f7]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/models"
              className="text-sm text-gray-500 hover:text-primary"
            >
              ← Models
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[2fr,1fr] lg:items-start">
            {/* 左侧：模型类 + 模型名 + 简介，顶部对齐 */}
            <div className="flex flex-col gap-3">
              {(model.usageType || model.categoryName) && (
                <p className="text-xl font-medium text-gray-700">
                  {[model.usageType?.toUpperCase(), model.categoryName].filter(Boolean).join(" / ")}
                </p>
              )}
              <h1 className="text-3xl font-bold text-[#8CC020]">{model.name}</h1>
              {model.overview && (
                <p className="text-sm leading-[125%] text-gray-600">
                  {model.overview}
                </p>
              )}
            </div>
            {/* 右侧：Size / RAM / Precision，仅左边线分隔，底部对齐 */}
            <div className="flex flex-col gap-3 border-0 border-l border-[#d9d9d9] bg-transparent pl-6 pr-0 text-sm lg:self-end lg:pl-9">
              {model.size && (
                <div className="flex flex-col gap-0">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mingcute:file-fill"
                      className="h-4 w-4 flex-shrink-0"
                      style={{ color: "#8CC020" }}
                    />
                    <span className="font-medium leading-[1.5] text-black/50">Size</span>
                  </div>
                  <span className="pl-6 font-medium leading-[1.5] text-gray-900">{model.size}</span>
                </div>
              )}
              {model.ram && (
                <div className="flex flex-col gap-0">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mingcute:chip-fill"
                      className="h-4 w-4 flex-shrink-0"
                      style={{ color: "#8CC020" }}
                    />
                    <span className="font-medium leading-[1.5] text-black/50">Memory Requirement</span>
                  </div>
                  <span className="pl-6 font-medium leading-[1.5] text-gray-900">{model.ram}</span>
                </div>
              )}
              {model.precision && (
                <div className="flex flex-col gap-0">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mingcute:dashboard-fill"
                      className="h-4 w-4 flex-shrink-0"
                      style={{ color: "#8CC020" }}
                    />
                    <span className="font-medium leading-[1.5] text-black/50">Precision</span>
                  </div>
                  <span className="pl-6 font-medium leading-[1.5] text-gray-900">{model.precision}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-10 pb-0 sm:px-6 lg:px-8">
        {/* Getting Started: Run with Docker + REST API 代码块 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#8CC020]">Getting Started</h2>
          <p className="mt-1 text-gray-600">
            Choose your platform and inference engine; the Docker command below updates automatically.
          </p>
          <div className="mt-4 flex flex-wrap gap-6">
            <div className="min-w-[200px]">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Platform
              </label>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary"
              >
                {devices.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-[200px]">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Inference Engine
              </label>
              <select
                value={selectedEngine}
                onChange={(e) => setSelectedEngine(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary"
              >
                {engines.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <CodeBlock code={dockerCommand} label="Docker" language="bash" />
          </div>
          {hasRestApiContent && (
            <>
              <h3 className="mt-8 text-lg font-semibold text-gray-900">REST API</h3>
              <p className="mt-1 text-sm text-gray-600">
                Use the REST API to run inference. Copy the commands below.
              </p>
              <div className="mt-4 space-y-6">
                <div>
                  <CodeBlock code={curlCode} label="Curl" language="bash" />
                </div>
                <div>
                  <CodeBlock code={pythonCode} label="Python" language="python" />
                </div>
              </div>
            </>
          )}
        </section>

        {/* Model Details: 背景占满横向空间，上 border，上下 padding 与 Getting Started 统一 */}
        <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen border-t border-gray-200 bg-[#f7f7f7] py-10 mb-0">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#8CC020]">Model Details</h2>
            {wikiPlatformOptions.length > 0 && (
              <div className="mt-4 max-w-xs">
                <label
                  htmlFor="model-details-platform"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Platform
                </label>
                <select
                  id="model-details-platform"
                  value={selectedWikiPlatform?.id ?? ""}
                  onChange={(e) => setSelectedWikiPlatformId(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {wikiPlatformOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className={`font-system prose prose-gray max-w-none text-gray-600 ${wikiPlatformOptions.length > 0 ? "mt-8" : "mt-4"}`}>
              {modelDetailsMarkdown ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="mt-6 mb-4 text-[28px] font-bold text-gray-900 first:mt-0">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="mt-6 mb-3 text-[22px] font-bold text-gray-900 first:mt-0">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="mt-4 mb-2 text-[18px] font-semibold text-gray-900 first:mt-0">
                        {children}
                      </h3>
                    ),
                    pre({ children }) {
                      return <>{children}</>;
                    },
                    code({ node, className, children, ...props }) {
                      const hasLanguage = className != null && /language-/.test(String(className));
                      const content = String(children).replace(/\n$/, "");
                      const isBlock = hasLanguage || /\n/.test(content);
                      if (!isBlock) {
                        return (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                      const lang = className ? String(className).replace(/^language-/, "") : undefined;
                      const normalized = normalizeCodeLanguage(lang);
                      return (
                        <CodeBlock
                          code={content}
                          label={lang || "Code"}
                          language={normalized}
                          embedded
                        />
                      );
                    },
                  }}
                >
                  {modelDetailsMarkdown}
                </ReactMarkdown>
              ) : model.description ? (
                <p className="whitespace-pre-wrap">{model.description}</p>
              ) : model.overview ? (
                <p>{model.overview}</p>
              ) : (
                <p>No detailed description available for this model.</p>
              )}
            </div>
            {model.inputsOutputs && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900">Inputs and Outputs</h3>
                <p className="mt-2 text-gray-600">{model.inputsOutputs}</p>
              </div>
            )}
          </div>
        </section>

        {/* Benchmark: 仅在有数据时显示 */}
        {hasBenchmarkData && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#8CC020]">Benchmark</h2>
            <p className="mt-1 text-gray-600">
              Inference speed on different hardware (example data).
            </p>
            <div className="mt-4 flex flex-wrap items-end gap-6">
              <div className="min-w-[200px]">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Inference Engine
                </label>
                <select
                  value={effectiveBenchmarkEngineId}
                  onChange={(e) => setBenchmarkEngineId(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {benchmarkEngineOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
              {benchmarkChartData.length > 0 ? (
                <>
                  {benchmarkUnits.length >= 2 && (
                    <div className="mb-3 flex justify-end">
                      <div
                        role="group"
                        aria-label="Unit"
                        className="flex rounded-lg border border-gray-300 bg-gray-50 p-0.5"
                      >
                        {benchmarkUnits.map((u) => (
                          <button
                            key={u}
                            type="button"
                            onClick={() => setBenchmarkUnit(u)}
                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                              effectiveBenchmarkUnit === u
                                ? "bg-white text-gray-900"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <BenchmarkChart data={benchmarkChartData} unit={effectiveBenchmarkUnit || undefined} />
                </>
              ) : (
                <p className="py-8 text-center text-sm text-gray-500">No data for this selection.</p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
