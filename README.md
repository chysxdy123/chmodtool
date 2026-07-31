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

- Pages project：`chmodtool-git`
- Pages URL：<https://chmodtool-git.pages.dev>
- Deployment：GitHub 自动部署，推送到 `main` 后触发
- Framework preset：`None`，使用下面的显式构建设置
- Build command：`pnpm build`
- Build output directory：`out`
- Root directory：仓库根目录
- Node.js / pnpm：`22` / `9.15.0`

详细步骤见 [docs/deployment.md](docs/deployment.md)。

从产品判断、MVP、技术裁剪到上线、SEO、分析与迭代的通用复盘，见 [docs/zero-to-one-web-project-playbook.md](docs/zero-to-one-web-project-playbook.md)。

## 目录

- `src/app/`：首页、法律页、robots 和 sitemap
- `src/app/fix/`：面向具体报错场景的交互式修复页
- `src/components/`：工具根容器、广告位、站点框架、Google Analytics
- `src/i18n/`：i18n 骨架，目前仅启用英文 `en`
- `src/lib/permission-engine.ts`：三位/四位 Unix 权限转换、解析、说明和风险判断
- `src/lib/seo.ts`：每页 title、description、canonical 和 Open Graph 配置
- `public/`：品牌图标
- `docs/`：产品、部署、决策和验证记录

## 当前边界

首页已实现权限复选框、八进制模式、权限字符串和 chmod 命令的实时双向联动。纯函数换算逻辑位于 `src/lib/permission-engine.ts`，可复用交互位于 `src/components/permission-widget.tsx`，页面命令外壳位于 `src/components/chmod-tool-shell.tsx`。项目不包含登录、OAuth、注册、用户中心、后台、订阅、积分、支付、付费墙、数据库或 CMS。
