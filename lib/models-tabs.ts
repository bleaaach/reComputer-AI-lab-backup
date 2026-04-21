import type { Model, ModelFamily, ModelsTabId } from "./types";

const defaultBenchmarks = [
  { device: "reComputer J401", value: 45, unit: "FPS" },
  { device: "reComputer RK3588", value: 32, unit: "FPS" },
  { device: "reComputer R01", value: 28, unit: "FPS" },
];

const defaultBenchmarksLlm = [
  { device: "reComputer J401", value: 40, unit: "tok/s" },
  { device: "reComputer RK3588", value: 28, unit: "tok/s" },
  { device: "reComputer R01", value: 22, unit: "tok/s" },
];

function makeModel(
  overrides: Partial<Model> & { id: string; name: string; slug: string; categoryId: string; categoryName: string }
): Model {
  return {
    ...overrides,
    benchmarks: overrides.benchmarks ?? defaultBenchmarks,
  } as Model;
}

const yolo11nCurl = `curl -X POST "http://localhost:8080/v1/detection" \\
  -H "Content-Type: application/json" \\
  -d '{"image_url": "https://example.com/image.jpg", "conf": 0.25}'`;

const yolo11nPython = `import requests

resp = requests.post(
    "http://localhost:8080/v1/detection",
    json={"image_url": "https://example.com/image.jpg", "conf": 0.25},
)
print(resp.json())`;

/** Featured 模型：YOLO 11n */
export const featuredModel: Model = makeModel({
  id: "yolo11n",
  name: "YOLO 11n",
  slug: "yolo11n",
  categoryId: "yolo",
  categoryName: "YOLO",
  isNew: true,
  downloads: 1200,
  favorites: 320,
  uploadedAt: "2025-01-15",
  overview: "YOLO11 目标检测系列 nano 版本，轻量高效，适合边缘部署。",
  description:
    "YOLO 11n 是 YOLO11 目标检测系列的 nano 版本，参数量最小，适合在 reComputer 等边缘设备上实时运行。支持常见 COCO 类别检测，可通过 REST API 或 Python SDK 调用。部署后可通过 HTTP 上传图片或 URL 获取检测结果（边界框与置信度）。",
  usageType: "cv",
  size: "~6MB",
  ram: "1GB+",
  precision: "FP16",
  curlExample: yolo11nCurl,
  pythonExample: yolo11nPython,
  restApiEndpoint: "POST http://localhost:8080/v1/detection",
  benchmarks: [
    { device: "reComputer J401", value: 55, unit: "FPS" },
    { device: "reComputer RK3588", value: 42, unit: "FPS" },
    { device: "reComputer R01", value: 35, unit: "FPS" },
  ],
});

/** CV / LLM / VLM 按 family 分组数据 */
const cvFamilies: ModelFamily[] = [
  {
    id: "yolo",
    name: "YOLO",
    groupName: "YOLO11目标检测",
    models: [
      makeModel({
        id: "yolo11n",
        name: "yolo11n",
        slug: "yolo11n",
        categoryId: "yolo",
        categoryName: "YOLO",
        isNew: true,
        downloads: 1200,
        favorites: 320,
        uploadedAt: "2025-01-15",
        overview: "YOLO11 nano，最小体积，适合边缘设备。",
        description: featuredModel.description,
        usageType: "cv",
        size: "~6MB",
        ram: "1GB+",
        precision: "FP16",
        curlExample: featuredModel.curlExample,
        pythonExample: featuredModel.pythonExample,
        restApiEndpoint: featuredModel.restApiEndpoint,
      }),
      makeModel({
        id: "yolo11s",
        name: "yolo11s",
        slug: "yolo11s",
        categoryId: "yolo",
        categoryName: "YOLO",
        downloads: 800,
        favorites: 180,
        uploadedAt: "2025-01-10",
        overview: "YOLO11 small，精度与速度平衡。",
        usageType: "cv",
        size: "~22MB",
        ram: "2GB+",
      }),
      makeModel({
        id: "yolo11m",
        name: "yolo11m",
        slug: "yolo11m",
        categoryId: "yolo",
        categoryName: "YOLO",
        downloads: 500,
        favorites: 95,
        uploadedAt: "2025-01-08",
        overview: "YOLO11 medium，更高精度。",
        usageType: "cv",
        size: "~52MB",
        ram: "2GB+",
      }),
    ],
  },
];

