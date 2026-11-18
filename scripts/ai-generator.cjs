/**
 * AI 题目生成器（通用 OpenAI 兼容接口）
 * 按 MBTI 4 个维度批量生成题目，每个维度 N 道题
 *
 * 使用方法：
 * 1. 编辑 .env 文件，配置 API_URL、API_KEY、MODEL
 * 2. 运行：node scripts/ai-generator.cjs
 * 3. 生成的文件：scripts/ai-generated-questions.json
 *
 * 配置文件：scripts/ai-config.json（可选，控制生成参数）
 */

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 4 个 MBTI 维度
const DIMENSIONS = [
  { code: 'EI', name: '外倾 E / 内倾 I', desc: '能量来源——你是从社交中获取能量，还是从独处中获取能量' },
  { code: 'SN', name: '感觉 S / 直觉 N', desc: '信息获取——你更关注具体事实和细节，还是更关注整体模式和可能性' },
  { code: 'TF', name: '思维 T / 情感 F', desc: '决策方式——你更倾向用逻辑分析做决定，还是更看重人情和价值观' },
  { code: 'JP', name: '判断 J / 知觉 P', desc: '生活态度——你更喜欢计划和秩序，还是更喜欢灵活和随性' }
];

/**
 * 获取北京时间的格式化字符串，用于文件名
 * 返回格式：YYYY-MM-DD_HH-mm-ss
 */
function getBeijingTimeString() {
  const now = new Date();
  const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const year = beijingTime.getFullYear();
  const month = String(beijingTime.getMonth() + 1).padStart(2, '0');
  const day = String(beijingTime.getDate()).padStart(2, '0');
  const hours = String(beijingTime.getHours()).padStart(2, '0');
  const minutes = String(beijingTime.getMinutes()).padStart(2, '0');
  const seconds = String(beijingTime.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

/**
 * 获取北京时间的 ISO 格式字符串，用于数据记录
 */
function getBeijingISOTime() {
  const now = new Date();
  const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return beijingTime.toISOString();
}

// 配置
const config = {
  apiUrl: process.env.API_URL || 'https://token.longshine.com/v1/chat/completions',
  apiKey: process.env.API_KEY || '',
  model: process.env.MODEL || 'qwen3.7-max',
  maxTokens: parseInt(process.env.MAX_TOKENS || '4096', 10),
  outputFile: path.join(__dirname, `ai-generated-${getBeijingTimeString()}.json`),
  latestFile: path.join(__dirname, 'ai-generated-questions.json'),
  configFile: path.join(__dirname, 'ai-config.json')
};

// 默认生成参数
const defaultConfig = {
  questionsPerDimension: 10,   // 每个维度生成几道题
  difficulty: 'medium',
  style: 'situational'
};

function loadConfig() {
  try {
    if (fs.existsSync(config.configFile)) {
      const content = fs.readFileSync(config.configFile, 'utf-8');
      return { ...defaultConfig, ...JSON.parse(content) };
    }
  } catch (error) {
    console.warn('⚠️  读取配置文件失败，使用默认配置');
  }
  return defaultConfig;
}

function saveConfig(configData) {
  fs.writeFileSync(config.configFile, JSON.stringify(configData, null, 2), 'utf-8');
}

/**
 * 调用 AI API
 */
async function callAI(prompt) {
  const response = await axios.post(
    config.apiUrl,
    {
      model: config.model,
      max_tokens: config.maxTokens,
      messages: [{ role: 'user', content: prompt }]
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'User-Agent': 'mbti-generator/1.0'
      },
      timeout: 120000
    }
  );

  // 兼容 OpenAI 格式和 Anthropic 格式
  if (response.data.choices?.[0]?.message?.content) {
    return response.data.choices[0].message.content;
  } else if (response.data.content) {
    return Array.isArray(response.data.content)
      ? response.data.content.find(c => c.type === 'text')?.text || ''
      : response.data.content;
  }

  throw new Error('无法识别 API 返回格式：' + JSON.stringify(response.data).slice(0, 200));
}

/**
 * 尝试修复常见的 JSON 格式问题
 */
function repairJSON(str) {
  let s = str;

  // 1. 移除 markdown 代码块标记
  s = s.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

  // 2. 提取 JSON 数组部分（AI 有时会在前后加说明文字）
  const arrStart = s.indexOf('[');
  const arrEnd = s.lastIndexOf(']');
  if (arrStart !== -1 && arrEnd > arrStart) {
    s = s.slice(arrStart, arrEnd + 1);
  }

  // 3. 修复尾部逗号：},] → }] 和 ,] → ]
  s = s.replace(/,(\s*[}\]])/g, '$1');

  // 4. 修复缺少逗号：}\n{ → },{（对象之间缺少逗号）
  s = s.replace(/}\s*\n\s*{/g, '},{');

  // 5. 修复单引号 → 双引号（仅在值部分）
  // 跳过这个，容易误伤

  // 6. 修复未转义的双引号（在字符串值内部的裸引号）
  // 这个很难准确修复，跳过

  // 7. 修复缺失的逗号：property value 后直接跟另一个 property
  // "value"  "key" → "value", "key"  或  value\n  "key" → value,\n"key"
  s = s.replace(/(["\d\w\]\}])\s*\n(\s*")/g, '$1,\n$2');

  return s;
}

