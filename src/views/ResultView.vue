<template>
  <div class="result-view">
    <!-- Top Bar -->
    <div class="result-top-bar">
      <button class="home-btn" @click="goHome" title="返回首页">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </button>
      <button class="theme-toggle-result" @click="themeStore.toggle()" :title="themeStore.mode === 'apple' ? '切换到深色主题' : '切换到浅色主题'">
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

    <div class="result-center">
      <div class="hero-bg-glow"></div>

      <!-- Character -->
      <div class="character-display animate-in" style="--delay: 0.1s">
        <MbtiCharacters :type="charType" :size="160" :show-labels="false" />
      </div>

      <!-- Type Info -->
      <div class="type-info animate-in" style="--delay: 0.3s">
        <span ref="typeRef" class="type-text">{{ personality?.code }}</span>
        <p class="type-english">{{ personality?.nameEn }}</p>
        <h1 class="type-chinese">{{ personality?.nickname }} · {{ personality?.nameCn }}</h1>
        <p class="type-tagline">{{ personality?.tagline }}</p>
        <span class="type-emoji">{{ personality?.emoji }}</span>
      </div>

      <!-- Actions -->
      <div class="actions animate-in" style="--delay: 0.5s">
        <button class="action-btn primary-btn" @click="goDetail">
          查看详细介绍 →
        </button>
        <button v-if="hasQuizResult" class="action-btn secondary-btn" @click="retake">
          重新测试
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import gsap from 'gsap'
import { getPersonalities } from '../data/dataLoader'
import { useQuizStore } from '../stores/quizStore'
import { useThemeStore } from '../stores/themeStore'

const MbtiCharacters = defineAsyncComponent(() =>
  import('../components/ui/MbtiCharacters.vue').then(m => m.default)
)

type MbtiCharacterType = 'dreamer' | 'leader' | 'analyst' | 'explorer' | 'connector'

const route = useRoute()
const router = useRouter()
const store = useQuizStore()
const themeStore = useThemeStore()

const typeRef = ref<HTMLElement>()

const typeCode = computed(() => (route.params.type as string).toUpperCase())
const personalities = getPersonalities()
const personality = computed(() => personalities[typeCode.value])
const hasQuizResult = computed(() => !!sessionStorage.getItem('mbti-result'))

// Map MBTI type to character type
const typeToChar: Record<string, MbtiCharacterType> = {
  INFP: 'dreamer', INFJ: 'dreamer', INTJ: 'dreamer', INTP: 'dreamer',
  ENFJ: 'connector', ENFP: 'connector', ENTP: 'connector', ENTJ: 'connector',
  ISTJ: 'analyst', ISFJ: 'analyst', ISTP: 'analyst', ISFP: 'analyst',
  ESTP: 'explorer', ESFP: 'explorer', ESTJ: 'explorer', ESFJ: 'explorer',
}

const charType = computed<MbtiCharacterType>(() => {
  return typeToChar[typeCode.value] || 'dreamer'
})

function goDetail() {
  router.push(`/result/${typeCode.value}/detail`)
}

function retake() {
  store.reset()
  sessionStorage.removeItem('mbti-result')
  router.push('/')
}

function goHome() {
  store.reset()
  sessionStorage.removeItem('mbti-result')
  router.push('/')
}

onMounted(() => {
  if (typeRef.value && personality.value) {
    const letters = personality.value.code.split('')
    typeRef.value.innerHTML = ''
    letters.forEach((letter) => {
      const span = document.createElement('span')
      span.textContent = letter
      span.style.display = 'inline-block'
      span.style.opacity = '0'
      span.style.transform = 'translateY(40px) scale(0.8)'
      typeRef.value!.appendChild(span)
    })

    gsap.to(typeRef.value.querySelectorAll('span'), {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: 0.15,
      duration: 0.8,
      ease: 'back.out(1.7)',
      delay: 0.3
    })
  }
})
</script>

<style scoped>
.result-view {
  height: 100dvh;
  background: var(--canvas);
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease;
  display: flex;
  flex-direction: column;
}

.result-top-bar {
  position: absolute;
  top: calc(1rem + var(--safe-top));
  left: 1.25rem;
  right: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

.home-btn, .theme-toggle-result {
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
.home-btn:active, .theme-toggle-result:active { transform: scale(0.9); }

.result-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 1.5rem;
  position: relative;
}

.hero-bg-glow {
  position: absolute;
  width: 18.75rem;
  height: 18.75rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gradient-violet), var(--gradient-magenta));
  filter: blur(100px);
  opacity: 0.25;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.character-display {
  position: relative;
  z-index: 1;
  margin-bottom: 1.5rem;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(1.5rem); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-in {
  animation: slideUp 0.6s ease-out both;
  animation-delay: var(--delay, 0s);
}

.type-info {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.type-text {
  font-size: clamp(3.5rem, 16vw, 6rem);
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: -3px;
  color: var(--ink);
}

.type-english {
  font-size: 0.9375rem;
  color: var(--ink-muted);
  font-style: italic;
}

.type-chinese {
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--ink);
  margin-top: 0.125rem;
  white-space: nowrap;
}

.type-tagline {
  font-size: 0.875rem;
  color: var(--ink-muted);
  max-width: 20rem;
  line-height: 1.6;
}

.type-emoji {
  font-size: 2.5rem;
  margin-top: 0.5rem;
}

.actions {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 18rem;
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
.action-btn:active { transform: scale(0.96); }

.primary-btn {
  background: var(--ink);
  color: var(--canvas);
}

.secondary-btn {
  background: var(--surface-1);
  color: var(--ink);
  border: 1px solid var(--hairline);
}
</style>
