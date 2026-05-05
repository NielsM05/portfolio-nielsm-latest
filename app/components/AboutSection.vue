<script setup lang="ts">
interface ExperienceEntry {
  role_en: string; role_nl: string
  company: string; date_from: string; date_to: string
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

const experience = computed(() =>
  [...(config.value?.experience ?? [])].map(e => {
    const from = formatMonth(e.date_from)
    const to = e.date_to ? formatMonth(e.date_to) : t.value.about.present
    return {
      role: locale.value === 'nl' ? e.role_nl || e.role_en : e.role_en,
      company: e.company,
      period: from && to ? `${from} – ${to}` : from || to,
      description: locale.value === 'nl' ? e.description_nl || e.description_en : e.description_en,
    }
  })
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
    <div v-if="experience.length" class="timeline-wrap reveal">
      <div class="timeline-label">{{ t.about.experienceTitle }}</div>
      <div class="timeline">
        <div v-for="(exp, i) in experience" :key="i" class="timeline-entry">
          <div class="tl-left">
            <span class="tl-period">{{ exp.period }}</span>
          </div>
          <div class="tl-spine">
            <div class="tl-dot" />
            <div v-if="i < experience.length - 1" class="tl-line" />
          </div>
          <div class="tl-right">
            <div class="tl-role">{{ exp.role }}</div>
            <div class="tl-company">{{ exp.company }}</div>
            <p v-if="exp.description" class="tl-desc">{{ exp.description }}</p>
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

.timeline-label {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin-bottom: 3rem;
}

.timeline { display: flex; flex-direction: column; }

.timeline-entry {
  display: grid;
  grid-template-columns: 120px 2rem 1fr;
  gap: 0 1.5rem;
  min-height: 5rem;
}

.tl-left {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.15rem;
}

.tl-period {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.tl-spine {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tl-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
  margin-top: 0.15rem;
}

.tl-line {
  width: 1px;
  flex: 1;
  background: var(--border);
  margin-top: 0.4rem;
  margin-bottom: 0;
  min-height: 2rem;
}

.tl-right { padding-bottom: 3rem; }

.tl-role {
  font-family: var(--display);
  font-size: 1.2rem;
  color: var(--white);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0.3rem;
}

.tl-company {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--text);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.tl-desc { font-size: 0.85rem; line-height: 1.7; }

@media (max-width: 768px) {
  #about { padding: 4rem 1.5rem; }
  .about-cols { grid-template-columns: 1fr; gap: 2.5rem; }
  .about-hero-text { margin-bottom: 2.5rem; }

  .timeline-entry { grid-template-columns: 80px 1.5rem 1fr; gap: 0 1rem; }
  .tl-period { font-size: 0.55rem; }
  .tl-role { font-size: 1rem; }
}
</style>
