<template>
  <div class="home-view">
    <!-- Follow Guide Modal -->
    <transition name="modal">
      <div v-if="showFollowGuide" class="follow-overlay" @click.self="showFollowGuide = false">
        <div class="follow-modal">
          <button class="follow-close" @click="showFollowGuide = false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <div class="follow-modal-icon">💜</div>
          <h3 class="follow-modal-title">关注公众号获取更多内容</h3>
          <p class="follow-modal-desc">搜索公众号，每周更新 MBTI 深度解读</p>
          <div class="follow-account-box">
            <span class="follow-account-name">性格密码研究所</span>
            <button class="follow-copy-btn" @click="copyAccountName">复制</button>
          </div>
          <div class="follow-steps">
            <div class="follow-step">
              <span class="step-num">1</span>
              <span>复制公众号名称</span>
            </div>
            <div class="follow-step">
              <span class="step-num">2</span>
              <span>打开微信搜索关注</span>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="bg-ambient"></div>
    <ParticleBackground />

    <div class="content">
      <!-- Top bar -->
      <div class="top-bar">
        <div class="top-bar-left">
          <button class="about-btn" @click="router.push('/about')" title="了解 MBTI">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
          </button>
          <button class="style-btn" @click="router.push('/style-preview')" title="角色风格">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <path d="M12 2C6.48 2 2 6 2 10.5c0 2.1.9 4 2.3 5.4L4 18l3.5-1.2c1.4.6 2.9.9 4.5.9 5.52 0 10-4 10-8.5S17.52 2 12 2z"/>
              <circle cx="8" cy="10" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="10" r="1.5" fill="currentColor"/>
              <circle cx="16" cy="10" r="1.5" fill="currentColor"/>
            </svg>
          </button>
          <button class="theme-toggle" @click="toggleTheme" :title="themeStore.mode === 'apple' ? '切换到深色主题' : '切换到浅色主题'">
          <svg v-if="themeStore.mode === 'apple'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
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
        <button class="share-btn" @click="shareToWeChat" title="分享给好友">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      </div>

      <!-- Hero: Character + Title -->
      <section class="hero">
        <div class="character-wrapper animate-in" style="--delay: 0.1s">
          <div class="character-clickable" @click="tapCharacter">
            <transition name="char-swap" mode="out-in">
              <MbtiCharacters :type="currentChar" :size="130" :show-labels="false" :key="currentChar" />
            </transition>
            <!-- Speech bubble -->
            <transition name="bubble">
              <div v-if="showBubble" class="speech-bubble" :key="currentMsg">
                <span>{{ currentMsg }}</span>
              </div>
            </transition>
          </div>
          <span class="char-label">{{ charLabels[currentChar] }}</span>
        </div>

        <h1 class="hero-title animate-in" style="--delay: 0.25s">发现你的<br/><span class="title-accent">性格密码</span></h1>
        <p class="hero-sub animate-in" style="--delay: 0.4s">点击切换角色 · 打个招呼吧 👋</p>
      </section>

      <!-- Entry Cards -->
      <section class="entry-cards">
        <div class="entry-card quick animate-in" style="--delay: 0.5s" @click="startQuiz('quick')">
          <div class="entry-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <div class="entry-body">
            <h3>快速测试</h3>
            <p>12 道精选题 · 1 分钟</p>
          </div>
          <div class="entry-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        <div class="entry-card full animate-in" style="--delay: 0.65s" @click="startQuiz('full')">
          <div class="entry-icon full-entry-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <line x1="8" y1="8" x2="16" y2="8"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="8" y1="16" x2="12" y2="16"/>
            </svg>
          </div>
          <div class="entry-body">
            <h3>完整测试</h3>
            <p>40 道题 · 4 个章节 · 3 分钟</p>
          </div>
          <div class="entry-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore, type QuizMode } from '../stores/quizStore'
import { useThemeStore } from '../stores/themeStore'

// Lazy load heavy components
const MbtiCharacters = defineAsyncComponent(() =>
  import('../components/ui/MbtiCharacters.vue').then(m => m.default)
)
const ParticleBackground = defineAsyncComponent(() =>
  import('../components/ui/ParticleBackground.vue').then(m => m.default)
)

