<script setup lang="ts">
const props = defineProps<{ modelValue: string; placeholder?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const MONTHS_NL = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec']
const MONTHS_FULL_NL = ['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December']

const isOpen = ref(false)
const pickerRef = ref<HTMLElement>()

const currentYear = new Date().getFullYear()
const viewYear = ref(
  props.modelValue ? parseInt(props.modelValue.split('-')[0]) : currentYear
)

const selectedYear = computed(() => props.modelValue ? parseInt(props.modelValue.split('-')[0]) : null)
const selectedMonth = computed(() => props.modelValue ? parseInt(props.modelValue.split('-')[1]) : null)

const displayLabel = computed(() => {
  if (!props.modelValue) return props.placeholder ?? 'Selecteer maand'
  const [y, m] = props.modelValue.split('-')
  return `${MONTHS_FULL_NL[parseInt(m) - 1]} ${y}`
})

function select(monthIndex: number) {
  const mm = String(monthIndex + 1).padStart(2, '0')
  emit('update:modelValue', `${viewYear.value}-${mm}`)
  isOpen.value = false
}

function clear() {
  emit('update:modelValue', '')
  isOpen.value = false
}

function toggle() { isOpen.value = !isOpen.value }

onClickOutside(pickerRef, () => { isOpen.value = false })
</script>

<template>
  <div ref="pickerRef" class="myp-wrap">
    <button type="button" class="myp-trigger" @click="toggle">
      <span :class="{ placeholder: !modelValue }">{{ displayLabel }}</span>
      <span class="myp-arrow">{{ isOpen ? '▲' : '▼' }}</span>
    </button>

    <div v-if="isOpen" class="myp-panel">
      <div class="myp-year-nav">
        <button type="button" class="myp-nav-btn" @click="viewYear--">‹</button>
        <span class="myp-year">{{ viewYear }}</span>
        <button type="button" class="myp-nav-btn" @click="viewYear++">›</button>
      </div>

      <div class="myp-months">
        <button
          v-for="(m, i) in MONTHS_NL"
          :key="i"
          type="button"
          class="myp-month"
          :class="{ active: selectedYear === viewYear && selectedMonth === i + 1 }"
          @click="select(i)"
        >{{ m }}</button>
      </div>

      <button v-if="modelValue" type="button" class="myp-clear" @click="clear">Wis selectie</button>
    </div>
  </div>
</template>

<style scoped>
.myp-wrap { position: relative; width: 100%; }

.myp-trigger {
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
.myp-trigger:focus { outline: none; border-color: var(--accent); }
.myp-trigger .placeholder { color: var(--text); }
.myp-arrow { font-size: 0.5rem; color: var(--text); flex-shrink: 0; margin-left: 0.5rem; }

.myp-panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--surface);
  border: 1px solid var(--accent);
  z-index: 200;
  padding: 1rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}

.myp-year-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.myp-year {
  font-family: var(--mono);
  font-size: 0.75rem;
  color: var(--white);
  letter-spacing: 0.1em;
}

.myp-nav-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text);
  cursor: pointer;
  width: 1.8rem;
  height: 1.8rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s, color 0.2s;
}
.myp-nav-btn:hover { border-color: var(--accent); color: var(--accent); }

.myp-months {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  margin-bottom: 0.5rem;
}

.myp-month {
  background: none;
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--mono);
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  padding: 0.4rem 0;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
  text-transform: uppercase;
}
.myp-month:hover { border-color: var(--accent); color: var(--white); }
.myp-month.active { background: var(--accent); border-color: var(--accent); color: var(--white); }

.myp-clear {
  width: 100%;
  background: none;
  border: none;
  color: var(--text);
  font-family: var(--mono);
  font-size: 0.55rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  padding: 0.35rem 0;
  border-top: 1px solid var(--border);
  margin-top: 0.25rem;
  transition: color 0.2s;
}
.myp-clear:hover { color: var(--accent); }
</style>
