/**
 * Build-time script: read content/models/defaults.yaml and per-model YAML under
 * content/models/cv/, llm/, vlm/, output lib/models-data.generated.ts.
 * Run before build: npm run build:models (or prebuild).
 *
 * Models content root is read from scripts/content-config.js (MODELS_CONTENT_DIR)
 * so it can be adjusted for future i18n (e.g. per-locale wikis or generated files).
 */
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { ROOT, MODELS_CONTENT_DIR } = require("./content-config.js");

const CONTENT_DIR = MODELS_CONTENT_DIR;
const DEFAULTS_PATH = path.join(CONTENT_DIR, "defaults.yaml");
const WIKIS_DIR = path.join(CONTENT_DIR, "wikis");
const OUT_PATH = path.join(ROOT, "lib", "models-data.generated.ts");

const TYPE_DIRS = ["cv", "llm", "vlm"];

function loadDefaults() {
  const raw = fs.readFileSync(DEFAULTS_PATH, "utf-8");
  const data = yaml.load(raw);
  return {
    devices: data?.devices || [],
    engines: data?.engines || [],
  };
}

function discoverModelFiles() {
  const files = [];
  for (const typeDir of TYPE_DIRS) {
    const dir = path.join(CONTENT_DIR, typeDir);
    if (!fs.existsSync(dir)) continue;
    const walk = (d) => {
      const entries = fs.readdirSync(d, { withFileTypes: true });
      for (const e of entries) {
        const full = path.join(d, e.name);
        if (e.isDirectory()) walk(full);
        else if (e.isFile() && e.name.endsWith(".yaml")) files.push(full);
      }
    };
    walk(dir);
  }
  return files;
}

function readWikiRef(ref) {
  if (!ref || typeof ref !== "string") return "";
  const base = ref.startsWith("wikis/") ? ref : path.join("wikis", ref);
  const full = path.join(CONTENT_DIR, base);
  try {
    return fs.readFileSync(full, "utf-8").trim();
  } catch {
    return "";
  }
}

