# 决策：MVP 阶段使用 Cloudflare Web Analytics

日期：2026-07-29

状态：Cloudflare Web Analytics 方案继续保留；其中“暂不启用 GA4”的部分已被 [0003-consent-based-ga4.md](0003-consent-based-ga4.md) 取代。

## 背景

网站需要验证自然搜索流量、热门页面和页面性能。GA4 能提供更细的事件和转化分析，但当前 MVP 没有广告、付费转化或复杂用户路径，也没有 Cookie 同意机制。

## 决策

启用 Cloudflare Web Analytics，暂不启用 GA4。保留现有 GA4 构建时配置位，后续只有在需要事件级分析并完成相应隐私与同意方案后再启用。

## 影响

- 当前可在 Cloudflare 查看聚合访问量、页面浏览量、来源和 Core Web Vitals。
- 隐私政策说明 Cloudflare Web Analytics 已启用，并明确 GA4 当前未启用。
- Cloudflare Web Analytics 数据已经在后台出现，说明自动注入和数据采集正常。
- Cloudflare Web Analytics 与将来可能启用的 GA4 统计口径不同，不应期待数字完全一致。
