<template>
  <div class="style-preview">
    <div class="bg-ambient"></div>
    <div class="content">
      <h1 class="title">选择角色风格</h1>

      <div class="styles-grid">
        <!-- Style A: Geometric Minimal -->
        <div class="style-card" @click="selectStyle('geometric')">
          <div class="style-preview-area">
            <div class="char-row">
              <MbtiCharacters v-for="t in allTypes" :key="'geo-'+t" :type="t" :size="48" :show-labels="false" char-style="geometric" />
            </div>
          </div>
        </div>

        <!-- Style B: Line Art -->
        <div class="style-card" @click="selectStyle('lineart')">
          <div class="style-preview-area">
            <div class="char-row">
              <MbtiCharacters v-for="t in allTypes" :key="'line-'+t" :type="t" :size="48" :show-labels="false" char-style="lineart" />
            </div>
          </div>
        </div>

        <!-- Style C: Bold Icon -->
        <div class="style-card" @click="selectStyle('bold')">
          <div class="style-preview-area">
            <div class="char-row">
              <MbtiCharacters v-for="t in allTypes" :key="'bold-'+t" :type="t" :size="48" :show-labels="false" char-style="bold" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { defineAsyncComponent } from 'vue'

const MbtiCharacters = defineAsyncComponent(() =>
  import('../components/ui/MbtiCharacters.vue').then(m => m.default)
)

type MbtiCharacterType = 'dreamer' | 'leader' | 'analyst' | 'explorer' | 'connector'

const router = useRouter()
const allTypes: MbtiCharacterType[] = ['dreamer', 'leader', 'analyst', 'explorer', 'connector']

function selectStyle(style: string) {
  localStorage.setItem('mbti-char-style', style)
  router.push('/')
}
</script>

<style scoped>
.style-preview {
  height: 100dvh;
  background: var(--canvas);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.25rem;
  position: relative;
  overflow: hidden;
}
.bg-ambient { z-index: 0; position: absolute; inset: 0; pointer-events: none; }
.content { position: relative; z-index: 1; text-align: center; max-width: 25rem; width: 100%; }
.title { font-size: 1.5rem; font-weight: 700; color: var(--ink); margin-bottom: 2rem; }
.styles-grid { display: flex; flex-direction: column; gap: 1rem; }
.style-card {
  background: var(--surface-1);
  border: 1px solid var(--hairline-soft);
  border-radius: var(--rounded-xl);
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
  text-align: center;
}
.style-card:active { transform: scale(0.97); }
.style-card:hover { box-shadow: var(--shadow-md); border-color: var(--accent-blue); }
.style-preview-area { background: var(--surface-2); border-radius: var(--rounded-lg); padding: 1rem 0.5rem; overflow: hidden; }
.style-preview-area svg { width: 100%; height: auto; display: block; }
.char-row { display: flex; justify-content: center; align-items: flex-end; gap: 0.5rem; }
.style-desc { font-size: 0.75rem; color: var(--ink-muted); }
</style>
