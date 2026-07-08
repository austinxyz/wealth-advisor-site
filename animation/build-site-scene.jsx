// build-site-scene.jsx — "从脚本到上线网站" 工作流动画
// Reads engine globals set by animations.jsx (Stage, Sprite, useTime, useSprite, Easing, clamp…)

const SANS  = "'Noto Sans SC', system-ui, sans-serif";
const SERIF = "'Noto Serif SC', Georgia, serif";
const MONO  = "'JetBrains Mono', ui-monospace, monospace";

const INK    = '#20201b';
const PAPER  = '#f3efe7';
const PAPER2 = '#e8e2d6';
const CARD   = '#fbf9f4';
const GREEN  = '#1f5138';
const GREEN_D= '#153726';
const GREEN_L= '#e2ebe4';
const GOLD   = '#b0803a';
const MUTE   = '#8b8579';
const LINE   = '#d9d2c4';
const TERM   = '#12271c';

const W = 1280, H = 720;

// ── timing map (seconds) ─────────────────────────────────────────────────────
const T = {
  hook:   [0.0,  6.0],
  intro:  [5.6,  9.4],
  brief:  [9.2,  17.0],
  design: [16.8, 24.6],
  code:   [24.4, 32.4],
  deploy: [32.2, 40.0],
  grow:   [39.8, 46.6],
  close:  [46.4, 52.0],
};
const DURATION = 52;

// step-rail thresholds — when each stage becomes "active"
const STEPS = [
  { key: 'Brief',  cn: '写 Brief',    at: 9.2  },
  { key: 'Design', cn: 'Claude Design', at: 16.8 },
  { key: 'Code',   cn: 'Claude Code', at: 24.4 },
  { key: 'Git',    cn: 'Git · GitHub', at: 32.2 },
  { key: 'Vercel', cn: 'Vercel 上线', at: 36.0 },
];

// ── reveal helper (must be used inside a Sprite) ─────────────────────────────
function useReveal(delay = 0, dur = 0.5, ease) {
  ease = ease || Easing.easeOutCubic;
  const { localTime, duration } = useSprite();
  const exitStart = duration - 0.45;
  let o = 1, y = 0, s = 1;
  const lt = localTime - delay;
  if (lt < 0) { o = 0; y = 16; s = 0.985; }
  else if (lt < dur) { const t = ease(clamp(lt / dur, 0, 1)); o = t; y = (1 - t) * 16; s = 0.985 + 0.015 * t; }
  if (localTime > exitStart) { const t = Easing.easeInCubic(clamp((localTime - exitStart) / 0.45, 0, 1)); o *= (1 - t); y -= t * 8; }
  return { opacity: o, transform: `translateY(${y}px) scale(${s})` };
}

function typed(text, localTime, delay, cps) {
  const t = Math.max(0, localTime - delay);
  const n = Math.min(text.length, Math.floor(t * cps));
  return { shown: text.slice(0, n), done: n >= text.length };
}
function Caret({ localTime, color }) {
  const on = Math.floor(localTime * 2) % 2 === 0;
  return React.createElement('span', {
    style: { display: 'inline-block', width: 9, height: '1em', marginLeft: 1, verticalAlign: '-2px',
      background: on ? (color || GREEN) : 'transparent' }
  });
}

// ── backdrop (full bleed, opacity only) ──────────────────────────────────────
function Backdrop({ color, delay = 0 }) {
  const r = useReveal(delay, 0.6);
  return React.createElement('div', {
    style: { position: 'absolute', inset: 0, background: color, opacity: r.opacity }
  });
}

// ── persistent step rail (bottom) ────────────────────────────────────────────
function StepRail() {
  const time = useTime();
  if (time < T.intro[0] + 0.4) return null;
  if (time >= T.close[0]) return null;
  const closing = false;
  let active = -1;
  STEPS.forEach((s, i) => { if (time >= s.at) active = i; });
  if (closing) active = STEPS.length - 1;

  const railW = 940, x = (W - railW) / 2, y = 648;
  const seg = railW / (STEPS.length - 1);
  const appear = clamp((time - (T.intro[0] + 0.4)) / 0.6, 0, 1);

  return React.createElement('div', {
    style: { position: 'absolute', left: x, top: y, width: railW, opacity: appear,
      transform: `translateY(${(1 - appear) * 14}px)`, fontFamily: SANS }
  },
    // base line
    React.createElement('div', { style: { position: 'absolute', left: 8, right: 8, top: 8, height: 2, background: LINE } }),
    // progress line
    React.createElement('div', { style: { position: 'absolute', left: 8, top: 8, height: 2, background: GREEN,
      width: active < 0 ? 0 : (active / (STEPS.length - 1)) * (railW - 16), transition: 'width 0.5s cubic-bezier(.4,0,.2,1)' } }),
    STEPS.map((s, i) => {
      const on = i <= active;
      const cur = i === active && !closing;
      return React.createElement('div', {
        key: s.key,
        style: { position: 'absolute', left: i * seg, top: 0, transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 140 }
      },
        React.createElement('div', {
          style: { width: cur ? 18 : 14, height: cur ? 18 : 14, borderRadius: 20,
            background: on ? GREEN : CARD, border: `2px solid ${on ? GREEN : LINE}`,
            marginTop: cur ? -1 : 1, boxShadow: cur ? `0 0 0 6px ${GREEN}22` : 'none',
            transition: 'all .35s' }
        }),
        React.createElement('div', {
          style: { fontSize: 15, fontWeight: on ? 700 : 500, color: on ? GREEN_D : MUTE, letterSpacing: '0.01em',
            transition: 'all .35s' }
        }, `${i + 1}. ${s.cn}`)
      );
    })
  );
}

