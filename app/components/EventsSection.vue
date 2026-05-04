<script setup lang="ts">
interface Event {
  id: number
  date: string
  type: string
  title: string
  description: string
  linkedinUrl: string
}

const { data: events } = await useFetch<Event[]>('/api/events')
</script>

<template>
  <section id="events">
    <div class="events-inner">
      <div class="events-top reveal">
        <div>
          <div class="events-eyebrow">Blog &amp; Events</div>
          <h2 class="events-title">Wat ik<br><em>deel</em></h2>
        </div>
        <p class="events-sub">
          Spreekbeurten, workshops en inzichten — ook te volgen via
          <a href="https://linkedin.com" target="_blank" rel="noopener" class="li-link">LinkedIn</a>.
        </p>
      </div>

      <div class="events-list">
        <article
          v-for="event in events"
          :key="event.id"
          class="event-card reveal"
        >
          <div class="event-meta">
            <span class="event-type">{{ event.type }}</span>
            <span class="event-date">{{ event.date }}</span>
          </div>
          <div class="event-body">
            <h3 class="event-title">{{ event.title }}</h3>
            <p class="event-desc">{{ event.description }}</p>
          </div>
          <a :href="event.linkedinUrl" target="_blank" rel="noopener" class="event-link">
            Bekijk op LinkedIn →
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

.events-inner {
  display: flex;
  flex-direction: column;
  gap: 5rem;
}

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

.events-title em {
  font-style: italic;
  color: var(--accent);
}

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

.li-link:hover {
  color: var(--accent);
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.event-card {
  display: grid;
  grid-template-columns: 220px 1fr auto;
  align-items: center;
  gap: 3rem;
  padding: 2.5rem 0;
  border-bottom: 1px solid var(--border);
  transition: border-color 0.3s;
}

.event-card:first-child {
  border-top: 1px solid var(--border);
}

.event-card:hover {
  border-color: var(--accent);
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.event-type {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.event-date {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--text);
}

.event-title {
  font-family: var(--display);
  font-size: 1.25rem;
  color: var(--white);
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.event-desc {
  font-size: 0.85rem;
  line-height: 1.7;
  max-width: 580px;
}

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

.event-link:hover {
  color: var(--accent);
}
</style>
