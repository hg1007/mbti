# MBTI 人格测试 — 开发计划

> 技术栈: Vue 3 + Vite + Pinia + Vue Router + GSAP + Animate.css  
> 设计风格: Framer 深色画布 + 渐变聚光灯卡片  
> 目标平台: 微信公众号 H5 (移动端优先)

---

## 项目结构

```
d:\code\mbti\
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/            # 静态资源 (渐变背景图、图标)
│   ├── components/
│   │   ├── ui/            # 通用UI组件 (按钮、卡片、进度条)
│   │   │   ├── GradientButton.vue       # 药丸按钮 (Framer白/渐变)
│   │   │   ├── SpotlightCard.vue         # 渐变聚光灯卡片 (核心视觉)
│   │   │   ├── ProgressRing.vue          # 环形进度指示器
│   │   │   └── AnimatedBackground.vue    # 动态粒子/光效背景
│   │   ├── quiz/          # 测试相关组件
│   │   │   ├── QuestionCard.vue          # 题目卡片 (滑动切换)
│   │   │   ├── OptionButton.vue          # 选项按钮 (带动效)
│   │   │   └── ProgressBar.vue           # 顶部进度条
│   │   └── result/        # 结果展示组件
│   │       ├── ResultHero.vue            # 结果主视觉 (人格类型大字)
│   │       ├── TraitBar.vue              # 特质维度条 (E/I, S/N等)
│   │       ├── PersonalityCard.vue       # 人格详情卡
│   │       └── ShareCard.vue             # 分享卡片 (可截图)
│   ├── composables/       # 组合式函数
│   │   ├── useQuiz.ts                    # 测试流程逻辑
│   │   ├── useScoring.ts                 # MBTI 计分算法
│   │   └── useShare.ts                   # 分享/截图功能
│   ├── data/              # MBTI 题库 & 人格数据
│   │   ├── questions.ts                  # 93道MBTI测试题
│   │   └── personalities.ts              # 16种人格详细数据
│   ├── router/
│   │   └── index.ts
│   ├── stores/
│   │   └── quizStore.ts                  # Pinia 状态管理
│   ├── views/
│   │   ├── HomeView.vue                  # 首页 (进入测试)
│   │   ├── QuizView.vue                  # 测试页面 (逐题答题)
│   │   ├── LoadingView.vue               # 分析中过渡页
│   │   └── ResultView.vue                # 结果展示页
│   ├── styles/
│   │   ├── variables.css                 # Framer 设计令牌 (颜色/间距/圆角)
│   │   ├── typography.css                # 字体系统 (Inter + 负字间距)
│   │   ├── gradients.css                 # 渐变聚光灯预设
│   │   └── global.css                    # 全局样式 + 动画
│   ├── App.vue
│   └── main.ts
├── scripts/
│   └── scrape-mbti.mjs                   # 爬虫: 抓取MBTI题目数据
├── index.html
├── vite.config.ts
├── package.json
└── README.md
```

---

## 阶段一: 数据准备 (爬虫)

### 1.1 MBTI 题目数据爬取
- **目标**: 从互联网获取标准 MBTI 93 道测试题 (Form M)
- **来源**: 16personalities.com / truity.com / similar sites
- **脚本**: `scripts/scrape-mbti.mjs` (Node.js + fetch)
- **数据格式**:
```ts
interface Question {
  id: number
  text: string                        // 题目文本
  dimension: 'EI' | 'SN' | 'TF' | 'JP'  // 所属维度
  options: {
    A: { text: string; score: number } // 倾向A极的选项
    B: { text: string; score: number } // 倾向B极的选项
  }
}
```

### 1.2 16种人格数据
- 每种人格包含: 类型代码、中文名、英文名、标签、渐变色、描述、优势、劣势、适合职业、著名人物
- 每个人格对应一种 Framer 渐变聚光灯色 (紫/洋红/橙/珊瑚 轮转)

---

## 阶段二: 设计系统搭建 (Framer 风格)

### 2.1 设计令牌 (`styles/variables.css`)
```
Canvas:        #090909
Surface-1:     #141414
Surface-2:     #1c1c1c
Ink:           #ffffff
Ink-muted:     #999999
Accent-blue:   #0099ff
Gradient-violet:   #6a4cf5
Gradient-magenta:  #d44df0
Gradient-orange:   #ff7a3d
Gradient-coral:    #ff5577

Rounded: xs 4px → pill 100px
Spacing: base 5px scale
```

