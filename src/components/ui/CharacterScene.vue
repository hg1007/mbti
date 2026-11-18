<template>
  <div class="character-scene">
    <MbtiCharacter
      :stroke-color="strokeColor"
      :skin-color="skinColor"
      :hair-color="hairColor"
      :body-color="bodyColor"
      :accent-color="accentColor"
      :hair-style="hairStyle"
      :eye-style="eyeStyle"
      :mouth-style="mouthStyle"
      :pose="pose"
      :accessory="accessory"
      :particles="particles"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MbtiCharacter from './MbtiCharacters.vue'

const props = defineProps<{
  scene?: 'hero' | 'quiz' | 'result' | 'about' | 'loading'
  theme?: 'apple' | 'framer'
}>()

const isDark = computed(() => props.theme === 'framer')

const strokeColor = computed(() => isDark.value ? '#e5e5e5' : '#1d1d1f')
const skinColor = computed(() => isDark.value ? '#d4b896' : '#fce4c8')
const hairColor = computed(() => isDark.value ? '#5a4a3a' : '#4a3728')

const configs = {
  hero: { bodyColor: '#7c6cf0', accentColor: '#bf5af2', hairStyle: 'curly', eyeStyle: 'happy', mouthStyle: 'smile', pose: 'wave', accessory: 'star', particles: true },
  quiz: { bodyColor: '#34c759', accentColor: '#30d158', hairStyle: 'short', eyeStyle: 'open', mouthStyle: 'neutral', pose: 'think', accessory: 'glasses', particles: false },
  result: { bodyColor: '#ff6b8a', accentColor: '#ff2d55', hairStyle: 'long', eyeStyle: 'happy', mouthStyle: 'smile', pose: 'hip', accessory: 'heart', particles: true },
  about: { bodyColor: '#5ac8fa', accentColor: '#0a84ff', hairStyle: 'medium', eyeStyle: 'open', mouthStyle: 'soft', pose: 'stand', accessory: 'book', particles: false },
  loading: { bodyColor: '#ff9f0a', accentColor: '#ffd60a', hairStyle: 'curly', eyeStyle: 'closed', mouthStyle: 'o', pose: 'stand', accessory: 'star', particles: true },
}

const config = computed(() => configs[props.scene || 'hero'])
const bodyColor = computed(() => config.value.bodyColor)
const accentColor = computed(() => config.value.accentColor)
const hairStyle = computed(() => config.value.hairStyle as any)
const eyeStyle = computed(() => config.value.eyeStyle as any)
const mouthStyle = computed(() => config.value.mouthStyle as any)
const pose = computed(() => config.value.pose as any)
const accessory = computed(() => config.value.accessory as any)
const particles = computed(() => config.value.particles)
</script>

<style scoped>
.character-scene {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 120px;
  flex-shrink: 0;
}
</style>
