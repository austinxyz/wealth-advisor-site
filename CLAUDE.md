# 北极星财务规划 · 网站项目

## 项目定位

**服务者**：北美华人个人理财顾问（CFP®，前硅谷工程师）  
**目标客户**：30–45 岁湾区华人工程师，RSU 已开始 vest，对税务和退休规划感到困惑  
**核心价值主张**：Fee-only 独立收费，不卖保险，不拿佣金，专注帮客户把 RSU / 401K / 税务 / 退休现金流系统梳理清楚

**客户心理**：信任专业意见，但不信任陌生推销。不喜欢科技感太强，喜欢有温度的专业感。

---

## 视觉风格

**整体气质**：编辑暖白（方向 1a）—— 温暖、专业、有温度，不冷峻，不科技感

- 干净白底，留白充足
- 衬线大标题（Newsreader）配无衬线正文（Noto Sans SC）
- 金色点缀，不过度装饰

---

## 配色方案

当前使用：**深蓝 #1B3A5B**（理性可信）

| 用途 | 色值 |
|------|------|
| 主色（按钮、强调、icon）| `#1B3A5B` |
| 主色 hover | `#142B45` |
| 页面底色 | `#FAF8F3`（暖白） |
| 次级底色（section 背景）| `#F1EDE4` |
| 浅蓝标签背景 | `#E5EAF1` |
| 金色 accent（序号、标签、点缀）| `#B4894A` |
| 正文主色 | `#17211C` |
| 正文次级（描述文字）| `rgba(23,33,28,.66)` |

**备选主色方案**（Claude Design 已出稿，可切换）：
- 深绿 `#1E4D3A`（更暖、更亲和）
- 鲜艳翡翠绿 `#12925F`（更活泼）

---

## 字体方案

```
标题大字：Newsreader（Google Fonts，serif，英文数字衬线）
中文标题：Noto Serif SC（serif，副标题/section 标题）
正文：Noto Sans SC（sans-serif，400/500/700）
```

```html
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@600;700&display=swap" rel="stylesheet">
```

**用法规则**：
- Hero h1、大数字、价格数字 → `font-family:'Newsreader','Noto Serif SC',serif`
- Section h2、痛点卡片 h3、定价 h3 → `font-family:'Noto Serif SC',serif`
- 正文、badge、按钮、nav → `font-family:'Noto Sans SC',system-ui,sans-serif`

---

## 页面结构

1. **Nav**：Logo（✦ 北极星财务规划）+ 锚点链接 + 预约按钮
2. **Hero**：badge 标签 + 大标题"把股权，变成底气。" + 副标题 + 两个 CTA 按钮 + 三项统计数字
3. **Pain Points**：三张白卡，序号 01/02/03，金色序号，serif 标题
4. **About**：4:5 竖版照片占位 + 文案 + badge 标签组
5. **Pricing**：两档（单次诊断 / 年度顾问），年度顾问深蓝底色，金色"最受欢迎"标签
6. **Book / CTA**：深色 `#17211C` 背景大块，Calendly 按钮 + 微信二维码
7. **Footer**：免责声明

---

## 待填入的占位符

| 占位符 | 说明 |
|--------|------|
| `［你的名字］` | About 区真实姓名 |
| About 照片 | 4:5 竖版专业照 |
| `$499` / `$1,999` | 定价确认或调整 |
| Calendly 链接 | 替换 `https://calendly.com/` |
| `hello@example.com` | 真实邮箱 |
| 微信二维码 | 替换 QR 占位图 |

---

## 文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 主网站，单文件，无构建依赖 |
| `handoff/untitled/project/财务顾问落地页.dc.html` | Claude Design 完整落地页稿 |
| `handoff/untitled/project/视觉方向.dc.html` | 三个视觉方向对比（1a 暖白 / 1b 深色 / 1c 极简） |
| `handoff/untitled/project/配色对比.dc.html` | 深绿 vs 深蓝 vs 翡翠绿配色对比 |
| `handoff/untitled/project/advisor-blue.dc.html` | 深蓝配色完整页稿 |
| `handoff/untitled/project/advisor-bright.dc.html` | 翡翠绿配色完整页稿 |
