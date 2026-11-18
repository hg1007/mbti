/**
 * AI 题目生成 API 示例
 *
 * 这是一个后端 API 示例，展示如何使用 Claude API 生成 MBTI 题目。
 * 你需要将此代码部署到你的后端服务器。
 *
 * 部署选项：
 * 1. Vercel Serverless Functions
 * 2. Netlify Functions
 * 3. Node.js Express 服务器
 * 4. 其他支持 Node.js 的平台
 */

// 示例：Vercel Serverless Function
module.exports = async (req, res) => {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { dimension, count, apiKey } = req.body;

    // 验证参数
    if (!dimension || !count || !apiKey) {
      return res.status(400).json({
        error: 'Missing required fields: dimension, count, apiKey'
      });
    }

    if (!['EI', 'SN', 'TF', 'JP'].includes(dimension)) {
      return res.status(400).json({
        error: 'Invalid dimension. Must be one of: EI, SN, TF, JP'
      });
    }

    if (count < 1 || count > 20) {
      return res.status(400).json({
        error: 'Count must be between 1 and 20'
      });
    }

    // 调用 Claude API 生成题目
    const questions = await generateQuestions(dimension, count, apiKey);

    res.status(200).json({
      success: true,
      questions,
      dimension,
      count: questions.length
    });

  } catch (error) {
    console.error('生成题目失败:', error);
    res.status(500).json({
      error: 'Failed to generate questions',
      message: error.message
    });
  }
};

/**
 * 使用 Claude API 生成 MBTI 题目
 */
async function generateQuestions(dimension, count, apiKey) {
  const dimensionNames = {
    'EI': '外向 (E) / 内向 (I)',
    'SN': '感觉 (S) / 直觉 (N)',
    'TF': '思考 (T) / 情感 (F)',
    'JP': '判断 (J) / 知觉 (P)'
  };

  const prompt = `你是一位专业的心理测试设计师。请为 MBTI 人格测试生成 ${count} 道题目。

维度：${dimensionNames[dimension]}

要求：
1. 每道题目提供两个选项（A 和 B）
2. 选项 A 对应维度的第一个特质（如 E、S、T、J）
3. 选项 B 对应维度的第二个特质（如 I、N、F、P）
4. 题目应该贴近日常生活，易于理解
5. 选项应该具体、行为化，避免抽象描述
6. 每道题目配一个合适的 emoji

请以 JSON 格式返回，格式如下：
[
  {
    "text": "题目文本",
    "dimension": "${dimension}",
    "optionA": "选项 A 文本",
    "optionB": "选项 B 文本",
    "emoji": "🎯"
  }
]

直接返回 JSON 数组，不要包含其他文字。`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Claude API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const content = data.content[0].text;

  // 提取 JSON（处理可能的 markdown 代码块）
  let jsonStr = content;
  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  const questions = JSON.parse(jsonStr);

  // 添加 ID（使用时间戳 + 索引）
  const baseId = Date.now();
  return questions.map((q, index) => ({
    ...q,
    id: baseId + index
  }));
}

/**
 * 本地测试示例
 *
 * 使用方法：
 * 1. 设置环境变量：export ANTHROPIC_API_KEY=your_api_key
 * 2. 运行：node scripts/ai-generator.js
 */
if (require.main === module) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error('❌ 请设置 ANTHROPIC_API_KEY 环境变量');
    console.log('使用方法：');
    console.log('  Windows: set ANTHROPIC_API_KEY=your_api_key');
    console.log('  Linux/Mac: export ANTHROPIC_API_KEY=your_api_key');
    process.exit(1);
  }

  console.log('🤖 AI 题目生成器启动\n');

  // 测试生成
  generateQuestions('EI', 3, apiKey)
    .then(questions => {
      console.log('✅ 生成成功！\n');
      console.log(JSON.stringify(questions, null, 2));
    })
    .catch(error => {
      console.error('❌ 生成失败:', error.message);
    });
}
