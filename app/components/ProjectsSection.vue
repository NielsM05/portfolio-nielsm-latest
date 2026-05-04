<script setup lang="ts">
interface Project {
  id: number
  category_en: string; category_nl: string
  title_en: string;    title_nl: string
  description_en: string; description_nl: string
}

const { locale, t } = useLocale()
const { data: projects } = await useFetch<Project[]>('/api/projects')

const display = computed(() => (projects.value ?? []).map(p => ({
  id: p.id,
  category: p[`category_${locale.value}` as keyof Project] as string || p.category_en,
  title:    p[`title_${locale.value}` as keyof Project] as string    || p.title_en,
  description: p[`description_${locale.value}` as keyof Project] as string || p.description_en,
})))
</script>

<template>
  <section id="projects">
    <div
      v-for="(project, i) in display"
      :key="project.id"
      class="proj-editorial reveal"
      :class="{ reverse: i % 2 === 1 }"
    >
      <div class="proj-visual">
        <div class="proj-visual-inner">{{ String(i + 1).padStart(2, '0') }}</div>
      </div>
      <div class="proj-info">
        <div>
          <div class="proj-cat">{{ project.category }}</div>
          <div class="proj-h">{{ project.title }}</div>
          <p class="proj-p">{{ project.description }}</p>
        </div>
        <NuxtLink :to="`/projects/${project.id}`" class="proj-link">{{ t.project.readMore }}</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
#projects {
  padding: 4rem 4rem 8rem;
  max-width: 1200px;
  margin: 0 auto;
}

.proj-editorial {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid var(--border);
  margin-bottom: 1px;
  overflow: hidden;
  transition: border-color 0.3s;
}

.proj-editorial:hover { border-color: var(--accent); }

.proj-editorial.reverse { direction: rtl; }
.proj-editorial.reverse > * { direction: ltr; }

.proj-visual {
  background: var(--surface);
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.proj-visual-inner {
  font-family: var(--display);
  font-size: 8rem;
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 1px rgba(192, 57, 43, 0.2);
  user-select: none;
}

.proj-info {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-left: 1px solid var(--border);
}

.proj-editorial.reverse .proj-info {
  border-left: none;
  border-right: 1px solid var(--border);
}

.proj-cat {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.proj-h {
  font-family: var(--display);
  font-size: 1.8rem;
  color: var(--white);
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.proj-p {
  font-size: 0.85rem;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.proj-link {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--accent);
  text-decoration: none;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.proj-link:hover { text-decoration: underline; }
</style>
