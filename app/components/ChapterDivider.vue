<script setup lang="ts">
defineProps<{
  num: string
  title: string
}>()
</script>

<template>
  <div class="chapter">
    <span class="chapter-num">{{ num }}</span>
    <span class="chapter-title">{{ title }}</span>
  </div>
</template>

<style scoped>
.chapter {
  border-top: 1px solid var(--border);
  padding: 1.5rem 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chapter-num {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--border);
}

.chapter-title {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--text);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
</style>
