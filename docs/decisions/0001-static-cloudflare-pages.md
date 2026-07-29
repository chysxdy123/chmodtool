# 决策：使用 Cloudflare Pages 静态导出

日期：2026-07-29

## 背景

ShipAny Two 的 `cf` 分支使用 OpenNext 部署到 Cloudflare Workers，包含服务器运行时、数据库和认证能力。当前产品明确不需要这些能力，部署目标是 Cloudflare Pages。

## 决策

使用 Next.js `output: 'export'` 生成 `out/`，由 Cloudflare Pages 作为静态资源托管。

## 影响

- 不使用 ShipAny `cf` 分支的 OpenNext、D1、Hyperdrive 或 Workers 配置。
- 不存在服务器 API、会话、数据库和运行时密钥。
- `NEXT_PUBLIC_*` 配置会在构建时写入静态资源，修改后需要重新构建部署。
- 如果以后需要服务端功能，应重新评估迁移到 Cloudflare Workers，而不是向 Pages 静态站叠加后端能力。
