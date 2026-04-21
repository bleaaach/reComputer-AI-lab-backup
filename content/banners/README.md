# 首页 Banner 维护说明

本目录是**首页顶端轮播 Banner** 的单一数据源。轮播内容从 `banners.yaml` 读取，无需改代码即可增删改条目。

---

## 一、数据文件

- **唯一数据源**：`banners.yaml`
- **结构**：顶层键 `banners`，值为 Banner 对象数组。每个对象字段见下方「字段速查表」。

---

## 二、图片地址（imageUrl）两种方式（都支持）

- **外链**：填任意可访问的完整 URL（如 `https://example.com/banner.jpg`）。部分站点会防盗链导致裂图，建议使用允许外链的图床。
- **上传到仓库**：将图片放到项目根目录下的 **`public/banners/`**，在 YAML 中填站内路径，如 `/banners/xxx.jpg`。新增或更换图片时把文件提交到 Git 即可。

**推荐**：轮播图建议尺寸比例约 **1200×400**，以保证在不同屏幕上的显示效果。

---

## 三、新增 Banner

1. 打开 `banners.yaml`。
2. 在 `banners:` 数组下新增一条，按字段填写。示例：

```yaml
- id: "my-banner"
  imageUrl: "https://example.com/banner.jpg"
  link: "/tutorials"
  alt: "活动说明"
  sortOrder: 4
```

若使用本地上传的图片，将图片放入 `public/banners/` 后，可写：

```yaml
- id: "my-banner"
  imageUrl: "/banners/my-banner.jpg"
  link: "/tutorials"
  alt: "活动说明"
  sortOrder: 4
```

3. 保存文件。下次构建或刷新后即可在首页轮播中看到。

---

## 四、删除 Banner

在 `banners.yaml` 中删除对应条目（整段 `- id: ...` 到下一项之前）并保存即可。

---

## 五、修改 Banner

直接编辑 `banners.yaml` 中该条目的任意字段（如 `imageUrl`、`link`、`alt`、`sortOrder`），保存即可。

---

## 六、修改后如何看到更新

- **本地开发**（`npm run dev`）：保存 `banners.yaml` 后，**刷新浏览器**即可看到更新，无需重启 dev 服务。
- **正式部署**：修改 YAML 或更换 `public/banners/` 内图片后，需重新执行 **`npm run build`**（并重新部署），首页轮播才会展示最新内容。

---

## 七、字段速查表

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 唯一标识，建议英文/数字/连字符 |
| imageUrl | string | 是 | 图片地址：外链 URL 或站内路径（如 `/banners/xxx.jpg`） |
| link | string | 否 | 点击跳转链接，不填则点击不跳转 |
| alt | string | 否 | 图片 alt 文案，利于无障碍与 SEO |
| sortOrder | number | 否 | 排序权重，数值越小越靠前；不填则按 YAML 中顺序 |
