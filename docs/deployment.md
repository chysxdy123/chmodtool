# Cloudflare Pages 部署

## 当前状态

- Pages 项目：`chmodtool-git`
- GitHub 仓库：`chysxdy123/chmodtool`
- 生产分支：`main`
- Pages 地址：<https://chmodtool-git.pages.dev>
- 首次部署：2026-07-29，从 GitHub 提交 `ec8360f` 构建成功
- Git Provider：已连接；推送 `main` 会自动构建并部署
- 旧项目：直接上传项目 `chmodtool` 暂时保留作为回退，不再作为主部署目标
- 自定义域名：`https://chmodtool.com` 已绑定并上线
- GA4 数据流：已创建，Measurement ID 为 `G-LXX778W8KZ`；尚未写入 Cloudflare 环境变量

## 构建配置

- Framework preset：`None`
- Production branch：`main`
- Build command：`pnpm build`
- Build output directory：`out`
- Root directory：仓库根目录
- Node.js version：`22`
- pnpm version：`9.15.0`

## Cloudflare 后台步骤

1. 将当前项目推送到一个私有 GitHub 仓库。ShipAny 许可证禁止公开发布模板源码。
2. 在 Cloudflare 进入 `Workers & Pages`，创建 Pages 项目并连接该私有仓库。
3. Framework preset 保持 `None`，填入上面的构建命令和输出目录。
4. 在 `Settings > Environment variables` 为 Production 和 Preview 配置：
   - `NEXT_PUBLIC_APP_URL=https://chmodtool.com`
   - `NEXT_PUBLIC_APP_NAME=chmodtool.com`
   - `NEXT_PUBLIC_DEFAULT_LOCALE=en`
   - `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-LXX778W8KZ`：本地同意机制验证完成；获得上线确认后再为 Production 和 Preview 填写
   - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`：暂留空，选择 Search Console HTML tag 验证时填写 content 值
5. 触发一次部署，确认 `*.pages.dev` 预览地址可访问。
6. 进入 Pages 项目的 `Custom domains`，添加 `chmodtool.com`。若域名 DNS 已托管在同一 Cloudflare 账号，按提示自动创建记录；否则按后台给出的目标添加 DNS 记录。
7. 建议同时添加 `www.chmodtool.com`，再在 Cloudflare 设置 301 重定向到裸域，避免两个可索引版本。
8. 在 Google Search Console 创建 Domain property 时按提示添加 DNS TXT；若使用 URL-prefix property，则可使用上面的 HTML tag 环境变量。
9. 验证 Search Console 后提交 `https://chmodtool.com/sitemap.xml`。

环境变量是构建时配置。新增 GA 或 Search Console 值后需要重新部署，静态文件才会包含对应标签。GA4 即使已配置，也只会在访客明确接受分析后加载。

## 本地预览

```bash
pnpm build
pnpm preview
```

Wrangler 会从 `out/` 启动 Pages 本地服务，默认地址为 `http://localhost:8788`。

## 部署方式

日常发布只需将通过验证的提交推送到 GitHub `main`，Cloudflare 会自动构建和部署。

CLI 仅作为自动部署不可用时的手动回退：

首次使用前需由项目负责人执行 Cloudflare 登录并确认账号：

```bash
pnpm exec wrangler login
pnpm pages:deploy
```

手动部署需要 Cloudflare 登录授权，不应作为日常发布方式。
