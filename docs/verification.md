# 验证清单

- [x] `pnpm lint` 通过
- [x] `pnpm build` 通过并生成 `out/`
- [x] 首页 `<title>` 为 `chmod calculator`
- [x] 首页唯一主标题 `<h1>` 为 `chmod calculator`
- [x] `/robots.txt` 可访问并引用正式 sitemap
- [x] `/sitemap.xml` 只包含真实页面和正式域名
- [x] 页面源码不包含登录、支付、积分、后台或 CMS 路由
- [x] 未配置 GA ID 时不加载 Google Analytics 脚本
- [x] 配置测试值后会生成 GA 和 Search Console 标签
- [x] 空广告位存在但不加载广告脚本
- [x] 桌面和移动端无溢出或遮挡
- [x] Cloudflare Pages 构建命令为 `pnpm build`，输出目录为 `out`

## 上线后待验证

- [ ] `https://chmodtool.com` 与 HTTPS 证书可访问
- [ ] 自定义域名只保留一个可索引版本，`www` 正确 301 到裸域
- [ ] Search Console 域名验证通过并成功读取 sitemap
- [ ] 填入真实 GA4 ID 后能在实时报告看到访问事件
