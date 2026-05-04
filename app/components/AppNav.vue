<script setup lang="ts">
const isDark = ref(false)

onMounted(() => {
  const onScroll = () => { isDark.value = window.scrollY > 60 }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})
</script>

<template>
  <nav :class="{ dark: isDark }">
    <div class="nav-mark">NIELS MAES <em>//</em> SEC</div>
    <ul class="nav-menu">
      <li><a href="/#about">Over</a></li>
      <li><a href="/#projects">Projecten</a></li>
      <li><a href="/#skills">Skills</a></li>
      <li><a href="/#events">Events</a></li>
      <li><a href="/#contact">Contact</a></li>
    </ul>
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
}

.nav-mark em {
  color: var(--accent);
  font-style: normal;
}

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

.nav-menu a:hover {
  color: var(--white);
}
</style>
