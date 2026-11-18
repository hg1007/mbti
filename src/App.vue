<template>
  <router-view v-slot="{ Component, route }">
    <transition
      :name="route.meta.transition || 'fade-up'"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @leave="onLeave"
      mode="out-in"
    >
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import gsap from 'gsap'

function onBeforeEnter(el: Element) {
  gsap.set(el, { opacity: 0 })
}

function onEnter(el: Element, done: () => void) {
  gsap.fromTo(el,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', onComplete: done }
  )
}

function onLeave(el: Element, done: () => void) {
  gsap.to(el, { opacity: 0, y: -20, duration: 0.3, ease: 'power3.in', onComplete: done })
}
</script>
