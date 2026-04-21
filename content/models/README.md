# Models 模型信息填写指南 / Models Details Guide

---

## 中文

本目录是 reComputer AI Lab 模型目录的单一数据源。每个模型对应一个 YAML 文件，按**类型**（cv / llm / vlm）和**二级类别**（如 yolo、deepseek-r1-distill-qwen）放在子目录下，便于多人同时编辑不同模型而减少冲突。

### 目录结构

```
content/models/
  defaults.yaml          # 全局默认：设备与推理引擎（模型未定义时使用）
  cv/
    yolo/
      yolo11n.yaml       # 每个模型一个文件
      yolo11s.yaml
  llm/
    deepseek-r1-distill-qwen/
      1.5b-w4a16.yaml
  vlm/
    qwen2.5-vl/
      3b-w4a16.yaml
  wikis/                 # 可选：供 wikiRef、wikiPlatforms 引用的 .md 文件
    *.md
```

- **defaults.yaml**：仅包含 `devices` 和 `engines`，不包含模型列表。
- **&lt;类型&gt;/&lt;二级类别&gt;/&lt;slug&gt;.yaml**：单个模型文件。类型为 `cv`、`llm` 或 `vlm`；二级类别如 `yolo`、`deepseek-r1-distill-qwen`。文件名（去掉 `.yaml`）可作为 `slug`，若文件中未写 `slug` 则用文件名。

### defaults.yaml 的作用

`defaults.yaml` 提供**全局默认**的「设备/板卡」和「推理引擎」列表：

- 当某个模型**没有**在自身 YAML 中定义 `devices` 时，Run 弹窗和详情页的「Device / Board」下拉将使用 `defaults.yaml` 里的 `devices`。
- 当某个模型**没有**定义 `engines`，且也没有为当前设备配置 `deviceEngines[deviceId]` 时，将使用 `defaults.yaml` 里的 `engines`。

因此，所有模型共用的默认设备与引擎只需在 `defaults.yaml` 中维护一份；单个模型需要不同选项时，在自己的 YAML 里写 `devices`、`engines` 或 `deviceEngines` 即可覆盖。

### 一级类别与二级类别的增减

- **一级类别**（即类型）：对应 Models 页的 Tab，取值为 `cv`、`llm`、`vlm`。由每个模型 YAML 中的 `type` 字段决定，**不**由目录名自动推断。若要增加或修改一级类别，需在模型里写对应的 `type`，并在 `content/models/` 下建立同名目录（如 `cv/`、`llm/`、`vlm/`）以存放该类型下的模型文件。前端 Tab 会根据所有模型出现的 `type` 展示。
- **二级类别**（即系列/家族）：对应同一 Tab 下的分组，如「YOLO」「deepseek-r1-distill-qwen」。由模型 YAML 中的 `secondaryCategoryId` 和 `secondaryCategoryName` 决定。  
  - **增加**：在对应类型目录下新建子目录（如 `llm/my-new-family/`），在其中添加模型 YAML，并设置 `secondaryCategoryId: my-new-family`、`secondaryCategoryName: My New Family`（或你想要的展示名）。  
  - **删除/改名**：删除或重命名目录中的模型文件即可；若只改展示名，仅需修改模型内的 `secondaryCategoryName`，无需改目录。  
分组逻辑完全以 YAML 中的 `type` 与 `secondaryCategoryId` 为准，目录结构仅建议与之一致，便于浏览。

### 模型的增删改

- **新增模型**：在对应类型与二级类别目录下新建 `<slug>.yaml`，按下方字段说明填写。构建脚本会扫描 `cv/`、`llm/`、`vlm/` 下所有 `.yaml` 文件。
- **删除模型**：删除该模型的 YAML 文件即可。
- **修改模型**：只编辑该模型对应的 YAML 文件。
- **推荐字段顺序**：`id`、`name`、`slug`、`description`、`overview`...；其中 `description` 建议紧跟在 `slug` 下一行，作为 Featured Models 卡片文案。

### Wiki 部分

模型详情页的「Model Details」Wiki 区域支持 Markdown（二选一）

1. **内联在 YAML 中**：在模型 YAML 里使用 `wiki: |` 多行字符串，将 Markdown 直接写在当前文件中。适合篇幅较短、不常改动的说明。
2. **引用外部 .md 文件**：同一模型在不同硬件平台（如 reComputer RK、reComputer Jetson）上的部署步骤、Docker 命令、API 端口等往往不同。若将说明全部挤在一份文档里，用户需要自己翻找对应平台的内容，体验较差。`wikiPlatforms` 的作用是：在模型详情页「Model Details」下增加**平台下拉框**，用户选择平台后，页面自动切换显示该平台对应的文档，避免混在一起、便于查阅。

**使用方式**