/**
 * 解析 AI 返回的 JSON，带修复和重试
 */
function parseQuestions(content, dimCode) {
  // 先直接尝试解析
  try {
    const clean = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    return JSON.parse(clean);
  } catch (e) {
    // 直接解析失败，尝试修复
  }

  // 尝试修复后解析
  try {
    const repaired = repairJSON(content);
    const questions = JSON.parse(repaired);
    console.log(`   🔧 JSON 已自动修复`);
    return questions;
  } catch (e) {
    // 修复也失败了，尝试逐题提取
  }

  // 最后的兜底：尝试提取完整的 JSON 对象
  try {
    const objects = [];
    const regex = /\{[^{}]*\}/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      try {
        objects.push(JSON.parse(match[0]));
      } catch {
        // 单个对象解析失败，跳过
      }
    }
    if (objects.length > 0) {
      console.log(`   🔧 逐题提取，恢复了 ${objects.length} 道`);
      return objects;
    }
  } catch {
    // 兜底也失败
  }

  throw new Error(`JSON 解析失败，无法修复。原始内容前 300 字符：${content.slice(0, 300)}`);
}

/**
 * 为某个维度生成题目（带重试）
 */
async function generateForDimension(dim, count, difficulty, style, startId) {
  const MAX_RETRIES = 2;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const content = await callAIPrompt(dim, count, difficulty, style);

    try {
      const questions = parseQuestions(content, dim.code);

      if (questions.length === 0) {
        throw new Error('返回的题目数为 0');
      }

      // 重新编号 + 确保维度正确
      return questions.map((q, i) => ({
        ...q,
        id: startId + i,
        dimension: dim.code
      }));
    } catch (parseError) {
      if (attempt < MAX_RETRIES) {
        process.stdout.write(`⚠️ 第 ${attempt + 1} 次解析失败，重试... `);
        await new Promise(r => setTimeout(r, 1500));
        continue;
      }
      throw parseError;
    }
  }
}

/**
 * 构建 prompt 并调用 AI
 */
async function callAIPrompt(dim, count, difficulty, style) {
  const difficultyMap = { 'easy': '简单', 'medium': '中等', 'hard': '困难' };
  const styleMap = {
    'situational': '情境选择题',
    'self-assessment': '自我评估题',
    'behavioral': '行为描述题'
  };

  const prompt = `你是一个专业的 MBTI 人格测试题目设计专家。请针对 "${dim.code}" 维度（${dim.name}）生成 ${count} 道测试题目。

维度说明：${dim.desc}

要求：
1. 每道题都只测 ${dim.code} 这一个维度
2. 选项 A 对应该维度的第一个字母（${dim.code[0]}），选项 B 对应第二个字母（${dim.code[1]}）
3. 难度级别：${difficultyMap[difficulty] || '中等'}
4. 题目风格：${styleMap[style] || '情境选择题'}
5. 题目要贴近日常生活，场景多样化（工作、社交、休闲、学习等不同场景）
6. 易于理解和回答，避免使用心理学专业术语
7. ${count} 道题之间不要有重复或相似的题目
8. 选项要有一定的区分度，但不要太极端，让人容易代入

重要：请确保返回的 JSON 格式完全正确，每个属性之间用逗号分隔，不要有多余的逗号。

输出格式要求：
返回一个 JSON 数组，每个题目对象包含以下字段：
{
  "id": 数字,
  "text": "题目描述",
  "dimension": "${dim.code}",
  "optionA": "选项 A 的内容（对应 ${dim.code[0]}）",
  "optionB": "选项 B 的内容（对应 ${dim.code[1]}）",
  "emoji": "一个相关的 emoji"
}

请直接返回 JSON 数组，不要包含任何其他文字。`;

  return callAI(prompt);
}

