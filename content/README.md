# Content 目录说明

本目录存放站点的可编辑内容（YAML、Markdown 等）。所有路径均由应用通过统一的「内容根」解析，见 `lib/content-paths.ts` 中的 `getContentRoot()`。

---

## 当前路径约定

- **内容根**：即本目录 `content/`。教程、工具、项目、首页、轮播等均相对于此根目录下的子目录读取。
- **受影响的子目录**：
  - `tutorials/` — 教程目录（index.yaml）与正文（*.md）
  - `tools/` — 工具目录（index.yaml）与正文（*.md）
  - `projects/` — 项目列表（projects.yaml）
  - `home/` — 首页快捷入口（quick-access.yaml）
  - `banners/` — 首页轮播（banners.yaml）
  - `models/` — 模型元数据与 wiki，由构建脚本 `scripts/build-models.js` 读取（根路径见 `scripts/content-config.js`）

各子目录的详细格式与维护方式见各自目录下的 README（如 `tools/README.md`、`tutorials/README.md` 等）。

---

## 多语言支持（规划）

为支持多语言，计划将上述可编辑内容按语言分子目录，**默认语言为 `zh`**：

- **教程 / 工具 / 项目 / 首页 / 轮播**：将置于 `content/<locale>/...`，例如：
  - `content/zh/tutorials/`、`content/zh/tools/`、`content/zh/projects/`、`content/zh/home/`、`content/zh/banners/`
  - `content/en/...` 等其它语言同理
- **模型**：元数据（defaults、各 model yaml）可保持共享或按需在 YAML 内增加多语言字段；wiki 正文若需多语言，计划使用 `content/models/wikis/<locale>/xxx.md` 等形式，具体在实现 i18n 时再定。

当前实现仍使用单一内容根（无 locale 子目录）；待多语言接入时，会在 `getContentRoot(locale)` 中按 locale 返回 `content/<locale>`，并做缺失时的 fallback（如无 `en` 时回退到 `zh`），无需再改各 loader 的路径拼接方式。
