<script setup lang="ts">
interface Experience {
  role_en: string; role_nl: string
  company: string; date_from: string; date_to: string; tag: string
  description_en: string; description_nl: string
}

interface Config {
  cv_url?: string
  about_extra_en?: string
  about_extra_nl?: string
  experience?: Experience[]
}

const { locale, t } = useLocale()
const { formatMonth } = useFormatMonth()
useReveal()

const { data: config } = await useFetch<Config>('/api/config')

const cvUrl = computed(() => config.value?.cv_url ?? '')

const extraParagraphs = computed(() => {
  const raw = (locale.value === 'nl' ? config.value?.about_extra_nl : config.value?.about_extra_en) ?? ''
  return raw.split(/\n{2,}/).map(p => p.trim()).filter(Boolean)
})

const allExperience = computed(() =>
  (config.value?.experience ?? []).map(e => {
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

const certifications = [
  { name: 'SEC0 - TryHackMe', year: '2026' },
  { name: 'SEC1 - TryHackMe', year: '2026' },
  { name: 'Cybersecurity Bachelor (in progress) - Howest', year: '2023-2026' },
]
</script>

<template>
  <div>
    <AppNav />
    <main class="about-page">

      <div class="about-header reveal">
        <NuxtLink to="/#about" class="back-link">← {{ t.nav.about }}</NuxtLink>
        <div class="page-eyebrow">{{ t.nav.aboutPage }}</div>
        <h1 class="page-title" v-html="t.about.intro" />
        <div class="header-actions">
          <a
            :href="cvUrl || undefined"
            :download="cvUrl ? true : undefined"
            class="btn-cv"
            :class="{ disabled: !cvUrl }"
          >{{ t.about.downloadCv }}</a>
        </div>
      </div>

      <div class="about-body">

        <!-- Bio -->
        <section class="about-block reveal">
          <div class="block-side">
            <div class="block-label">Bio</div>
          </div>
          <div class="block-content">
            <p>{{ t.about.p1 }}</p>
            <p>{{ t.about.p2 }}</p>
            <p v-for="(para, i) in extraParagraphs" :key="i">{{ para }}</p>
          </div>
        </section>

        <!-- Experience timeline -->
        <section v-if="allExperience.length" class="about-block reveal">
          <div class="block-side">
            <div class="block-label">{{ t.about.experienceTitle }}</div>
            <div v-if="availableTags.length" class="tl-filters">
              <button
                class="tl-filter"
                :class="{ active: activeTag === '' }"
                @click="activeTag = ''"
              >Alles</button>
              <button
                v-for="tag in availableTags"
                :key="tag"
                class="tl-filter"
                :class="{ active: activeTag === tag }"
                @click="activeTag = tag"
              >{{ tag }}</button>
            </div>
          </div>

          <div class="block-content">
            <div class="timeline">
              <div v-for="(exp, i) in experience" :key="i" class="tl-entry">
                <div class="tl-spine">
                  <div class="tl-dot" />
                  <div v-if="i < experience.length - 1" class="tl-line" />
                </div>
                <div class="tl-body">
                  <div class="tl-period">{{ exp.period }}</div>
                  <div class="tl-role">{{ exp.role }}</div>
                  <div class="tl-company">{{ exp.company }}</div>
                  <span v-if="exp.tag" class="tl-tag">{{ exp.tag }}</span>
                  <p v-if="exp.description" class="tl-desc">{{ exp.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Certifications -->
        <section class="about-block reveal">
          <div class="block-side">
            <div class="block-label">Certifications</div>
          </div>
          <div class="block-content">
            <div v-for="cert in certifications" :key="cert.name" class="cert-entry">
              <span class="cert-name">{{ cert.name }}</span>
              <span class="cert-yr">{{ cert.year }}</span>
            </div>
          </div>
        </section>

      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.about-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 10rem 4rem 8rem;
}

.about-header { margin-bottom: 6rem; }

.back-link {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--text);
  text-decoration: none;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: 2rem;
  transition: color 0.2s;
}
.back-link:hover { color: var(--white); }

.page-eyebrow {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.page-title {
  font-family: var(--display);
  font-size: clamp(2rem, 5vw, 4rem);
  color: var(--white);
  font-weight: 900;
  line-height: 1.1;
  max-width: 800px;
  margin-bottom: 2rem;
}
.page-title :deep(em) { font-style: italic; color: var(--accent); }

.header-actions { margin-top: 1rem; }

.btn-cv {
  display: inline-block;
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
.btn-cv.disabled { opacity: 0.35; cursor: not-allowed; pointer-events: none; }

/* Body layout */
.about-body { display: flex; flex-direction: column; }

.about-block {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 3rem;
  padding: 3rem 0;
  border-top: 1px solid var(--border);
}

.block-side { padding-top: 0.2rem; }

.block-label {
  font-family: var(--mono);
  font-size: 0.55rem;
  color: var(--accent);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  position: sticky;
  top: 7rem;
  margin-bottom: 1.25rem;
}

/* Tag filters (in sidebar) */
.tl-filters {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: sticky;
  top: calc(7rem + 1.5rem);
}

.tl-filter {
  font-family: var(--mono);
  font-size: 0.5rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.35rem 0.6rem;
  border: 1px solid var(--border);
  background: none;
  color: var(--text);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}
.tl-filter:hover { border-color: var(--accent); color: var(--accent); }
.tl-filter.active { background: var(--accent); border-color: var(--accent); color: var(--white); }

.block-content { display: flex; flex-direction: column; gap: 1rem; }
.block-content p { font-size: 0.9rem; line-height: 1.8; }

/* Vertical timeline */
.timeline { display: flex; flex-direction: column; }

.tl-entry {
  display: grid;
  grid-template-columns: 1.5rem 1fr;
  gap: 0 1.25rem;
}

.tl-spine {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0.2rem;
}

.tl-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
  box-shadow: 0 0 0 3px var(--bg);
}

.tl-line {
  width: 1px;
  flex: 1;
  background: var(--border);
  margin-top: 0.4rem;
  min-height: 1.5rem;
}

.tl-body { padding-bottom: 2.5rem; }

.tl-period {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.1em;
  margin-bottom: 0.4rem;
}

.tl-role {
  font-family: var(--display);
  font-size: 1.2rem;
  color: var(--white);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0.25rem;
}

.tl-company {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--text);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 0.6rem;
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
  margin-bottom: 0.75rem;
}

.tl-desc { font-size: 0.85rem; line-height: 1.7; }

/* Certifications */
.cert-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--border);
  gap: 1rem;
}
.cert-entry:first-child { border-top: 1px solid var(--border); }
.cert-name { font-size: 0.9rem; color: var(--white); }
.cert-yr { font-family: var(--mono); font-size: 0.65rem; color: var(--accent); flex-shrink: 0; }

@media (max-width: 768px) {
  .about-page { padding: 8rem 1.5rem 4rem; }
  .about-block { grid-template-columns: 1fr; gap: 1.5rem; }
  .block-label { position: static; }
  .tl-filters { flex-direction: row; flex-wrap: wrap; position: static; }
}
</style>
