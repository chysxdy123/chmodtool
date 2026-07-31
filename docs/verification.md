# 验证清单

- [x] `pnpm lint` 通过
- [x] `pnpm build` 通过并生成 `out/`
- [x] 首页 `<title>` 为 `chmod Calculator - Octal & Symbolic Permission Converter`
- [x] 首页唯一主标题 `<h1>` 为 `chmod calculator`
- [x] 首页 meta description 完整包含 `chmod calculator` 和四个常用权限值
- [x] `/robots.txt` 可访问并引用正式 sitemap
- [x] `/sitemap.xml` 只包含真实页面和正式域名
- [x] 页面源码不包含登录、支付、积分、后台或 CMS 路由
- [x] 未配置有效 GA ID 时不显示同意条或加载 Google Analytics 脚本
- [x] 配置 GA ID 后，同意前不请求 Google Analytics 脚本
- [x] 接受后加载 GA4，并把选择持久保存在浏览器中
- [x] 拒绝后不加载 GA4；撤回同意后停止新事件并清理可访问的 GA Cookie
- [x] 复制成功时只发送 `copy_chmod_command` 和命令类型
- [x] 页脚的 Analytics settings 可以重新打开选择面板
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
- [x] 权限引擎支持 3 位和 4 位八进制、setuid、setgid、sticky bit，并对非法输入抛出明确错误
- [x] 可复用 PermissionWidget 支持可编辑和只读展示模式，主计算器默认视觉与交互保持不变
- [x] SSH key 权限修复页为静态页面，六种文件/目录选项输出 600、644 或 700 的正确命令
- [x] SSH key 权限修复页的命令、Windows icacls 和排错命令均提供复制按钮
- [x] SSH key 权限修复页 title、description、canonical、FAQPage JSON-LD 和 sitemap 入口已生成
- [x] SSH key 权限修复页桌面端与 390px 移动端无整页横向溢出
- [x] SSH key 权限修复页已在 Safari 实测单行 chmod 与多行 Windows icacls 命令均可完整复制
- [x] SSH key 权限修复页在无扩展 Chrome 的 Lighthouse 13.3.0 移动端 SEO 审计中得分 100
- [x] 提交 `232d8d3` 已部署到正式域名；新页面、首页入口、sitemap、canonical、FAQPage、700 模式切换和 390px 布局均在生产环境验证通过，控制台无错误
- [x] Cloudflare Web Analytics 已启用并能显示 `chmodtool.com` 的访问量与页面浏览量
- [x] 隐私政策准确说明 Cloudflare Web Analytics 和基于同意的 GA4 行为
- [x] 首页可见 FAQ 与 FAQPage JSON-LD 使用同一份文案数据

## 本地验收说明

- Lighthouse 应在无扩展或无痕窗口运行。普通 Chrome 窗口中的扩展可能向页面注入图片等元素，造成与网站源码无关的 SEO 误报。本次普通窗口首次得到 92 分，无痕窗口复测为 100 分，失败项确认来自扩展注入。

## PEM 权限修复页本地验收（2026-07-31）

- [x] `/fix/pem-file-permissions` 已生成静态页面，并加入首页 Common fixes、SSH 页互链和 sitemap；本地 sitemap 共包含 9 个可收录 URL
- [x] title、description、H1、canonical 和 FAQPage JSON-LD 使用 PEM/AWS EC2 语境，主推 `chmod 400`
- [x] PEM 修复器复用共享交互骨架，三种目标分别输出 `.pem=400`、目录 `700`、SSH config `600`
- [x] AWS PEM 页包含 400 vs 600、Windows PowerShell `icacls` 完整步骤、WSL 提示和 EC2 四步排查顺序
- [x] 9 项单元测试、全部 512 种三位权限往返验证、ESLint、本批文件 Prettier 检查和正式构建通过
- [x] 1440px 桌面与 390px 移动端无整页横向溢出；390px 下无主内容越界，三个命令区的文字与复制按钮无重叠
- [x] 正式静态构建中 Windows 四行命令可完整复制，内容逐字一致
- [x] SSH 页回归通过：URL、title、H1、默认 600 命令和 `.ssh` 目录 700 切换保持不变
- [x] PEM 与 SSH 两页正文逐段比对，无完全重复段落；两页浏览器控制台均无错误
- [ ] 新页面 Lighthouse 移动端 SEO 复测（本机当前未安装 Lighthouse，本轮未联网安装）

## 上线后待验证

- [ ] 配置并验证 `privacy@chmodtool.com` 与 `support@chmodtool.com` 可以正常收信
- [ ] `https://chmodtool.com` 与 HTTPS 证书可访问
- [ ] 自定义域名只保留一个可索引版本，`www` 正确 301 到裸域
- [ ] Search Console 域名验证通过并成功读取 sitemap
- [x] PEM 权限修复页在正式域名返回 200；canonical、FAQPage、修复器 400/700 切换和 390px 布局正常，控制台无错误
- [ ] 在 Search Console 对 `/fix/pem-file-permissions` 请求编入索引
- [ ] 在 GA4 中将 `copy_chmod_command` 标记为关键事件
- [ ] 接入广告前升级为 Google 认证 CMP，并再次更新隐私政策
