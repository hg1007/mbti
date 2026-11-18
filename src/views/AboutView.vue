<template>
  <div class="about-view">
    <div class="bg-ambient"></div>

    <!-- Top Bar -->
    <div class="top-bar">
      <button class="back-btn" @click="router.push('/')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <span class="page-title">关于 MBTI</span>
      <div style="width:36px"></div>
    </div>

    <div class="content">
      <!-- Hero -->
      <section class="about-hero animate-in" style="--delay: 0.1s">
        <div class="about-icon-row">
          <span class="about-icon">🧠</span>
          <span class="about-icon">📖</span>
          <span class="about-icon">🔬</span>
        </div>
        <h1 class="about-title">什么是 MBTI？</h1>
        <p class="about-subtitle">Myers-Briggs 性格类型指标</p>
      </section>

      <!-- Introduction -->
      <section class="section animate-in" style="--delay: 0.2s">
        <div class="card surface-card">
          <p class="card-text">
            MBTI 是全球使用最广泛的性格评估工具之一，基于心理学家<b>卡尔·荣格</b>的人格理论发展而来。
            它通过四个维度来描述你的性格偏好，帮助你了解自己在能量来源、信息获取、决策方式和生活方式上的倾向。
          </p>
          <p class="card-text">
            目前已有超过 <b>5000 万人</b>使用过 MBTI 测试，广泛应用于职业规划、团队建设、人际关系改善等领域。
          </p>
        </div>
      </section>

      <!-- 4 Dimensions Explained -->
      <section class="section animate-in" style="--delay: 0.3s">
        <h2 class="sec-title">四个维度详解</h2>
        <div class="dim-explain-list">
          <div v-for="ch in chapters" :key="ch.id" class="dim-explain-card" :style="{ background: ch.bgColor }">
            <div class="dim-explain-header">
              <span class="dim-explain-emoji">{{ ch.emoji }}</span>
              <div>
                <div class="dim-explain-title">{{ ch.title }}</div>
                <div class="dim-explain-subtitle">{{ ch.subtitle }}</div>
              </div>
            </div>
            <p class="dim-explain-desc">{{ ch.description }}</p>
          </div>
        </div>
      </section>

      <!-- Tips -->
      <section class="section animate-in" style="--delay: 0.5s">
        <h2 class="sec-title">测试小贴士</h2>
        <div class="card surface-card">
          <div class="tip-list">
            <div class="tip-item">
              <span class="tip-icon">💡</span>
              <span>选择你<b>自然的倾向</b>，而不是你觉得"应该"的</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">⏱️</span>
              <span>不要花太多时间思考，<b>第一反应</b>最准确</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">🎯</span>
              <span>没有"好"或"坏"的类型，每种性格都有独特优势</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">🔄</span>
              <span>结果仅供参考，人的性格会随<b>经历和成长</b>而变化</span>
            </div>
          </div>
        </div>
      </section>

      <!-- What you get -->
      <section class="section animate-in" style="--delay: 0.55s">
        <h2 class="sec-title">你将获得什么？</h2>
        <div class="features-grid">
          <div class="feature-card" style="background: rgba(124,108,240,0.08)">
            <span class="feature-icon">📊</span>
            <h4>四维度分析</h4>
            <p>每个倾向的百分比</p>
          </div>
          <div class="feature-card" style="background: rgba(52,199,89,0.08)">
            <span class="feature-icon">💪</span>
            <h4>优势与盲点</h4>
            <p>认识真正的自己</p>
          </div>
          <div class="feature-card" style="background: rgba(255,149,0,0.08)">
            <span class="feature-icon">🎯</span>
            <h4>职业匹配</h4>
            <p>找到适合的方向</p>
          </div>
          <div class="feature-card" style="background: rgba(255,45,85,0.08)">
            <span class="feature-icon">💕</span>
            <h4>关系洞察</h4>
            <p>理解你与他人的互动</p>
          </div>
        </div>
      </section>

      <!-- 16 Types -->
      <section class="section animate-in" style="--delay: 0.6s">
        <h2 class="sec-title">16 种人格类型</h2>
        <div class="types-grid">
          <div
            v-for="p in allTypes"
            :key="p.code"
            class="type-chip"
            :style="{ background: p.bgColor }"
            @click="router.push(`/result/${p.code}`)"
          >
            <span class="chip-emoji">{{ p.emoji }}</span>
            <span class="chip-code" :style="{ color: p.accentColor }">{{ p.code }}</span>
            <span class="chip-name">{{ p.nameCn }}</span>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="section about-cta animate-in" style="--delay: 0.6s">
        <button class="cta-btn" @click="router.push('/')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          返回开始测试
        </button>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getChapters, getPersonalities } from '../data/dataLoader'
