import { ref } from 'vue'
import gsap from 'gsap'

export function useAnimations() {
  const tl = ref<gsap.core.Timeline | null>(null)

  function staggerReveal(targets: gsap.TweenTarget, stagger = 0.1, fromVars: gsap.TweenVars = {}) {
    return gsap.from(targets, {
      opacity: 0,
      y: 40,
      stagger,
      duration: 0.8,
      ease: 'power3.out',
      ...fromVars
    })
  }

  function letterByLetter(element: HTMLElement, text: string, stagger = 0.05) {
    element.innerHTML = ''
    const letters = text.split('')
    letters.forEach((letter) => {
      const span = document.createElement('span')
      span.textContent = letter
      span.style.display = 'inline-block'
      if (letter === ' ') span.style.width = '0.3em'
      element.appendChild(span)
    })

    return gsap.from(element.children, {
      opacity: 0,
      y: 60,
      rotateX: -90,
      stagger,
      duration: 0.8,
      ease: 'back.out(1.7)'
    })
  }

  function scaleIn(target: gsap.TweenTarget, delay = 0) {
    return gsap.from(target, {
      scale: 0.8,
      opacity: 0,
      delay,
      duration: 0.6,
      ease: 'back.out(1.7)'
    })
  }

  function slideIn(target: gsap.TweenTarget, direction: 'left' | 'right' = 'left', duration = 0.6) {
    const x = direction === 'left' ? -100 : 100
    return gsap.from(target, {
      x: `${x}%`,
      opacity: 0,
      duration,
      ease: 'power3.out'
    })
  }

  function pulseGlow(target: gsap.TweenTarget) {
    return gsap.to(target, {
      boxShadow: '0 0 40px rgba(106, 76, 245, 0.6)',
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    })
  }

  function progressBar(target: gsap.TweenTarget, value: number, duration = 0.6) {
    return gsap.to(target, {
      width: `${value}%`,
      duration,
      ease: 'power2.out'
    })
  }

  function countUp(target: HTMLElement, end: number, duration = 2) {
    const obj = { val: 0 }
    return gsap.to(obj, {
      val: end,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        target.textContent = Math.round(obj.val).toString()
      }
    })
  }

  function floatAnimation(target: gsap.TweenTarget, y = -10, duration = 2) {
    return gsap.to(target, {
      y,
      duration,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    })
  }

  function rotateGradient(target: gsap.TweenTarget, duration = 20) {
    return gsap.to(target, {
      rotation: 360,
      duration,
      repeat: -1,
      ease: 'none'
    })
  }

  return {
    staggerReveal,
    letterByLetter,
    scaleIn,
    slideIn,
    pulseGlow,
    progressBar,
    countUp,
    floatAnimation,
    rotateGradient,
    tl
  }
}
