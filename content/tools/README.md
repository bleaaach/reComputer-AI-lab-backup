# Tools 工具页维护说明

本目录是 **Tools** 页的单一数据源。工具列表与详情均从 `index.yaml` 及对应 Markdown 文档读取，无需改代码即可增删改 series、category、工具信息与正文。

---

## 一、数据文件

- **索引**：`index.yaml` — 定义 series（系列）、categories（分类，如 CV/LLM/VLM）、tools（工具条目：id、title、description、path）。
- **正文**：每个工具的 `path` 指向本目录下的 Markdown 文件，例如 `rk/cv/rknn-toolkit2-convert.md`。

---

## 二、结构说明

- **series**：系列（如 reComputer RK / R / J）。字段：`id`、`title`、`description`（可选）。
- **categories**：每个 series 下的分类（如 CV、LLM、VLM、General）。字段：`id`、`title`。
- **items**：每个 category 下的工具。字段：`id`、`title`、`description`（可选）、`path`（相对本目录的 .md 路径）。

`path` 必须对应 `content/tools/` 下实际存在的 .md 文件，否则详情页会 404 或显示“文档待补充”。

---

## 三、新增工具

1. 在 `content/tools/` 下按需创建子目录（如 `rk/cv/`），并新建 Markdown 文件，例如 `my-tool.md`。
2. 打开 `index.yaml`，在对应 series 的对应 category 的 `items` 下新增一条：

```yaml
- id: my-tool
  title: 我的工具名称
  description: 简短描述（可选）
  path: rk/cv/my-tool.md
```

3. 保存。刷新后即可在 /tools 列表看到，点击「进入」进入详情页。

---

## 四、新增 series 或 category

- **新增 series**：在 `index.yaml` 的 `series` 下新增一项，填写 `id`、`title`、`description`（可选）、`categories`（结构同上）。
- **新增 category**：在对应 series 的 `categories` 下新增一项，填写 `id`、`title`、`items`（可为空数组）。

---

## 五、删除或修改

- **删除工具**：在 `index.yaml` 中删除对应 `items` 条目；如需删除正文可一并删除对应 .md 文件。
- **修改展示信息**：直接编辑 `index.yaml` 中该工具的 `title`、`description` 或 `path`。
- **修改正文**：直接编辑对应 .md 文件，支持标准 Markdown（与 Tutorials 页相同渲染）。

---

## 六、修改后如何看到更新

- **本地开发**（`npm run dev`）：保存 YAML 或 .md 后，刷新浏览器即可。
- **正式部署**：修改后需重新执行 **`npm run build`** 并重新部署。

---

## 七、字段速查表

| 层级 | 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| series | id | string | 是 | 系列唯一标识，如 rk、r、j |
| series | title | string | 是 | 系列名称 |
| series | description | string | 否 | 系列简介，列表页展示 |
| category | id | string | 是 | 分类标识，如 cv、llm、vlm、general |
| category | title | string | 是 | 分类名称 |
| item | id | string | 是 | 工具唯一标识，用于 URL：/tools/{seriesId}/{toolId} |
| item | title | string | 是 | 工具名称 |
| item | description | string | 否 | 工具简短描述 |
| item | path | string | 是 | 相对 content/tools/ 的 .md 路径，如 rk/cv/xxx.md |
