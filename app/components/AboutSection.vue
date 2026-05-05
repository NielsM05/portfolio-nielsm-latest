<script setup lang="ts">
interface ExperienceEntry {
  role_en: string; role_nl: string
  company: string; date_from: string; date_to: string; tag: string
  description_en: string; description_nl: string
}

interface Config {
  cv_url?: string
  experience?: ExperienceEntry[]
}

const { locale, t } = useLocale()
const { formatMonth } = useFormatMonth()

const certifications = [
  { name: 'SEC0 - TryHackMe', year: '2026' },
  { name: 'SEC1 - TryHackMe', year: '2026' },
  { name: 'Cybersecurity Bachelor (in progress) - Howest', year: '2023-2026' },
]

const { data: config } = await useFetch<Config>('/api/config')

const cvUrl = computed(() => config.value?.cv_url ?? '')

const allExperience = computed(() =>
  [...(config.value?.experience ?? [])].map(e => {
    const from = formatMonth(e.date_from)
    const to = e.date_to ? formatMonth(e.date_to) : t.value.about.present
    return {
      role: locale.value === 'nl' ? e.role_nl || e.role_en : e.role_en,
      company: e.company,
      period: from && to ? `${from} – ${to}` : from || to,
      tag: e.tag || '',
      description: locale.value === 'nl' ? e.description_nl || e.description_en : e.description_en,
    }
  })
)

const availableTags = computed(() => [...new Set(allExperience.value.map(e => e.tag).filter(Boolean))])
const activeTag = ref('')
const experience = computed(() =>
  activeTag.value ? allExperience.value.filter(e => e.tag === activeTag.value) : allExperience.value
)
</script>

<template>
  <section id="about">
    <p class="about-hero-text reveal" v-html="t.about.intro" />

    <div class="about-cols reveal">
      <div>
        <p>{{ t.about.p1 }}</p>
        <p>{{ t.about.p2 }}</p>

        <div class="about-actions">
          <NuxtLink to="/about" class="btn-outline">{{ t.about.learnMore }}</NuxtLink>
          <a
            :href="cvUrl || undefined"
            :download="cvUrl ? true : undefined"
            class="btn-cv"
            :class="{ disabled: !cvUrl }"
            :aria-disabled="!cvUrl"
            @click.prevent="cvUrl ? undefined : null"
          >{{ t.about.downloadCv }}</a>
        </div>
      </div>

      <div>
        <div class="cert-list">
          <div v-for="cert in certifications" :key="cert.name" class="cert-entry">
            <span class="cert-entry-name">{{ cert.name }}</span>
            <span class="cert-entry-yr">{{ cert.year }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline -->
    <div v-if="allExperience.length" class="timeline-wrap reveal">
      <div class="timeline-header">
        <div class="timeline-label">{{ t.about.experienceTitle }}</div>
        <div v-if="availableTags.length" class="tl-filters">
          <button
            class="tl-filter-btn"
            :class="{ active: activeTag === '' }"
            @click="activeTag = ''"
          >Alles</button>
          <button
            v-for="tag in availableTags"
            :key="tag"
            class="tl-filter-btn"
            :class="{ active: activeTag === tag }"
            @click="activeTag = tag"
          >{{ tag }}</button>
        </div>
      </div>

      <div class="tl-scroll">
        <div class="tl-track">
          <div class="tl-rail" />
          <div v-for="(exp, i) in experience" :key="i" class="tl-entry">
            <div class="tl-dot" />
            <div class="tl-card">
              <div class="tl-period">{{ exp.period }}</div>
              <div class="tl-role">{{ exp.role }}</div>
              <div class="tl-company">{{ exp.company }}</div>
              <span v-if="exp.tag" class="tl-tag">{{ exp.tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
#about {
  padding: 8rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

.about-hero-text {
  font-family: var(--display);
  font-size: clamp(1.8rem, 4vw, 3.5rem);
  color: var(--white);
  line-height: 1.2;
  font-weight: 700;
  max-width: 800px;
  margin-bottom: 4rem;
}
.about-hero-text :deep(em) { color: var(--accent); font-style: italic; }

.about-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
}
.about-cols p { font-size: 0.9rem; line-height: 1.8; margin-bottom: 1rem; }

.about-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.btn-outline {
  font-family: var(--mono);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border);
  color: var(--text);
  text-decoration: none;
  transition: border-color 0.2s, color 0.2s;
}
.btn-outline:hover { border-color: var(--white); color: var(--white); }

.btn-cv {
  font-family: var(--mono);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.75rem 1.5rem;
  background: var(--accent);
  color: var(--white);
  text-decoration: none;
  border: 1px solid var(--accent);
  transition: background 0.2s, color 0.2s;
}
.btn-cv:hover:not(.disabled) { background: transparent; color: var(--accent); }
.btn-cv.disabled {
  opacity: 0.35;
  cursor: not-allowed;
  pointer-events: none;
}

.cert-list { margin-top: 0.5rem; }
.cert-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.85rem;
  gap: 1rem;
}
.cert-entry:first-child { border-top: 1px solid var(--border); }
.cert-entry-name { color: var(--white); }
.cert-entry-yr { font-family: var(--mono); font-size: 0.65rem; color: var(--accent); flex-shrink: 0; }

/* Timeline */
.timeline-wrap {
  margin-top: 6rem;
  padding-top: 4rem;
  border-top: 1px solid var(--border);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.timeline-label {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.25em;
  text-transform: uppercase;
}

.tl-filters { display: flex; gap: 0.5rem; flex-wrap: wrap; }

.tl-filter-btn {
  font-family: var(--mono);
  font-size: 0.55rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.4rem 0.9rem;
  border: 1px solid var(--border);
  background: none;
  color: var(--text);
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}
.tl-filter-btn:hover { border-color: var(--accent); color: var(--accent); }
.tl-filter-btn.active { background: var(--accent); border-color: var(--accent); color: var(--white); }

/* Horizontal scroll track */
.tl-scroll {
  overflow-x: auto;
  padding-bottom: 1rem;
  -webkit-overflow-scrolling: touch;
}

.tl-track {
  display: flex;
  align-items: flex-start;
  position: relative;
  min-width: max-content;
  padding-top: 1rem;
}

.tl-rail {
  position: absolute;
  top: 1.55rem;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border);
  z-index: 0;
}

.tl-entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 220px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.tl-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
  margin-bottom: 1.25rem;
  box-shadow: 0 0 0 3px var(--bg);
}

.tl-card {
  width: 100%;
  padding: 0 1.25rem;
  text-align: left;
}

.tl-period {
  font-family: var(--mono);
  font-size: 0.55rem;
  color: var(--accent);
  letter-spacing: 0.1em;
  margin-bottom: 0.6rem;
  line-height: 1.4;
}

.tl-role {
  font-family: var(--display);
  font-size: 1rem;
  color: var(--white);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0.3rem;
}

.tl-company {
  font-family: var(--mono);
  font-size: 0.55rem;
  color: var(--text);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.tl-tag {
  display: inline-block;
  font-family: var(--mono);
  font-size: 0.5rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.25rem 0.6rem;
  border: 1px solid var(--border);
  color: var(--text);
}

@media (max-width: 768px) {
  #about { padding: 4rem 1.5rem; }
  .about-cols { grid-template-columns: 1fr; gap: 2.5rem; }
  .about-hero-text { margin-bottom: 2.5rem; }
  .timeline-header { flex-direction: column; align-items: flex-start; }
  .tl-entry { width: 180px; }
}
</style>