### 2.2 字体系统 (`styles/typography.css`)
- 标题: Inter 600-700, 负 letter-spacing (-3px ~ -5px 大标题)
- 正文: Inter Variable 400, 15-18px
- 按钮: Inter 500, 14px, 药丸形
- 中文字体 fallback: "PingFang SC", "Microsoft YaHei"

### 2.3 渐变预设 (`styles/gradients.css`)
- 4 种聚光灯渐变 → 16 种人格类型轮转使用
- 每种渐变 = linear-gradient(135deg, color1, color2)
- 用于: 人格结果卡片、进度指示、装饰元素

---

## 阶段三: 核心页面开发

### 3.1 首页 (`HomeView.vue`)
**布局**:
- 深黑背景 + 动态渐变光效 (缓慢旋转的紫色/洋红光斑)
- 超大标题: "发现你的 MBTI" (Inter 700, -4px tracking, 渐入动画)
- 副标题: "探索你的性格密码" (Inter 400, ink-muted)
- 白色药丸 CTA: "开始测试" → 点击后页面过渡
- 底部: 预计用时 "约5分钟" + 题目数 "93题"
- 16种人格小卡片轮播 (SpotlightCard 缩小版，缓慢滚动)

**动画**:
- GSAP: 标题逐字渐入 + 上浮
- 背景光效: CSS animation 缓慢旋转
- CTA 按钮: 悬停微缩放 (Framer 风格)

### 3.2 测试页 (`QuizView.vue`)
**布局**:
- 顶部: 极简进度条 (渐变填充, 显示 X/93)
- 中间: 题目卡片 (Surface-1 背景, rounded-xl, 居中)
  - 题目文本 (Inter 500, 20px)
  - 两个选项按钮 (Surface-2 背景, 药丸形, 选中时渐变高亮)
- 手势: 左右滑动切换题目 (VueUse Gesture)
- 底部: 题号指示器 (当前题/总题数)

**交互**:
- 选择选项后: 按钮变为渐变填充 + 微弹跳 → 自动跳下一题 (800ms)
- 滑动: 卡片滑出 + 新卡片滑入 (GSAP x-transition)
- 进度条: 平滑过渡 (CSS transition)

### 3.3 分析过渡页 (`LoadingView.vue`)
**布局**:
- 深黑背景 + 居中环形进度指示器 (ProgressRing)
- 进度环: 渐变描边 (violet → magenta → orange)
- 下方文字轮播: "正在分析你的性格维度..." / "计算 E/I 倾向..." 等
- 持续 2-3 秒后自动跳转

**动画**:
- GSAP: 进度环旋转 + 填充
- 文字: 淡入淡出轮播
- 最终: 渐亮过渡到结果页

### 3.4 结果页 (`ResultView.vue`)
**布局**:
- **Hero 区**: 超大 4字母类型 (INFP) + 渐变色背景 (根据人格类型)
  - 英文副标题: "The Mediator 调停者"
  - 简短一句话描述
- **维度条区**: 4个 TraitBar (E/I, S/N, T/F, J/P)
  - 渐变填充条 + 百分比数字
  - 进入视口时 GSAP 动画填充
- **详情卡片区**: 滚动展示
  - "性格特点" 卡 (渐变边框)
  - "优势与劣势" 卡 (两列对比)
  - "适合职业" 卡 (图标 + 职业名)
  - "人际关系" 卡
- **底部**: 
  - "重新测试" 按钮
  - "生成分享卡片" 按钮 → 弹出 ShareCard
  - "分享给朋友" (调用微信分享)

**ShareCard**:
- 生成精美分享卡片 (html2canvas 截图)
- 包含: 人格类型 + 渐变色 + 维度条 + 一句话
- 适配公众号分享尺寸

---

## 阶段四: 交互与动画

