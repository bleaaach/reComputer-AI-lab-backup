# Projects 项目维护说明

本目录是 **Community Projects** 的单一数据源。项目列表和首页「Community Projects」区块均从 `projects.yaml` 读取，无需改代码即可增删改项目。

---

## 一、数据文件

- **唯一数据源**：`projects.yaml`
- **结构**：顶层键 `projects`，值为项目对象数组。每个对象字段见下方「字段速查表」。

---

## 二、新增项目

1. 打开 `projects.yaml`。
2. 在 `projects:` 数组下新增一条，按字段填写。示例：

```yaml
- id: "my-project"
  title: "My Cool Project"
  summary: "One-line description for the card."
  author: "Your Name or Team"
  publishedAt: "2025-02-25"
  tags: ["llm", "robotics"]
  featured: true
  sourceUrl: "https://example.com/project"
  sourceLabel: "Hackster"
  cover:
    type: image
    url: "https://example.com/cover.jpg"
```

3. 保存文件。下次构建或刷新后即可在 `/projects` 页和（若 `featured: true`）首页显示。

**封面类型说明**：

| cover.type | 说明 | url 示例 |
|------------|------|----------|
| `image` | 静态图片 | 任意图片直链 |
| `gif` | 动图 | 任意 GIF 直链 |
| `video` | 视频 | 视频文件直链（卡片上会静音循环播放） |
| `youtube` | YouTube 视频 | 完整链接如 `https://www.youtube.com/watch?v=VIDEO_ID`，或仅写 `VIDEO_ID` |

**封面无法显示（裂图）**：若图片/动图不显示，多为外链被目标站**防盗链（403）**拦截。例如 `files.seeedstudio.com` 等仅允许站内引用。解决办法：将封面图上传到允许外链的图床或自己站点，在 `cover.url` 中改用新地址；或暂时改用 `type: image` 并填写一张可公开访问的图片链接。

---

## 三、删除项目

在 `projects.yaml` 中删除对应条目（整段 `- id: ...` 到下一项之前）并保存即可。

---

## 四、修改项目

直接编辑 `projects.yaml` 中该项目的任意字段，保存即可。例如改标题、摘要、作者、发布时间、标签、是否精选、封面或外链。

---

## 五、修改后如何看到更新

- **本地开发**（`npm run dev`）：保存 `projects.yaml` 后，**刷新浏览器**即可看到更新，无需重启 dev 服务。
- **正式部署**：修改 YAML 后需重新执行 **`npm run build`**（并重新部署），首页和 `/projects` 页才会展示最新内容。

---

## 六、首页展示规则

- 仅 **`featured: true`** 的项目会出现在首页「Community Projects」区块。
- 若没有项目设为 `featured: true`，首页该区块会显示「暂无精选项目」类提示。
- 所有项目（无论是否 featured）都会在 **/projects** 页完整列出。

---

## 七、字段速查表

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 唯一标识，建议英文/数字/连字符 |
| title | string | 是 | 项目名称 |
| summary | string | 是 | 卡片摘要文案 |
| author | string | 否 | 作者或团队名，显示在标题上方 |
| publishedAt | string | 否 | 发布时间，如 `2025-01-15` 或 `Oct 26, 2025` |
| tags | string[] | 否 | 标签列表，如 `["llm", "robotics"]` |
| featured | boolean | 否 | 是否在首页展示，默认 false |
| sourceUrl | string | 是 | 项目外链（Hackster / YouTube / GitHub 等） |
| sourceLabel | string | 否 | 来源名称，如 "Hackster"、"YouTube" |
| cover | object | 否 | 见下表 |

**cover 对象**：

| 字段 | 类型 | 说明 |
|------|------|------|
| type | string | `image` \| `gif` \| `video` \| `youtube` |
| url | string | 图片/动图/视频直链；YouTube 为完整链接或 video ID |

不填 `cover` 时，卡片封面区域为灰色占位。
