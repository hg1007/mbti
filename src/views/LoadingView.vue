<template>
  <div class="loading-view">
    <!-- Home Button -->
    <button class="home-btn" @click="goHome" title="返回首页">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    </button>

    <div class="loading-content">
      <!-- Animated Ring -->
      <div class="ring-wrapper">
        <svg class="progress-ring" viewBox="0 0 120 120">
          <circle
            class="ring-bg"
            cx="60" cy="60" r="52"
            fill="none"
            stroke="var(--surface-2)"
            stroke-width="6"
          />
          <circle
            ref="ringRef"
            class="ring-fill"
            cx="60" cy="60" r="52"
            fill="none"
            stroke="url(#gradient)"
            stroke-width="6"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="circumference"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="var(--gradient-violet)" />
              <stop offset="50%" stop-color="var(--gradient-magenta)" />
              <stop offset="100%" stop-color="var(--gradient-coral)" />
            </linearGradient>
          </defs>
        </svg>
        <div class="ring-text">
          <span ref="percentRef" class="percent-number">0</span>
          <span class="percent-sign">%</span>
        </div>
      </div>

      <!-- Status Text -->
      <div class="status-area">
        <transition name="fade" mode="out-in">
          <p :key="statusIndex" class="status-text">
            {{ statusMessages[statusIndex] }}
          </p>
        </transition>
      </div>

      <!-- Dimension indicators -->
      <div class="dimension-indicators">
        <div
          v-for="(dim, i) in dimensions"
          :key="dim.label"
          class="dim-item"
          :class="{ active: activeDim === i }"
        >
          <span class="dim-label">{{ dim.label }}</span>
          <div class="dim-bar">
            <div class="dim-fill" :style="{ width: dim.value + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { useQuizStore } from '../stores/quizStore'

const router = useRouter()
const store = useQuizStore()

function goHome() {
  store.reset()
  sessionStorage.removeItem('mbti-result')
  router.push('/')
}

const ringRef = ref<SVGCircleElement>()
const percentRef = ref<HTMLElement>()

const circumference = 2 * Math.PI * 52

const statusMessages = [
  '正在分析你的性格维度...',
  '计算 E/I 倾向...',
  '分析 S/N 偏好...',
  '评估 T/F 决策方式...',
  '测算 J/P 生活态度...',
  '生成你的性格画像...'
]

const dimensions = ref([
  { label: 'E / I', value: 0 },
  { label: 'S / N', value: 0 },
  { label: 'T / F', value: 0 },
  { label: 'J / P', value: 0 }
])

const statusIndex = ref(0)
const activeDim = ref(-1)

onMounted(() => {
  const ringTimeline = gsap.timeline()

  ringTimeline.to(ringRef.value, {
    strokeDashoffset: 0,
    duration: 3,
    ease: 'power2.inOut'
  })

  const obj = { val: 0 }
  gsap.to(obj, {
    val: 100,
    duration: 3,
    ease: 'power2.inOut',
    onUpdate: () => {
      if (percentRef.value) {
        percentRef.value.textContent = Math.round(obj.val).toString()
      }
    }
  })

  const statusInterval = setInterval(() => {
    if (statusIndex.value < statusMessages.length - 1) {
      statusIndex.value++
    }
  }, 500)

  const dimTimeline = gsap.timeline({ delay: 0.5 })
  dimensions.value.forEach((_, i) => {
    dimTimeline.to({}, {
      duration: 0.1,
      onStart: () => {
        activeDim.value = i
        dimensions.value[i].value = 30 + Math.random() * 50
      }
    })
    dimTimeline.to({}, { duration: 0.5 })
  })

  setTimeout(() => {
    clearInterval(statusInterval)
    const result = sessionStorage.getItem('mbti-result')
    if (result) {
      const { type } = JSON.parse(result)
      router.replace({ path: `/result/${type}/detail`, query: { reveal: 'true' } })
    } else {
      router.replace('/')
    }
  }, 3500)
})
</script>

<style scoped>
.loading-view {
  min-height: 100dvh;
  background: var(--canvas);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  position: relative;
  transition: background-color 0.3s ease;
}

.home-btn {
  position: absolute;
  top: calc(1rem + var(--safe-top));
  left: 1.25rem;
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
  z-index: 10;
}

.home-btn:active {
  transform: scale(0.9);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  max-width: 22.5rem;
  width: 100%;
}

.ring-wrapper {
  position: relative;
  width: 10rem;
  height: 10rem;
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  opacity: 0.3;
}

.ring-fill {
  transition: stroke-dashoffset 0.1s ease;
}

.ring-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.125rem;
}

.percent-number {
  font-size: 2.625rem;
  font-weight: 700;
  letter-spacing: -2px;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

.percent-sign {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--ink-muted);
  margin-top: 0.75rem;
}

.status-area {
  text-align: center;
  min-height: 3rem;
}

.status-text {
  font-size: 1rem;
  color: var(--ink-muted);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.dimension-indicators {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dim-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  opacity: 0.4;
  transition: opacity 0.3s ease;
}

.dim-item.active {
  opacity: 1;
}

.dim-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--ink-muted);
  min-width: 2.25rem;
  letter-spacing: 1px;
}

.dim-bar {
  flex: 1;
  height: 0.25rem;
  background: var(--surface-2);
  border-radius: var(--rounded-full);
  overflow: hidden;
}

.dim-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gradient-violet), var(--gradient-magenta));
  border-radius: var(--rounded-full);
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
