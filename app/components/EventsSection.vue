<script setup lang="ts">
interface Event {
  id: number
  date_en: string;  date_nl: string
  type_en: string;  type_nl: string
  title_en: string; title_nl: string
  description_en: string; description_nl: string
  linkedinUrl: string
}

const { locale, t } = useLocale()
const { data: events } = await useFetch<Event[]>('/api/events')

const display = computed(() => (events.value ?? []).map(e => ({
  id: e.id,
  linkedinUrl: e.linkedinUrl,
  date:        e[`date_${locale.value}` as keyof Event] as string        || e.date_en,
  type:        e[`type_${locale.value}` as keyof Event] as string        || e.type_en,
  title:       e[`title_${locale.value}` as keyof Event] as string       || e.title_en,
  description: e[`description_${locale.value}` as keyof Event] as string || e.description_en,
})))
</script>

<template>
  <section id="events">
    <div class="events-inner">
      <div class="events-top reveal">
        <div>
          <div class="events-eyebrow">{{ t.events.eyebrow }}</div>
          <h2 class="events-title">{{ t.events.title }}<br><em>{{ t.events.titleEm }}</em></h2>
        </div>
        <p class="events-sub">
          {{ t.events.sub }}
          <a href="https://linkedin.com" target="_blank" rel="noopener" class="li-link">LinkedIn</a>.
        </p>
      </div>

      <div class="events-list">
        <article v-for="event in display" :key="event.id" class="event-card reveal">
          <div class="event-meta">
            <span class="event-type">{{ event.type }}</span>
            <span class="event-date">{{ event.date }}</span>
          </div>
          <div class="event-body">
            <h3 class="event-title">{{ event.title }}</h3>
            <p class="event-desc">{{ event.description }}</p>
          </div>
          <a :href="event.linkedinUrl" target="_blank" rel="noopener" class="event-link">
            {{ t.events.linkedin }}
          </a>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
#events {
  padding: 8rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

.events-inner { display: flex; flex-direction: column; gap: 5rem; }

.events-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.events-eyebrow {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.events-title {
  font-family: var(--display);
  font-size: clamp(3rem, 6vw, 5rem);
  color: var(--white);
  font-weight: 900;
  line-height: 0.9;
}

.events-title em { font-style: italic; color: var(--accent); }

.events-sub {
  max-width: 300px;
  font-size: 0.85rem;
  line-height: 1.7;
  text-align: right;
}

.li-link {
  color: var(--white);
  text-decoration: none;
  border-bottom: 1px solid var(--accent);
  padding-bottom: 0.1rem;
  transition: color 0.2s;
}

.li-link:hover { color: var(--accent); }

.events-list { display: flex; flex-direction: column; gap: 1px; }

.event-card {
  display: grid;
  grid-template-columns: 220px 1fr auto;
  align-items: center;
  gap: 3rem;
  padding: 2.5rem 0;
  border-bottom: 1px solid var(--border);
  transition: border-color 0.3s;
}

.event-card:first-child { border-top: 1px solid var(--border); }
.event-card:hover { border-color: var(--accent); }

.event-meta { display: flex; flex-direction: column; gap: 0.5rem; }

.event-type {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.event-date { font-family: var(--mono); font-size: 0.65rem; color: var(--text); }

.event-title {
  font-family: var(--display);
  font-size: 1.25rem;
  color: var(--white);
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.event-desc { font-size: 0.85rem; line-height: 1.7; max-width: 580px; }

.event-link {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--text);
  text-decoration: none;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
  transition: color 0.2s;
  flex-shrink: 0;
}

.event-link:hover { color: var(--accent); }
</style>
