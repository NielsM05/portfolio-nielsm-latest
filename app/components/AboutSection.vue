<script setup lang="ts">
const { t } = useLocale()

const certifications = [
  { name: 'SEC0 - TryHackMe', year: '2026' },
  { name: 'SEC1 - TryHackMe', year: '2026' },
  { name: 'Cybersecurity Bachelor (in progress) - Howest', year: '2023-2026' },
]

const { data: config } = await useFetch<{ cv_url?: string }>('/api/config')
const cvUrl = computed(() => config.value?.cv_url ?? '')
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
.btn-cv.disabled { opacity: 0.35; cursor: not-allowed; pointer-events: none; }

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

@media (max-width: 768px) {
  #about { padding: 4rem 1.5rem; }
  .about-cols { grid-template-columns: 1fr; gap: 2.5rem; }
  .about-hero-text { margin-bottom: 2.5rem; }
}
</style>
