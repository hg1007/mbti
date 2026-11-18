// MBTI 题库 - 按维度分组，方便章节化展示
// 每题属于四个维度之一: EI(外向-内向), SN(感觉-直觉), TF(思考-情感), JP(判断-知觉)

export interface Question {
  id: number
  text: string
  dimension: 'EI' | 'SN' | 'TF' | 'JP'
  optionA: string
  optionB: string
  emoji: string  // 趣味 emoji 装饰
}

// 章节定义
export interface Chapter {
  id: string
  dimension: 'EI' | 'SN' | 'TF' | 'JP'
  title: string
  subtitle: string
  emoji: string
  gradient: string
  bgColor: string
  description: string
}

export const chapters: Chapter[] = [
  {
    id: 'chapter-1',
    dimension: 'EI',
    title: '能量来源',
    subtitle: '外向 E vs 内向 I',
    emoji: '⚡',
    gradient: 'gradient-violet',
    bgColor: '#edebfb',
    description: '你是从人群中获取能量，还是在独处时充电？'
  },
  {
    id: 'chapter-2',
    dimension: 'SN',
    title: '信息获取',
    subtitle: '感觉 S vs 直觉 N',
    emoji: '🔍',
    gradient: 'gradient-magenta',
    bgColor: '#e5f8ef',
    description: '你更关注具体事实还是未来的可能性？'
  },
  {
    id: 'chapter-3',
    dimension: 'TF',
    title: '决策方式',
    subtitle: '思考 T vs 情感 F',
    emoji: '🧭',
    gradient: 'gradient-orange',
    bgColor: '#e8f0fe',
    description: '你靠逻辑分析做决定，还是跟随内心的感受？'
  },
  {
    id: 'chapter-4',
    dimension: 'JP',
    title: '生活态度',
    subtitle: '判断 J vs 知觉 P',
    emoji: '🎯',
    gradient: 'gradient-coral',
    bgColor: '#fef3e0',
    description: '你喜欢井井有条的计划，还是灵活随性？'
  }
]

