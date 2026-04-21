# Models content

Single source of truth for reComputer AI Lab model catalog. Each model lives in its own YAML file under `cv/`, `llm/`, or `vlm/` by type and family, so multiple people can edit different models without merge conflicts.

## Directory layout

```
content/models/
  defaults.yaml          # Global devices and engines (used when a model omits its own)
  cv/
    yolo/
      yolo11n.yaml       # One file per model
      yolo11s.yaml
      yolo11m.yaml
  llm/
    deepseek-r1-distill-qwen/
      7b-w4a16-g128.yaml
      1.5b-w4a16.yaml
      ...
  vlm/
    qwen2.5-vl/
      3b-w4a16.yaml
  wikis/                 # Optional: reference via wikiRef in a model
    *.md
```

- **defaults.yaml** – Only `devices` and `engines`. No model list.
- **&lt;type&gt;/&lt;family&gt;/&lt;slug&gt;.yaml** – One file per model. Type is `cv`, `llm`, or `vlm`. Family is e.g. `yolo`, `deepseek-r1-distill-qwen`. Filename (without `.yaml`) is used as `slug` if the file does not set `slug`.

## Adding or removing models

- **Add a model**: Create a new YAML file under the right type and family, e.g. `llm/my-family/my-model.yaml`. Use the field reference below. The build script discovers all `.yaml` files under `cv/`, `llm/`, and `vlm/`.
- **Remove a model**: Delete its YAML file.
- **Change a model**: Edit only that model’s file; others are untouched.

## Field reference (per-model YAML)

Each model file is a single YAML object with the following keys (same as before, just one model per file):

| Field | Key(s) in YAML | Description |
|-------|----------------|-------------|
| **a. Name & intro** | `name`, `overview` | Display name and short description. |
| **b. Type** | `type` | One of `cv`, `llm`, `vlm`. Must match the directory (`cv/`, `llm/`, `vlm/`). |
| **c. Secondary category** | `secondaryCategoryId`, `secondaryCategoryName` | e.g. yolo, deepseek-r1-distill-qwen. Drives family grouping; should match the parent directory name. |
| **d. Featured** | `featured` | `true` to show in the Featured Models section. |
| **e. Update date** | `updatedAt` | Date string, e.g. `"2025-01-15"`. Shown on cards and details. |
| **f. Device/board options** | `devices` | List of `{ id, label }`. Only these appear in the device dropdown. Omit to use defaults. |
| **g. Inference engine options** | `engines` | List of `{ id, label }` used when no per-device list is set. Omit to use defaults. |
| **g2. Engines per device** | `deviceEngines` | Optional. Map deviceId to list of `{ id, label }`. For each device, only these engines appear; omit key to fall back to `engines`. |
| **h. Docker commands** | `docker` | List of `{ deviceId, engineId, command }`. The shown command switches with device/engine selection. Omit to use fallback generator. |
| **i. Benchmark** | `benchmarks` | List of `{ device, value, unit }` (e.g. FPS, tok/s). |
| **j. Wiki (Markdown)** | `wiki` or `wikiRef` | Inline Markdown with `wiki: \|` or reference external file with `wikiRef: wikis/slug.md`. |

You can omit `id` and `slug` if the filename is `<slug>.yaml`; the build script will use the filename as `slug` and `id`.

## Engines per device (deviceEngines)

To show different inference engines per device, add `deviceEngines` with one entry per device id. Only the engines listed for the selected device appear in the dropdown.

```yaml
deviceEngines:
  recomputer-j401:
    - id: vllm
      label: VLLM
    - id: tensorrt
      label: TensorRT-LLM
  rk3588:
    - id: vllm
      label: VLLM
```

If you omit `deviceEngines` or a device id, the model’s `engines` (or global defaults) are used for that device.

## Global defaults

Edit `defaults.yaml` to change the default devices and engines used by models that do not define their own:

```yaml
devices:
  - id: recomputer-j401
    label: reComputer J401
  # ...
engines:
  - id: vllm
    label: VLLM
  # ...
```

## Conventions

- **Type and family**: Stored in each model’s YAML (`type`, `secondaryCategoryId`, `secondaryCategoryName`). Folder path should match so the repo stays easy to browse.
- **IDs**: Use lowercase, hyphenated ids (e.g. `recomputer-j401`, `yolo11n`) for `id`, `slug`, `deviceId`, `engineId`, and `secondaryCategoryId`.
- **Build**: After editing any model or defaults, run `npm run build:models` to regenerate `lib/models-data.generated.ts`. The Next.js `build` script runs this automatically via `prebuild`.

## Optional: external wiki files

Place Markdown in `wikis/` and reference from a model with `wikiRef: wikis/my-model.md`. The build script reads the file and attaches its content as the model’s wiki Markdown.