import type { Personality } from '../data/personalities'

const router = useRouter()
const chapters = getChapters()
const allTypes: Personality[] = Object.values(getPersonalities())
</script>

<style scoped>
.about-view {
  height: 100dvh;
  background: var(--canvas);
  position: relative;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  transition: background-color 0.3s ease;
  padding-bottom: var(--safe-bottom);
}

.about-view::-webkit-scrollbar {
  width: 0;
  display: none;
}

.bg-ambient { z-index: 0; }

.content {
  position: relative;
  z-index: 1;
  max-width: 33.75rem;
  margin: 0 auto;
  padding: 0 1.25rem;
}

/* Animation */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(1.5rem); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-in {
  animation: slideUp 0.6s ease-out both;
  animation-delay: var(--delay, 0s);
}

/* Top Bar */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(0.75rem + var(--safe-top)) 1.25rem 0.75rem;
  position: relative;
  z-index: 1;
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
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--hairline-soft);
  transition: transform 0.2s;
}
.back-btn:active { transform: scale(0.9); }

.page-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--ink);
}

/* Hero */
.about-hero {
  text-align: center;
  padding: 1.5rem 0 2rem;
}

.about-icon-row {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 2.25rem;
}

.about-title {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: var(--ink);
  margin-bottom: 0.5rem;
}

.about-subtitle {
  font-size: 0.9375rem;
  color: var(--ink-muted);
}

/* Section */
.section { margin-bottom: 1.75rem; }

.sec-title {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: var(--ink);
  margin-bottom: 1rem;
}

.surface-card {
  background: var(--surface-1);
  border: 1px solid var(--hairline-soft);
  border-radius: var(--rounded-xl);
  padding: 1.5rem;
}

.card-text {
  font-size: 0.9375rem;
  line-height: 1.8;
  color: var(--ink-secondary);
  margin-bottom: 0.75rem;
}
.card-text:last-child { margin-bottom: 0; }
.card-text b { color: var(--ink); }

/* Dimension Explanations */
.dim-explain-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dim-explain-card {
  padding: 1.125rem;
  border-radius: var(--rounded-lg);
}

/* Dark mode: override data-driven light backgrounds with tinted transparency */
[data-theme="framer"] .dim-explain-card {
  background: rgba(124,108,240,0.08) !important;
  border: 1px solid rgba(124,108,240,0.15);
}

.dim-explain-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.625rem;
}

.dim-explain-emoji { font-size: 1.75rem; }

.dim-explain-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--ink);
}

.dim-explain-subtitle {
  font-size: 0.75rem;
  color: var(--ink-muted);
}

.dim-explain-desc {
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--ink-secondary);
}

/* Tips */
.tip-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--ink-secondary);
}
.tip-item b { color: var(--ink); }

.tip-icon { font-size: 1.125rem; flex-shrink: 0; }

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.feature-card {
  padding: 1.25rem 1rem;
  border-radius: var(--rounded-lg);
  text-align: center;
}

/* Dark mode: override data-driven light backgrounds with tinted transparency */
[data-theme="framer"] .feature-card {
  background: rgba(52,199,89,0.08) !important;
  border: 1px solid rgba(52,199,89,0.15);
}

.feature-icon {
  font-size: 1.75rem;
  display: block;
  margin-bottom: 0.5rem;
}

.feature-card h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 0.25rem;
}

.feature-card p {
  font-size: 0.75rem;
  color: var(--ink-muted);
}

/* 16 Types Grid */
.types-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.625rem;
}

.type-chip {
  padding: 0.875rem 0.5rem;
  border-radius: var(--rounded-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

/* Dark mode: override data-driven light backgrounds with tinted transparency */
[data-theme="framer"] .type-chip {
  background: rgba(124,108,240,0.08) !important;
  border: 1px solid rgba(124,108,240,0.15);
}

.type-chip:active { transform: scale(0.95); }

.chip-emoji { font-size: 1.5rem; }

.chip-code {
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.chip-name {
  font-size: 0.6875rem;
  color: var(--ink-muted);
}

/* CTA */
.about-cta {
  text-align: center;
  padding: 1rem 0;
  margin-bottom: 0;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: var(--accent-blue);
  color: white;
  border-radius: var(--rounded-pill);
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all 0.2s ease;
}
.cta-btn:active { transform: scale(0.96); }
</style>