/**
 * 主流程
 */
async function generateQuestions() {
  if (!config.apiKey || config.apiKey === 'your_api_key_here') {
    console.error('❌ 错误：未配置 API_KEY');
    console.log('');
    console.log('请编辑 .env 文件，填入以下配置：');
    console.log('  API_URL=https://your-api-endpoint.com/v1/chat/completions');
    console.log('  API_KEY=your_api_key');
    console.log('  MODEL=model_name');
    process.exit(1);
  }

  const userConfig = loadConfig();

  if (!fs.existsSync(config.configFile)) {
    saveConfig(userConfig);
    console.log('📝 已创建配置文件：scripts/ai-config.json');
  }

  const perDim = userConfig.questionsPerDimension;
  const totalQuestions = DIMENSIONS.length * perDim;

  console.log('🤖 MBTI 题目 AI 生成器启动\n');
  console.log('API 配置：');
  console.log(`  - 接口地址：${config.apiUrl}`);
  console.log(`  - 模型：${config.model}`);
  console.log(`  - 最大 Token：${config.maxTokens}\n`);
  console.log('生成计划：');
  console.log(`  - 维度数：${DIMENSIONS.length}（EI / SN / TF / JP）`);
  console.log(`  - 每维度题数：${perDim}`);
  console.log(`  - 预计总题数：${totalQuestions}`);
  console.log(`  - API 调用次数：${DIMENSIONS.length}\n`);

  const allQuestions = [];
  let currentId = 1;
  let failed = 0;

  for (let i = 0; i < DIMENSIONS.length; i++) {
    const dim = DIMENSIONS[i];

    process.stdout.write(`[${i + 1}/${DIMENSIONS.length}] 生成 ${dim.code}（${dim.name}）题目... `);

    try {
      const questions = await generateForDimension(
        dim,
        perDim,
        userConfig.difficulty,
        userConfig.style,
        currentId
      );
      allQuestions.push(...questions);
      currentId += questions.length;
      console.log(`✅ ${questions.length} 道`);
    } catch (error) {
      failed++;
      if (error.response) {
        const errMsg = error.response.data?.error?.message
          || error.response.data?.message || '未知错误';
        console.log(`❌ API ${error.response.status}: ${errMsg}`);
      } else {
        console.log(`❌ ${error.message}`);
      }
    }

    // 请求间隔，避免触发限流
    if (i < DIMENSIONS.length - 1) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log(`\n========================================`);
  console.log(`✅ 成功生成 ${allQuestions.length} 道题目`);
  if (failed > 0) {
    console.log(`❌ ${failed} 个维度生成失败`);
  }
  console.log(`========================================\n`);

  // 保存到文件
  const outputData = {
    questions: allQuestions,
    generatedAt: getBeijingISOTime(),
    config: userConfig,
    model: config.model,
    source: 'ai-generator',
    total: allQuestions.length
  };

  const jsonStr = JSON.stringify(outputData, null, 2);
  fs.writeFileSync(config.outputFile, jsonStr, 'utf-8');
  fs.writeFileSync(config.latestFile, jsonStr, 'utf-8');
  console.log(`💾 已保存到：${config.outputFile}`);
  console.log(`💾 最新数据：${config.latestFile}`);
  console.log(`📊 共 ${allQuestions.length} 道题目\n`);

  // 按维度统计
  const dimCount = { EI: 0, SN: 0, TF: 0, JP: 0 };
  allQuestions.forEach(q => { if (dimCount[q.dimension] !== undefined) dimCount[q.dimension]++; });
  console.log('📈 维度分布：');
  Object.entries(dimCount).forEach(([dim, count]) => {
    console.log(`  ${dim}: ${count} 道`);
  });
  console.log('');

  // 预览每个维度第一题
  console.log('📋 每个维度预览（各 1 题）：\n');
  for (const dim of DIMENSIONS) {
    const q = allQuestions.find(q => q.dimension === dim.code);
    if (q) {
      console.log(`[${dim.code}] ${q.text} ${q.emoji || ''}`);
      console.log(`   A. ${q.optionA}`);
      console.log(`   B. ${q.optionB}\n`);
    }
  }

  console.log('下一步：在管理后台使用"导入数据"功能导入这些题目');
}

generateQuestions().catch(console.error);