type MbtiCharacterType = 'dreamer' | 'leader' | 'analyst' | 'explorer' | 'connector'

const router = useRouter()
const quizStore = useQuizStore()
const themeStore = useThemeStore()

const charTypes: MbtiCharacterType[] = ['dreamer', 'leader', 'analyst', 'explorer', 'connector']
const charLabels: Record<MbtiCharacterType, string> = {
  dreamer: '梦想家 · INFP',
  leader: '领导者 · ENTJ',
  analyst: '分析师 · INTP',
  explorer: '探险家 · ESFP',
  connector: '联结者 · ENFJ',
}
const charIndex = ref(0)
const currentChar = ref<MbtiCharacterType>('dreamer')

const encouragements: Record<MbtiCharacterType, string[]> = {
  dreamer: ['嘿，来聊聊吧', '你今天心情怎么样？', '我总觉得你心里藏着星星', '慢慢来，不着急'],
  leader: ['有什么计划吗？', '准备好了吗？出发吧', '今天想挑战什么', '跟我来，带你飞'],
  analyst: ['想不通的事，换个角度试试', '逻辑有时候也会骗人哦', '让我帮你想一想', '嗯…有意思'],
  explorer: ['走吧，出去玩！', '今天天气好像不错', '有什么好玩的推荐吗', '说走就走'],
  connector: ['你最近还好吗？', '一起聊聊天吧', '有人陪你真好', '来，抱一个'],
}

const showBubble = ref(false)
const currentMsg = ref('')
const showFollowGuide = ref(false)
let bubbleTimer: ReturnType<typeof setTimeout> | null = null

function tapCharacter() {
  // Cycle to next character
  charIndex.value = (charIndex.value + 1) % charTypes.length
  currentChar.value = charTypes[charIndex.value]

  // Show encouragement
  const msgs = encouragements[currentChar.value]
  const msg = msgs[Math.floor(Math.random() * msgs.length)]
  currentMsg.value = msg
  showBubble.value = true

  if (bubbleTimer) clearTimeout(bubbleTimer)
  bubbleTimer = setTimeout(() => {
    showBubble.value = false
  }, 2500)
}

function startQuiz(mode: QuizMode) {
  quizStore.startQuiz(mode)
  router.push('/quiz')
}

function toggleTheme() {
  themeStore.toggle()
}

async function shareToWeChat() {
  const accountName = '性格密码研究所'
  // Check if running in WeChat browser
  const isWeChat = /MicroMessenger/i.test(navigator.userAgent)

  if (isWeChat && window.wx) {
    // In WeChat browser - show follow guide modal
    showFollowGuide.value = true
    return
  }

  // Outside WeChat - copy account name
  try {
    await navigator.clipboard.writeText(accountName)
    showBubble.value = true
    currentMsg.value = `公众号「${accountName}」已复制！去微信搜索关注`
    if (navigator.vibrate) navigator.vibrate(30)
    setTimeout(() => { showBubble.value = false }, 3000)
  } catch (e) {
    const textArea = document.createElement('textarea')
    textArea.value = accountName
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showBubble.value = true
    currentMsg.value = `公众号「${accountName}」已复制！去微信搜索关注`
    setTimeout(() => { showBubble.value = false }, 3000)
  }
}

function copyAccountName() {
  const accountName = '性格密码研究所'
  try {
    navigator.clipboard.writeText(accountName)
  } catch {
    const textArea = document.createElement('textarea')
    textArea.value = accountName
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
  showFollowGuide.value = false
  showBubble.value = true
  currentMsg.value = '已复制！打开微信搜索关注'
  setTimeout(() => { showBubble.value = false }, 3000)
}
</script>

<style scoped>
.home-view {
  min-height: 100dvh;
  background: var(--canvas);
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease;
  display: flex;
  flex-direction: column;
}

/* Follow Guide Modal */
.follow-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
}

.follow-modal {
  background: var(--canvas);
  border-radius: var(--rounded-xl);
  padding: 2rem 1.5rem;
  max-width: 20rem;
  width: 100%;
  text-align: center;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.follow-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--surface-2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: all 0.2s;
}

.follow-close:active {
  transform: scale(0.9);
  background: var(--surface-3);
}

