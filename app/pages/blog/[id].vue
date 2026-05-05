<script setup lang="ts">
interface Block {
  type: 'text' | 'image'
  content_en?: string; content_nl?: string
  path?: string
  caption_en?: string; caption_nl?: string
}

interface BlogPost {
  id: number
  date_en: string; date_nl: string
  title_en: string; title_nl: string
  blocks?: Block[]
  content_en?: string; content_nl?: string
  likes?: number
}

interface GiscusConfig {
  giscus_enabled?: boolean
  giscus_repo?: string
  giscus_repo_id?: string
  giscus_category?: string
  giscus_category_id?: string
}

const { locale, t } = useLocale()
const route = useRoute()

const [{ data: post }, { data: giscusCfg }] = await Promise.all([
  useFetch<BlogPost>(`/api/blog/${route.params.id}`),
  useFetch<GiscusConfig>('/api/config'),
])

if (!post.value) throw createError({ statusCode: 404, fatal: true })

const display = computed(() => ({
  date:  post.value![`date_${locale.value}` as keyof BlogPost] as string  || post.value!.date_en,
  title: post.value![`title_${locale.value}` as keyof BlogPost] as string || post.value!.title_en,
}))

const blocks = computed<Block[]>(() => {
  if (post.value!.blocks?.length) return post.value!.blocks!
  const content = locale.value === 'nl'
    ? (post.value!.content_nl || post.value!.content_en || '')
    : (post.value!.content_en || '')
  return content.split(/\n{2,}/).map(p => p.trim()).filter(Boolean)
    .map(p => ({ type: 'text' as const, content_en: p, content_nl: p }))
})

const likes = ref(post.value!.likes ?? 0)
const liked = ref(false)

onMounted(() => {
  liked.value = !!localStorage.getItem(`liked_post_${post.value!.id}`)
})

async function likePost() {
  if (liked.value) return
  const { likes: newCount } = await $fetch<{ likes: number }>(`/api/blog/${post.value!.id}/like`, { method: 'POST' })
  likes.value = newCount
  liked.value = true
  localStorage.setItem(`liked_post_${post.value!.id}`, '1')
}

const giscusEl = ref<HTMLElement | null>(null)

onMounted(() => {
  const cfg = giscusCfg.value
  if (!cfg?.giscus_enabled || !cfg?.giscus_repo) return
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', cfg.giscus_repo)
  script.setAttribute('data-repo-id', cfg.giscus_repo_id ?? '')
  script.setAttribute('data-category', cfg.giscus_category ?? '')
  script.setAttribute('data-category-id', cfg.giscus_category_id ?? '')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', 'transparent_dark')
  script.setAttribute('data-lang', locale.value)
  script.setAttribute('crossorigin', 'anonymous')
  script.async = true
  giscusEl.value?.appendChild(script)
})
</script>

<template>
  <div>
    <AppNav />
    <main class="blog-detail">
      <div class="post-header">
        <NuxtLink to="/blog" class="back-link">{{ t.blog.back }}</NuxtLink>
        <div class="post-eyebrow">{{ t.blog.eyebrow }}</div>
        <h1 class="post-title">{{ display.title }}</h1>
        <div class="post-date">{{ display.date }}</div>
      </div>

      <div class="post-content">
        <template v-for="(block, i) in blocks" :key="i">
          <p v-if="block.type === 'text'" class="post-para">
            {{ locale === 'nl' ? (block.content_nl || block.content_en) : block.content_en }}
          </p>
          <figure v-else-if="block.type === 'image' && block.path" class="post-figure">
            <img :src="block.path" :alt="locale === 'nl' ? (block.caption_nl || block.caption_en || '') : (block.caption_en || '')" class="post-img" />
            <figcaption v-if="block.caption_en || block.caption_nl" class="post-caption">
              {{ locale === 'nl' ? (block.caption_nl || block.caption_en) : block.caption_en }}
            </figcaption>
          </figure>
        </template>
      </div>

      <div class="post-footer">
        <button class="like-btn" :class="{ liked }" :disabled="liked" @click="likePost">
          <span class="like-icon">{{ liked ? '♥' : '♡' }}</span>
          <span class="like-count">{{ likes }}</span>
        </button>
      </div>

      <div v-if="giscusCfg?.giscus_enabled" class="giscus-section">
        <div ref="giscusEl" />
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.blog-detail {
  max-width: 780px;
  margin: 0 auto;
  padding: 10rem 4rem 8rem;
}

.back-link {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--text);
  text-decoration: none;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: 2.5rem;
  transition: color 0.2s;
}
.back-link:hover { color: var(--white); }

.post-eyebrow {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.post-title {
  font-family: var(--display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: var(--white);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.post-date {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--text);
  margin-bottom: 4rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.post-content { display: flex; flex-direction: column; gap: 1.25rem; }

.post-para { font-size: 1rem; line-height: 1.8; }

.post-figure {
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.post-img {
  width: 100%;
  border: 1px solid var(--border);
  display: block;
}

.post-caption {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--text);
  letter-spacing: 0.08em;
  text-align: center;
}

.post-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 3rem;
  padding: 1.5rem 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: none;
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--mono);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  padding: 0.6rem 1.4rem;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.like-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
.like-btn.liked { border-color: var(--accent); color: var(--accent); cursor: default; }
.like-btn:disabled:not(.liked) { opacity: 0.4; }

.like-icon { font-size: 1rem; line-height: 1; }
.like-count { min-width: 1.5ch; text-align: left; }

.giscus-section { margin-top: 2rem; }

@media (max-width: 768px) {
  .blog-detail { padding: 8rem 1.5rem 4rem; }
}
</style>
