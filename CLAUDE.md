# 北极星财务规划 · 网站项目

## 项目定位

**服务者**：北美华人个人理财顾问（独立理财顾问，前硅谷工程师）  
**目标客户**：30–45 岁湾区华人工程师，RSU 已开始 vest，对税务和退休规划感到困惑  
**核心价值主张**：Fee-only 独立收费，不卖保险，不拿佣金，专注帮客户把 RSU / 401K / 税务 / 退休现金流系统梳理清楚

**客户心理**：信任专业意见，但不信任陌生推销。不喜欢科技感太强，喜欢有温度的专业感。

---

## 视觉风格

**整体气质**：精密极简网格（方向 1c）—— 白底、黑色网格边框、等宽字体标签、900 weight 无衬线标题，工程师式干净精密感

- 纯白底 `#FFFFFF`，大量留白
- 黑色细线 `#17211C` 作为结构线（border）
- 等宽字体（ui-monospace）用于标签、eyebrow、meta 信息
- 重磅 `font-weight:900` 无衬线大标题
- 深蓝 `#1B3A5B` 作为唯一彩色点缀

---

## 配色方案

| 用途 | 色值 |
|------|------|
| 主色（按钮、强调、标签边框）| `#1B3A5B` |
| 主色 hover | `#142B45` |
| 页面底色 | `#FFFFFF` |
| 次级底色（Pain / Pricing section）| `#FAF8F3` |
| 结构线（border）| `#17211C` |
| 正文主色 | `#17211C` |
| 正文次级 | `rgba(23,33,28,.62)` |
| Featured tier 文字 | `#EFF2F6` / `#9DB4CE` |

---

## 字体方案

```
标题 / 正文：Noto Sans SC（sans-serif，400/500/700/900）
标签 / eyebrow / meta：ui-monospace, Menlo, monospace（系统等宽）
```

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;900&display=swap" rel="stylesheet">
```

**用法规则**：
- Hero h1、section h2 → `font-weight:900; letter-spacing:-.025em`
- Section eyebrow → `font-family:ui-monospace; font-size:12px; letter-spacing:.16em; color:#1B3A5B`
- Badge / tag → `font-family:ui-monospace; border:1px solid #17211C`
- 正文 p → `Noto Sans SC, font-size:14.5–16px, line-height:1.68`

---

## 页面结构

### index.html（落地页）
1. **Nav**：`北极星 / POLARIS`（等宽）+ 锚点链接 + 预约按钮（深蓝实色）
2. **Hero**：eyebrow `01 —` + 大标题"挣得多，更要留得下。" + 副标题 + 两个 CTA + 三栏统计（带黑色分隔线）
3. **Pain Points**：`02 —` eyebrow + 大标题 + 三卡网格（1px 黑色 gap 形成格线效果）
4. **About**：`03 —` + 4:5 照片占位（黑边框）+ 文案 + 等宽 badge
5. **Pricing**：`04 —` + 两档（PLAN A / PLAN B），网格 1px 黑色分隔，PLAN B 深蓝底色
6. **Book / CTA**：`05 —` + 深色 `#17211C` 背景块，Calendly 按钮 + 微信二维码
7. **Footer**：等宽 Logo + 免责声明

### resources.html（资源页）
- 同款 Nav（资源链接高亮 active 状态）
- Hero：eyebrow `RESOURCES —` + 大标题"把复杂的事，写清楚。"
- 筛选栏（sticky）：全部 / 401K / RSU / 税务规划 / 投资基础，active 状态深蓝实色
- 文章网格：3 列，卡片含 topic tag（等宽边框）、标题、摘要、日期 + 阅读时间
- JS 客户端筛选，无刷新

---

## 待填入的占位符

| 占位符 | 说明 |
|--------|------|
| `［你的名字］` | About 区真实姓名 |
| About 照片 | 替换 `.about-photo` 为 `<img>` |
| `$499` / `$1,999` | 定价确认或调整 |
| Calendly 链接 | 替换 `https://calendly.com/` |
| `hello@example.com` | 真实邮箱 |
| 微信二维码 | 替换 `.wechat-qr` 内容为 `<img>` |
| 文章链接 | `resources.html` 各卡片 `href="#"` 替换为真实文章页 |

---

## 文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 落地页，单文件，无构建依赖 |
| `resources.html` | 资源/文章列表页，含客户端筛选 JS |
| `handoff/untitled/project/财务顾问落地页.dc.html` | Claude Design 落地页稿（1c 方向） |
| `handoff/untitled/project/resources.dc.html` | Claude Design 资源页稿 |
| `handoff/untitled/project/视觉方向.dc.html` | 三个视觉方向对比 |
| `handoff/untitled/project/配色对比.dc.html` | 深绿 vs 深蓝 vs 翡翠绿配色对比 |
