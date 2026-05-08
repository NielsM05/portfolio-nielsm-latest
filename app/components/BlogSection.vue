<script setup lang="ts">
interface BlogPost {
  id: number
  date_en: string; date_nl: string
  title_en: string; title_nl: string
  summary_en: string; summary_nl: string
}

const { locale, t } = useLocale()
const { data: posts } = await useFetch<BlogPost[]>('/api/blog')

const display = computed(() => (posts.value ?? []).slice(0, 3).map(p => ({
  id: p.id,
  date:    p[`date_${locale.value}` as keyof BlogPost] as string    || p.date_en,
  title:   p[`title_${locale.value}` as keyof BlogPost] as string   || p.title_en,
  summary: p[`summary_${locale.value}` as keyof BlogPost] as string || p.summary_en,
})))
</script>

<template>
  <section id="blog">
    <div class="blog-inner">
      <div class="blog-top reveal">
        <div>
          <div class="blog-eyebrow">{{ t.blog.eyebrow }}</div>
          <h2 class="blog-title">{{ t.blog.title }}<br><em>{{ t.blog.titleEm }}</em></h2>
        </div>
        <p class="blog-sub">{{ t.blog.sub }}</p>
      </div>

      <div class="blog-list">
        <article v-for="post in display" :key="post.id" class="post-card reveal">
          <div class="post-date">{{ post.date }}</div>
          <div class="post-body">
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-summary">{{ post.summary }}</p>
          </div>
          <NuxtLink :to="`/blog/${post.id}`" class="post-link">{{ t.blog.readMore }}</NuxtLink>
        </article>
        <p v-if="!display.length" class="empty">{{ t.blog.empty }}</p>
      </div>

      <div class="blog-footer reveal">
        <NuxtLink to="/blog" class="see-all-link">{{ t.blog.seeAll }}</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
#blog { padding: 8rem 4rem; max-width: 1200px; margin: 0 auto; }
.blog-inner { display: flex; flex-direction: column; gap: 5rem; }

.blog-top { display: flex; justify-content: space-between; align-items: flex-end; }

.blog-eyebrow {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.blog-title { font-family: var(--display); font-size: clamp(2.5rem, 6vw, 5rem); color: var(--white); font-weight: 900; line-height: 0.9; }
.blog-title em { font-style: italic; color: var(--accent); }

.blog-sub { max-width: 300px; font-size: 0.85rem; line-height: 1.7; text-align: right; }

.blog-list { display: flex; flex-direction: column; gap: 1px; }

.post-card {
  display: grid;
  grid-template-columns: 200px 1fr auto;
  align-items: center;
  gap: 2rem;
  padding: 2.5rem 0;
  border-bottom: 1px solid var(--border);
  transition: border-color 0.3s;
}

.post-card:first-child { border-top: 1px solid var(--border); }
.post-card:hover { border-color: var(--accent); }

.post-date { font-family: var(--mono); font-size: 0.65rem; color: var(--text); }

.post-title { font-family: var(--display); font-size: 1.25rem; color: var(--white); font-weight: 700; margin-bottom: 0.5rem; line-height: 1.3; }
.post-summary { font-size: 0.85rem; line-height: 1.7; }

.post-link { font-family: var(--mono); font-size: 0.6rem; color: var(--accent); text-decoration: none; letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap; transition: opacity 0.2s; flex-shrink: 0; }
.post-link:hover { opacity: 0.7; }

.empty { font-family: var(--mono); font-size: 0.65rem; color: var(--text); letter-spacing: 0.1em; padding: 2rem 0; border-top: 1px solid var(--border); }

.blog-footer { padding-top: 2.5rem; }

.see-all-link {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--accent);
  text-decoration: none;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--accent);
  padding-bottom: 0.15rem;
  transition: opacity 0.2s;
}

.see-all-link:hover { opacity: 0.7; }

@media (max-width: 768px) {
  #blog { padding: 4rem 1.5rem; }
  .blog-inner { gap: 3rem; }
  .blog-top { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
  .blog-sub { text-align: left; max-width: 100%; }

  .post-card {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1.5rem 0;
  }

  .post-link { margin-top: 0.25rem; }
}
</style>