function mapModel(row, defaults) {
  const dockerCommands = (row.docker || []).map((d) => ({
    deviceId: d.deviceId,
    engineId: d.engineId,
    command: (d.command || "").trim(),
  }));

  let wikiMarkdown = (row.wiki || "").trim();
  if (row.wikiRef) {
    const fromFile = readWikiRef(row.wikiRef);
    if (fromFile) wikiMarkdown = fromFile;
  }

  // wikiPlatforms: 平台选项，每项引用一个 MD 文档；有此项时 Model Details 使用下拉切换
  let wikiPlatforms = undefined;
  if (row.wikiPlatforms && Array.isArray(row.wikiPlatforms) && row.wikiPlatforms.length > 0) {
    wikiPlatforms = row.wikiPlatforms
      .filter((p) => p && (p.doc || p.docRef) && p.label)
      .map((p) => {
        const doc = p.doc || p.docRef;
        const markdown = readWikiRef(doc);
        const id = (p.id || doc.replace(/\.md$/, "").replace(/\//g, "-")).trim();
        return { id, label: String(p.label).trim(), markdown: markdown || "" };
      })
      .filter((p) => p.id && p.label);
    if (wikiPlatforms.length === 0) wikiPlatforms = undefined;
  }

  let deviceEngines = undefined;
  if (row.deviceEngines && typeof row.deviceEngines === "object") {
    deviceEngines = {};
    for (const [key, val] of Object.entries(row.deviceEngines)) {
      if (Array.isArray(val)) deviceEngines[key] = val;
    }
  }

  // benchmarks: support object (by engineId) or legacy array; always output benchmarksByEngine + benchmarks
  const rawBenchmarks = row.benchmarks;
  let benchmarksByEngine = undefined;
  let benchmarks = [];
  if (rawBenchmarks != null) {
    if (Array.isArray(rawBenchmarks)) {
      benchmarks = rawBenchmarks;
      const firstEngineId =
        (deviceEngines && Object.values(deviceEngines)[0]?.[0]?.id) || "default";
      benchmarksByEngine = { [firstEngineId]: rawBenchmarks };
    } else if (typeof rawBenchmarks === "object" && !Array.isArray(rawBenchmarks)) {
      benchmarksByEngine = {};
      for (const [engineId, points] of Object.entries(rawBenchmarks)) {
        if (Array.isArray(points)) benchmarksByEngine[engineId] = points;
      }
      if (Object.keys(benchmarksByEngine).length > 0) {
        const firstKey = Object.keys(benchmarksByEngine)[0];
        benchmarks = benchmarksByEngine[firstKey] || [];
      }
    }
  }

  const model = {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || row.overview,
    categoryId: row.secondaryCategoryId || row.id,
    categoryName: row.secondaryCategoryName || row.name,
    isNew: row.isNew ?? false,
    featured: row.featured ?? false,
    downloads: row.downloads,
    favorites: row.favorites,
    uploadedAt: row.updatedAt || row.uploadedAt,
    updatedAt: row.updatedAt || row.uploadedAt,
    size: row.size,
    ram: row.ram,
    precision: row.precision,
    overview: row.overview,
    wikiMarkdown: wikiMarkdown || undefined,
    wikiPlatforms: wikiPlatforms,
    usageType: row.type,
    restApiEndpoint: row.restApiEndpoint,
    restApiExample: row.restApiExample,
    restApiResponseExample: row.restApiResponseExample,
    curlExample: row.curlExample,
    pythonExample: row.pythonExample,
    inputsOutputs: row.inputsOutputs,
    benchmarks,
    benchmarksByEngine:
      benchmarksByEngine && Object.keys(benchmarksByEngine).length > 0
        ? benchmarksByEngine
        : undefined,
    devices: row.devices && row.devices.length > 0 ? row.devices : defaults.devices,
    engines: row.engines && row.engines.length > 0 ? row.engines : defaults.engines,
    deviceEngines: deviceEngines && Object.keys(deviceEngines).length > 0 ? deviceEngines : undefined,
    dockerCommands: dockerCommands.length > 0 ? dockerCommands : undefined,
  };

  return model;
}

function buildFamiliesByTab(models) {
  const tabIds = ["cv", "llm", "vlm"];
  const byTab = { cv: {}, llm: {}, vlm: {} };

  for (const m of models) {
    const tab = m.usageType || "cv";
    if (!tabIds.includes(tab)) continue;
    const catId = m.categoryId;
    const catName = m.categoryName;
    if (!byTab[tab][catId]) {
      byTab[tab][catId] = { id: catId, name: catName, groupName: catName, models: [] };
    }
    byTab[tab][catId].models.push(m);
  }

  const familiesByTab = {};
  for (const tab of tabIds) {
    familiesByTab[tab] = Object.values(byTab[tab]).map((f) => ({
      ...f,
      models: f.models.sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0)),
    }));
  }
  return familiesByTab;
}

function main() {
  const defaults = loadDefaults();
  const modelFiles = discoverModelFiles();
  const models = [];
  for (const filePath of modelFiles) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const row = yaml.load(raw);
    if (!row) continue;
    const baseName = path.basename(filePath, ".yaml");
    if (!row.slug) row.slug = baseName;
    if (!row.id) row.id = row.slug;
    models.push(mapModel(row, defaults));
  }
  const featuredModels = models.filter((m) => m.featured);
  const familiesByTab = buildFamiliesByTab(models);

  const out = `/**
 * Auto-generated from content/models (defaults + per-model YAML). Do not edit by hand.
 * Run: npm run build:models
 */
import type { Model, ModelFamily, ModelsTabId } from "./types";

export const DEFAULT_DEVICES = ${JSON.stringify(defaults.devices, null, 2)} as const;
export const DEFAULT_ENGINES = ${JSON.stringify(defaults.engines, null, 2)} as const;

export const featuredModels: Model[] = ${JSON.stringify(featuredModels, null, 2)};

export const familiesByTab: Record<ModelsTabId, ModelFamily[]> = ${JSON.stringify(familiesByTab, null, 2)};

const allModels: Model[] = ${JSON.stringify(models, null, 2)};

export function getModelBySlug(slug: string): Model | null {
  return allModels.find((m) => m.slug === slug) ?? null;
}

/** First featured model for backward compatibility when only one featured is shown */
export function getFeaturedModel(): Model {
  return featuredModels[0] ?? allModels[0] ?? ({} as Model);
}
`;

  fs.writeFileSync(OUT_PATH, out, "utf-8");
  console.log("Wrote", OUT_PATH);
}

main();