export const questions: Question[] = [
  // ===== Chapter 1: E/I 维度 (10题) =====
  { id: 1, text: '在社交聚会中，你通常会：', dimension: 'EI', emoji: '🎉', optionA: '和很多人交谈，包括陌生人', optionB: '只和少数你认识的人交谈' },
  { id: 2, text: '周末你更喜欢怎样度过：', dimension: 'EI', emoji: '🌤️', optionA: '和朋友们一起外出活动', optionB: '独自待着或只和一两个人相处' },
  { id: 3, text: '当你感到疲惫时，你会：', dimension: 'EI', emoji: '🔋', optionA: '找朋友出去放松', optionB: '独自安静地休息' },
  { id: 4, text: '你更喜欢的沟通方式是：', dimension: 'EI', emoji: '💬', optionA: '面对面交流或打电话', optionB: '发消息或写邮件' },
  { id: 5, text: '你的精力来源主要是：', dimension: 'EI', emoji: '✨', optionA: '与人互动和社交活动', optionB: '独处和自我反思' },
  { id: 6, text: '做决定时，你更倾向于：', dimension: 'EI', emoji: '🤔', optionA: '和别人讨论后再决定', optionB: '自己想清楚再决定' },
  { id: 7, text: '在团队工作中，你倾向于：', dimension: 'EI', emoji: '👥', optionA: '积极发言，主导讨论', optionB: '先听别人说，再表达想法' },
  { id: 8, text: '午休时间，你更想：', dimension: 'EI', emoji: '☕', optionA: '和同事一起吃午饭聊天', optionB: '找个安静的地方独处' },
  { id: 9, text: '长时间独处后，你会感到：', dimension: 'EI', emoji: '😶', optionA: '无聊，想出门社交', optionB: '充满能量，很满足' },
  { id: 10, text: '你觉得自己更像：', dimension: 'EI', emoji: '🪞', optionA: '一个外向的行动派', optionB: '一个内向的思考者' },

  // ===== Chapter 2: S/N 维度 (10题) =====
  { id: 11, text: '你更关注的是：', dimension: 'SN', emoji: '👁️', optionA: '眼前的事实和细节', optionB: '未来的可能性和大局' },
  { id: 12, text: '你更信任：', dimension: 'SN', emoji: '🤝', optionA: '亲身经历和实际数据', optionB: '直觉和内在的预感' },
  { id: 13, text: '阅读时，你更喜欢：', dimension: 'SN', emoji: '📚', optionA: '实用类书籍（教程、工具书）', optionB: '理论或概念类书籍（哲学、科幻）' },
  { id: 14, text: '解决问题时，你更依赖：', dimension: 'SN', emoji: '🔧', optionA: '已验证的方法和经验', optionB: '创新的想法和新思路' },
  { id: 15, text: '你的想法通常是：', dimension: 'SN', emoji: '💡', optionA: '脚踏实地的、可执行的', optionB: '天马行空的、充满想象的' },
  { id: 16, text: '面对一个新项目，你首先会：', dimension: 'SN', emoji: '🚀', optionA: '收集数据和了解现状', optionB: '构想愿景和最终目标' },
  { id: 17, text: '你更容易注意到：', dimension: 'SN', emoji: '🔎', optionA: '环境中的变化（新发型、新装饰）', optionB: '别人情绪或态度的微妙变化' },
  { id: 18, text: '你更喜欢的故事类型：', dimension: 'SN', emoji: '📖', optionA: '真实事件改编、纪实类', optionB: '奇幻、科幻、充满隐喻' },
  { id: 19, text: '你看待问题的方式更像：', dimension: 'SN', emoji: '🔭', optionA: '用放大镜看细节', optionB: '用望远镜看全局' },
  { id: 20, text: '面对不确定性时，你更倾向于：', dimension: 'SN', emoji: '🌫️', optionA: '收集更多信息来减少不确定', optionB: '凭直觉做出判断' },

  // ===== Chapter 3: T/F 维度 (10题) =====
  { id: 21, text: '做决定时，你更看重：', dimension: 'TF', emoji: '⚖️', optionA: '逻辑分析和客观事实', optionB: '个人价值观和他人感受' },
  { id: 22, text: '朋友向你倾诉烦恼时，你更倾向于：', dimension: 'TF', emoji: '💝', optionA: '帮TA分析问题，提供解决方案', optionB: '先共情安慰，让TA感到被理解' },
  { id: 23, text: '批评别人时，你更倾向于：', dimension: 'TF', emoji: '🗣️', optionA: '直接指出问题，即使可能伤人', optionB: '委婉表达，注意对方的感受' },
  { id: 24, text: '你更认同的说法是：', dimension: 'TF', emoji: '📌', optionA: '"对事不对人"', optionB: '"人和事不能分开看"' },
  { id: 25, text: '你认为更重要的是：', dimension: 'TF', emoji: '🎭', optionA: '真相，即使它令人不快', optionB: '和谐，即使需要善意的谎言' },
  { id: 26, text: '你觉得"公平"意味着：', dimension: 'TF', emoji: '🏛️', optionA: '每个人受到同样的对待', optionB: '根据每个人的情况区别对待' },
  { id: 27, text: '你更容易被什么打动：', dimension: 'TF', emoji: '💫', optionA: '严密的论证和精彩的推理', optionB: '真挚的情感和感人的故事' },
  { id: 28, text: '你觉得一个好人最重要的品质是：', dimension: 'TF', emoji: '🌟', optionA: '正直和理性', optionB: '善良和同理心' },
  { id: 29, text: '当朋友做了一个你认为错误的决定时：', dimension: 'TF', emoji: '🫂', optionA: '直接告诉TA你的分析和担忧', optionB: '先理解TA的想法，再委婉提出建议' },
  { id: 30, text: '你的内心更常被什么驱动：', dimension: 'TF', emoji: '🔥', optionA: '对正确和错误的判断', optionB: '对喜欢和不喜欢的情感' },

  // ===== Chapter 4: J/P 维度 (10题) =====
  { id: 31, text: '你的生活更接近：', dimension: 'JP', emoji: '📋', optionA: '有计划、有安排、有条理', optionB: '随性、灵活、顺其自然' },
  { id: 32, text: '旅行时，你更喜欢：', dimension: 'JP', emoji: '✈️', optionA: '提前规划好行程和住宿', optionB: '到了再说，随机应变' },
  { id: 33, text: '面对截止日期，你通常：', dimension: 'JP', emoji: '⏰', optionA: '提前完成，留有余量', optionB: '在最后期限前赶工' },
  { id: 34, text: '你更享受：', dimension: 'JP', emoji: '🎊', optionA: '做出决定后的确定感', optionB: '保持选择开放的自由感' },
  { id: 35, text: '当计划突然改变时，你：', dimension: 'JP', emoji: '🌪️', optionA: '感到不安，希望尽快回到正轨', optionB: '觉得挺好的，享受意外' },
  { id: 36, text: '你觉得"规则"是：', dimension: 'JP', emoji: '📏', optionA: '应该遵守的，能维持秩序', optionB: '可以变通的，视情况而定' },
  { id: 37, text: '你对"即兴"这个词的感受是：', dimension: 'JP', emoji: '🎵', optionA: '有点焦虑，更喜欢准备充分', optionB: '很兴奋，即兴发挥往往最精彩' },
  { id: 38, text: '你做事更像：', dimension: 'JP', emoji: '🎯', optionA: '按清单逐项完成', optionB: '同时推进多件事' },
  { id: 39, text: '对于"完美的旅行"，你认为是：', dimension: 'JP', emoji: '🗺️', optionA: '每个景点都按计划打卡', optionB: '偶然发现计划外的美景' },
  { id: 40, text: '你对"不确定性"的态度是：', dimension: 'JP', emoji: '🎲', optionA: '尽量消除它，追求确定和掌控', optionB: '可以接受，生活本就充满未知' },
]

// 按章节获取题目
export function getQuestionsByChapter(chapterIndex: number): Question[] {
  const dim = chapters[chapterIndex]?.dimension
  if (!dim) return []
  return questions.filter(q => q.dimension === dim)
}
