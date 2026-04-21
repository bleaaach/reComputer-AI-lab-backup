import type { Model, Category } from "./types";

let modelsCache: { categories: Category[]; models: Model[] } | null = null;

export async function getCategories(): Promise<Category[]> {
  if (modelsCache) return modelsCache.categories;
  const data = await getModelsData();
  return data.categories;
}

export async function getModels(): Promise<Model[]> {
  if (modelsCache) return modelsCache.models;
  const data = await getModelsData();
  return data.models;
}

/** 服务端读文件，客户端 fetch /data/models.json；后续可替换为 CMS API */
async function getModelsData(): Promise<{ categories: Category[]; models: Model[] }> {
  if (typeof window !== "undefined") {
    const res = await fetch("/data/models.json");
    const data = await res.json();
    modelsCache = data;
    return data;
  }
  const fs = await import("fs");
  const path = await import("path");
  const filePath = path.join(process.cwd(), "data", "models.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  modelsCache = JSON.parse(raw) as { categories: Category[]; models: Model[] };
  return modelsCache;
}

// Projects: use getProjects() / getFeaturedProjects() from lib/projects.ts (data from content/projects/projects.yaml)