1. **准备 MD 文档**：在 `content/models/wikis/` 下为每个平台新建一个 .md 文件（例如 `wikis/deepseek-7b-rk.md`、`wikis/deepseek-7b-jetson.md`），分别写入该平台的部署说明、命令、API 示例等。
2. **在模型 YAML 中引用**：在模型 YAML 中添加 `wikiPlatforms` 数组，每项指定 `doc`（引用的 MD 路径）和 `label`（下拉框中显示的名称）。

**YAML 定义示例**

```yaml
wikiPlatforms:
  - { doc: wikis/deepseek-7b-rk.md, label: reComputer RK }
  - { doc: wikis/deepseek-7b-jetson.md, label: reComputer Jetson }
```

- **doc**：引用的 MD 文件路径，相对于 `content/models/`，支持 `wikis/xxx.md` 或 `xxx.md`。
- **label**：下拉框中显示的选项名称。
- **id**（可选）：若不写，由 doc 路径自动生成。

有 `wikiPlatforms` 时，优先使用平台文档；无 `wikiPlatforms` 时回退到 `wiki` 或 `wikiRef`。下拉框样式与 Getting Started 的 Device / Inference Engine 保持一致。

### 字段速查（单模型 YAML）

| 字段 | YAML 键 | 说明 |
|------|---------|------|
| 名称与简介 | `name`, `description`, `overview` | `description` 用于 Featured Models 卡片展示（建议写在 `slug` 下一行）；`overview` 用于详情页概览。 |
| 一级类别 | `type` | `cv` / `llm` / `vlm`，需与所在目录一致。 |
| 二级类别 | `secondaryCategoryId`, `secondaryCategoryName` | 如 yolo、deepseek-r1-distill-qwen，用于分组；建议与父目录名一致。 |
| 是否精选 | `featured` | `true` 时出现在 Featured 区。 |
| 更新日期 | `updatedAt` | 如 `"2025-01-15"`。 |
| 设备/板卡 | `devices` | `{ id, label }` 列表；仅此处列出的会出现在下拉中。不写则用 defaults。 |
| 推理引擎（全局） | `engines` | 未按设备配置时的默认 `{ id, label }` 列表。不写则用 defaults。 |
| 按设备的引擎 | `deviceEngines` | 可选。`deviceId` → 该设备可选的 engine 列表；不写的设备回退到 `engines` 或 defaults。 |
| Docker 命令 | `docker` | `deviceId`, `engineId`, `command` 列表；随选项切换显示的代码块。不写则用生成器回退。 |
| Benchmark | `benchmarks` | **按引擎**：对象，key 为 engineId，value 为 `{ device, value, unit }` 数组；**兼容**：扁平数组，构建时归为单一引擎。`unit` 用于详情页单位 Toggle（如 TTFT (ms)、Tokens/s）；多单位时同一 device 可有多条。 |
| Wiki | `wiki` 或 `wikiRef` | 二选一：内联用 `wiki: \|`，或外部文件用 `wikiRef: wikis/xxx.md`。 |
| 平台文档 | `wikiPlatforms` | 可选。按平台切换：`[{ doc: wikis/xxx.md, label: 显示名 }]`，有此项时优先于 wiki。 |

可省略 `id`、`slug`，由文件名（不含 `.yaml`）作为 slug 与 id。

### 按设备约束推理引擎（deviceEngines）

若某设备只支持部分引擎，可为该设备单独配置 `deviceEngines`，例如：

```yaml
deviceEngines:
  recomputer-j401:
    - { id: vllm, label: VLLM }
    - { id: tensorrt, label: TensorRT-LLM }
  recomputer-r01:
    - { id: vllm, label: VLLM }
```

则选 reComputer J401 时出现 VLLM 与 TensorRT-LLM；选 reComputer R01 时只出现 VLLM。未出现在 `deviceEngines` 中的设备将使用 `engines` 或 defaults。

### Benchmark 部分（按引擎与单位）

详情页 Benchmark 区块支持按推理引擎切换数据，并按单位（如 TTFT (ms)、Tokens/s）切换图表。YAML 支持两种写法：

1. **按引擎（推荐）**：`benchmarks` 为对象，key 为 engineId（与 `deviceEngines` 中的 id 一致），value 为该引擎下的数据列表。同一 device 可有多个 unit。
2. **扁平数组（兼容）**：`benchmarks` 为 `[{ device, value, unit }, ...]`，构建时归到模型第一个引擎下。

按引擎示例：

```yaml
benchmarks:
  rkllm:
    - { device: reComputer rk3576, value: 7, unit: TTFT (ms) }
    - { device: reComputer rk3576, value: 70, unit: Tokens/s }
  vllm:
    - { device: reComputer J401, value: 85, unit: tok/s }
```

### 约定

