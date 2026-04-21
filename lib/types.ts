export type UsageType = "cv" | "llm" | "vlm";

export interface BenchmarkPoint {
  device: string;
  value: number;
  unit?: string;
}

/** Device/board option for Run modal */
export interface DeviceOption {
  id: string;
  label: string;
}

/** Inference engine option for Run modal */
export interface EngineOption {
  id: string;
  label: string;
}

/** Per (device, engine) docker command for Run modal */
export interface DockerCommandEntry {
  deviceId: string;
  engineId: string;
  command: string;
}

export interface Model {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  isNew?: boolean;
  /** 是否在 Featured 区展示 */
  featured?: boolean;
  /** 下载量，用于排序（降序） */
  downloads?: number;
  /** 收藏量 */
  favorites?: number;
  /** 上传/更新日期，如 2025-01-15 */
  uploadedAt?: string;
  /** 更新日期（与 uploadedAt 二选一或一致） */
  updatedAt?: string;
  size?: string;
  ram?: string;
  /** 如 FP8 / FP16 */
  precision?: string;
  overview?: string;
  /** Featured Models 卡片描述；详情页在无 wiki 时可回退显示 */
  description?: string;
  /** 详情页 Markdown wiki，优先于 description 渲染 */
  wikiMarkdown?: string;
  /** 平台选项：按平台切换显示不同 MD 文档内容；有此项时优先于 wikiMarkdown */
  wikiPlatforms?: Array<{ id: string; label: string; markdown: string }>;
  usageType?: UsageType;
  usageContent?: string;
  restApiEndpoint?: string;
  restApiExample?: string;
  restApiResponseExample?: string;
  /** Getting Started 用 - Curl 示例 */
  curlExample?: string;
  /** Getting Started 用 - Python 示例 */
  pythonExample?: string;
  inputsOutputs?: string;
  /** Legacy: flat list; used when benchmarksByEngine is absent (build fills from this into default engine). */
  benchmarks: BenchmarkPoint[];
  /** Benchmark data by inference engine id; build fills from benchmarks object or from benchmarks array under "default". */
  benchmarksByEngine?: Record<string, BenchmarkPoint[]>;
  /** 该模型可选的 device/board，不写则用全局默认 */
  devices?: DeviceOption[];
  /** 该模型可选的 inference engine，不写则用全局默认 */
  engines?: EngineOption[];
  /** 按 device 约束的 engine 列表：deviceEngines[deviceId] 为该 device 可选的 engine；缺失时用 engines */
  deviceEngines?: Record<string, EngineOption[]>;
  /** 按 (deviceId, engineId) 的 docker 命令，Run 弹窗用 */
  dockerCommands?: DockerCommandEntry[];
}

/** Models 页按 Tab（CV/LLM/VLM）+ 模型族分组 */
export type ModelsTabId = "cv" | "llm" | "vlm";

export interface ModelFamily {
  id: string;
  name: string;
  /** 可选分组名，如 YOLO11目标检测 */
  groupName?: string;
  models: Model[];
}

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
}

/** Cover type for project card: image, gif, video, or youtube */
export type ProjectCoverType = "image" | "gif" | "video" | "youtube";

export interface ProjectCover {
  type: ProjectCoverType;
  url: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  summary: string;
  /** @deprecated Use cover instead; normalized to cover in getProjects() */
  coverImage?: string;
  /** Cover media: image, gif, video, or youtube. If absent, coverImage is used as image. */
  cover?: ProjectCover;
  sourceUrl: string;
  sourceLabel?: string;
  author?: string;
  /** Publish date, e.g. "2025-01-15" or "Oct 26, 2025" */
  publishedAt?: string;
  /** Tags for the card, e.g. ["llm", "robotics"] */
  tags?: string[];
  /** If true, shown in homepage Community Projects section */
  featured?: boolean;
}
