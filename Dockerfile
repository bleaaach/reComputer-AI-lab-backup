FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3004

RUN apk add --no-cache libc6-compat

# Standalone 已包含 traced 的 node_modules（含 next）；勿再 npm ci，否则会清空并重建依赖，
# 在 lock/平台不一致或安装失败时易出现运行时 Cannot find module 'next'。
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# #region agent log — build-time: 若 standalone 未带上 next，此处失败（hypothesisId H1/H2）
RUN node -e "require('next')"
# #endregion

EXPOSE 3004
CMD ["node", "server.js"]

