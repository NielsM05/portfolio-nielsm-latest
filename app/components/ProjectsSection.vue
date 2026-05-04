<script setup lang="ts">
const projects = [
  {
    num: '01',
    category: 'Penetration Test',
    title: 'Webapplicatie Security Audit',
    description: 'Volledige pentest van een e-commerce platform. 14 kritieke kwetsbaarheden geïdentificeerd, gedocumenteerd en opgelost. Van SQL injection tot session management issues.',
    link: '#',
    linkLabel: 'Lees meer →',
    reverse: false,
  },
  {
    num: '02',
    category: 'Netwerk Security',
    title: 'Infrastructuur Hardening KMO',
    description: 'Analyse en verharding van de volledige IT-infrastructuur. Firewall-configuratie, Active Directory hardening en security awareness training voor medewerkers.',
    link: '#',
    linkLabel: 'Lees meer →',
    reverse: true,
  },
  {
    num: '03',
    category: 'Open Source Tool',
    title: 'Recon Automatisatie Framework',
    description: 'Zelfgebouwd tool dat subdomain enumeration, port scanning en vulnerability detection combineert in één geautomatiseerde workflow. Beschikbaar op GitHub.',
    link: '#',
    linkLabel: 'Bekijk op GitHub →',
    reverse: false,
  },
]
</script>

<template>
  <section id="projects">
    <div
      v-for="project in projects"
      :key="project.num"
      class="proj-editorial reveal"
      :class="{ reverse: project.reverse }"
    >
      <div class="proj-visual">
        <div class="proj-visual-inner">{{ project.num }}</div>
      </div>
      <div class="proj-info">
        <div>
          <div class="proj-cat">{{ project.category }}</div>
          <div class="proj-h">{{ project.title }}</div>
          <p class="proj-p">{{ project.description }}</p>
        </div>
        <a :href="project.link" class="proj-link">{{ project.linkLabel }}</a>
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

.proj-editorial:hover {
  border-color: var(--accent);
}

.proj-editorial.reverse {
  direction: rtl;
}

.proj-editorial.reverse > * {
  direction: ltr;
}

.proj-visual {
  background: var(--surface);
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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

.proj-link:hover {
  text-decoration: underline;
}
</style>
