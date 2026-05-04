<script setup lang="ts">
const skillGroups = [
  {
    title: 'Offensief',
    skills: [
      { name: 'Penetration Testing', level: '///', highlight: true },
      { name: 'Web App Hacking', level: '///', highlight: true },
      { name: 'Social Engineering', level: '//', highlight: true },
      { name: 'Exploit Dev', level: '//', highlight: false },
    ],
  },
  {
    title: 'Defensief',
    skills: [
      { name: 'Incident Response', level: '///', highlight: true },
      { name: 'SIEM / Logging', level: '//', highlight: true },
      { name: 'Threat Modelling', level: '///', highlight: true },
      { name: 'Forensics', level: '//', highlight: false },
    ],
  },
  {
    title: 'Tools',
    skills: [
      { name: 'Burp Suite', level: '///', highlight: true },
      { name: 'Metasploit', level: '//', highlight: true },
      { name: 'Wireshark', level: '///', highlight: true },
      { name: 'Nmap / Nessus', level: '///', highlight: true },
    ],
  },
  {
    title: 'Code',
    skills: [
      { name: 'Python', level: '///', highlight: true },
      { name: 'Bash', level: '///', highlight: true },
      { name: 'PowerShell', level: '//', highlight: true },
      { name: 'SQL', level: '//', highlight: false },
    ],
  },
]
</script>

<template>
  <section id="skills">
    <div class="skills-inner">
      <div class="skills-top reveal">
        <h2>Skills &<br><em>Expertise</em></h2>
        <p>Een combinatie van offensieve en defensieve technieken — opgebouwd door jarenlange praktijkervaring en continue bijscholing.</p>
      </div>

      <div class="skills-grid reveal">
        <div
          v-for="group in skillGroups"
          :key="group.title"
          class="skill-block"
        >
          <div class="skill-block-title">{{ group.title }}</div>
          <div
            v-for="skill in group.skills"
            :key="skill.name"
            class="s-item"
          >
            <span>{{ skill.name }}</span>
            <span class="s-lvl" :class="{ hi: skill.highlight }">{{ skill.level }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
#skills {
  padding: 8rem 4rem;
  background: var(--surface);
  border-top: 1px solid var(--border);
}

.skills-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.skills-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 5rem;
}

.skills-top h2 {
  font-family: var(--display);
  font-size: clamp(3rem, 6vw, 5rem);
  color: var(--white);
  font-weight: 900;
  font-style: italic;
}

.skills-top p {
  max-width: 300px;
  font-size: 0.85rem;
  line-height: 1.7;
  text-align: right;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--border);
}

.skill-block {
  background: var(--surface);
  padding: 2rem 1.5rem;
}

.skill-block-title {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.s-item {
  padding: 0.6rem 0;
  border-bottom: 1px solid rgba(30, 30, 30, 0.8);
  font-size: 0.82rem;
  color: var(--text);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.s-item:last-child {
  border-bottom: none;
}

.s-item:hover {
  color: var(--white);
}

.s-lvl {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--border);
}

.s-lvl.hi {
  color: var(--accent);
}
</style>
