<template>
  <div class="detail-view">
    <!-- Easter Egg Toast -->
    <transition name="toast-slide">
      <div v-if="showEasterEgg" class="easter-toast" @click="showEasterEgg = false">
        <span class="toast-icon">🎉</span>
        <div class="toast-body">
          <span class="toast-title">隐藏彩蛋！</span>
          <span class="toast-msg">{{ easterEggMessage }}</span>
        </div>
      </div>
    </transition>

    <!-- Top Bar -->
    <div class="detail-top-bar">
      <button class="back-btn" @click="router.push(`/result/${typeCode}`)" title="返回">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <button class="theme-toggle-detail" @click="themeStore.toggle()" :title="themeStore.mode === 'apple' ? '切换到深色主题' : '切换到浅色主题'">
        <svg v-if="themeStore.mode === 'apple'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      </button>
    </div>

    <!-- Header -->
    <div class="detail-header">
        <div class="header-bg-glow"></div>
        <div class="header-content">
          <div class="type-badge">
            <span class="type-text">{{ personality?.code }}</span>
          </div>
          <p class="type-english">{{ personality?.nameEn }}</p>
          <h1 class="type-chinese">{{ personality?.nickname }} · {{ personality?.nameCn }}</h1>
          <p class="type-tagline">{{ personality?.tagline }}</p>
          <div class="type-character" @click="triggerEasterEgg">
            <MbtiCharacters :type="charType" :size="80" :show-labels="false" />
          </div>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div class="detail-body">
        <!-- Quick mode accuracy tip -->
        <section v-if="hasQuizResult && quizMode === 'quick'" class="section">
          <div class="card surface-card accuracy-tip">
            <span class="accuracy-icon">💡</span>
            <div class="accuracy-text">
              <p>快速测试使用 12 道题，准确度约 <strong>70%</strong></p>
              <p>完整测试 40 道题可获得更精准的结果</p>
            </div>
            <button class="accuracy-btn" @click="retake">
              完整测试 →
            </button>
          </div>
        </section>

        <!-- Dimension Bars -->
        <section v-if="hasQuizResult" class="section">
          <h3 class="section-title">📊 性格维度</h3>
          <div class="dimensions">
            <div v-for="dim in dimensionData" :key="dim.left" class="dimension-row">
              <div class="dim-labels">
                <span class="dim-label" :class="{ active: dim.leftPercent > 50 }">{{ dim.left }} ({{ dim.leftPercent }}%)</span>
                <span class="dim-label" :class="{ active: dim.rightPercent > 50 }">{{ dim.right }} ({{ dim.rightPercent }}%)</span>
              </div>
              <div class="dim-track">
                <div class="dim-bar-fill" :style="{ width: dim.leftPercent + '%', background: dim.color }"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Motto -->
        <section class="section">
          <div class="card surface-card motto-card">
            <p class="motto-text">{{ personality?.motto }}</p>
          </div>
        </section>

        <!-- Description -->
        <section class="section">
          <h3 class="section-title">🧠 性格概述</h3>
          <div class="card surface-card">
            <p class="description-text">{{ personality?.description }}</p>
          </div>
        </section>

        <!-- Strengths & Weaknesses -->
        <section class="section">
          <h3 class="section-title">💪 优势与待提升</h3>
          <div class="two-col">
            <div class="card surface-card strengths-card">
              <h4 class="card-subtitle">✨ 优势</h4>
              <div class="tag-list">
                <span v-for="s in personality?.strengths" :key="s" class="tag positive-tag">{{ s }}</span>
              </div>
            </div>
            <div class="card surface-card weaknesses-card">
              <h4 class="card-subtitle">⚡ 待提升</h4>
              <div class="tag-list">
                <span v-for="w in personality?.weaknesses" :key="w" class="tag caution-tag">{{ w }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Growth Tips -->
        <section class="section">
          <h3 class="section-title">🌱 成长建议</h3>
          <div class="card surface-card">
            <div class="growth-list">
              <div v-for="(tip, i) in personality?.growthTips" :key="i" class="growth-item">
                <span class="growth-num">{{ i + 1 }}</span>
                <span class="growth-text">{{ tip }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Work & Learning Style -->
        <section class="section">
          <h3 class="section-title">🏢 工作与学习</h3>
          <div class="two-col">
            <div class="card surface-card">
              <h4 class="card-subtitle">💼 工作风格</h4>
              <p class="description-text">{{ personality?.workStyle }}</p>
            </div>
            <div class="card surface-card">
              <h4 class="card-subtitle">📚 学习偏好</h4>
              <p class="description-text">{{ personality?.learningStyle }}</p>
            </div>
          </div>
        </section>

        <!-- Careers -->
        <section class="section">
          <h3 class="section-title">🎯 适合职业</h3>
          <div class="card surface-card">
            <div class="career-grid">
              <div v-for="career in personality?.careers" :key="career" class="career-item">
                <span class="career-dot"></span>
                <span class="career-name">{{ career }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Famous People -->
        <section class="section">
          <h3 class="section-title">🌟 著名人物</h3>
          <div class="card surface-card">
            <div class="people-list">
              <div v-for="person in personality?.famousPeople" :key="person" class="person-item">
                <div class="person-avatar">{{ person[0] }}</div>
                <span class="person-name">{{ person }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Compatibility -->
        <section class="section">
          <h3 class="section-title">💕 类型兼容性</h3>
          <div class="card surface-card">
            <div class="compat-chips">
              <div v-for="code in personality?.compatibility" :key="code" class="compat-chip" @click="router.push(`/result/${code}/detail`)">
                <span class="compat-emoji">{{ allPersonalities[code]?.emoji }}</span>
                <span class="compat-code">{{ code }}</span>
                <span class="compat-name">{{ allPersonalities[code]?.nameCn }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Match & Compare -->
        <section class="section">
          <h3 class="section-title">🧲 性格匹配对比</h3>
          <div class="card surface-card match-card">
            <p class="match-intro">选择朋友的 MBTI 类型，看看你们的化学反应</p>
            <div class="match-picker">
              <select v-model="matchType" class="match-select">
                <option value="">选择类型...</option>
                <option v-for="p in Object.keys(allPersonalities).filter(k => k !== typeCode)" :key="p" :value="p">
                  {{ allPersonalities[p].emoji }} {{ p }} {{ allPersonalities[p].nickname }}
                </option>
              </select>
            </div>
            <transition name="match-reveal">
              <div v-if="matchType && matchResult" class="match-result">
                <div class="match-score">
                  <div class="score-circle">
                    <span class="score-num">{{ matchResult.score }}</span>
                    <span class="score-pct">%</span>
                  </div>
                  <span class="score-label">{{ matchResult.label }}</span>
                </div>
                <div class="match-chemistry">
                  <div class="chemistry-item" v-for="(item, i) in matchResult.chemistry" :key="i">
                    <span class="chem-emoji">{{ item.emoji }}</span>
                    <div class="chem-info">
                      <span class="chem-title">{{ item.title }}</span>
                      <span class="chem-desc">{{ item.desc }}</span>
                    </div>
                  </div>
                </div>
                <p class="match-verdict">{{ matchResult.verdict }}</p>
              </div>
            </transition>
          </div>
        </section>

        <!-- Relationships -->
        <section class="section">
          <h3 class="section-title">🤝 人际关系</h3>
          <div class="card surface-card">
            <p class="description-text">{{ personality?.relationships }}</p>
          </div>
        </section>

        <!-- Keyword Cloud Poster -->
        <section v-if="hasQuizResult" class="section">
          <h3 class="section-title">🎨 性格关键词海报</h3>
          <div class="card surface-card poster-card">
            <div ref="posterRef" class="keyword-poster">
              <div class="poster-bg"></div>
              <div class="poster-content">
                <div class="poster-header">
                  <span class="poster-emoji">{{ personality?.emoji }}</span>
                  <h4 class="poster-type">{{ personality?.code }}</h4>
                  <p class="poster-name">{{ personality?.nickname }}</p>
                </div>
                <div class="keyword-cloud">
                  <span v-for="(kw, i) in posterKeywords" :key="i"
                        class="keyword-tag"
                        :style="{
                          fontSize: kw.size + 'rem',
                          animationDelay: (i * 0.08) + 's'
                        }">
                    {{ kw.text }}
                  </span>
                </div>
                <p class="poster-tagline">{{ personality?.motto }}</p>
                <div class="poster-watermark">
                  <span class="watermark-text">🔍 搜索公众号「性格密码研究所」获取更多</span>
                </div>
              </div>
            </div>
            <button class="action-btn primary-btn poster-download-btn" @click="downloadPoster">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              保存关键词海报
            </button>
          </div>
        </section>

        <!-- Type Rankings -->
        <section v-if="typeRankings.length > 0" class="section">
          <h3 class="section-title">🏆 类型排行榜</h3>
          <div class="card surface-card rankings-card">
            <div class="rankings-list">
              <div v-for="(item, i) in typeRankings" :key="item.type" class="ranking-item">
                <span class="ranking-num">{{ i + 1 }}</span>
                <span class="ranking-emoji">{{ allPersonalities[item.type]?.emoji }}</span>
                <div class="ranking-info">
                  <span class="ranking-type">{{ item.type }}</span>
                  <span class="ranking-name">{{ allPersonalities[item.type]?.nickname }}</span>
                </div>
                <span class="ranking-count">{{ item.count }}次</span>
              </div>
            </div>
          </div>
        </section>

      </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPersonalities } from '../data/dataLoader'
import { useQuizStore } from '../stores/quizStore'
import { useThemeStore } from '../stores/themeStore'

// Lazy load heavy components
const MbtiCharacters = defineAsyncComponent(() =>
  import('../components/ui/MbtiCharacters.vue').then(m => m.default)
)
const ParticleBackground = defineAsyncComponent(() =>
  import('../components/ui/ParticleBackground.vue').then(m => m.default)
)

type MbtiCharacterType = 'dreamer' | 'leader' | 'analyst' | 'explorer' | 'connector'

// Expose personalities for compatibility chip lookups
const personalities = getPersonalities()
const allPersonalities = personalities

const route = useRoute()
const router = useRouter()
const store = useQuizStore()
const themeStore = useThemeStore()

const posterRef = ref<HTMLElement>()

const typeCode = computed(() => (route.params.type as string).toUpperCase())
const personality = computed(() => getPersonalities()[typeCode.value])
const hasQuizResult = computed(() => !!sessionStorage.getItem('mbti-result'))
const quizMode = computed(() => store.mode)

// Map MBTI type to character type
const typeToChar: Record<string, MbtiCharacterType> = {
  INFP: 'dreamer', INFJ: 'dreamer', INTJ: 'dreamer', INTP: 'dreamer',
  ENFJ: 'connector', ENFP: 'connector', ENTP: 'connector', ENTJ: 'connector',
  ISTJ: 'analyst', ISFJ: 'analyst', ISTP: 'analyst', ISFP: 'analyst',
  ESTP: 'explorer', ESFP: 'explorer', ESTJ: 'explorer', ESFJ: 'explorer',
}
const charType = computed<MbtiCharacterType>(() => typeToChar[typeCode.value] || 'dreamer')

// Match & Compare
const matchType = ref('')

interface ChemItem { emoji: string; title: string; desc: string }
interface MatchResult { score: number; label: string; chemistry: ChemItem[]; verdict: string }

// Compatibility scoring data
const compatScores: Record<string, number> = {
  ENFJ: 95, ENFP: 88, INFP: 92, INFJ: 90, INTJ: 82, INTP: 78,
  ENTP: 76, ENTJ: 80, ISFJ: 72, ISFP: 85, ISTP: 70, ISTJ: 68,
  ESFJ: 83, ESFP: 77, ESTP: 65, ESTJ: 62,
}

const compatChemistry: Record<string, ChemItem[]> = {
  ENFJ: [
    { emoji: '💫', title: '灵魂共鸣', desc: '你们对世界有相似的感知方式，能深入理解彼此' },
    { emoji: '🔥', title: '相互激励', desc: 'TA 的热情会点燃你内心的火花' },
    { emoji: '🤝', title: '价值观契合', desc: '你们都重视人际关系和深层连接' },
  ],
  INFP: [
    { emoji: '🌙', title: '诗意默契', desc: '无需多言，你们就能感知对方的情绪' },
    { emoji: '🎨', title: '创意碰撞', desc: '两个丰富的内心世界相遇，激发无限灵感' },
    { emoji: '💚', title: '温柔守护', desc: '彼此给予空间和理解，是最舒适的陪伴' },
  ],
  INFJ: [
    { emoji: '🔮', title: '心灵感应', desc: '你们像两面镜子，能照见对方最深的自我' },
    { emoji: '🌊', title: '深层对话', desc: '从表面聊到宇宙人生，你们总有说不完的话题' },
    { emoji: '🛡️', title: '默契同盟', desc: '共同理想让你们成为最好的战友' },
  ],
  INTJ: [
    { emoji: '♟️', title: '智识交锋', desc: '你们的对话像一场精彩的棋局，互相挑战又欣赏' },
    { emoji: '🎯', title: '目标一致', desc: '都追求卓越，能一起制定宏大计划' },
    { emoji: '⚡', title: '互补火花', desc: '你的感性 + TA 的理性 = 完美决策' },
  ],
  ENFP: [
    { emoji: '🎪', title: '快乐搭档', desc: '在一起永远充满欢笑和冒险' },
    { emoji: '✨', title: '灵感风暴', desc: '你们的脑洞加起来可以装下整个宇宙' },
    { emoji: '🌈', title: '色彩斑斓', desc: '每一天都会是新的惊喜' },
  ],
  ENTJ: [
    { emoji: '👑', title: '强强联手', desc: '两个有主见的人在一起，能创造不可思议的事' },
    { emoji: '🚀', title: '效率倍增', desc: '你们的行动力叠加，几乎没有完不成的事' },
    { emoji: '💎', title: '互相欣赏', desc: '你们都尊重能力和决心，彼此深深敬佩' },
  ],
  ISFP: [
    { emoji: '🎭', title: '静默之美', desc: '不需要热闹，安静地在一起就是最好的时光' },
    { emoji: '🌸', title: '感官共鸣', desc: '一起欣赏美食、音乐、自然，享受生活的每一个细节' },
    { emoji: '🕊️', title: '自由空间', desc: '彼此尊重独立人格，是最不互相束缚的组合' },
  ],
  INTP: [
    { emoji: '🧪', title: '思想实验室', desc: '你们的对话可以从量子物理聊到存在主义' },
    { emoji: '🔍', title: '真相猎人', desc: '都不满足于表面答案，一起探索事物本质' },
    { emoji: '🧩', title: '拼图伙伴', desc: '各自思考，然后拼出完整的画面' },
  ],
}

const defaultChemistry: ChemItem[] = [
  { emoji: '🌐', title: '新视角', desc: '不同的思维方式让你们看到彼此盲区之外的世界' },
  { emoji: '🎭', title: '反差魅力', desc: '差异本身就是最大的吸引力' },
  { emoji: '🌱', title: '成长催化', desc: 'TA 会帮你发展自己不擅长的一面' },
]

const matchResult = computed<MatchResult | null>(() => {
  if (!matchType.value) return null
  // Use deterministic but varied scores based on type pair
  const pair = typeCode.value + matchType.value
  const hash = pair.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const baseScore = compatScores[matchType.value] || (60 + hash % 30)
  const label = baseScore >= 85 ? '天作之合 ✨' : baseScore >= 70 ? '默契搭档 🤝' : baseScore >= 55 ? '互补组合 🧩' : '挑战模式 🔥'
  return {
    score: baseScore,
    label,
    chemistry: compatChemistry[matchType.value] || defaultChemistry,
    verdict: baseScore >= 85
      ? '你们的化学反应太强了！在一起会激发出彼此最好的一面。'
      : baseScore >= 70
        ? '很好的搭配！你们能在很多方面互相支持和成长。'
        : baseScore >= 55
          ? '有趣的组合！差异会让关系充满新鲜感和学习机会。'
          : '挑战型组合！需要更多理解和包容，但突破后会更深刻。'
  }
})

interface DimensionDisplay {
  left: string
  right: string
  leftPercent: number
  rightPercent: number
  color: string
}

const dimensionData = computed<DimensionDisplay[]>(() => {
  const stored = sessionStorage.getItem('mbti-result')
  if (!stored) return []
  const { percentages } = JSON.parse(stored)

  return [
    { left: 'E 外向', right: 'I 内向', leftPercent: percentages.E, rightPercent: percentages.I, color: 'var(--dim-ei)' },
    { left: 'S 感觉', right: 'N 直觉', leftPercent: percentages.S, rightPercent: percentages.N, color: 'var(--dim-sn)' },
    { left: 'T 思考', right: 'F 情感', leftPercent: percentages.T, rightPercent: percentages.F, color: 'var(--dim-tf)' },
    { left: 'J 判断', right: 'P 知觉', leftPercent: percentages.J, rightPercent: percentages.P, color: 'var(--dim-jp)' }
  ]
})

function retake() {
  store.reset()
  sessionStorage.removeItem('mbti-result')
  router.push('/')
}

const posterKeywords = computed(() => {
  if (!personality.value) return []
  const p = personality.value
  const keywords = [
    ...p.strengths.slice(0, 4),
    p.nickname,
    ...p.tagline.split('，').slice(0, 2),
  ].slice(0, 8)
  return keywords.map((text, i) => ({
    text,
    size: i === 0 ? 1.5 : i < 3 ? 1.25 : 1
  }))
})

async function downloadPoster() {
  if (!posterRef.value) return
  try {
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(posterRef.value, {
      backgroundColor: '#0a0a0a',
      scale: 2,
      useCORS: true
    })
    const link = document.createElement('a')
    link.download = `mbti-poster-${typeCode.value}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (e) {
    console.error('Failed to capture poster:', e)
  }
}

// Type Rankings (local storage)
interface TypeStats {
  [key: string]: number
}

const typeRankings = computed(() => {
  const stats: TypeStats = JSON.parse(localStorage.getItem('mbti-stats') || '{}')
  const sorted = Object.entries(stats)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  return sorted
})

function updateStats(type: string) {
  const stats: TypeStats = JSON.parse(localStorage.getItem('mbti-stats') || '{}')
  stats[type] = (stats[type] || 0) + 1
  localStorage.setItem('mbti-stats', JSON.stringify(stats))
}

// Update stats when quiz completes
if (route.query.reveal === 'true') {
  updateStats(typeCode.value)
}

// Easter Egg
const easterEggClicks = ref(0)
const showEasterEgg = ref(false)
const eggRef = ref<HTMLElement>()

function triggerEasterEgg() {
  easterEggClicks.value++
  if (easterEggClicks.value >= 10) {
    showEasterEgg.value = true
    if (navigator.vibrate) navigator.vibrate(50)
    setTimeout(() => {
      showEasterEgg.value = false
      easterEggClicks.value = 0
    }, 5000)
  }
}

const easterEggMessage = computed(() => {
  if (!personality.value) return ''
  const p = personality.value
  return `恭喜发现隐藏彩蛋！作为 ${p.code} 型人格，你拥有 ${p.strengths[0]} 和 ${p.strengths[1]} 的超能力！`
})

</script>

<style scoped>
.detail-view {
  min-height: 100dvh;
  background: var(--canvas);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
}

.detail-view::-webkit-scrollbar {
  width: 0;
  display: none;
}

.detail-top-bar {
  position: sticky;
  top: 0;
  padding: calc(0.75rem + var(--safe-top)) 1.25rem 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  background: var(--canvas);
}

.back-btn, .theme-toggle-detail {
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--rounded-full);
  background: var(--surface-1);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--hairline-soft);
  color: var(--ink);
  transition: all 0.2s ease;
}
.back-btn:active, .theme-toggle-detail:active { transform: scale(0.9); }

.detail-header {
  position: relative;
  padding: 2rem 1.5rem 2rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
}

.header-bg-glow {
  position: absolute;
  width: 18.75rem;
  height: 18.75rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gradient-violet), var(--gradient-magenta));
  filter: blur(100px);
  opacity: 0.3;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.header-content {
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.type-text {
  display: block;
  font-size: clamp(4rem, 18vw, 7.5rem);
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: -3px;
  color: var(--ink);
}

.type-english {
  font-size: 1rem;
  color: var(--ink-muted);
  font-style: italic;
}

.type-chinese {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--ink);
  margin-top: 0.25rem;
  white-space: nowrap;
}

.type-tagline {
  font-size: 0.9375rem;
  color: var(--ink-muted);
  max-width: 22rem;
  line-height: 1.6;
}

.type-character {
  margin-top: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.type-character:active {
  transform: scale(0.9);
}

.detail-body {
  padding: 0 1.25rem 2.5rem;
  max-width: 30rem;
  margin: 0 auto;
}

.section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-left: 0.25rem;
  color: var(--ink);
}

.surface-card {
  background: var(--surface-1);
  border: 1px solid var(--hairline);
  border-radius: var(--rounded-xl);
  padding: 1.5rem;
}

.description-text {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--ink-secondary);
}

.dimensions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dimension-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dim-labels {
  display: flex;
  justify-content: space-between;
}

.dim-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--ink-subtle);
  transition: color 0.3s ease;
}

.dim-label.active {
  color: var(--ink);
}

.dim-track {
  height: 0.5rem;
  background: var(--surface-2);
  border-radius: var(--rounded-full);
  overflow: hidden;
}

.dim-bar-fill {
  height: 100%;
  border-radius: var(--rounded-full);
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.card-subtitle {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--ink);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.375rem 0.75rem;
  border-radius: var(--rounded-pill);
  font-size: 0.8125rem;
  font-weight: 500;
}

.positive-tag {
  background: rgba(52, 199, 89, 0.15);
  color: var(--success);
}

.caution-tag {
  background: rgba(255, 149, 0, 0.15);
  color: var(--gradient-orange);
}

.career-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.career-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.career-dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background: var(--accent-blue);
  flex-shrink: 0;
}

.career-name {
  font-size: 0.9375rem;
  color: var(--ink);
}

.people-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.875rem;
}

.person-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-width: 0;
}

.person-avatar {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, var(--gradient-violet), var(--gradient-magenta));
}

.person-name {
  font-size: 0.875rem;
  color: var(--ink);
}

/* Motto */
.motto-card {
  background: linear-gradient(135deg, rgba(124,108,240,0.08), rgba(191,90,242,0.05));
  border: 1px solid rgba(124,108,240,0.2);
  text-align: center;
  padding: 2rem 1.5rem;
}

.motto-text {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--ink);
  font-style: italic;
  font-weight: 500;
}

/* Growth Tips */
.growth-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.growth-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.growth-num {
  width: 1.75rem;
  height: 1.75rem;
  min-width: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gradient-violet), var(--gradient-magenta));
  color: white;
  font-size: 0.8125rem;
  font-weight: 700;
  flex-shrink: 0;
}

.growth-text {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--ink-secondary);
  padding-top: 0.1875rem;
}

/* Compatibility Chips */
.compat-chips {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.compat-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem 1rem;
  background: var(--surface-2);
  border: 1px solid var(--hairline-soft);
  border-radius: var(--rounded-lg);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.compat-chip:hover {
  background: var(--surface-3);
  border-color: var(--gradient-violet);
  transform: translateY(-2px);
}

.compat-chip:active {
  transform: translateY(0) scale(0.98);
}

.compat-emoji {
  font-size: 2rem;
  line-height: 1;
}

.compat-code {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: 0.5px;
}

.compat-name {
  font-size: 0.75rem;
  color: var(--ink-muted);
  white-space: nowrap;
}

/* Accuracy tip */
.accuracy-tip {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255,149,0,0.08);
  border: 1px solid rgba(255,149,0,0.2);
}

.accuracy-icon {
  font-size: 1.5rem;
}

.accuracy-text {
  flex: 1;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--ink-secondary);
}

.accuracy-text strong {
  color: var(--ink);
}

.accuracy-btn {
  padding: 0.5rem 1rem;
  background: var(--gradient-orange);
  color: white;
  border-radius: var(--rounded-pill);
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
}

.accuracy-btn:active {
  transform: scale(0.95);
}

/* Match & Compare */
.match-intro {
  font-size: 0.875rem;
  color: var(--ink-muted);
  margin-bottom: 1rem;
  text-align: center;
}

.match-picker {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.match-select {
  padding: 0.75rem 1.25rem;
  background: var(--surface-2);
  color: var(--ink);
  border: 1px solid var(--hairline);
  border-radius: var(--rounded-xl);
  font-size: 0.9375rem;
  font-family: inherit;
  min-width: 14rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2386868b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
}

.match-result {
  padding-top: 1rem;
  border-top: 1px solid var(--hairline-soft);
}

.match-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.score-circle {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gradient-violet), var(--gradient-magenta));
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.125rem;
}

.score-num {
  font-size: 2rem;
  font-weight: 700;
  color: white;
}

.score-pct {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.375rem;
}

.score-label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--ink);
}

.match-chemistry {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin-bottom: 1.25rem;
}

.chemistry-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.chem-emoji {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.chem-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.chem-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--ink);
}

.chem-desc {
  font-size: 0.8125rem;
  color: var(--ink-muted);
  line-height: 1.5;
}

.match-verdict {
  font-size: 0.875rem;
  color: var(--ink-secondary);
  text-align: center;
  line-height: 1.6;
  padding: 0.75rem;
  background: var(--surface-2);
  border-radius: var(--rounded-lg);
}

.match-reveal-enter-active {
  animation: matchIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.match-reveal-leave-active {
  animation: matchOut 0.2s ease-in;
}

@keyframes matchIn {
  from { opacity: 0; transform: translateY(1rem) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes matchOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Keyword Cloud Poster */
.poster-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.keyword-poster {
  position: relative;
  border-radius: var(--rounded-xl);
  overflow: hidden;
  min-height: 18rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.poster-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
  z-index: 0;
}

.poster-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  padding: 2rem 1.5rem;
  width: 100%;
}

.poster-header {
  text-align: center;
}

.poster-emoji {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.5rem;
}

.poster-type {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  letter-spacing: -2px;
  margin: 0;
}

.poster-name {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0.25rem 0 0;
}

.keyword-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  max-width: 20rem;
}

.keyword-tag {
  padding: 0.375rem 0.875rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--rounded-pill);
  color: white;
  font-weight: 500;
  backdrop-filter: blur(10px);
  animation: keywordIn 0.5s ease-out both;
}

@keyframes keywordIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

.poster-tagline {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-style: italic;
  margin: 0;
}

.poster-watermark {
  position: absolute;
  bottom: 1rem;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.watermark-text {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.25rem 0.75rem;
  border-radius: var(--rounded-pill);
  display: inline-block;
}

.poster-download-btn {
  margin-top: 0.5rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-radius: var(--rounded-pill);
  font-size: 0.9375rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.action-btn:active {
  transform: scale(0.96);
}

.primary-btn {
  background: var(--ink);
  color: var(--canvas);
}

.secondary-btn {
  background: var(--surface-1);
  color: var(--ink);
  border: 1px solid var(--hairline);
}

/* Rankings */
.rankings-card {
  padding: 0;
}

.rankings-list {
  display: flex;
  flex-direction: column;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--hairline-soft);
}

.ranking-item:last-child {
  border-bottom: none;
}

.ranking-num {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  background: var(--surface-2);
  color: var(--ink-muted);
}

.ranking-item:first-child .ranking-num {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #1a1a2e;
}

.ranking-item:nth-child(2) .ranking-num {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  color: #1a1a2e;
}

.ranking-item:nth-child(3) .ranking-num {
  background: linear-gradient(135deg, #cd7f32, #e8a87c);
  color: #1a1a2e;
}

.ranking-emoji {
  font-size: 1.5rem;
}

.ranking-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.ranking-type {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--ink);
}

.ranking-name {
  font-size: 0.8125rem;
  color: var(--ink-muted);
}

.ranking-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ink-secondary);
}

/* Easter Egg Toast */
.easter-toast {
  position: fixed;
  top: calc(var(--safe-top) + 4rem);
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  max-width: 90vw;
  width: 20rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
  cursor: pointer;
  animation: toastShake 0.5s ease-in-out 0.3s;
}

@keyframes toastShake {
  0%, 100% { transform: translateX(-50%) rotate(0); }
  25% { transform: translateX(-50%) rotate(-2deg); }
  75% { transform: translateX(-50%) rotate(2deg); }
}

.toast-icon {
  font-size: 2rem;
  flex-shrink: 0;
  animation: toastBounce 1s ease-in-out infinite;
}

@keyframes toastBounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-0.25rem) scale(1.1); }
}

.toast-body {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
}

.toast-title {
  font-size: 1rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
}

.toast-msg {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
}

.toast-slide-enter-active {
  animation: toastIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-slide-leave-active {
  animation: toastOut 0.3s ease-in;
}

@keyframes toastIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-2rem) scale(0.8); }
  to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
}

@keyframes toastOut {
  from { opacity: 1; transform: translateX(-50%) translateY(0); }
  to { opacity: 0; transform: translateX(-50%) translateY(-2rem); }
}
</style>
