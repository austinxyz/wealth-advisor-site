import fs from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';

function loadWiki() {
  const wikiDir = path.join(process.cwd(), 'wiki');
  const files = fs.readdirSync(wikiDir).filter(f => f.endsWith('.md'));
  return files.map(f => {
    const content = fs.readFileSync(path.join(wikiDir, f), 'utf-8');
    return `## 知识条目：${f.replace('.md', '')}\n\n${content}`;
  }).join('\n\n---\n\n');
}

const SYSTEM_PROMPT = `你是北极星财务规划的 AI 助手，专门服务湾区华人工程师。

你的角色：
- 根据下方知识库，准确回答用户关于 RSU、401K、税务规划的问题
- 回答简洁、具体、可执行，避免模糊建议
- 涉及个人具体情况时，提醒用户预约顾问做深度分析
- 只在知识库有相关内容时作答；无法确定时明确说明，不要编造数据

回答风格：中文，专业但有温度，不过度使用免责声明。

---

知识库：

${loadWiki()}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question } = req.body;
  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return res.status(400).json({ error: 'Missing question' });
  }
  if (question.length > 500) {
    return res.status(400).json({ error: 'Question too long' });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const stream = client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: question.trim() }],
  });

  stream.on('text', (text) => {
    res.write(`data: ${JSON.stringify({ text })}\n\n`);
  });

  stream.on('end', () => {
    res.write('data: [DONE]\n\n');
    res.end();
  });

  stream.on('error', (err) => {
    console.error('Claude stream error:', err);
    res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
    res.end();
  });
}
