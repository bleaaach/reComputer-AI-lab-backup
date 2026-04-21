# 本地字体

- **Space Grotesk**：此处为从 `@fontsource/space-grotesk` 复制的 woff2（latin 400/500/600/700），由 `next/font/local` 在 `app/layout.tsx` 中加载。构建与部署均不依赖外网。
- **Noto Sans SC**：通过 `app/globals.css` 中的 `@import "@fontsource/noto-sans-sc/..."` 从 node_modules 打包，同样不依赖 Google Fonts。

若需更新 Space Grotesk 文件，可从 node_modules 复制：

```bash
cp node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-{400,500,600,700}-normal.woff2 app/fonts/
```
