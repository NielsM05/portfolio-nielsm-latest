<script setup lang="ts">
const orbStyle = ref<{ transform?: string }>({})
let rafId: number | null = null

function updateOrb() {
  const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1)
  const progress = Math.min(window.scrollY / maxScroll, 1)
  const xStart = window.innerWidth - 500
  const xEnd = -300
  const x = xStart + progress * (xEnd - xStart)
  const y = -100 + progress * window.innerHeight * 0.4
  orbStyle.value = { transform: `translate(${x}px, ${y}px)` }
}

onMounted(() => {
  updateOrb()
  const onScroll = () => {
    if (rafId !== null) return
    rafId = requestAnimationFrame(() => { updateOrb(); rafId = null })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    if (rafId !== null) cancelAnimationFrame(rafId)
  })
})
</script>

<template>
  <div class="global-orb" :style="orbStyle" />
  <NuxtPage />
</template>

<style>
.global-orb {
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(192, 57, 43, 0.13) 0%, transparent 70%);
  pointer-events: none;
  z-index: -1;
  left: 0;
  top: 0;
  transform: translate(calc(100vw - 500px), -100px);
  will-change: transform;
}

@media (max-width: 768px) {
  .global-orb {
    width: 350px;
    height: 350px;
  }
}
</style>
