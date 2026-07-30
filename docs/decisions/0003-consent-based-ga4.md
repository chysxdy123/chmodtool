# 决策：在明确同意后启用 GA4

日期：2026-07-29

## 背景

Cloudflare Web Analytics 已能提供聚合流量和性能数据，但后续需要衡量用户是否实际复制了 chmod 命令。GA4 可以记录这类事件，但不应在访客同意前加载 Google 标签或传输数据。

## 决策

保留 Cloudflare Web Analytics，并增加采用基础同意模式的 GA4：

- 首次访问时提供接受和拒绝两个选择。
- 同意前完全不加载 Google 标签，也不向 Google 发送数据。
- 选择保存在浏览器本地存储中，页脚始终提供重新修改选择的入口。
- 首期只记录页面浏览和 `copy_chmod_command` 事件。
- 复制事件只附带 `octal` 或 `symbolic` 类型，不发送命令内容、文件名或权限值。
- 撤回同意后停止调用 GA4，并删除当前站点可访问的 GA Cookie。

## 影响

- GA4 的访问量会低于真实访问量，因为拒绝或尚未选择的访客不会被统计。
- Cloudflare Web Analytics 与 GA4 的统计口径不同，两者数字不应直接对齐。
- 后续接入 AdSense 前，必须重新评估并升级为 Google 认证的 CMP，不能把当前同意条直接当作广告同意方案。
