<script setup lang="ts">
const certifications = [
  { name: 'CompTIA Security+', year: '2023' },
  { name: 'CEH — Ethical Hacker', year: '2024' },
  { name: 'OSCP (In progress)', year: '2025' },
  { name: 'ISO 27001 Awareness', year: '2023' },
]
</script>

<template>
  <section id="about">
    <p class="about-hero-text reveal">
      Ik ben <em>Niels Maes</em> — een cybersecurity specialist die gelooft
      dat de beste verdediging begint met denken als een aanvaller.
    </p>

    <div class="about-cols reveal">
      <div>
        <p>
          Met jaren ervaring in zowel offensieve als defensieve security help ik bedrijven,
          overheden en individuen hun digitale omgeving aantoonbaar veiliger te maken.
          Geen generieke adviezen — concrete bevindingen, duidelijke rapportages en haalbare oplossingen.
        </p>
        <p>
          Mijn specialiteit ligt in webapplicaties, netwerksecurity en social engineering assessments.
          Ik denk als een aanvaller, maar werk als een trusted advisor.
        </p>
      </div>

      <div>
        <div class="cert-list">
          <div
            v-for="cert in certifications"
            :key="cert.name"
            class="cert-entry"
          >
            <span class="cert-entry-name">{{ cert.name }}</span>
            <span class="cert-entry-yr">{{ cert.year }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
#about {
  padding: 8rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

.about-hero-text {
  font-family: var(--display);
  font-size: clamp(2rem, 4vw, 3.5rem);
  color: var(--white);
  line-height: 1.2;
  font-weight: 700;
  max-width: 800px;
  margin-bottom: 4rem;
}

.about-hero-text em {
  color: var(--accent);
  font-style: italic;
}

.about-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
}

.about-cols p {
  font-size: 0.9rem;
  line-height: 1.8;
  margin-bottom: 1rem;
}

.cert-list {
  margin-top: 0.5rem;
}

.cert-entry {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.85rem;
}

.cert-entry:first-child {
  border-top: 1px solid var(--border);
}

.cert-entry-name {
  color: var(--white);
}

.cert-entry-yr {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: var(--accent);
}
</style>
