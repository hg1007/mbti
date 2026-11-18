<template>
  <div class="chapter-intro" :class="chapter.gradient">
    <div class="chapter-content">
      <div class="chapter-emoji-wrapper">
        <span class="chapter-emoji">{{ chapter.emoji }}</span>
      </div>

      <div class="chapter-info">
        <span class="chapter-number">Chapter {{ chapterIndex + 1 }} / 4</span>
        <h1 class="chapter-title text-display-xl">{{ chapter.title }}</h1>
        <p class="chapter-subtitle text-headline">{{ chapter.subtitle }}</p>
        <p class="chapter-description text-body-lg">{{ chapter.description }}</p>
      </div>

      <button class="start-chapter-btn" @click="startChapter">
        <span>开始答题</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>

      <div class="progress-dots">
        <div
          v-for="i in 4"
          :key="i"
          class="dot"
          :class="{ active: i <= chapterIndex + 1, current: i === chapterIndex + 1 }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'
import { getChapters } from '../../data/dataLoader'

const props = defineProps<{
  chapterIndex: number
}>()

const emit = defineEmits<{
  (e: 'start'): void
}>()

const chapter = getChapters()[props.chapterIndex]

function startChapter() {
  emit('start')
}

onMounted(() => {
  const tl = gsap.timeline()

  tl.from('.chapter-emoji-wrapper', {
    scale: 0,
    opacity: 0,
    duration: 0.6,
    ease: 'back.out(1.7)'
  })

  tl.from('.chapter-number', {
    y: 20,
    opacity: 0,
    duration: 0.4,
    ease: 'power2.out'
  }, '-=0.2')

  tl.from('.chapter-title', {
    y: 30,
    opacity: 0,
    duration: 0.5,
    ease: 'power3.out'
  }, '-=0.2')

  tl.from('.chapter-subtitle', {
    y: 20,
    opacity: 0,
    duration: 0.4,
    ease: 'power2.out'
  }, '-=0.2')

  tl.from('.chapter-description', {
    y: 20,
    opacity: 0,
    duration: 0.4,
    ease: 'power2.out'
  }, '-=0.2')

  tl.from('.start-chapter-btn', {
    scale: 0.8,
    opacity: 0,
    duration: 0.5,
    ease: 'back.out(1.7)'
  }, '-=0.2')

  tl.from('.progress-dots .dot', {
    scale: 0,
    opacity: 0,
    stagger: 0.1,
    duration: 0.3,
    ease: 'back.out(1.7)'
  }, '-=0.3')
})
</script>

<style scoped>
.chapter-intro {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.chapter-content {
  max-width: 420px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.chapter-emoji-wrapper {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.chapter-emoji {
  font-size: 64px;
}

.chapter-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chapter-number {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.chapter-title {
  color: white;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.chapter-subtitle {
  color: rgba(255, 255, 255, 0.9);
}

.chapter-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.start-chapter-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  background: white;
  color: var(--canvas);
  border-radius: var(--rounded-pill);
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  margin-top: 16px;
}

.start-chapter-btn:active {
  transform: scale(0.95);
}

.start-chapter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
}

.progress-dots {
  display: flex;
  gap: 8px;
  margin-top: 24px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.dot.active {
  background: white;
}

.dot.current {
  width: 24px;
  border-radius: var(--rounded-pill);
}
</style>