- **类型与二级类别**：以 YAML 中的 `type`、`secondaryCategoryId`、`secondaryCategoryName` 为准；目录建议与之一致便于浏览。
- **ID**：使用小写、连字符（如 `recomputer-j401`、`yolo11n`）。
- **构建**：修改模型或 defaults 后执行 `npm run build:models` 重新生成数据；`npm run build` 会通过 prebuild 自动执行。

---

## English

This directory is the single source of truth for the reComputer AI Lab model catalog. Each model lives in its own YAML file under subdirectories by **type** (cv / llm / vlm) and **secondary category** (e.g. yolo, deepseek-r1-distill-qwen), so multiple people can edit different models without merge conflicts.

### Directory layout

```
content/models/
  defaults.yaml          # Global defaults: devices and engines (used when a model omits its own)
  cv/
    yolo/
      yolo11n.yaml       # One file per model
      yolo11s.yaml
  llm/
    deepseek-r1-distill-qwen/
      1.5b-w4a16.yaml
  vlm/
    qwen2.5-vl/
      3b-w4a16.yaml
  wikis/                 # Optional: .md files referenced by wikiRef, wikiPlatforms
    *.md
```

- **defaults.yaml** – Contains only `devices` and `engines`; no model list.
- **&lt;type&gt;/&lt;family&gt;/&lt;slug&gt;.yaml** – One file per model. Type is `cv`, `llm`, or `vlm`. Family is e.g. `yolo`, `deepseek-r1-distill-qwen`. Filename (without `.yaml`) is used as `slug` if the file does not set `slug`.

### Role of defaults.yaml

`defaults.yaml` provides **global default** lists for devices/boards and inference engines:

- If a model **does not** define `devices` in its own YAML, the “Device / Board” dropdown in the Run modal and detail page uses the `devices` list from `defaults.yaml`.
- If a model **does not** define `engines`, and has no `deviceEngines[deviceId]` for the current device, the `engines` list from `defaults.yaml` is used.

So all models share one place for default devices and engines; override only in the model’s YAML when needed via `devices`, `engines`, or `deviceEngines`.

### Adding or removing type and secondary category

- **Type** (一级类别): Corresponds to the Models page tabs: `cv`, `llm`, `vlm`. It is set by the `type` field in each model’s YAML, **not** by directory name. To add or change a type, set `type` in the model and create a directory under `content/models/` with that name (e.g. `cv/`, `llm/`, `vlm/`) to hold model files. Tabs are driven by the `type` values present in models.
- **Secondary category** (二级类别 / family): The grouping under each tab (e.g. “YOLO”, “deepseek-r1-distill-qwen”). It is set by `secondaryCategoryId` and `secondaryCategoryName` in the model YAML.  
  - **Add**: Create a new subdirectory under the type (e.g. `llm/my-new-family/`), add model YAMLs there, and set `secondaryCategoryId: my-new-family`, `secondaryCategoryName: My New Family` (or the display name you want).  
  - **Remove or rename**: Delete or move the model files; if you only change the display name, edit `secondaryCategoryName` in the YAML. Grouping is entirely determined by `type` and `secondaryCategoryId` in YAML; directory layout is for convenience.

### Adding or removing models

- **Add a model**: Create a new `<slug>.yaml` under the right type and family directory and fill in the fields below. The build script discovers all `.yaml` files under `cv/`, `llm/`, and `vlm/`.
- **Remove a model**: Delete its YAML file.
- **Change a model**: Edit only that model’s YAML file.
- **Recommended field order**: `id`, `name`, `slug`, `description`, `overview`... Put `description` directly below `slug`; it is used as the Featured Models card copy.

### Wiki section (choose one)

The “Model Details” wiki on the model detail page supports Markdown. There are **two mutually exclusive** ways to provide it:

1. **Inline in YAML**: In the model YAML, use a `wiki: |` multi-line string and put the Markdown directly in the file. Best for short, stable text.
2. **External .md file**: Put the Markdown in `content/models/wikis/` (e.g. `wikis/polo11m.md`) and in the model YAML set `wikiRef: wikis/polo11m.md`. The build script reads that file and uses its content as the model’s wiki. Best for long or separately edited docs.

If both `wiki` and `wikiRef` are set, the build script uses the file from `wikiRef`. Prefer using only one to avoid confusion.

### Platform toggle (wikiPlatforms)

**Purpose**

The same model often has different deployment steps, Docker commands, API ports, etc. on different hardware (e.g. reComputer RK vs. reComputer Jetson). Putting all of this in one wiki forces users to dig for their platform. `wikiPlatforms` adds a **platform dropdown** under "Model Details"; users pick a platform and the page shows only that platform's doc, keeping content organized and easier to use.

**How to use**