### 4.1 GSAP 动画清单
| 场景 | 动画效果 |
|------|----------|
| 首页标题 | 逐字 stagger 渐入 + y: 30px → 0 |
| 首页CTA | 悬停 scale 0.95 (Framer pressed) |
| 题目切换 | x: ±100% slide + opacity fade |
| 选项选中 | scale 1.05 → 1 + 渐变填充 |
| 进度条 | width transition 600ms ease |
| 分析页 | 环形进度 0→100% + 旋转 |
| 结果类型 | 逐字母 stagger 放大渐入 |
| 维度条 | width 0→N% ease-out |
| 详情卡片 | scrollTrigger 上浮渐入 |

### 4.2 手势交互
- 题目卡片: 左右滑动切换 (VueUse Gesture)
- 结果页: 左右滑动切换不同信息卡
- 长按选项: 触发触觉反馈 (vibrate API)

### 4.3 页面过渡
- Vue Router `<transition>` + GSAP
- 首页→测试: 上推 + 渐隐
- 测试→分析: 缩放 + 渐隐
- 分析→结果: 渐亮 + 上浮

---

## 阶段五: 功能完善

### 5.1 MBTI 计分算法
- 每个维度 (E/I, S/N, T/F, J/P) 独立计分
- 计算各维度倾向百分比
- 组合得出 4 字母类型
- 输出完整人格分析数据

### 5.2 微信适配
- viewport meta 适配
- 禁止缩放
- 安全区域适配 (safe-area-inset)
- 微信 JS-SDK 分享接口 (可选)

### 5.3 性能优化
- 路由懒加载
- 字体子集化 (只加载用到的中文字符)
- 图片/渐变 SVG 内联
- CSS 动画使用 transform/opacity (GPU加速)

---

## 技术选型汇总

| 用途 | 选择 | 理由 |
|------|------|------|
| 框架 | Vue 3 + Vite | 指定技术栈 |
| 路由 | Vue Router 4 | SPA 多页面 |
| 状态 | Pinia | 测试状态管理 |
| 动画 | GSAP 3 | 精细控制 + ScrollTrigger |
| CSS动画 | Animate.css | 快速预设动画 |
| 手势 | @vueuse/gesture | 滑动切换题目 |
| 工具 | @vueuse/core | 响应式工具函数 |
| 截图 | html2canvas | 生成分享卡片 |
| 字体 | Inter (Google Fonts) | Framer 同款 |

---

## 开发顺序

1. ✅ 项目初始化 (已完成)
2. 🔲 爬虫获取 MBTI 题目数据
3. 🔲 设计系统 (CSS 变量 + 字体 + 渐变)
4. 🔲 UI 组件库 (按钮、卡片、进度条)
5. 🔲 首页开发
6. 🔲 测试页 + 答题流程
7. 🔲 计分算法
8. 🔲 分析过渡页
9. 🔲 结果页 + 16种人格数据
10. 🔲 分享卡片功能
11. 🔲 动画打磨 (GSAP 全场)
12. 🔲 微信适配 + 测试

---

## 16种人格 × 渐变色映射

| 类型 | 中文名 | 渐变色 | 标签 |
|------|--------|--------|------|
| INFP | 调停者 | violet (#6a4cf5 → #9b7bff) | 理想主义 |
| INFJ | 提倡者 | magenta (#d44df0 → #e879f9) | 洞察者 |
| INTJ | 建筑师 | orange (#ff7a3d → #ffaa5c) | 策略家 |
| INTP | 逻辑学家 | coral (#ff5577 → #ff8a9e) | 分析者 |
| ENFP | 竞选者 | violet → magenta 混合 | 热情者 |
| ENFJ | 主人公 | magenta → coral 混合 | 引导者 |
| ENTJ | 指挥官 | orange → coral 混合 | 领导者 |
| ENTP | 辩论家 | coral → orange 混合 | 创新者 |
| ISFP | 探险家 | violet (#6a4cf5) | 艺术家 |
| ISFJ | 守卫者 | magenta (#d44df0) | 保护者 |
| ISTJ | 物流师 | orange (#ff7a3d) | 检查员 |
| ISTP | 鉴赏家 | coral (#ff5577) | 巧匠 |
| ESFP | 表演者 | magenta → violet | 表演家 |
| ESFJ | 执政官 | coral → magenta | 关怀者 |
| ESTJ | 总经理 | orange → magenta | 管理者 |
| ESTP | 企业家 | coral → orange | 冒险家 |
