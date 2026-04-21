# 首页 Quick Access 维护说明

本目录是**首页 Quick Access 区块**的配置数据源。区块标题、描述与各卡片的标题、描述、按钮文案均从 `quick-access.yaml` 读取，无需改代码即可编辑。

---

## 一、数据文件

- **唯一数据源**：`quick-access.yaml`
- **结构**：顶层 `title`（区块标题）、`description`（区块描述）、`cards`（卡片数组）。每张卡片字段见下方「字段速查表」。

---

## 二、可编辑项

- **区块**：`title`（区块标题）、`description`（区块描述）。
- **每张卡片**：`title`（卡片标题）、`description`（卡片描述）、`buttonText`（按钮/链接文案）、`href`（跳转链接，一般不需改）。

直接编辑 `quick-access.yaml` 中对应字段，保存即可生效。

---

## 三、新增或删除卡片

- **新增**：在 `cards:` 数组下新增一条，按字段填写（id、title、description、buttonText、href）。
- **删除**：在 `quick-access.yaml` 中删除对应条目（整段 `- id: ...` 到下一项之前）并保存。
- **调整顺序**：调整 `cards` 数组中条目的顺序即可，展示顺序与 YAML 中顺序一致。

---

## 四、修改后如何看到更新

- **本地开发**（`npm run dev`）：保存 `quick-access.yaml` 后，**刷新浏览器**即可看到更新，无需重启 dev 服务。
- **正式部署**：修改 YAML 后需重新执行 **`npm run build`**（并重新部署），首页 Quick Access 区块才会展示最新内容。

---

## 五、字段速查表

**区块顶层：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 否 | 区块标题，默认 "Quick Access" |
| description | string | 否 | 区块描述文案 |
| cards | array | 是 | 卡片列表，见下表 |

**卡片（cards 每项）：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 唯一标识，建议英文/数字/连字符 |
| title | string | 是 | 卡片标题 |
| description | string | 是 | 卡片描述文案 |
| buttonText | string | 是 | 按钮/链接文案（如 "Browse all models →"） |
| href | string | 是 | 点击跳转链接（如 "/models"） |
