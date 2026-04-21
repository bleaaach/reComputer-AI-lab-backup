import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { getContentRoot } from "./content-paths";

export interface ToolEntry {
  id: string;
  title: string;
  description?: string;
  path: string;
}

export interface ToolCategory {
  id: string;
  title: string;
  items: ToolEntry[];
}

export interface ToolSeries {
  id: string;
  title: string;
  description?: string;
  categories: ToolCategory[];
}

export interface ToolDetailResult {
  series: ToolSeries;
  category: ToolCategory;
  tool: ToolEntry;
  content: string;
}

let catalogCache: ToolSeries[] | null = null;

function loadCatalog(): ToolSeries[] {
  if (catalogCache && process.env.NODE_ENV === "production") return catalogCache;
  const root = getContentRoot();
  const toolsIndexPath = path.join(root, "tools", "index.yaml");
  const raw = fs.readFileSync(toolsIndexPath, "utf-8");
  const data = yaml.load(raw) as { series?: ToolSeries[] };
  const series = Array.isArray(data?.series) ? data.series : [];
  // Normalize: YAML may leave category.items as undefined when empty
  for (const s of series) {
    if (Array.isArray(s.categories)) {
      for (const c of s.categories) {
        if (!Array.isArray(c.items)) c.items = [];
      }
    }
  }
  catalogCache = series;
  return series;
}

/** Returns the full tools catalog for the list page. */
export function getToolsCatalog(): ToolSeries[] {
  return loadCatalog();
}

/** Returns a single tool by series id and tool id, with markdown content. */
export function getToolBySlug(
  seriesId: string,
  toolId: string
): ToolDetailResult | null {
  const catalog = loadCatalog();
  const series = catalog.find((s) => s.id === seriesId);
  if (!series) return null;

  for (const category of series.categories) {
    const tool = category.items.find((t) => t.id === toolId);
    if (tool) {
      const contentPath = path.join(getContentRoot(), "tools", tool.path);
      let content = "";
      if (fs.existsSync(contentPath)) {
        content = fs.readFileSync(contentPath, "utf-8");
      }
      return { series, category, tool, content };
    }
  }
  return null;
}

/** All (seriesId, toolId) pairs for static generation. */
export function getAllToolSlugs(): { seriesId: string; toolId: string }[] {
  const catalog = loadCatalog();
  const slugs: { seriesId: string; toolId: string }[] = [];
  for (const series of catalog) {
    for (const category of series.categories) {
      for (const tool of category.items) {
        slugs.push({ seriesId: series.id, toolId: tool.id });
      }
    }
  }
  return slugs;
}