.follow-modal-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.follow-modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.follow-modal-desc {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.follow-account-box {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--rounded-lg);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.follow-account-name {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
}

.follow-copy-btn {
  padding: 0.5rem 1rem;
  background: var(--primary);
  color: white;
  border-radius: var(--rounded-md);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.follow-copy-btn:active {
  transform: scale(0.95);
  opacity: 0.9;
}

.follow-steps {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.follow-step {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.step-num {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: var(--primary-soft);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.75rem;
  flex-shrink: 0;
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .follow-modal,
.modal-leave-active .follow-modal {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .follow-modal,
.modal-leave-to .follow-modal {
  transform: scale(0.9);
}

.bg-ambient {
  z-index: 0;
}

.content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 30rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ===== Animation ===== */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(1.5rem); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-in {
  animation: slideUp 0.6s ease-out both;
  animation-delay: var(--delay, 0s);
}

/* ===== Top Bar ===== */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: calc(1rem + var(--safe-top)) 0 0.5rem;
}

.top-bar-left {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.top-bar button {
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

.top-bar button:active { transform: scale(0.9); }
.top-bar button svg { color: var(--ink); }

/* ===== Hero ===== */
.hero {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 0 1rem;
  min-height: 0;
}

.character-wrapper {
  position: relative;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.character-clickable {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.character-clickable:active {
  transform: scale(0.95);
}

.char-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--ink-muted);
  margin-top: 0.375rem;
  letter-spacing: 0.3px;
}

/* Character swap transition */
.char-swap-enter-active {
  animation: charIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.char-swap-leave-active {
  animation: charOut 0.2s ease-in;
}

@keyframes charIn {
  from { opacity: 0; transform: scale(0.85) translateY(0.5rem); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes charOut {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.85) translateY(-0.5rem); }
}

/* ===== Speech Bubble ===== */
.speech-bubble {
  position: absolute;
  top: -1rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--surface-1);
  border: 1px solid var(--hairline-soft);
  border-radius: var(--rounded-xl);
  padding: 0.625rem 1rem;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ink);
  box-shadow: var(--shadow-md);
  pointer-events: none;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -0.375rem;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 0.75rem;
  height: 0.75rem;
  background: var(--surface-1);
  border-right: 1px solid var(--hairline-soft);
  border-bottom: 1px solid var(--hairline-soft);
}

.bubble-enter-active {
  animation: bubbleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.bubble-leave-active {
  animation: bubbleOut 0.25s ease-in;
}

@keyframes bubbleIn {
  from { opacity: 0; transform: translateX(-50%) translateY(0.5rem) scale(0.8); }
  to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
}
@keyframes bubbleOut {
  from { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  to { opacity: 0; transform: translateX(-50%) translateY(-0.5rem) scale(0.9); }
}

/* ===== Title ===== */
.hero-title {
  font-size: clamp(1.875rem, 8vw, 2.75rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -1px;
  color: var(--ink);
  margin-bottom: 0.625rem;
}

.title-accent {
  background: linear-gradient(135deg, var(--gradient-violet), var(--gradient-magenta), var(--gradient-orange));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  font-size: 0.875rem;
  color: var(--ink-muted);
  margin-bottom: 0;
}

/* ===== Entry Cards ===== */
.entry-cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: calc(1.25rem + var(--safe-bottom));
}

.entry-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--surface-1);
  border: 1px solid var(--hairline);
  border-radius: var(--rounded-xl);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.entry-card:active { transform: scale(0.97); }
.entry-card:hover { box-shadow: var(--shadow-lg); }

.entry-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--rounded-lg);
  flex-shrink: 0;
  background: rgba(124, 108, 240, 0.12);
  color: var(--gradient-violet);
}

.full-entry-icon {
  background: rgba(52, 199, 89, 0.12);
  color: #34c759;
}

.entry-body {
  flex: 1;
  min-width: 0;
}

.entry-body h3 {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 0.1875rem;
}

.entry-body p {
  font-size: 0.8125rem;
  color: var(--ink-muted);
}

.entry-arrow {
  color: var(--ink-subtle);
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.entry-card:hover .entry-arrow {
  transform: translateX(0.1875rem);
}
</style>
