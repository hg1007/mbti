import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ThemeMode = 'apple' | 'framer'

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>('apple')

  function init() {
    const saved = localStorage.getItem('mbti-theme') as ThemeMode | null
    if (saved === 'apple' || saved === 'framer') {
      mode.value = saved
    }
    apply()
  }

  function toggle() {
    mode.value = mode.value === 'apple' ? 'framer' : 'apple'
    localStorage.setItem('mbti-theme', mode.value)
    apply()
  }

  function apply() {
    document.documentElement.setAttribute('data-theme', mode.value)
  }

  return { mode, init, toggle, apply }
})