// ── little UI atoms ──────────────────────────────────────────────────────────
function Dot3() {
  return React.createElement('div', { style: { display: 'flex', gap: 7 } },
    ['#e06c5b', '#e3b04b', '#5cae6a'].map((c, i) =>
      React.createElement('div', { key: i, style: { width: 11, height: 11, borderRadius: 6, background: c } })));
}
function BrowserFrame({ x, y, w, h, url, live, children, style }) {
  return React.createElement('div', {
    style: { position: 'absolute', left: x, top: y, width: w, height: h, background: CARD,
      borderRadius: 12, border: `1px solid ${LINE}`, boxShadow: '0 24px 60px rgba(30,40,30,0.14)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column', ...style }
  },
    React.createElement('div', { style: { height: 40, flexShrink: 0, background: '#efeae0',
      borderBottom: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px' } },
      React.createElement(Dot3, null),
      React.createElement('div', { style: { flex: 1, height: 24, borderRadius: 12, background: CARD,
        border: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px',
        fontFamily: MONO, fontSize: 13, color: url ? INK : MUTE } },
        live && React.createElement('span', { style: { width: 8, height: 8, borderRadius: 5, background: '#43a047',
          boxShadow: '0 0 0 3px #43a04733' } }),
        url || '　'
      )
    ),
    React.createElement('div', { style: { flex: 1, position: 'relative', overflow: 'hidden' } }, children)
  );
}

// mini landing page (brand-consistent) rendered inside a browser frame
function LandingMini({ build = 1, dark = false }) {
  // build 0..1 controls how many blocks are in
  const blocks = [
    { t: 'hero' }, { t: 'pain' }, { t: 'about' }, { t: 'price' }
  ];
  const show = (i) => build > (i + 0.5) / blocks.length ? 1 : (build > i / blocks.length ? clamp((build - i / blocks.length) * blocks.length, 0, 1) : 0);
  return React.createElement('div', { style: { position: 'absolute', inset: 0, background: CARD, overflow: 'hidden' } },
    // hero
    React.createElement('div', { style: { background: GREEN, color: '#f4efe4', padding: '26px 30px 30px',
      opacity: show(0), transform: `translateY(${(1 - show(0)) * 14}px)` } },
      React.createElement('div', { style: { fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em',
        color: '#bcd3c4', marginBottom: 12 } }, '硅谷华人工程师 · 财务规划'),
      React.createElement('div', { style: { fontFamily: SERIF, fontSize: 30, fontWeight: 700, lineHeight: 1.25 } }, '让你的每一份股票，'),
      React.createElement('div', { style: { fontFamily: SERIF, fontSize: 30, fontWeight: 700, lineHeight: 1.25 } }, '都用在对的地方。'),
      React.createElement('div', { style: { marginTop: 16, display: 'inline-block', background: GOLD, color: '#fff',
        fontFamily: SANS, fontWeight: 700, fontSize: 14, padding: '9px 18px', borderRadius: 8 } }, '预约咨询')
    ),
    // pain cards
    React.createElement('div', { style: { display: 'flex', gap: 12, padding: '18px 24px 6px', opacity: show(1),
      transform: `translateY(${(1 - show(1)) * 14}px)` } },
      ['401K 配置', 'RSU 税务', 'ISO 行权'].map((t, i) =>
        React.createElement('div', { key: i, style: { flex: 1, background: GREEN_L, borderRadius: 10, padding: '14px 12px' } },
          React.createElement('div', { style: { width: 22, height: 22, borderRadius: 6, background: GREEN, marginBottom: 10 } }),
          React.createElement('div', { style: { fontFamily: SANS, fontWeight: 700, fontSize: 15, color: GREEN_D } }, t),
          React.createElement('div', { style: { fontFamily: SANS, fontSize: 11, color: MUTE, marginTop: 5, lineHeight: 1.5 } }, '避免节税机会浪费')
        ))
    ),
    // about strip
    React.createElement('div', { style: { margin: '10px 24px 0', background: GREEN_D, color: '#e7efe8', borderRadius: 10,
      padding: '14px 16px', opacity: show(2), transform: `translateY(${(1 - show(2)) * 14}px)` } },
      React.createElement('div', { style: { fontFamily: SANS, fontSize: 13, lineHeight: 1.6 } }, '独立理财顾问 · 前硅谷工程师 · 只做费用制，不卖产品')
    ),
    // pricing
    React.createElement('div', { style: { display: 'flex', gap: 12, padding: '12px 24px 20px', opacity: show(3),
      transform: `translateY(${(1 - show(3)) * 14}px)` } },
      [['单次规划', '$480'], ['年度陪跑', '$2,400']].map((p, i) =>
        React.createElement('div', { key: i, style: { flex: 1, background: CARD, border: `1.5px solid ${i ? GREEN : LINE}`,
          borderRadius: 10, padding: '12px 14px' } },
          React.createElement('div', { style: { fontFamily: SANS, fontWeight: 700, fontSize: 14, color: INK } }, p[0]),
          React.createElement('div', { style: { fontFamily: SERIF, fontWeight: 700, fontSize: 22, color: GREEN, marginTop: 4 } }, p[1])
        ))
    )
  );
}

// resources page mini
function ResourcesMini({ build = 1 }) {
  const arts = ['401K 分层配置全指南', 'RSU vest 后如何避税', 'Backdoor Roth 实操', '529 开户与州税优惠', 'ISO 行权时点决策', '年终奖的税务规划'];
  const nShow = Math.round(clamp(build, 0, 1) * arts.length);
  return React.createElement('div', { style: { position: 'absolute', inset: 0, background: CARD, overflow: 'hidden' } },
    React.createElement('div', { style: { background: GREEN, height: 44, display: 'flex', alignItems: 'center',
      padding: '0 22px', color: '#f4efe4', fontFamily: SERIF, fontWeight: 700, fontSize: 15 } }, '理财资源与指南'),
    React.createElement('div', { style: { display: 'flex', gap: 8, padding: '14px 22px 4px' } },
      ['全部', '401K', 'RSU', '税务', '投资'].map((t, i) =>
        React.createElement('div', { key: i, style: { fontFamily: SANS, fontSize: 12, fontWeight: 600,
          padding: '5px 12px', borderRadius: 20, background: i === 0 ? GREEN : GREEN_L, color: i === 0 ? '#fff' : GREEN_D } }, t))),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '10px 22px' } },
      arts.map((a, i) =>
        React.createElement('div', { key: i, style: { background: CARD, border: `1px solid ${LINE}`, borderRadius: 12,
          padding: '13px 14px', opacity: i < nShow ? 1 : 0.12, transform: `translateY(${i < nShow ? 0 : 8}px)`,
          transition: 'all .3s' } },
          React.createElement('div', { style: { fontFamily: SANS, fontWeight: 700, fontSize: 13.5, color: INK, lineHeight: 1.35 } }, a),
          React.createElement('div', { style: { fontFamily: SANS, fontSize: 11, color: MUTE, marginTop: 6, lineHeight: 1.5 } }, '两行摘要，讲清这篇文章能帮你解决什么问题。'),
          React.createElement('div', { style: { fontFamily: MONO, fontSize: 10.5, color: GOLD, marginTop: 8 } }, `2026·06 · 6 分钟阅读`)
        ))
    )
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SCENES
// ═══════════════════════════════════════════════════════════════════════════

function SceneHook() {
  const { localTime } = useSprite();
  const rTag = useReveal(0.2, 0.5);
  const rCard = useReveal(0.5, 0.6, Easing.easeOutBack);
  const rQ1 = useReveal(2.0, 0.6);
  const rQ2 = useReveal(3.0, 0.6, Easing.easeOutBack);
  const glow = 0.5 + 0.5 * Math.sin(localTime * 1.6);
  const zoom = 1 + Math.min(localTime, 6) * 0.006;
  return React.createElement(React.Fragment, null,
    React.createElement(Backdrop, { color: GREEN_D }),
    React.createElement('div', { style: { position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '50% 42%' } },
      React.createElement('div', { style: { position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center',
        fontFamily: MONO, fontSize: 15, letterSpacing: '0.34em', color: '#8fb39c', ...rTag } }, 'SESSION 4 · DEMO'),
      // knowledge base card
      React.createElement('div', { style: { position: 'absolute', top: 210, left: '50%', transform: `translateX(-50%) ${rCard.transform}`,
        opacity: rCard.opacity, width: 300, background: '#1c4632', border: '1px solid #2f6047', borderRadius: 18,
        padding: '26px 24px', textAlign: 'center', boxShadow: `0 0 ${30 + glow * 40}px ${GREEN}${Math.round(40 + glow * 40).toString(16)}` } },
        React.createElement('div', { style: { width: 60, height: 60, margin: '0 auto 16px', borderRadius: 14,
          background: '#e9f1eb', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
          React.createElement('div', { style: { fontFamily: SERIF, fontWeight: 800, fontSize: 30, color: GREEN } }, '知')),
        React.createElement('div', { style: { fontFamily: SANS, fontWeight: 700, fontSize: 22, color: '#f2f7f3' } }, '你的知识库'),
        React.createElement('div', { style: { fontFamily: MONO, fontSize: 12, color: '#8fb39c', marginTop: 8, letterSpacing: '0.06em' } }, '401K · RSU · ISO · 529')
      ),
      React.createElement('div', { style: { position: 'absolute', top: 460, left: 0, right: 0, textAlign: 'center',
        fontFamily: SANS, fontSize: 20, color: '#a9c6b4', ...rQ1 } }, 'S2 之后，专业知识都在你电脑里。'),
      React.createElement('div', { style: { position: 'absolute', top: 500, left: 0, right: 0, textAlign: 'center',
        fontFamily: SERIF, fontWeight: 700, fontSize: 46, color: '#f4efe4', ...rQ2 } }, '可是——客户在哪里？')
    )
  );
}

function SceneIntro() {
  const rH = useReveal(0.15, 0.55);
  const rS = useReveal(0.5, 0.55);
  return React.createElement(React.Fragment, null,
    React.createElement('div', { style: { position: 'absolute', top: 250, left: 0, right: 0, textAlign: 'center',
      fontFamily: SERIF, fontWeight: 700, fontSize: 54, color: INK, ...rH } }, '不写一行代码，走一遍工作流。'),
    React.createElement('div', { style: { position: 'absolute', top: 340, left: 0, right: 0, textAlign: 'center',
      fontFamily: SANS, fontSize: 21, color: MUTE, ...rS } }, '一个人，从一句 brief 到真实上线的网站。')
  );
}

function SceneBrief() {
  const { localTime } = useSprite();
  const rWin = useReveal(0.1, 0.55, Easing.easeOutCubic);
  const lines = [
    '我是一名北美华人理财顾问，',
    '专注硅谷华人工程师群体。',
    '',
    '帮 30–45 岁湾区工程师优化',
    '401K / RSU / ISO / 529 配置。',
    '',
    '风格：专业、简洁、有温度，',
    '白底，accent 用深绿。',
    '',
    '页面：Hero · 痛点 · About · 定价 · 预约',
  ];
  const full = lines.join('\n');
  const { shown, done } = typed(full, localTime, 0.9, 34);
  const chips = [
    { t: '受众', at: 1.7 }, { t: '服务', at: 2.8 }, { t: '风格', at: 4.0 }, { t: '页面内容', at: 5.0 },
  ];
  return React.createElement(React.Fragment, null,
    React.createElement('div', { style: { position: 'absolute', top: 62, left: 130, fontFamily: SANS, fontWeight: 700,
      fontSize: 24, color: INK, whiteSpace: 'nowrap', ...useReveal(0, 0.5) } },
      React.createElement('span', { style: { color: GREEN } }, 'Step 1 · '), '写 Brief｜说清楚，再让 AI 动手'),
    // chat window
    React.createElement('div', { style: { position: 'absolute', left: 130, top: 128, width: 660, height: 470,
      background: CARD, border: `1px solid ${LINE}`, borderRadius: 16, boxShadow: '0 24px 60px rgba(30,40,30,0.12)',
      overflow: 'hidden', opacity: rWin.opacity, transform: rWin.transform } },
      React.createElement('div', { style: { height: 42, background: '#efeae0', borderBottom: `1px solid ${LINE}`,
        display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px' } },
        React.createElement(Dot3, null),
        React.createElement('div', { style: { fontFamily: MONO, fontSize: 13, color: MUTE } }, 'claude.ai · 新对话')),
      React.createElement('div', { style: { padding: '22px 24px', fontFamily: SANS, fontSize: 18.5, lineHeight: 1.72,
        color: INK, whiteSpace: 'pre-wrap' } }, shown, !done && React.createElement(Caret, { localTime })),
    ),
    // brief four-elements checklist
    React.createElement('div', { style: { position: 'absolute', left: 828, top: 150, width: 300, ...useReveal(0.6, 0.5) } },
      React.createElement('div', { style: { fontFamily: MONO, fontSize: 13, letterSpacing: '0.16em', color: GOLD, marginBottom: 18 } }, 'BRIEF 四要素'),
      chips.map((c, i) => {
        const on = localTime > c.at;
        return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 16px', marginBottom: 12, borderRadius: 12, background: on ? GREEN_L : '#00000000',
          border: `1.5px solid ${on ? GREEN : LINE}`, transition: 'all .4s' } },
          React.createElement('div', { style: { width: 26, height: 26, borderRadius: 14, flexShrink: 0,
            background: on ? GREEN : 'transparent', border: `2px solid ${on ? GREEN : LINE}`, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700 } }, on ? '✓' : ''),
          React.createElement('div', { style: { fontFamily: SANS, fontWeight: 700, fontSize: 19, color: on ? GREEN_D : MUTE } }, c.t)
        );
      })
    )
  );
}

function SceneDesign() {
  const { localTime } = useSprite();
  const build = clamp((localTime - 2.2) / 3.6, 0, 1);
  return React.createElement(React.Fragment, null,
    React.createElement('div', { style: { position: 'absolute', top: 62, left: 130, fontFamily: SANS, fontWeight: 700,
      fontSize: 24, color: INK, whiteSpace: 'nowrap', ...useReveal(0, 0.5) } },
      React.createElement('span', { style: { color: GREEN } }, 'Step 2 · '), 'Claude Design｜brief 变成视觉方案'),
    // palette + type spec panel (left)
    React.createElement('div', { style: { position: 'absolute', left: 130, top: 132, width: 372, ...useReveal(0.3, 0.55) } },
      React.createElement('div', { style: { fontFamily: MONO, fontSize: 12, letterSpacing: '0.16em', color: GOLD, marginBottom: 14 } }, '配色方案'),
      React.createElement('div', { style: { display: 'flex', gap: 12, marginBottom: 24 } },
        [['主色', GREEN, '#1F5138'], ['背景', PAPER, '#F3EFE7'], ['强调', GOLD, '#B0803A'], ['深色', GREEN_D, '#153726']].map((p, i) => {
          const on = localTime > 0.8 + i * 0.35;
          return React.createElement('div', { key: i, style: { flex: 1, opacity: on ? 1 : 0.15, transform: `translateY(${on ? 0 : 8}px)`, transition: 'all .35s' } },
            React.createElement('div', { style: { height: 64, borderRadius: 10, background: p[1], border: `1px solid ${LINE}` } }),
            React.createElement('div', { style: { fontFamily: SANS, fontWeight: 700, fontSize: 13, color: INK, marginTop: 7 } }, p[0]),
            React.createElement('div', { style: { fontFamily: MONO, fontSize: 10.5, color: MUTE } }, p[2]));
        })
      ),
      React.createElement('div', { style: { fontFamily: MONO, fontSize: 12, letterSpacing: '0.16em', color: GOLD, marginBottom: 14 } }, '排版'),
      React.createElement('div', { style: { ...useReveal(2.0, 0.5) } },
        React.createElement('div', { style: { fontFamily: SERIF, fontWeight: 700, fontSize: 30, color: INK, lineHeight: 1.2 } }, '标题 Noto Serif SC'),
        React.createElement('div', { style: { fontFamily: SANS, fontSize: 17, color: '#4c4a42', marginTop: 8 } }, '正文 Noto Sans SC — 干净、有呼吸感、专业。')
      ),
      React.createElement('div', { style: { marginTop: 22, display: 'inline-block', background: GREEN_L, color: GREEN_D,
        fontFamily: SANS, fontWeight: 700, fontSize: 14, padding: '8px 16px', borderRadius: 8, ...useReveal(3.4, 0.5) } },
        'tagline：让每份股票用在对的地方')
    ),
    // preview building (right)
    React.createElement(Sprite, { start: 0, end: 99 },
      React.createElement('div', { style: { ...useReveal(0.6, 0.55) } },
        React.createElement(BrowserFrame, { x: 542, y: 132, w: 586, h: 462, url: 'index.html · 预览' },
          React.createElement(LandingMini, { build })
        ))
    )
  );
}

function SceneCode() {
  const { localTime } = useSprite();
  const rTerm = useReveal(0.15, 0.55);
  const cmds = [
    { txt: '$ cd ~/projects/s4-wealth-site', at: 0.6 },
    { txt: '$ claude', at: 1.5 },
  ];
  const genLine = typed('根据 CLAUDE.md 生成 index.html', localTime, 3.4, 26);
  const build = clamp((localTime - 4.6) / 3.0, 0, 1);
  return React.createElement(React.Fragment, null,
    React.createElement('div', { style: { position: 'absolute', top: 62, left: 130, fontFamily: SANS, fontWeight: 700,
      fontSize: 24, color: INK, whiteSpace: 'nowrap', ...useReveal(0, 0.5) } },
      React.createElement('span', { style: { color: GREEN } }, 'Step 3 · '), 'Claude Code｜CLAUDE.md 是项目的品牌宪法'),
    // terminal
    React.createElement('div', { style: { position: 'absolute', left: 130, top: 132, width: 470, height: 462, background: TERM,
      borderRadius: 14, boxShadow: '0 24px 60px rgba(20,30,22,0.28)', overflow: 'hidden', opacity: rTerm.opacity,
      transform: rTerm.transform } },
      React.createElement('div', { style: { height: 40, background: '#0d1e15', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px' } },
        React.createElement(Dot3, null),
        React.createElement('div', { style: { fontFamily: MONO, fontSize: 12.5, color: '#6f9880' } }, 's4-wealth-site — claude')),
      React.createElement('div', { style: { padding: '18px 20px', fontFamily: MONO, fontSize: 14.5, lineHeight: 1.9, color: '#cfe6d6' } },
        cmds.map((c, i) => localTime > c.at ? React.createElement('div', { key: i, style: { color: '#e7f2ea' } }, c.txt) : null),
        localTime > 2.2 && React.createElement('div', { style: { color: '#7fbf95', marginTop: 6 } }, '✻ Claude Code 已就绪'),
        localTime > 3.2 && React.createElement('div', { style: { marginTop: 14, color: '#e7f2ea' } }, '> ', genLine.shown,
          !genLine.done && React.createElement(Caret, { localTime, color: '#7fbf95' })),
        localTime > 4.6 && React.createElement('div', { style: { color: '#7fbf95', marginTop: 12, lineHeight: 1.8 } },
          '✓ 读取 CLAUDE.md 品牌规范', React.createElement('br'), '✓ 写入 index.html …')
      )
    ),
    // CLAUDE.md card overlay
    React.createElement('div', { style: { position: 'absolute', left: 336, top: 108, width: 280, background: CARD,
      border: `1.5px solid ${GREEN}`, borderRadius: 12, boxShadow: '0 18px 40px rgba(30,40,30,0.18)', padding: '16px 18px',
      ...useReveal(1.9, 0.5, Easing.easeOutBack) } },
      React.createElement('div', { style: { fontFamily: MONO, fontWeight: 700, fontSize: 15, color: GREEN_D, marginBottom: 12,
        display: 'flex', alignItems: 'center', gap: 8 } },
        React.createElement('span', { style: { width: 10, height: 10, borderRadius: 3, background: GOLD } }), 'CLAUDE.md'),
      ['品牌定位 · 目标受众', '配色 hex / 字体规范', '语气 Tone', '页面：index · resources'].map((t, i) =>
        React.createElement('div', { key: i, style: { fontFamily: SANS, fontSize: 13.5, color: '#4c4a42', padding: '5px 0',
          borderTop: i ? `1px solid ${LINE}` : 'none' } }, '· ' + t))
    ),
    // preview rendering
    React.createElement('div', { style: { ...useReveal(4.3, 0.55) } },
      React.createElement(BrowserFrame, { x: 636, y: 132, w: 492, h: 462, url: 'index.html · 本地预览' },
        React.createElement(LandingMini, { build }))
    )
  );
}

function SceneDeploy() {
  const { localTime } = useSprite();
  const gitCmds = [
    { t: 'git init', at: 0.5 }, { t: 'git add .', at: 1.0 }, { t: 'git commit -m "首页"', at: 1.5 }, { t: 'git push origin main', at: 2.1 },
  ];
  const deploying = localTime > 3.4 && localTime < 5.4;
  const liveUrl = localTime > 5.2;
  const prog = clamp((localTime - 3.4) / 2.0, 0, 1);
  return React.createElement(React.Fragment, null,
    React.createElement('div', { style: { position: 'absolute', top: 62, left: 130, fontFamily: SANS, fontWeight: 700,
      fontSize: 24, color: INK, whiteSpace: 'nowrap', ...useReveal(0, 0.5) } },
      React.createElement('span', { style: { color: GREEN } }, 'Step 4 · '), 'Git → GitHub → Vercel｜网站上线'),
    // git checklist (left)
    React.createElement('div', { style: { position: 'absolute', left: 130, top: 150, width: 340, ...useReveal(0.2, 0.5) } },
      gitCmds.map((c, i) => {
        const on = localTime > c.at;
        return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16,
          opacity: on ? 1 : 0.25, transition: 'opacity .3s' } },
          React.createElement('div', { style: { width: 26, height: 26, borderRadius: 14, flexShrink: 0, background: on ? GREEN : 'transparent',
            border: `2px solid ${on ? GREEN : LINE}`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700 } }, on ? '✓' : ''),
          React.createElement('div', { style: { fontFamily: MONO, fontSize: 15.5, color: on ? INK : MUTE } }, c.t));
      })
    ),
    // flow GitHub -> Vercel (right)
    React.createElement('div', { style: { position: 'absolute', left: 520, top: 168, width: 610, ...useReveal(2.4, 0.55) } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 18 } },
        React.createElement('div', { style: { flex: 1, background: CARD, border: `1.5px solid ${LINE}`, borderRadius: 14, padding: '18px 20px' } },
          React.createElement('div', { style: { fontFamily: SANS, fontWeight: 800, fontSize: 19, color: INK } }, 'GitHub'),
          React.createElement('div', { style: { fontFamily: MONO, fontSize: 12.5, color: MUTE, marginTop: 6 } }, 's4-wealth-site'),
          React.createElement('div', { style: { fontFamily: MONO, fontSize: 12, color: GREEN, marginTop: 4 } }, '● 2 files pushed')),
        React.createElement('div', { style: { fontFamily: SANS, fontSize: 28, color: GOLD } }, '→'),
        React.createElement('div', { style: { flex: 1, background: GREEN_D, borderRadius: 14, padding: '18px 20px', color: '#eef4ef' } },
          React.createElement('div', { style: { fontFamily: SANS, fontWeight: 800, fontSize: 19, display: 'flex', alignItems: 'center', gap: 8 } },
            React.createElement('span', { style: { fontSize: 15 } }, '▲'), 'Vercel'),
          React.createElement('div', { style: { fontFamily: MONO, fontSize: 12.5, color: '#9fc0ac', marginTop: 6 } },
            deploying ? 'Building… ~30s' : (liveUrl ? 'Ready' : 'Import Git Repo')),
          React.createElement('div', { style: { height: 5, borderRadius: 3, background: '#0e241a', marginTop: 10, overflow: 'hidden' } },
            React.createElement('div', { style: { height: '100%', width: `${prog * 100}%`, background: '#57b276', borderRadius: 3 } })))
      ),
      // live url pill
      liveUrl && React.createElement('div', { style: { marginTop: 26, display: 'flex', justifyContent: 'center' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, background: CARD, border: `2px solid ${GREEN}`,
          borderRadius: 30, padding: '12px 22px', boxShadow: `0 0 0 6px ${GREEN}18`,
          transform: `scale(${0.9 + 0.1 * clamp((localTime - 5.2) / 0.4, 0, 1)})` } },
          React.createElement('span', { style: { width: 11, height: 11, borderRadius: 6, background: '#43a047', boxShadow: '0 0 0 4px #43a04733' } }),
          React.createElement('span', { style: { fontFamily: MONO, fontSize: 18, fontWeight: 700, color: GREEN_D } }, 's4-wealth-site.vercel.app'))),
      liveUrl && React.createElement('div', { style: { textAlign: 'center', marginTop: 16, fontFamily: SERIF, fontWeight: 700, fontSize: 30, color: INK } }, '首页上线了。')
    )
  );
}