const llmFamilies: ModelFamily[] = [
  {
    id: "deepseek-r1-distill-qwen",
    name: "deepseek-r1-distill-qwen",
    models: [
      makeModel({
        id: "ds-r1-qwen-7b-w4a16-g128",
        name: "7b-w4a16-g128",
        slug: "7b-w4a16-g128",
        categoryId: "deepseek-r1-distill-qwen",
        categoryName: "deepseek-r1-distill-qwen",
        downloads: 650,
        favorites: 210,
        uploadedAt: "2025-01-12",
        overview: "7B 量化 w4a16，group size 128。",
        usageType: "llm",
        size: "~4GB",
        ram: "8GB+",
        benchmarks: defaultBenchmarksLlm,
      }),
      makeModel({
        id: "ds-r1-qwen-1.5b-w4a16",
        name: "1.5b-w4a16",
        slug: "1.5b-w4a16",
        categoryId: "deepseek-r1-distill-qwen",
        categoryName: "deepseek-r1-distill-qwen",
        downloads: 980,
        favorites: 280,
        uploadedAt: "2025-01-14",
        overview: "1.5B w4a16 量化。",
        usageType: "llm",
        size: "~1GB",
        ram: "2GB+",
        benchmarks: defaultBenchmarksLlm,
      }),
      makeModel({
        id: "ds-r1-qwen-1.5b-fp16",
        name: "1.5b-fp16",
        slug: "1.5b-fp16",
        categoryId: "deepseek-r1-distill-qwen",
        categoryName: "deepseek-r1-distill-qwen",
        downloads: 720,
        favorites: 150,
        uploadedAt: "2025-01-11",
        overview: "1.5B FP16 全精度。",
        usageType: "llm",
        size: "~3GB",
        ram: "4GB+",
        benchmarks: defaultBenchmarksLlm,
      }),
      makeModel({
        id: "ds-r1-qwen-1.5b-w4a16-g128",
        name: "1.5b-w4a16-g128",
        slug: "1.5b-w4a16-g128",
        categoryId: "deepseek-r1-distill-qwen",
        categoryName: "deepseek-r1-distill-qwen",
        downloads: 1100,
        favorites: 260,
        uploadedAt: "2025-01-16",
        overview: "1.5B w4a16，group size 128。",
        usageType: "llm",
        size: "~1GB",
        ram: "2GB+",
        benchmarks: defaultBenchmarksLlm,
      }),
    ],
  },
];

const vlmFamilies: ModelFamily[] = [
  {
    id: "qwen2.5-vl",
    name: "qwen2.5-vl",
    models: [
      makeModel({
        id: "qwen2.5-vl-3b-w4a16",
        name: "3b-w4a16",
        slug: "3b-w4a16",
        categoryId: "qwen2.5-vl",
        categoryName: "qwen2.5-vl",
        downloads: 420,
        favorites: 88,
        uploadedAt: "2025-01-09",
        overview: "Qwen2.5-VL 3B w4a16 量化，视觉语言模型。",
        usageType: "vlm",
        size: "~2GB",
        ram: "4GB+",
        benchmarks: defaultBenchmarksLlm,
      }),
    ],
  },
];

const familiesByTab: Record<ModelsTabId, ModelFamily[]> = {
  cv: cvFamilies,
  llm: llmFamilies,
  vlm: vlmFamilies,
};

export function getFeaturedModel(): Model {
  return featuredModel;
}

export function getFamiliesByTab(tab: ModelsTabId): ModelFamily[] {
  return familiesByTab[tab];
}

export function getAllFamiliesByTab(): Record<ModelsTabId, ModelFamily[]> {
  return { ...familiesByTab };
}

/** 收集所有模型（featured + 各 tab 下 family），按 slug 查找 */
export function getModelBySlug(slug: string): Model | null {
  if (featuredModel.slug === slug) return featuredModel;
  for (const tab of Object.keys(familiesByTab) as ModelsTabId[]) {
    for (const family of familiesByTab[tab]) {
      const m = family.models.find((x) => x.slug === slug);
      if (m) return m;
    }
  }
  return null;
}
