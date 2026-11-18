# MBTI 人格测试

基于 Vue 3 + Vite + Pinia 开发的 MBTI 人格测试应用，支持双主题切换（Apple 浅色 / Framer 深色），适配微信公众号环境。

## 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite 8
- **状态管理**: Pinia 4
- **路由**: Vue Router 4（Hash 模式）
- **动画**: GSAP 3
- **工具库**: @vueuse/core、@vueuse/gesture
- **分享卡片**: html2canvas
- **样式**: CSS Variables 双主题系统（Apple Light / Framer Dark）
- **动画库**: animate.css
- **字体**: Inter (Google Fonts)

## 特性

- 🎨 **双主题设计** — Apple 浅色（默认）+ Framer 深色画布，一键切换，偏好持久化存储
- ✨ **精细动画** — GSAP 逐字动画、滑动过渡、进度条动画、GSAP 路由过渡
- 📖 **分章测试** — 93 道标准 MBTI 测试题，按四个维度（E/I、S/N、T/F、J/P）分章节呈现，含章节介绍页
- ⚡ **快速模式** — 12 题快速测试（每维度随机 3 题），适合快速了解性格倾向
- 📊 **详细结果** — 16 种人格类型详细分析，含维度百分比、优劣势、成长建议、职业推荐、名人案例
- 🔍 **深度详情** — 结果详情页展示工作风格、学习偏好、人际关系、兼容类型等维度
- 📸 **分享卡片** — 可生成测试结果分享图（html2canvas）
- 📱 **移动端优先** — 适配微信公众号环境，支持微信 JS-SDK 分享配置
- 🌟 **粒子背景** — ParticleBackground 粒子动效 + DecoBlob 装饰元素
- 🎭 **MBTI 角色** — 每种人格类型对应专属插画角色（MbtiCharacters / CharacterScene）

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器 (localhost:5173)
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
src/
├── components/           # 组件
│   ├── quiz/
│   │   └── ChapterIntro.vue      # 章节介绍过渡页
│   └── ui/
│       ├── CharacterScene.vue    # 角色场景组件
│       ├── DecoBlob.vue          # 装饰性渐变背景
│       ├── MbtiCharacters.vue    # MBTI 人格角色插画
│       └── ParticleBackground.vue # 粒子背景动效
├── composables/          # 组合式函数
│   └── useAnimations.ts          # GSAP 动画封装（逐字、渐显、缩放等）
├── data/                 # 数据
│   ├── questions.ts              # 93 道测试题 + 4 个章节定义
│   └── personalities.ts         # 16 种人格类型完整数据
├── router/
│   └── index.ts                  # 路由配置（Hash 模式）
├── stores/               # Pinia 状态管理
│   ├── quizStore.ts              # 测试核心逻辑（答题、计分、结果）
│   └── themeStore.ts             # 主题切换（Apple / Framer）
├── styles/               # 样式系统
│   ├── variables.css             # CSS 变量（双主题色板）
│   ├── typography.css            # 字体排版
│   ├── gradients.css             # 渐变色定义
│   └── global.css                # 全局样式
├── utils/
│   └── wechat.ts                 # 微信 JS-SDK 集成（分享功能）
├── views/                # 页面
│   ├── HomeView.vue              # 首页（模式选择 + 公众号引导）
│   ├── QuizView.vue              # 答题页
│   ├── LoadingView.vue           # 加载过渡页
│   ├── ResultView.vue            # 测试结果页
│   ├── ResultDetailView.vue      # 结果详情页
│   ├── AboutView.vue             # 关于 MBTI 介绍页
│   └── StylePreview.vue          # 角色风格预览页
├── App.vue                       # 根组件（路由过渡动画）
└── main.ts                       # 入口（初始化主题 + 微信 SDK）
```

## 页面路由

| 路由 | 页面 | 说明 |
|---|---|---|
| `/` | HomeView | 首页，选择完整/快速测试模式 |
| `/quiz` | QuizView | 答题页面，分章节展示题目 |
| `/loading` | LoadingView | 计算结果过渡页 |
| `/result/:type` | ResultView | 测试结果，展示人格类型与维度分数 |
| `/result/:type/detail` | ResultDetailView | 详细分析（优劣势、职业、关系等） |
| `/about` | AboutView | MBTI 理论介绍 |
| `/style-preview` | StylePreview | 16 种角色风格预览 |

## 测试模式

### 完整模式（Full）
- 93 道标准 MBTI 测试题
- 按四个维度分为 4 个章节（能量来源 / 信息获取 / 决策方式 / 生活态度）
- 每章包含章节介绍过渡页（ChapterIntro）
- 适合深度了解自己性格的用户

### 快速模式（Quick）
- 12 道精选题目（每维度随机抽取 3 题）
- 无章节分隔，连续作答
- 适合快速测试或分享场景

## 计分逻辑

- 每道题对应一个维度（EI / SN / TF / JP），选择 A 加分给前者，B 加分给后者
- 统计各维度得分，取较高分一方作为该维度字母
- 计算各维度百分比（如 E 70% / I 30%）
- 四个维度字母组合得出最终人格类型（如 INFP）

## 16 种人格类型

每种人格对应一种渐变色和专属角色插画：

| 色系 | 类型 | 昵称 |
|---|---|---|
| 💜 紫色 | INFP, ISFP | 理想主义者 |
| 💗 洋红 | INFJ, ISFJ | 洞察者 |
| 🧡 橙色 | INTJ, ISTJ | 策略家 |
| ❤️ 珊瑚 | INTP, ISTP | 分析者 |
| 💜💗 紫洋红 | ENFP, ESFP | 热情者 |
| 💗❤️ 洋红珊瑚 | ENFJ, ESFJ | 引导者 |
| 🧡❤️ 橙珊瑚 | ENTJ, ESTJ | 领导者 |
| ❤️🧡 珊瑚橙 | ENTP, ESTP | 创新者 |

每种人格数据包含：中英文名、昵称、座右铭、标签描述、详细描述、优势/劣势、成长建议、工作/学习风格、兼容类型、适合职业、著名人物、人际关系分析。

## 设计风格

### 双主题系统

**Apple 浅色主题（默认）：**
- 浅灰画布 `#f5f5f7`
- 白色表面层级
- Apple 系统级色彩（蓝 `#0071e3`、绿 `#34c759`、橙 `#ff9500`）

**Framer 深色主题：**
- 深黑画布 `#090909`
- 表面层级系统 (Surface 1-3)
- 渐变聚光灯卡片
- 药丸形按钮
- 高对比度荧光渐变色

### 公共设计元素
- Inter 字体 + 负字间距
- CSS 变量驱动的主题切换
- 主题偏好 localStorage 持久化
- 四维度色彩系统（EI 紫 / SN 绿 / TF 蓝 / JP 橙）

## 微信集成

项目内置微信 JS-SDK 集成（`src/utils/wechat.ts`）：
- 自动检测微信浏览器环境
- 动态加载微信 JS-SDK
- 支持「分享给朋友」和「分享到朋友圈」
- 首页包含公众号关注引导弹窗
- 需配置后端签名接口 `/api/wechat/signature`

## License

MIT