function SceneGrow() {
  const { localTime } = useSprite();
  const rH = useReveal(0.1, 0.5);
  const build2 = clamp((localTime - 0.8) / 2.2, 0, 1);
  const pushed = localTime > 3.6;
  return React.createElement(React.Fragment, null,
    React.createElement('div', { style: { position: 'absolute', top: 62, left: 130, fontFamily: SANS, fontWeight: 700,
      fontSize: 24, color: INK, whiteSpace: 'nowrap', ...rH } },
      React.createElement('span', { style: { color: GREEN } }, 'Step 5·6 · '), '加新页面｜同一个对话，风格自动一致'),
    // page 1 (settled, small)
    React.createElement('div', { style: { ...useReveal(0.2, 0.5) } },
      React.createElement(BrowserFrame, { x: 130, y: 138, w: 458, h: 420, url: 's4-wealth-site.vercel.app', live: true },
        React.createElement(LandingMini, { build: 1 }))
    ),
    React.createElement('div', { style: { position: 'absolute', left: 592, top: 330, fontFamily: SANS, fontSize: 30, color: GOLD, ...useReveal(0.6, 0.4) } }, '→'),
    // page 2 inheriting
    React.createElement('div', { style: { ...useReveal(0.7, 0.5) } },
      React.createElement(BrowserFrame, { x: 636, y: 138, w: 492, h: 420, url: pushed ? '…/resources.html' : 'resources.html · 预览', live: pushed },
        React.createElement(ResourcesMini, { build: build2 }))
    ),
    // auto-deploy badge
    pushed && React.createElement('div', { style: { position: 'absolute', left: 636, top: 566, width: 492, display: 'flex',
      justifyContent: 'center' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, background: GREEN_L, border: `1.5px solid ${GREEN}`,
        borderRadius: 24, padding: '8px 18px', fontFamily: SANS, fontWeight: 700, fontSize: 15, color: GREEN_D } },
        React.createElement('span', { style: { fontSize: 14 } }, '▲'), 'push → Vercel 自动部署 ✓')),
    React.createElement('div', { style: { position: 'absolute', left: 130, top: 578, width: 458, textAlign: 'center',
      fontFamily: SANS, fontSize: 16, color: MUTE, ...useReveal(0.4, 0.5) } }, '配色 · 字体 · 圆角 100% 继承首页')
  );
}

