"use client";

import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import type { Model, ModelFamily, ModelsTabId } from "@/lib/types";
import FeaturedModelCard from "./FeaturedModelCard";
import ModelFamilyCard from "./ModelFamilyCard";
import RunModal from "./RunModal";

const TABS: { id: ModelsTabId; label: string }[] = [
  { id: "cv", label: "CV" },
  { id: "llm", label: "LLM" },
  { id: "vlm", label: "VLM" },
];

type FilterKind = "all" | "new";
type SortKind = "new-then-downloads" | "downloads" | "name";

function sortModels(models: Model[], sort: SortKind): Model[] {
  const list = [...models];
  if (sort === "new-then-downloads") {
    return list.sort((a, b) => {
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      return (b.downloads ?? 0) - (a.downloads ?? 0);
    });
  }
  if (sort === "downloads") {
    return list.sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0));
  }
  if (sort === "name") {
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }
  return list;
}

export default function ModelsPageClient({
  featuredModels,
  familiesByTab,
}: {
  featuredModels: Model[];
  familiesByTab: Record<ModelsTabId, ModelFamily[]>;
}) {
  const [activeTab, setActiveTab] = useState<ModelsTabId>("cv");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKind>("all");
  const [sort, setSort] = useState<SortKind>("new-then-downloads");
  const [runModel, setRunModel] = useState<Model | null>(null);

  const filteredFamilies = useMemo(() => {
    const families = familiesByTab[activeTab] ?? [];
    const q = search.trim().toLowerCase();
    return families
      .map((f) => {
        let models = q
          ? f.models.filter(
              (m) =>
                m.name.toLowerCase().includes(q) ||
                f.name.toLowerCase().includes(q) ||
                (f.groupName && f.groupName.toLowerCase().includes(q))
            )
          : f.models;
        if (filter === "new") models = models.filter((m) => m.isNew);
        models = sortModels(models, sort);
        return { ...f, models };
      })
      .filter((f) => f.models.length > 0);
  }, [familiesByTab, activeTab, search, filter, sort]);

  return (
    <div className="bg-[#f7f7f7]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Featured Models */}
      <section className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Featured Models</h1>
        <div className="mt-6 flex flex-row flex-wrap items-stretch justify-center gap-6">
          {featuredModels.length > 0 ? (
            featuredModels.map((model) => (
              <FeaturedModelCard
                key={model.id}
                model={model}
                onRun={() => setRunModel(model)}
              />
            ))
          ) : null}
        </div>
      </section>
      </div>

      {/* All Models: 整块 section 从左到右白底 */}
      <section className="mt-0 w-full bg-white py-12 text-left">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">All Models</h2>

        {/* Tab 切换 + 搜索框 同一行 */}
        <div className="mt-3 flex flex-wrap items-center gap-4 border-b border-gray-200">
          <nav className="-mb-px flex gap-2" aria-label="Tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 px-3 py-3 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="relative ml-auto w-full min-w-0 border-l border-gray-200 pl-6 sm:w-56 md:w-72">
            <span className="pointer-events-none absolute left-0 top-1/2 flex w-9 -translate-y-1/2 items-center justify-center text-gray-400">
              <Icon icon="mingcute:search-line" className="h-4 w-4" aria-hidden />
            </span>
            <input
              type="search"
              placeholder="Search models..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border-0 py-2 pl-3 pr-3 text-sm text-gray-900 placeholder-gray-300 outline-none focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        {/* 过滤器 + 排序栏 — 暂时隐藏 */}
        {/* <div className="mt-4 flex flex-wrap items-center gap-4"> ... </div> */}

        <div className="mt-6 grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {filteredFamilies.map((family) => (
            <ModelFamilyCard
              key={family.id}
              family={family}
              onRun={setRunModel}
            />
          ))}
        </div>

        {filteredFamilies.length === 0 && (
          <p className="mt-8 text-center text-gray-500">No models match your search.</p>
        )}
        </div>
      </section>

      <RunModal model={runModel} onClose={() => setRunModel(null)} />
    </div>
  );
}
