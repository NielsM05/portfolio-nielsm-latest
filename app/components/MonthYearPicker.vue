<script setup lang="ts">
const props = defineProps<{ modelValue: string; placeholder?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const MONTHS_SHORT = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec']
const MONTHS_FULL  = ['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December']

const isOpen = ref(false)
const wrapEl = ref<HTMLElement>()

const viewYear = ref(
  props.modelValue ? parseInt(props.modelValue.split('-')[0]) : new Date().getFullYear()
)

const selYear  = computed(() => props.modelValue ? parseInt(props.modelValue.split('-')[0]) : null)
const selMonth = computed(() => props.modelValue ? parseInt(props.modelValue.split('-')[1]) : null)

const label = computed(() => {
  if (!props.modelValue) return props.placeholder ?? 'Selecteer maand'
  const [y, m] = props.modelValue.split('-')
  return `${MONTHS_FULL[parseInt(m) - 1]} ${y}`
})

function pick(i: number) {
  emit('update:modelValue', `${viewYear.value}-${String(i + 1).padStart(2, '0')}`)
  isOpen.value = false
}

function clear() {
  emit('update:modelValue', '')
  isOpen.value = false
}

function onDocClick(e: MouseEvent) {
  if (wrapEl.value && !wrapEl.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

watch(isOpen, (open) => {
  if (open) document.addEventListener('mousedown', onDocClick)
  else document.removeEventListener('mousedown', onDocClick)
})

onBeforeUnmount(() => document.removeEventListener('mousedown', onDocClick))
</script>

<template>
  <div ref="wrapEl" class="myp">
    <button type="button" class="myp-btn" @click="isOpen = !isOpen">
      <span :class="{ dim: !modelValue }">{{ label }}</span>
      <span class="myp-chevron">{{ isOpen ? '▲' : '▼' }}</span>
    </button>

    <div v-if="isOpen" class="myp-panel">
      <div class="myp-nav">
        <button type="button" class="myp-arrow" @click="viewYear--">‹</button>
        <span class="myp-year">{{ viewYear }}</span>
        <button type="button" class="myp-arrow" @click="viewYear++">›</button>
      </div>

      <div class="myp-grid">
        <button
          v-for="(m, i) in MONTHS_SHORT"
          :key="i"
          type="button"
          class="myp-month"
          :class="{ active: selYear === viewYear && selMonth === i + 1 }"
          @click="pick(i)"
        >{{ m }}</button>
      </div>

      <button v-if="modelValue" type="button" class="myp-clear" @click="clear">Wis</button>
    </div>
  </div>
</template>

<style scoped>
.myp { position: relative; width: 100%; }

.myp-btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--white);
  font-family: var(--body);
  font-size: 0.85rem;
  padding: 0.6rem 0.8rem;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s;
}
.myp-btn:focus { outline: none; border-color: var(--accent); }
.myp-btn .dim { color: var(--text); }
.myp-chevron { font-size: 0.5rem; color: var(--text); flex-shrink: 0; margin-left: 0.5rem; }

.myp-panel {
  position: absolute;
  top: calc(100% + 3px);
  left: 0;
  right: 0;
  background: var(--surface);
  border: 1px solid var(--accent);
  z-index: 300;
  padding: 0.85rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
}

.myp-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.6rem;
}

.myp-year {
  font-family: var(--mono);
  font-size: 0.7rem;
  color: var(--white);
  letter-spacing: 0.1em;
}

.myp-arrow {
  background: none;
  border: 1px solid var(--border);
  color: var(--text);
  cursor: pointer;
  width: 1.6rem;
  height: 1.6rem;
  font-size: 1rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s, color 0.15s;
}
.myp-arrow:hover { border-color: var(--accent); color: var(--accent); }

.myp-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3px;
  margin-bottom: 0.5rem;
}

.myp-month {
  background: none;
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--mono);
  font-size: 0.55rem;
  letter-spacing: 0.06em;
  padding: 0.35rem 0;
  cursor: pointer;
  text-transform: uppercase;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.myp-month:hover { border-color: var(--accent); color: var(--white); }
.myp-month.active { background: var(--accent); border-color: var(--accent); color: var(--white); }

.myp-clear {
  width: 100%;
  background: none;
  border: none;
  border-top: 1px solid var(--border);
  color: var(--text);
  font-family: var(--mono);
  font-size: 0.5rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  padding: 0.3rem 0 0;
  margin-top: 0.25rem;
  transition: color 0.15s;
}
.myp-clear:hover { color: var(--accent); }
</style>