function SceneClose() {
  const { localTime } = useSprite();
  const zoom = 1 + Math.min(localTime, 5) * 0.004;
  const rBig = useReveal(0.4, 0.6, Easing.easeOutBack);
  const rPipe = useReveal(1.4, 0.6);
  const rSub = useReveal(2.4, 0.5);
  const loopPulse = 0.5 + 0.5 * Math.sin(localTime * 2);
  const nodes = ['Brief', 'Design', 'Code', 'Git', 'Vercel'];
  return React.createElement(React.Fragment, null,
    React.createElement(Backdrop, { color: GREEN_D }),
    React.createElement('div', { style: { position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '50% 45%' } },
      React.createElement('div', { style: { position: 'absolute', top: 172, left: 0, right: 0, textAlign: 'center',
        fontFamily: SERIF, fontWeight: 800, fontSize: 74, color: '#f4efe4', ...rBig } }, '一个人，50 分钟。'),
      // pipeline chips + loop
      React.createElement('div', { style: { position: 'absolute', top: 340, left: 0, right: 0, display: 'flex',
        justifyContent: 'center', alignItems: 'center', gap: 14, opacity: rPipe.opacity, transform: rPipe.transform } },
        nodes.map((n, i) => React.createElement(React.Fragment, { key: n },
          React.createElement('div', { style: { background: '#1c4632', border: `1.5px solid #3a6b50`, borderRadius: 24,
            padding: '11px 22px', fontFamily: SANS, fontWeight: 700, fontSize: 20, color: '#eaf2ec' } }, n),
          i < nodes.length - 1 && React.createElement('span', { style: { color: GOLD, fontSize: 22 } }, '→')
        ))
      ),
      React.createElement('div', { style: { position: 'absolute', top: 410, left: 0, right: 0, textAlign: 'center',
        fontFamily: SANS, fontSize: 17, color: '#7fb094', opacity: rPipe.opacity } },
        React.createElement('span', { style: { opacity: 0.4 + 0.6 * loopPulse } }, '↻ push 一下，网站持续生长')),
      React.createElement('div', { style: { position: 'absolute', top: 486, left: 0, right: 0, textAlign: 'center',
        fontFamily: SERIF, fontSize: 24, color: '#c8dccf', ...rSub } }, '不用 Figma，不找设计师，不写一行代码。')
    )
  );
}

