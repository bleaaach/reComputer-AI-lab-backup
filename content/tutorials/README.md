# Tutorials 页面编辑指南

本文档面向负责更新和维护 Tutorials 教程内容的协作者。通过本指南，可以快速掌握目录结构、添加新文档、修改现有内容，以及理解 URL 规则。

---

## 一、内容结构概览

Tutorials 采用 **YAML 索引 + Markdown 文档** 的架构：

| 文件/目录 | 作用 |
|----------|------|
| `content/tutorials/index.yaml` | 目录索引，定义系列、分组和页面层级 |
| `content/tutorials/rk/` | reComputer RK 系列教程内容 |
| `content/tutorials/r/` | reComputer R 系列教程内容 |
| `content/tutorials/j/` | reComputer J 系列教程内容 |

- **仅修改 `index.yaml` 和 Markdown 文件**，无需改动代码即可完成日常维护。
- 左侧导航树和右侧正文由 `index.yaml` 自动生成。

---

## 二、索引文件 `index.yaml` 说明

### 2.1 顶层结构

```yaml
series:
  - id: rk              # 系列唯一标识，用于 URL
    title: reComputer RK Series
    items: [...]         # 该系列下的分组或页面
  - id: r
    title: reComputer R Series
    items: [...]
```

- `id`：英文、小写、连字符，用于 URL 路径，修改后会导致旧链接失效。
- `title`：侧边栏和面包屑中显示的标题。

### 2.2 节点类型

#### ① 分组（group）

用于在侧边栏中创建可折叠的分类：

```yaml
- type: group
  id: getting-start
  title: Getting start
  items:
    - type: page
      id: resource-download-summary
      title: Resource Download Summary
      path: rk/getting-start/resource-download-summary.md
```

- `id`：分组唯一标识，建议用连字符（如 `getting-start`）。
- `items`：可包含子分组或页面。

#### ② 页面（page）

对应一篇 Markdown 文档：

```yaml
- type: page
  id: hardware-connection
  title: Hardware Connection
  path: rk/getting-start/hardware-connection.md
```

- `id`：页面唯一标识，同一分组内不可重复。
- `path`：**相对于 `content/tutorials/` 的 Markdown 文件路径**，必须与真实文件位置一致。

#### ③ 外链（link）

跳转到外部网址，不渲染本地 Markdown：

```yaml
- type: link
  id: external-doc
  title: 外部文档
  url: https://example.com/doc
```

---

## 三、添加新文档

### 步骤 1：创建 Markdown 文件

在 `content/tutorials/` 下按系列和主题创建文件，例如：

```
content/tutorials/rk/application/new-feature.md
```

### 步骤 2：编写 Markdown 内容

支持标准 Markdown 语法，包括：

- 标题：`#`、`##`、`###`
- 列表、表格、引用
- 代码块（带语言高亮）：` ```bash `、` ```python ` 等
- 图片：`![描述](图片路径)`

示例：

```markdown
# 新功能说明

简要介绍该功能用途。

## 使用步骤

1. 第一步
2. 第二步

## 代码示例

```bash
./run.sh
```
```

### 步骤 3：在 `index.yaml` 中注册

在对应系列的 `items` 中增加页面节点：

```yaml
- type: page
  id: new-feature
  title: 新功能说明
  path: rk/application/new-feature.md
```

如需放在某分组下，则在分组的 `items` 中添加。

---

## 四、修改现有文档

- **只改正文**：直接编辑对应的 `.md` 文件，保存后刷新页面即可。
- **只改标题**：在 `index.yaml` 中修改该页面的 `title`。
- **改文件名或路径**：修改 `index.yaml` 中的 `path`，并确保新路径下的文件存在。

---

## 五、添加新系列或分组

### 5.1 添加新系列（如新硬件平台）

1. 在 `content/tutorials/` 下新建目录，如 `new-series/`。
2. 创建至少一个 Markdown 文件，如 `overview.md`。
3. 在 `index.yaml` 的 `series` 中追加：

```yaml
- id: new-series
  title: 新系列名称
  items:
    - type: page
      id: overview
      title: Overview
      path: new-series/overview.md
```

### 5.2 在现有系列下添加新分组

在对应系列的 `items` 中加入：

```yaml
- type: group
  id: new-category
  title: 新分类
  items:
    - type: page
      id: first-page
      title: 第一篇
      path: rk/new-category/first-page.md
```

并在 `content/tutorials/rk/new-category/` 下创建 `first-page.md`。

---

## 六、URL 规则

页面 URL 由 `index.yaml` 中的层级路径决定：

| 路径 | URL 示例 |
|------|----------|
| 系列根 | `/tutorials` → 自动跳转到第一个系列的第一篇 |
| 系列 + 页面 | `/tutorials/rk/resource-download-summary` |
| 系列 + 分组 + 页面 | `/tutorials/rk/getting-start/hardware-connection` |
| 多级分组 | `/tutorials/rk/getting-start/flash-os/install-system-microsd` |

URL 中的每一段对应 `id`，顺序与 `index.yaml` 的层级一致。

---

## 七、常见问题

### Q1：修改 `index.yaml` 后页面没变化？

开发环境下通常会热更新；若未生效，可尝试重启开发服务器或强制刷新浏览器。

### Q2：404 或内容加载失败？

检查：

1. `path` 是否与文件实际路径一致（相对于 `content/tutorials/`）。
2. 文件名、扩展名是否正确（`.md`）。
3. YAML 缩进是否正确（建议使用 2 空格）。

### Q3：同一分组下 `id` 重复会怎样？

同一层级内 `id` 重复会导致路由冲突，左侧导航可能异常。请确保每个 `id` 在同一层级内唯一。

### Q4：Markdown 中代码块不显示？

请使用围栏式代码块，并标明语言：

````markdown
```bash
echo "hello"
```
````

### Q5：如何调整文档顺序？

在 `index.yaml` 中调整对应 `items` 数组内节点的顺序即可，顺序即侧边栏和面包屑的显示顺序。

---

## 八、维护建议

1. **命名规范**：`id` 使用小写英文和连字符，如 `hardware-connection`。
2. **路径规范**：`path` 与目录结构对应，便于多人协作。
3. **先建文件再改索引**：新建页面时先创建 `.md` 文件，再在 `index.yaml` 中注册，避免 404。
4. **提交前检查**：修改后本地访问对应 URL，确认导航和内容正常。

---

## 九、快速参考

| 操作 | 主要修改 |
|------|----------|
| 新增页面 | 新建 `.md` + 在 `index.yaml` 中添加 `type: page` 节点 |
| 新增分组 | 在 `index.yaml` 中添加 `type: group` 节点 |
| 新增系列 | 新建目录 + 新建 `.md` + 在 `series` 中追加新系列 |
| 修改正文 | 直接编辑 `.md` |
| 修改标题/顺序 | 修改 `index.yaml` |
| 添加外链 | 在 `index.yaml` 中添加 `type: link` 节点 |
