<script setup lang="ts">
const { t } = useLocale()
</script>

<template>
  <section id="hero">
    <div class="grid-bg" />

    <div class="scroll-cue">
      <div class="scroll-line" />
      <span>Scroll</span>
    </div>

    <div class="hero-eyebrow">{{ t.hero.eyebrow }}</div>

    <h1 class="cinematic">
      {{ t.hero.line1 }}<br>
      <span class="italic">{{ t.hero.line2 }}</span><br>
      {{ t.hero.line3 }}
    </h1>

    <div class="hero-bottom">
      <p class="hero-sub">{{ t.hero.sub }}</p>
      <div class="hero-actions">
        <a href="#projects" class="btn btn-red">{{ t.hero.btn1 }}</a>
        <a href="#contact" class="btn btn-outline">{{ t.hero.btn2 }}</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
#hero {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 4rem 5rem;
  position: relative;
  overflow: hidden;
}

.grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 80px 80px;
  mask-image: radial-gradient(ellipse 70% 80% at 70% 30%, black, transparent);
}

.hero-eyebrow {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--accent);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  opacity: 0;
  animation: up 0.7s 0.3s forwards;
}

.hero-eyebrow::before {
  content: '';
  width: 40px;
  height: 1px;
  background: var(--accent);
  flex-shrink: 0;
}

h1.cinematic {
  font-family: var(--display);
  font-size: clamp(3.5rem, 11vw, 13rem);
  font-weight: 900;
  color: var(--white);
  line-height: 0.85;
  letter-spacing: -0.02em;
  max-width: 900px;
  opacity: 0;
  animation: up 0.9s 0.5s forwards;
}

h1.cinematic .italic { font-style: italic; color: var(--accent); }

.hero-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 3rem;
  opacity: 0;
  animation: up 0.8s 0.9s forwards;
}

.hero-sub {
  font-size: 0.95rem;
  color: var(--text);
  max-width: 360px;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-shrink: 0;
}

.scroll-cue {
  position: absolute;
  right: 4rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  opacity: 0;
  animation: fadeIn 1s 1.5s forwards;
}

.scroll-cue span {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--text);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  writing-mode: vertical-rl;
}

.scroll-line {
  width: 1px;
  height: 80px;
  background: linear-gradient(to bottom, var(--accent), transparent);
  animation: grow 2s ease-in-out infinite;
}

@media (max-width: 768px) {
  #hero { padding: 0 1.5rem 3rem; }
  .scroll-cue { display: none; }

  .hero-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .hero-sub { max-width: 100%; font-size: 0.85rem; }

  .hero-actions { flex-wrap: wrap; }

  .hero-eyebrow { font-size: 0.55rem; }
}
</style>
