<script setup lang="ts">
interface Experience {
  role_en: string; role_nl: string
  company: string; date_from: string; date_to: string
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

const experience = computed(() => (config.value?.experience ?? []).map(e => {
  const from = formatMonth(e.date_from)
  const to = e.date_to ? formatMonth(e.date_to) : t.value.about.present
  return {
    role: locale.value === 'nl' ? e.role_nl || e.role_en : e.role_en,
    company: e.company,
    period: from && to ? `${from} – ${to}` : from || to,
    description: locale.value === 'nl' ? e.description_nl || e.description_en : e.description_en,
  }
}))

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
            <template v-if="extraParagraphs.length">
              <p v-for="(para, i) in extraParagraphs" :key="i">{{ para }}</p>
            </template>
          </div>
        </section>

        <!-- Experience -->
        <section v-if="experience.length" class="about-block reveal">
          <div class="block-side">
            <div class="block-label">{{ t.about.experienceTitle }}</div>
          </div>
          <div class="block-content">
            <div v-for="(exp, i) in experience" :key="i" class="exp-entry">
              <div class="exp-header">
                <div class="exp-role">{{ exp.role }}</div>
                <div class="exp-period">{{ exp.period }}</div>
              </div>
              <div class="exp-company">{{ exp.company }}</div>
              <p v-if="exp.description" class="exp-desc">{{ exp.description }}</p>
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

        <!-- CV download -->
        <section class="about-block reveal">
          <div class="block-side">
            <div class="block-label">CV</div>
          </div>
          <div class="block-content">
            <a v-if="cvUrl" :href="cvUrl" download class="btn-cv">{{ t.about.downloadCv }}</a>
            <p v-else class="no-cv">CV not yet available.</p>
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
}

.page-title :deep(em) { font-style: italic; color: var(--accent); }

/* Body layout */
.about-body { display: flex; flex-direction: column; }

.about-block {
  display: grid;
  grid-template-columns: 180px 1fr;
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
}

.block-content { display: flex; flex-direction: column; gap: 1rem; }
.block-content p { font-size: 0.9rem; line-height: 1.8; }

/* Experience */
.exp-entry { padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
.exp-entry:last-child { border-bottom: none; padding-bottom: 0; }

.exp-header { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; margin-bottom: 0.25rem; }

.exp-role { font-family: var(--display); font-size: 1.1rem; color: var(--white); font-weight: 700; }
.exp-period { font-family: var(--mono); font-size: 0.6rem; color: var(--accent); letter-spacing: 0.1em; flex-shrink: 0; }
.exp-company { font-family: var(--mono); font-size: 0.65rem; color: var(--text); letter-spacing: 0.1em; margin-bottom: 0.75rem; }
.exp-desc { font-size: 0.85rem; line-height: 1.7; }

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

/* CV */
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
.btn-cv:hover { background: transparent; color: var(--accent); }

.no-cv { font-family: var(--mono); font-size: 0.65rem; color: var(--text); letter-spacing: 0.1em; }

@media (max-width: 768px) {
  .about-page { padding: 8rem 1.5rem 4rem; }
  .about-block { grid-template-columns: 1fr; gap: 1.5rem; }
  .block-label { position: static; }
  .exp-header { flex-direction: column; gap: 0.25rem; }
}
</style>