1. **Create MD files**: Add one .md file per platform under `content/models/wikis/` (e.g. `wikis/deepseek-7b-rk.md`, `wikis/deepseek-7b-jetson.md`), each with that platform's deployment instructions, commands, and API examples.
2. **Reference in model YAML**: Add a `wikiPlatforms` array to the model YAML, with each entry specifying `doc` (path to the .md file) and `label` (dropdown label).
3. **Build**: After running `npm run build:models` (or `npm run build`), the detail page shows the platform dropdown; switching options updates the displayed doc.

**YAML example:**

```yaml
wikiPlatforms:
  - { doc: wikis/deepseek-7b-rk.md, label: reComputer RK }
  - { doc: wikis/deepseek-7b-jetson.md, label: reComputer Jetson }
```

- **doc**: Path to the .md file relative to `content/models/`; supports `wikis/xxx.md` or `xxx.md`.
- **label**: Display name in the dropdown.
- **id** (optional): If omitted, derived from the doc path.

When `wikiPlatforms` is present, it overrides `wiki` and `wikiRef`; otherwise the model falls back to them. The dropdown styling matches the Getting Started Device / Inference Engine section.

### Field reference (per-model YAML)

| Field | Key(s) in YAML | Description |
|-------|----------------|-------------|
| Name & intro | `name`, `description`, `overview` | `description` is shown on Featured Models cards (recommended right below `slug`); `overview` is used for model detail overview text. |
| Type | `type` | One of `cv`, `llm`, `vlm`. Must match the directory. |
| Secondary category | `secondaryCategoryId`, `secondaryCategoryName` | e.g. yolo, deepseek-r1-distill-qwen. Drives family grouping; should match parent directory. |
| Featured | `featured` | `true` to show in the Featured section. |
| Update date | `updatedAt` | Date string, e.g. `"2025-01-15"`. |
| Device/board | `devices` | List of `{ id, label }`. Only these appear in the dropdown. Omit to use defaults. |
| Engines (global) | `engines` | Default `{ id, label }` when no per-device list. Omit to use defaults. |
| Engines per device | `deviceEngines` | Optional. Map deviceId to list of `{ id, label }`; omit key to fall back to `engines` or defaults. |
| Docker commands | `docker` | List of `{ deviceId, engineId, command }`. Shown command updates with selection. Omit for fallback generator. |
| Benchmark | `benchmarks` | **By engine**: object keyed by engineId, value = array of `{ device, value, unit }`. **Legacy**: flat array; build assigns it to a single engine. `unit` drives the detail-page unit toggle (e.g. TTFT (ms), Tokens/s); multiple units per device allowed. |
| Wiki | `wiki` or `wikiRef` | **Choose one**: inline with `wiki: \|`, or external file with `wikiRef: wikis/xxx.md`. |
| Platform docs | `wikiPlatforms` | Optional. Platform dropdown: `[{ doc: wikis/xxx.md, label: Display name }]`; overrides wiki when present. |

You can omit `id` and `slug`; the build script will use the filename (without `.yaml`) as `slug` and `id`.

### Engines per device (deviceEngines)

To show different inference engines per device, add `deviceEngines` with one entry per device id. Only the engines listed for the selected device appear in the dropdown.

```yaml
deviceEngines:
  recomputer-j401:
    - { id: vllm, label: VLLM }
    - { id: tensorrt, label: TensorRT-LLM }
  recomputer-r01:
    - { id: vllm, label: VLLM }
```

If you omit `deviceEngines` or a device id, the model’s `engines` (or global defaults) are used for that device.

### Benchmark section (by engine and unit)

The detail page Benchmark block lets users switch data by inference engine and switch the chart by unit (e.g. TTFT (ms), Tokens/s). YAML supports two formats:

1. **By engine (recommended)**: `benchmarks` is an object; keys are engineIds (matching `deviceEngines`), values are arrays of `{ device, value, unit }`. Multiple units per device are allowed.
2. **Flat array (legacy)**: `benchmarks` is `[{ device, value, unit }, ...]`; the build script assigns it to the model's first engine.

Example (by engine):

```yaml
benchmarks:
  rkllm:
    - { device: reComputer rk3576, value: 7, unit: TTFT (ms) }
    - { device: reComputer rk3576, value: 70, unit: Tokens/s }
  vllm:
    - { device: reComputer J401, value: 85, unit: tok/s }
```

### Conventions

- **Type and family**: Stored in each model’s YAML (`type`, `secondaryCategoryId`, `secondaryCategoryName`). Folder path should match for easier browsing.
- **IDs**: Use lowercase, hyphenated ids (e.g. `recomputer-j401`, `yolo11n`).
- **Build**: After editing any model or defaults, run `npm run build:models` to regenerate `lib/models-data.generated.ts`. The Next.js `build` script runs this automatically via `prebuild`.
