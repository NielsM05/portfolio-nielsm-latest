<script setup lang="ts">
interface Collaborator { name: string; linkedinUrl: string }

interface Project {
  id: number
  category_en: string; category_nl: string
  title_en: string;    title_nl: string
  description_en: string; description_nl: string
  content_en: string;  content_nl: string
  externalLink: string
  photos: string[]
  collaborators: Collaborator[]
}

const route = useRoute()
const { locale, t } = useLocale()
const { data: project, error } = await useFetch<Project>(`/api/projects/${route.params.id}`)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

const display = computed(() => {
  const p = project.value
  if (!p) return null
  const l = locale.value
  return {
    category:    p[`category_${l}` as keyof Project] as string    || p.category_en,
    title:       p[`title_${l}` as keyof Project] as string       || p.title_en,
    description: p[`description_${l}` as keyof Project] as string || p.description_en,
    content:     p[`content_${l}` as keyof Project] as string     || p.content_en,
  }
})

// Lightbox
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const photos = computed(() => project.value?.photos ?? [])

function openLightbox(i: number) {
  lightboxIndex.value = i
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

function prev() {
  lightboxIndex.value = (lightboxIndex.value - 1 + photos.value.length) % photos.value.length
}

function next() {
  lightboxIndex.value = (lightboxIndex.value + 1) % photos.value.length
}

function onKey(e: KeyboardEvent) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="detail-wrap">
    <AppNav />

    <main class="detail-main">
      <NuxtLink to="/#projects" class="back-link">{{ t.project.back }}</NuxtLink>

      <header class="detail-header">
        <div class="detail-eyebrow">{{ display!.category }}</div>
        <h1 class="detail-title">{{ display!.title }}</h1>
        <p class="detail-lead">{{ display!.description }}</p>
      </header>

      <section v-if="project!.photos?.length" class="detail-section">
        <h2 class="detail-section-label">{{ t.project.photos }}</h2>
        <div class="photos-grid">
          <button
            v-for="(photo, i) in project!.photos"
            :key="i"
            class="photo-btn"
            @click="openLightbox(i)"
          >
            <img :src="photo" :alt="`${display!.title} ${i + 1}`" class="photo-img" />
          </button>
        </div>
      </section>

      <section v-if="display!.content" class="detail-section">
        <h2 class="detail-section-label">{{ t.project.details }}</h2>
        <div class="detail-content">{{ display!.content }}</div>
      </section>

      <div v-if="project!.externalLink" class="detail-cta">
        <a :href="project!.externalLink" target="_blank" rel="noopener" class="btn btn-red">
          {{ t.project.viewProject }}
        </a>
      </div>

      <section v-if="project!.collaborators?.length" class="detail-section detail-collabs">
        <h2 class="detail-section-label">{{ t.project.collaborators }}</h2>
        <div class="collab-list">
          <a
            v-for="(c, i) in project!.collaborators"
            :key="i"
            :href="c.linkedinUrl || '#'"
            target="_blank"
            rel="noopener"
            class="collab-card"
          >
            <span class="collab-name">{{ c.name }}</span>
            <span class="collab-li">LinkedIn →</span>
          </a>
        </div>
      </section>
    </main>

    <AppFooter />

    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="lightboxOpen" class="lightbox" @click.self="closeLightbox">
        <button class="lb-close" @click="closeLightbox">×</button>

        <button v-if="photos.length > 1" class="lb-arrow lb-prev" @click="prev">‹</button>
        <button v-if="photos.length > 1" class="lb-arrow lb-next" @click="next">›</button>

        <div class="lb-img-wrap">
          <img :src="photos[lightboxIndex]" :alt="`${display!.title} ${lightboxIndex + 1}`" class="lb-img" />
        </div>

        <div v-if="photos.length > 1" class="lb-counter">
          {{ lightboxIndex + 1 }} / {{ photos.length }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.detail-wrap { min-height: 100vh; background: var(--bg); }

.detail-main {
  max-width: 900px;
  margin: 0 auto;
  padding: 6rem 4rem 8rem;
}

.back-link {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--text);
  text-decoration: none;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: color 0.2s;
  display: inline-block;
  margin-bottom: 3rem;
}
.back-link:hover { color: var(--white); }

.detail-header {
  margin-bottom: 4rem;
  padding-bottom: 4rem;
  border-bottom: 1px solid var(--border);
}

.detail-eyebrow {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.detail-title {
  font-family: var(--display);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  color: var(--white);
  font-weight: 900;
  line-height: 1.05;
  margin-bottom: 1.5rem;
}

.detail-lead { font-size: 1rem; line-height: 1.8; max-width: 680px; }

.detail-section { margin-bottom: 3.5rem; }

.detail-section-label {
  font-family: var(--mono);
  font-size: 0.55rem;
  color: var(--accent);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.collab-list { display: flex; flex-wrap: wrap; gap: 0.75rem; }

.collab-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1.25rem;
  border: 1px solid var(--border);
  text-decoration: none;
  transition: border-color 0.2s;
}
.collab-card:hover { border-color: var(--accent); }
.collab-name { font-size: 0.85rem; color: var(--white); }
.collab-li { font-family: var(--mono); font-size: 0.55rem; color: var(--accent); letter-spacing: 0.1em; text-transform: uppercase; }

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1px;
}

.photo-btn {
  display: block;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  background: var(--surface);
  border: none;
  padding: 0;
  cursor: zoom-in;
}

.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}
.photo-btn:hover .photo-img { transform: scale(1.04); }

.detail-content {
  font-size: 0.9rem;
  line-height: 1.9;
  white-space: pre-wrap;
  max-width: 680px;
}

.detail-cta {
  margin-top: 3rem;
  padding-top: 3rem;
  border-top: 1px solid var(--border);
}

.detail-collabs {
  margin-top: 3rem;
  padding-top: 3rem;
  border-top: 1px solid var(--border);
}

.btn {
  display: inline-block;
  font-family: var(--mono);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 1rem 2rem;
  transition: opacity 0.2s;
}
.btn-red { background: var(--accent); color: var(--white); }
.btn-red:hover { opacity: 0.85; }

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(0, 0, 0, 0.96);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lb-img-wrap {
  max-width: 90vw;
  max-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lb-img {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  display: block;
}

.lb-close {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: 1px solid rgba(255,255,255,0.2);
  color: var(--white);
  font-size: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
  line-height: 1;
}
.lb-close:hover { border-color: var(--accent); color: var(--accent); }

.lb-arrow {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: 1px solid rgba(255,255,255,0.2);
  color: var(--white);
  font-size: 1.8rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
  line-height: 1;
}
.lb-arrow:hover { border-color: var(--accent); color: var(--accent); }
.lb-prev { left: 1.5rem; }
.lb-next { right: 1.5rem; }

.lb-counter {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--mono);
  font-size: 0.6rem;
  color: rgba(255,255,255,0.4);
  letter-spacing: 0.15em;
}

@media (max-width: 768px) {
  .detail-main { padding: 4rem 1.5rem 5rem; }
  .back-link { margin-bottom: 2rem; }
  .detail-header { margin-bottom: 2.5rem; padding-bottom: 2.5rem; }
  .detail-section { margin-bottom: 2.5rem; }
  .photos-grid { grid-template-columns: 1fr 1fr; }
  .collab-list { flex-direction: column; }
  .collab-card { width: 100%; }
  .lb-arrow { display: none; }
}
</style>
