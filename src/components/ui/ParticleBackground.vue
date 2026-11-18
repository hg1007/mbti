<template>
  <div class="particles" aria-hidden="true">
    <span v-for="n in 24" :key="n" class="dot" :style="dotStyle(n)"></span>
  </div>
</template>

<script setup lang="ts">
const colors = ['#7c6cf0', '#bf5af2', '#ff9500', '#ff375f', '#34c759', '#ff6482', '#8b7dff', '#d44df0']

function dotStyle(n: number) {
  const size = 3 + (n % 5) * 1.5
  const color = colors[n % colors.length]
  const duration = 12 + (n % 8) * 3
  const delay = -(n * 1.3) % duration
  const startX = (n * 37 + 13) % 100
  const startY = (n * 53 + 7) % 100
  const moveX = ((n * 17) % 40) - 20
  const moveY = ((n * 23) % 40) - 20
  const animName = `float${n % 4}`

  return {
    '--size': `${size}px`,
    '--color': color,
    '--duration': `${duration}s`,
    '--delay': `${delay}s`,
    '--start-x': `${startX}%`,
    '--start-y': `${startY}%`,
    '--glow': `${size * 4}px`,
    animation: `${animName} ${duration}s ease-in-out ${delay}s infinite`,
    left: `${startX}%`,
    top: `${startY}%`,
    width: `${size}px`,
    height: `${size}px`,
    background: color,
    boxShadow: `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}60`
  }
}
</script>

<style scoped>
.particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.dot {
  position: absolute;
  border-radius: 50%;
  opacity: 0.45;
  will-change: transform, opacity;
}

@keyframes float0 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
  25% { transform: translate(30px, -40px) scale(1.3); opacity: 0.65; }
  50% { transform: translate(-20px, -80px) scale(0.8); opacity: 0.2; }
  75% { transform: translate(40px, -30px) scale(1.15); opacity: 0.55; }
}

@keyframes float1 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.25; }
  30% { transform: translate(-40px, 25px) scale(1.2); opacity: 0.6; }
  60% { transform: translate(30px, -50px) scale(0.85); opacity: 0.35; }
  85% { transform: translate(-15px, 35px) scale(1.1); opacity: 0.5; }
}

@keyframes float2 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.35; }
  20% { transform: translate(25px, 35px) scale(0.9); opacity: 0.55; }
  45% { transform: translate(-35px, -20px) scale(1.25); opacity: 0.2; }
  70% { transform: translate(15px, -45px) scale(1.05); opacity: 0.5; }
  90% { transform: translate(-25px, 15px) scale(0.95); opacity: 0.4; }
}

@keyframes float3 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
  35% { transform: translate(-20px, -35px) scale(1.2); opacity: 0.6; }
  55% { transform: translate(40px, 15px) scale(0.85); opacity: 0.25; }
  80% { transform: translate(-10px, 40px) scale(1.1); opacity: 0.45; }
}
</style>