// ═══════════════════════════════════════════════════════════════════════════
function WebsiteBuildScene() {
  const S = window.Sprite, St = window.Stage;
  return React.createElement(St, { width: W, height: H, duration: DURATION, background: PAPER, persistKey: 'buildsite' },
    React.createElement(S, { start: T.hook[0],   end: T.hook[1] },   React.createElement(SceneHook)),
    React.createElement(S, { start: T.intro[0],  end: T.intro[1] },  React.createElement(SceneIntro)),
    React.createElement(S, { start: T.brief[0],  end: T.brief[1] },  React.createElement(SceneBrief)),
    React.createElement(S, { start: T.design[0], end: T.design[1] }, React.createElement(SceneDesign)),
    React.createElement(S, { start: T.code[0],   end: T.code[1] },   React.createElement(SceneCode)),
    React.createElement(S, { start: T.deploy[0], end: T.deploy[1] }, React.createElement(SceneDeploy)),
    React.createElement(S, { start: T.grow[0],   end: T.grow[1] },   React.createElement(SceneGrow)),
    React.createElement(S, { start: T.close[0],  end: T.close[1] },  React.createElement(SceneClose)),
    // persistent through-line
    React.createElement(S, { start: T.intro[0], end: DURATION, keepMounted: true }, React.createElement(StepRail))
  );
}

window.WebsiteBuildScene = WebsiteBuildScene;
