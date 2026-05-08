<script setup lang="ts">
const { t, locale, toggle } = useLocale()
const isDark = ref(false)
const isMenuOpen = ref(false)

onMounted(() => {
  const onScroll = () => { isDark.value = window.scrollY > 60 }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})

function closeMenu() { isMenuOpen.value = false }

const { data: blogPosts } = await useFetch<{ date_iso?: string }[]>('/api/blog')
const hasNewPost = computed(() => {
  const latest = blogPosts.value?.[0]?.date_iso
  if (!latest) return false
  const diffDays = (Date.now() - new Date(latest).getTime()) / 86_400_000
  return diffDays <= 30
})
</script>

<template>
  <nav :class="{ dark: isDark }">
    <div class="nav-mark">NIELS MAES <em>//</em> SEC</div>

    <ul class="nav-menu" :class="{ open: isMenuOpen }">
      <li><a href="/#about" @click="closeMenu">{{ t.nav.about }}</a></li>
      <li><a href="/#projects" @click="closeMenu">{{ t.nav.projects }}</a></li>
      <li><a href="/#skills" @click="closeMenu">{{ t.nav.skills }}</a></li>
      <li class="blog-li">
        <NuxtLink to="/blog" class="blog-link" @click="closeMenu">
          {{ t.nav.blog }}
          <span class="new-dot" />
        </NuxtLink>
      </li>
      <li><a href="/#contact" @click="closeMenu">{{ t.nav.contact }}</a></li>
    </ul>

    <div class="nav-right">
      <button class="lang-toggle" @click="toggle">
        <span :class="{ active: locale === 'en' }">EN</span>
        <span class="sep">/</span>
        <span :class="{ active: locale === 'nl' }">NL</span>
      </button>
      <button class="hamburger" :class="{ open: isMenuOpen }" aria-label="Menu" @click="isMenuOpen = !isMenuOpen">
        <span /><span /><span />
      </button>
    </div>
  </nav>
</template>

<style scoped>
nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 2rem 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.4s;
}

nav.dark {
  background: rgba(10, 10, 10, 0.97);
  border-bottom: 1px solid var(--border);
}

.nav-mark {
  font-family: var(--mono);
  font-size: 0.7rem;
  color: var(--white);
  letter-spacing: 0.1em;
  position: relative;
  z-index: 101;
}

.nav-mark em { color: var(--accent); font-style: normal; }

.nav-menu {
  display: flex;
  gap: 2.5rem;
  list-style: none;
}

.nav-menu a {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--text);
  text-decoration: none;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: color 0.2s;
}

.nav-menu a:hover { color: var(--white); }

.blog-link { color: var(--accent) !important; position: relative; }
.blog-link:hover { opacity: 0.8; }

.new-dot {
  position: absolute;
  top: -4px;
  right: -9px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 6px var(--accent);
  animation: pulse 1.8s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 6px var(--accent); }
  50% { opacity: 0.6; transform: scale(1.4); box-shadow: 0 0 12px var(--accent); }
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 101;
}

.lang-toggle {
  font-family: var(--mono);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  background: none;
  border: 1px solid var(--border);
  color: var(--text);
  cursor: pointer;
  padding: 0.35rem 0.7rem;
  display: flex;
  gap: 0.3rem;
  align-items: center;
  transition: border-color 0.2s;
}

.lang-toggle:hover { border-color: var(--text); }
.lang-toggle .sep { opacity: 0.3; }
.lang-toggle span.active { color: var(--accent); }

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.hamburger span {
  display: block;
  width: 22px;
  height: 1px;
  background: var(--white);
  transition: transform 0.3s, opacity 0.3s;
}

.hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(4px, 4px); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(4px, -4px); }

@media (max-width: 768px) {
  nav { padding: 1.5rem; }

  .hamburger { display: flex; }

  .nav-menu {
    position: fixed;
    inset: 0;
    background: var(--bg);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
    z-index: 100;
    transform: translateX(100%);
    transition: transform 0.35s ease;
  }

  .nav-menu.open { transform: translateX(0); }

  .nav-menu a {
    font-size: 1.1rem;
    letter-spacing: 0.15em;
    color: var(--white);
  }
}
</style>
