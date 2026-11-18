<template>
  <div class="quiz-view">
    <!-- Top Bar -->
    <div class="top-bar">
      <button class="back-btn" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <div class="chapter-label">
        <template v-if="isQuick">
          <span class="chapter-emoji-sm">⚡</span>
          <span class="chapter-name">快速测试</span>
          <span class="chapter-sub">随机10题</span>
        </template>
        <template v-else>
          <span class="chapter-emoji-sm">{{ store.currentChapterData?.emoji }}</span>
          <span class="chapter-name">{{ store.currentChapterData?.title }}</span>
          <span class="chapter-sub">{{ store.currentChapterData?.subtitle }}</span>
        </template>
      </div>
    </div>

    <!-- Progress -->
    <div class="progress-area">
      <div class="progress-row">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${store.chapterProgress}%` }"></div>
        </div>
        <span class="progress-num">{{ currentQIndex + 1 }}/{{ totalQ }}</span>
      </div>
      <div v-if="!isQuick" class="overall-bar">
        <div class="overall-fill" :style="{ width: `${store.overallProgress}%` }"></div>
      </div>
    </div>

    <!-- Chapter banner (full mode only) -->
    <transition name="banner-slide">
      <div v-if="showBanner && !isQuick" class="chapter-banner">
        <span class="banner-emoji">{{ store.currentChapterData?.emoji }}</span>
        <div class="banner-info">
          <span class="banner-title">{{ store.currentChapterData?.title }}</span>
          <span class="banner-desc">{{ store.currentChapterData?.description }}</span>
        </div>
      </div>
    </transition>

    <!-- Question -->
    <div class="question-area">
      <transition
        name="q-slide"
      >
        <div class="question-card" :key="store.currentQuestion?.id">
          <div class="q-emoji">{{ store.currentQuestion?.emoji }}</div>
          <h2 class="question-text">{{ store.currentQuestion?.text }}</h2>

          <div class="options">
            <button
              class="option-btn"
              :class="{ selected: store.answers[store.currentQuestion?.id] === 'A' }"
              @click="pick('A')"
            >
              <span class="opt-letter">A</span>
              <span class="opt-text">{{ store.currentQuestion?.optionA }}</span>
            </button>

            <button
              class="option-btn"
              :class="{ selected: store.answers[store.currentQuestion?.id] === 'B' }"
              @click="pick('B')"
            >
              <span class="opt-letter">B</span>
              <span class="opt-text">{{ store.currentQuestion?.optionB }}</span>
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- Bottom -->
    <div class="bottom-bar">
      <div v-if="!isQuick" class="chapter-dots">
        <div v-for="i in 4" :key="i" class="c-dot" :class="{ done: i - 1 < store.currentChapter, active: i - 1 === store.currentChapter }"></div>
      </div>
      <div v-else class="quick-dots">
        <div
          v-for="i in 12"
          :key="i"
          class="q-dot"
          :class="{ done: store.answers[store.quickQuestions[i - 1]?.id], active: i - 1 === currentQIndex }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { useQuizStore } from '../stores/quizStore'

const router = useRouter()
const store = useQuizStore()

const slideDir = ref('slide-left')
const showBanner = ref(true)
const isAutoAdvancing = ref(false)

const isQuick = computed(() => store.mode === 'quick')
const hasAnswer = computed(() => !!store.answers[store.currentQuestion?.id])

const currentQIndex = computed(() => {
  if (isQuick.value) return store.currentIndexInQuick
  return store.currentIndexInChapter
})

const totalQ = computed(() => {
  if (isQuick.value) return store.quickQuestions.length
  return store.chapterQuestions.length
})

const isLast = computed(() => store.isLastChapter && store.isLastQuestionInChapter)

if (!isQuick.value) {
  setTimeout(() => { showBanner.value = false }, 2000)
} else {
  showBanner.value = false
}

function pick(choice: 'A' | 'B') {
  if (isAutoAdvancing.value) return
  store.answer(choice)
  // Haptic feedback
  if (navigator.vibrate) navigator.vibrate(10)
  // Animate the selected option with a satisfying bounce
  gsap.fromTo('.option-btn.selected', { scale: 1.06 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' })
  // Brief pause to feel the selection before transitioning
  isAutoAdvancing.value = true
  setTimeout(() => {
    goNext()
    isAutoAdvancing.value = false
  }, 400)
}

function goNext() {
  if (!hasAnswer.value) return
  if (store.isLastQuestionInChapter) {
    if (store.isLastChapter) {
      finishQuiz()
    } else {
      store.nextQuestion()
      showBanner.value = true
      setTimeout(() => { showBanner.value = false }, 2000)
      slideDir.value = 'slide-left'
    }
  } else {
    slideDir.value = 'slide-left'
    store.nextQuestion()
  }
}

function goBack() {
  if (isQuick.value) {
    if (store.currentIndexInQuick > 0) {
      slideDir.value = 'slide-right'
      store.prevQuestion()
    } else {
      router.push('/')
    }
  } else {
    if (store.currentIndexInChapter > 0) {
      slideDir.value = 'slide-right'
      store.prevQuestion()
    } else if (store.currentChapter > 0) {
      store.prevQuestion()
      showBanner.value = true
      setTimeout(() => { showBanner.value = false }, 2000)
    } else {
      router.push('/')
    }
  }
}

function finishQuiz() {
  const result = store.calculateResult()
  store.isComplete = true
  sessionStorage.setItem('mbti-result', JSON.stringify(result))
  router.push('/loading')
}

function onBeforeEnter(el: Element) {
  gsap.set(el, { opacity: 0, scale: 0.92, y: 20 })
}

function onEnter(el: Element, done: () => void) {
  const tl = gsap.timeline({ onComplete: done })

  // Card entrance with scale and slide
  tl.fromTo(el,
    { x: slideDir.value === 'slide-left' ? 80 : -80, opacity: 0, scale: 0.92, rotation: slideDir.value === 'slide-left' ? -2 : 2 },
    { x: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: 'power3.out' }
  )

  // Staggered entrance for child elements
  const emoji = (el as HTMLElement).querySelector('.q-emoji')
  const text = (el as HTMLElement).querySelector('.question-text')
  const options = (el as HTMLElement).querySelectorAll('.option-btn')

  if (emoji) {
    tl.fromTo(emoji, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.3')
  }
  if (text) {
    tl.fromTo(text, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2')
  }
  if (options.length > 0) {
    tl.fromTo(options, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.08 }, '-=0.25')
  }
}

function onLeave(el: Element, done: () => void) {
  gsap.to(el, {
    x: slideDir.value === 'slide-left' ? -100 : 100,
    opacity: 0,
    scale: 0.88,
    rotation: slideDir.value === 'slide-left' ? 3 : -3,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: done
  })
}
</script>

<style scoped>
.quiz-view {
  min-height: 100dvh;
  background: var(--canvas);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  padding: var(--safe-top) 1.25rem var(--safe-bottom);
  transition: background-color 0.3s ease;
}

.top-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0 0.5rem;
}

.back-btn {
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--rounded-full);
  background: var(--surface-1);
  color: var(--ink);
  flex-shrink: 0;
  transition: transform 0.2s;
}
.back-btn:active { transform: scale(0.9); }

.chapter-label {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.chapter-emoji-sm { font-size: 1.125rem; }

.chapter-name {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--ink);
}

.chapter-sub {
  font-size: 0.75rem;
  color: var(--ink-muted);
  padding: 0.125rem 0.5rem;
  background: var(--surface-2);
  border-radius: var(--rounded-pill);
}

.progress-area {
  padding: 0.5rem 0;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-bar {
  flex: 1;
  height: 0.5rem;
  background: var(--surface-2);
  border-radius: var(--rounded-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gradient-violet), var(--gradient-magenta));
  border-radius: var(--rounded-full);
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-num {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--ink-muted);
  font-variant-numeric: tabular-nums;
  min-width: 2.5rem;
  text-align: right;
}

.overall-bar {
  height: 0.25rem;
  background: var(--surface-2);
  border-radius: var(--rounded-full);
  overflow: hidden;
  margin-top: 0.375rem;
}

.overall-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gradient-violet), var(--gradient-magenta), var(--gradient-orange), var(--gradient-coral));
  border-radius: var(--rounded-full);
  transition: width 0.5s ease;
}

.chapter-banner {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.125rem;
  border-radius: var(--rounded-xl);
  background: var(--surface-1);
  margin-bottom: 0.5rem;
}

.banner-emoji {
  font-size: 1.75rem;
  flex-shrink: 0;
}

.banner-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.banner-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--ink);
}

.banner-desc {
  font-size: 0.75rem;
  color: var(--ink-muted);
}

/* Smooth question slide transition */
.question-area {
  position: relative;
}

.q-slide-enter-active,
.q-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
  top: 50%;
  left: 0;
  right: 0;
  margin: 0 auto;
}

.q-slide-enter-from {
  opacity: 0;
  transform: translateX(30px) translateY(-50%) scale(0.96);
}

.q-slide-enter-to {
  opacity: 1;
  transform: translateX(0) translateY(-50%) scale(1);
}

.q-slide-leave-from {
  opacity: 1;
  transform: translateX(0) translateY(-50%) scale(1);
}

.q-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px) translateY(-50%) scale(0.96);
}

.banner-slide-enter-active { transition: all 0.4s ease; }
.banner-slide-leave-active { transition: all 0.3s ease; }
.banner-slide-enter-from { opacity: 0; transform: translateY(-0.625rem); }
.banner-slide-leave-to { opacity: 0; transform: translateY(-0.625rem); }

.question-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
  overflow: hidden;
}

.question-card {
  width: 100%;
  max-width: 30rem;
}

.q-emoji {
  font-size: 3.25rem;
  text-align: center;
  margin-bottom: 1rem;
}

.question-text {
  font-size: 1.3125rem;
  font-weight: 600;
  line-height: 1.45;
  letter-spacing: -0.4px;
  color: var(--ink);
  text-align: center;
  margin-bottom: 1.75rem;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.125rem 1.25rem;
  background: var(--surface-1);
  border: 2px solid var(--hairline);
  border-radius: var(--rounded-xl);
  text-align: left;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
}

.option-btn:active {
  transform: scale(0.97);
}

.option-btn.selected {
  border-color: var(--gradient-violet);
  background: linear-gradient(135deg, rgba(124,108,240,0.1), rgba(191,90,242,0.05));
}

.option-btn.selected .opt-letter {
  background: var(--gradient-violet);
  color: white;
  border-color: transparent;
}

.opt-letter {
  flex-shrink: 0;
  width: 1.875rem;
  height: 1.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--rounded-md);
  background: var(--surface-2);
  border: 1px solid var(--hairline);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--ink-muted);
  transition: all 0.25s ease;
}

.opt-text {
  font-size: 1rem;
  line-height: 1.5;
  color: var(--ink);
}

.bottom-bar {
  padding: 0.75rem 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.875rem;
}

.chapter-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.c-dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background: var(--surface-3);
  transition: all 0.3s ease;
}

.c-dot.done {
  background: var(--gradient-violet);
}

.c-dot.active {
  width: 1.5rem;
  border-radius: var(--rounded-pill);
  background: linear-gradient(90deg, var(--gradient-violet), var(--gradient-magenta));
}

.quick-dots {
  display: flex;
  justify-content: center;
  gap: 0.375rem;
}

.q-dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background: var(--surface-3);
  transition: all 0.3s ease;
}

.q-dot.done {
  background: var(--gradient-violet);
}

.q-dot.active {
  width: 1.25rem;
  border-radius: var(--rounded-pill);
  background: linear-gradient(90deg, var(--gradient-violet), var(--gradient-magenta));
}

.next-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 18.75rem;
  padding: 1rem 2rem;
  background: var(--ink);
  color: var(--canvas);
  border-radius: var(--rounded-pill);
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.next-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.next-btn:not(:disabled):active {
  transform: scale(0.96);
}

.next-btn svg {
  transition: transform 0.3s ease;
}

.next-btn:not(:disabled):hover svg {
  transform: translateX(3px);
}
</style>
