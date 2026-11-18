# MBTI 数据管理系统

## 概述

本系统提供完整的数据管理解决方案，包括：

1. **管理后台** - 可视化管理题目和人格数据
2. **爬虫工具** - 从现有题库网站爬取数据
3. **AI 生成** - 使用通义千问 API 自动生成题目

## 📁 文件结构

```
mbti/
├── src/
│   ├── views/
│   │   └── AdminView.vue          # 管理后台页面
│   └── data/
│       ├── questions.ts            # 题目数据
│       └── personalities.ts        # 人格数据
├── scripts/
│   └── scraper.js                  # 爬虫脚本
├── api/
│   └── generate-questions.js       # AI 生成 API
└── docs/
    └── admin-system.md             # 本文档
```

## 🎛️ 管理后台

### 访问方式

启动开发服务器后，访问：`http://localhost:5173/#/admin`

### 功能

#### 1. 题目管理

- **查看统计** - 显示各维度题目数量
- **添加题目** - 点击"+ 添加新题目"按钮
- **编辑题目** - 点击题目卡片的"编辑"按钮
- **删除题目** - 点击题目卡片的"删除"按钮
- **导入/导出** - 批量导入或导出 JSON 数据

#### 2. 人格数据管理

- **浏览所有人格** - 卡片网格展示 16 种人格类型
- **编辑人格数据** - 点击卡片编辑详细信息
- **支持字段** - 22 个字段，包括：
  - 基本信息（代码、名称、昵称、emoji）
  - 描述信息（座右铭、一句话描述、详细描述）
  - 特质信息（优势、劣势）
  - 应用信息（适合职业、著名人物）

#### 3. 数据持久化

所有修改自动保存到 `localStorage`，刷新页面不会丢失。

如需更新源代码中的数据文件，使用"导出数据"功能，然后手动替换：
- `src/data/questions.ts`
- `src/data/personalities.ts`

## 🕷️ 爬虫工具

### 安装依赖

```bash
cd scripts
npm install axios cheerio
```

### 配置

编辑 `scripts/scraper.js`，在 `main()` 函数中添加目标 URL：

```javascript
const urls = [
  'https://example.com/mbti-questions/page1',
  'https://example.com/mbti-questions/page2',
];
```

### 自定义解析逻辑

根据目标网站的 HTML 结构，修改 `parseQuestions()` 函数：

```javascript
function parseQuestions(html) {
  const $ = cheerio.load(html);
  const questions = [];

  // 修改这里的选择器以匹配目标网站
  $('.question-item').each((index, element) => {
    const $el = $(element);
    
    const question = {
      id: index + 1,
      text: $el.find('.question-text').text().trim(),
      dimension: $el.data('dimension') || 'EI',
      optionA: $el.find('.option-a').text().trim(),
      optionB: $el.find('.option-b').text().trim(),
      emoji: '🤔'
    };

    if (question.text && question.optionA && question.optionB) {
      questions.push(question);
    }
  });

  return questions;
}
```

### 运行

```bash
node scripts/scraper.js
```

生成的文件：`scripts/scraped-questions.json`

### 注意事项

- ⚠️ 遵守目标网站的 `robots.txt` 和使用条款
- ⚠️ 设置合理的请求间隔（默认 2 秒）
- ⚠️ 爬取的数据仅供学习参考，请勿用于商业用途
- ⚠️ 某些网站可能有反爬虫机制，请谨慎使用

## 🤖 AI 题目生成

### 方案 1：Vercel Serverless Function（推荐）

1. 将 `api/generate-questions.js` 复制到 Vercel 项目的 `/api` 目录
2. 部署到 Vercel
3. 在管理后台的"AI 生成"标签页调用接口

### 方案 2：Netlify Function

1. 创建 `netlify/functions/generate-questions.js`
2. 复制 `api/generate-questions.js` 的内容
3. 部署到 Netlify

### 方案 3：本地 Express 服务器

```bash
npm install express cors
```

创建 `server.js`：

```javascript
const express = require('express');
const cors = require('cors');
const generateHandler = require('./api/generate-questions');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate-questions', generateHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 配置 API Key

#### Vercel

在 Vercel 项目的 Settings → Environment Variables 中添加：
```
ANTHROPIC_API_KEY=your_api_key_here
```

#### 本地开发

Windows:
```cmd
set ANTHROPIC_API_KEY=your_api_key_here
```

Linux/Mac:
```bash
export ANTHROPIC_API_KEY=your_api_key_here
```

### 本地测试

```bash
node api/generate-questions.js
```

### API 参数

**请求：**
```json
POST /api/generate-questions
{
  "dimension": "EI",
  "count": 5,
  "apiKey": "your-claude-api-key"
}
```

**响应：**
```json
{
  "success": true,
  "questions": [
    {
      "id": 1234567890,
      "text": "在周末，你更倾向于？",
      "dimension": "EI",
      "optionA": "和朋友聚会，参加社交活动",
      "optionB": "独自在家看书、看电影或休息",
      "emoji": "🌟"
    }
  ],
  "dimension": "EI",
  "count": 5
}
```

## 🔄 数据导入导出

### 导出格式

```json
{
  "questions": [
    {
      "id": 1,
      "text": "题目文本",
      "dimension": "EI",
      "optionA": "选项 A",
      "optionB": "选项 B",
      "emoji": "🤔"
    }
  ],
  "chapters": [...],
  "personalities": {
    "INTJ": { ... },
    "ENFP": { ... }
  },
  "exportDate": "2024-01-18T12:00:00.000Z"
}
```

### 导入步骤

1. 在管理后台点击"导入数据"按钮
2. 选择 JSON 文件
3. 数据自动加载并保存到 localStorage

### 更新源代码

如果需要永久更新数据文件：

1. 导出 JSON 数据
2. 手动转换为 TypeScript 格式
3. 替换 `src/data/questions.ts` 或 `src/data/personalities.ts`
4. 重新构建项目

## 🔐 安全建议

### 管理后台访问控制

当前版本未实现身份验证，建议：

1. **开发环境** - 仅在本地开发时使用
2. **生产环境** - 添加身份验证：
   - 使用 Firebase Authentication
   - 使用 Auth0
   - 实现简单的密码保护

### API Key 保护

⚠️ **永远不要在前端代码中暴露 API Key**

- 前端只调用后端 API
- API Key 存储在后端环境变量中
- 后端代理 Claude API 请求

## 📊 数据统计

管理后台提供实时统计：

- **题目总数** - 所有题目的数量
- **维度分布** - EI、SN、TF、JP 各维度的题目数量
- **人格类型数** - 已配置的人格类型数量（应为 16）

## 🛠️ 开发计划

- [ ] 添加题目批量编辑功能
- [ ] 支持题目的拖拽排序
- [ ] 添加题目的难度标签
- [ ] 实现题目的 A/B 测试功能
- [ ] 添加数据分析仪表盘
- [ ] 支持多语言题目管理

## 💡 使用技巧

### 快速添加题目

1. 使用"导入数据"功能导入现有题库
2. 使用 AI 生成功能批量生成新题目
3. 手动微调生成的题目

### 数据备份

定期使用"导出数据"功能备份数据，防止意外丢失。

### 测试新功能

1. 先在本地测试
2. 使用浏览器开发者工具监控 localStorage
3. 确认无误后再部署到生产环境

## 📞 支持

如有问题，请查看：
- 项目 README.md
- Vue 3 文档：https://vuejs.org/
- 通义千问 API 文档：https://help.aliyun.com/zh/model-studio/
