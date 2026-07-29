# chmodtool.com

面向开发者和运维的纯前端 chmod 权限计算器。项目基于 ShipAny Two 起步，已裁剪为可部署到 Cloudflare Pages 的 Next.js 静态站。

## 本地运行

环境要求：Node.js 22、pnpm 9.15.0。

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

开发地址：<http://localhost:3000>

验证生产产物：

```bash
pnpm build
pnpm preview
```

Pages 本地预览地址：<http://localhost:8788>

## Cloudflare Pages

- Framework preset：`Next.js (Static HTML Export)`
- Build command：`pnpm build`
- Build output directory：`out`
- Root directory：仓库根目录
- Node.js：`22`

详细步骤见 [docs/deployment.md](docs/deployment.md)。

## 目录

- `src/app/`：首页、法律页、robots 和 sitemap
- `src/components/`：工具根容器、广告位、站点框架、Google Analytics
- `src/i18n/`：i18n 骨架，目前仅启用英文 `en`
- `src/lib/seo.ts`：每页 title、description、canonical 和 Open Graph 配置
- `public/`：品牌图标
- `docs/`：产品、部署、决策和验证记录

## 当前边界

首页已有下一步可直接扩展的 `data-tool-root` 工具容器，但没有提前实现计算器交互。项目不包含登录、OAuth、注册、用户中心、后台、订阅、积分、支付、付费墙、数据库或 CMS。
