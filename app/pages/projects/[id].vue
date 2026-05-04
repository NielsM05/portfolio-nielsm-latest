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

      <section v-if="project!.collaborators?.length" class="detail-section">
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

      <section v-if="project!.photos?.length" class="detail-section">
        <h2 class="detail-section-label">{{ t.project.photos }}</h2>
        <div class="photos-grid">
          <a
            v-for="(photo, i) in project!.photos"
            :key="i"
            :href="photo"
            target="_blank"
            rel="noopener"
            class="photo-link"
          >
            <img :src="photo" :alt="`${display!.title} ${i + 1}`" class="photo-img" />
          </a>
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
    </main>

    <AppFooter />
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

.collab-li {
  font-family: var(--mono);
  font-size: 0.55rem;
  color: var(--accent);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1px;
}

.photo-link {
  display: block;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  background: var(--surface);
}

.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.photo-link:hover .photo-img { transform: scale(1.04); }

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
</style>
