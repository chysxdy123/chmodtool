# 验证清单

- [x] `pnpm lint` 通过
- [x] `pnpm build` 通过并生成 `out/`
- [x] 首页 `<title>` 为 `chmod Calculator - Octal & Symbolic Permission Converter`
- [x] 首页唯一主标题 `<h1>` 为 `chmod calculator`
- [x] 首页 meta description 完整包含 `chmod calculator` 和四个常用权限值
- [x] `/robots.txt` 可访问并引用正式 sitemap
- [x] `/sitemap.xml` 只包含真实页面和正式域名
- [x] 页面源码不包含登录、支付、积分、后台或 CMS 路由
- [x] 未配置 GA ID 时不加载 Google Analytics 脚本
- [x] 配置测试值后会生成 GA 和 Search Console 标签
- [x] 空广告位存在但不加载广告脚本
- [x] 桌面和移动端无溢出或遮挡
- [x] Cloudflare Pages 构建命令为 `pnpm build`，输出目录为 `out`
- [x] Cloudflare Pages 已连接 `chysxdy123/chmodtool`，推送 `main` 会自动部署
- [x] GitHub 集成首次从提交 `ec8360f` 构建成功
- [x] 九个勾选框、八进制模式和符号模式可从任一入口实时联动
- [x] `755`、`644`、`600`、`777` 快捷按钮输出正确
- [x] 数字命令和符号命令随权限实时更新且可复制
- [x] `777` 与 other 可写权限会显示风险提示
- [x] 所有权限勾选框都有可访问名称且可用键盘操作
- [x] 纯函数换算模块通过全部 512 种三位权限的往返验证
- [x] Cloudflare Web Analytics 已启用并能显示 `chmodtool.com` 的访问量与页面浏览量
- [x] 隐私政策准确说明 Cloudflare Web Analytics 已启用、GA4 未启用
- [x] 首页可见 FAQ 与 FAQPage JSON-LD 使用同一份文案数据

## 上线后待验证

- [ ] 配置并验证 `privacy@chmodtool.com` 与 `support@chmodtool.com` 可以正常收信
- [ ] `https://chmodtool.com` 与 HTTPS 证书可访问
- [ ] 自定义域名只保留一个可索引版本，`www` 正确 301 到裸域
- [ ] Search Console 域名验证通过并成功读取 sitemap
- [ ] 启用广告或需要事件级分析前，重新评估 GA4、Cookie 同意机制和隐私政策
