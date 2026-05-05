type Locale = 'en' | 'nl'

const translations = {
  en: {
    nav: {
      about: 'About',
      aboutPage: 'About me',
      projects: 'Projects',
      skills: 'Skills',
      events: 'Events',
      blog: 'Blog',
      contact: 'Contact',
    },
    hero: {
      eyebrow: 'Cybersecurity Specialist — Available for work',
      line1: 'I KEEP',
      line2: 'ATTACKERS',
      line3: 'OUT.',
      sub: 'Penetration tester, security architect and ethical hacker. I find the weaknesses before the attackers do.',
      btn1: 'My work',
      btn2: 'Get in touch',
    },
    chapters: ['Identification', 'Proof of work', 'Capabilities', 'Activity', 'Connection'],
    about: {
      intro: 'I am <em>Niels Maes</em> — a cybersecurity specialist who believes the best defense starts with thinking like an attacker.',
      p1: 'Currently in my third year of cybersecurity studies, with hands-on experience as a security engineer at AZ Sint-Jan hospital in Bruges. I focus on the defensive side of security — monitoring systems, detecting threats, and keeping incidents under control.',
      p2: 'My interest lies in SOC operations and the legal side of cybersecurity — from compliance frameworks to the regulations that shape how organisations handle security. I am actively building my portfolio and looking for my first professional step in defensive security.',
      learnMore: 'Learn more about me →',
      downloadCv: 'Download CV',
      experienceTitle: 'Experience',
      extraTitle: 'More about me',
      present: 'Present',
      tags: { Stage: 'Internship', Vakantiejob: 'Summer job', Opleiding: 'Education', Werk: 'Work' } as Record<string, string>,
    },
    skills: {
      sub: 'A combination of offensive and defensive techniques — built through years of hands-on experience and continuous learning.',
      groups: ['Offensive', 'Defensive', 'Tools', 'Code'],
    },
    projects: {
      eyebrow: 'Selected work',
      title: 'What I',
      titleEm: 'build',
      sub: 'Cybersecurity projects, research and tools — from penetration testing to infrastructure.',
      seeAll: 'See all projects →',
    },
    events: {
      eyebrow: 'Blog & Events',
      title: 'What I',
      titleEm: 'share',
      sub: 'Talks, workshops, and insights — also available via',
      linkedin: 'View on LinkedIn →',
      seeAll: 'See all events →',
    },
    blog: {
      eyebrow: 'Blog',
      title: 'My',
      titleEm: 'findings',
      sub: 'Write-ups, research notes and reflections on cybersecurity topics.',
      readMore: 'Read more →',
      back: '← Back to blog',
      empty: 'No posts yet.',
    },
    contact: {
      big: 'Ready to<br>work <em>together?</em>',
      p1: 'Whether you need a pentest, are looking for advice on your security architecture, or just have a question — I respond within 24 hours.',
      p2: 'Based in Bruges, available remote and on-site.',
      labelName: 'Name',
      labelEmail: 'Email',
      labelMessage: 'Message',
      placeholderName: 'Your name',
      placeholderMessage: 'Tell me how I can help...',
      submit: 'Send message →',
    },
    footer: {
      location: '© {{ year }} — BRUGES, BELGIUM',
    },
    project: {
      back: '← Back to portfolio',
      collaborators: 'Collaborators',
      photos: 'Photos',
      details: 'Details',
      viewProject: 'View project →',
      readMore: 'Read more →',
    },
  },
  nl: {
    nav: {
      about: 'Over',
      aboutPage: 'Over mij',
      projects: 'Projecten',
      skills: 'Skills',
      events: 'Events',
      blog: 'Blog',
      contact: 'Contact',
    },
    hero: {
      eyebrow: 'Cybersecurity Specialist — Beschikbaar voor werk',
      line1: 'IK HOUD',
      line2: 'AANVALLERS',
      line3: 'BUITEN.',
      sub: 'Penetration tester, security architect en ethisch hacker. Ik vind de zwakheden voordat de aanvallers dat doen.',
      btn1: 'Mijn werk',
      btn2: 'Neem contact op',
    },
    chapters: ['Identificatie', 'Bewijs van werk', 'Capaciteiten', 'Activiteit', 'Verbinding'],
    about: {
      intro: 'Ik ben <em>Niels Maes</em> — een cybersecurity specialist die gelooft dat de beste verdediging begint met denken als een aanvaller.',
      p1: 'Momenteel in mijn derde jaar cybersecurity, met praktijkervaring als security engineer bij het AZ Sint-Jan ziekenhuis in Brugge. Ik focus op de defensieve kant van security — systemen monitoren, dreigingen detecteren en incidenten beheersen.',
      p2: 'Mijn interesse gaat uit naar SOC-werk en de juridische kant van cybersecurity — van compliance-kaders tot de wetgeving die bepaalt hoe organisaties met security omgaan. Ik bouw actief mijn portfolio op en ben op zoek naar mijn eerste professionele stap in defensieve security.',
      learnMore: 'Leer meer over mij →',
      downloadCv: 'CV downloaden',
      experienceTitle: 'Ervaring',
      extraTitle: 'Meer over mij',
      present: 'Heden',
      tags: { Stage: 'Stage', Vakantiejob: 'Vakantiejob', Opleiding: 'Opleiding', Werk: 'Werk' } as Record<string, string>,
    },
    skills: {
      sub: 'Een combinatie van offensieve en defensieve technieken — opgebouwd door jarenlange praktijkervaring en continue bijscholing.',
      groups: ['Offensief', 'Defensief', 'Tools', 'Code'],
    },
    projects: {
      eyebrow: 'Geselecteerd werk',
      title: 'Wat ik',
      titleEm: 'bouw',
      sub: 'Cybersecurity projecten, onderzoek en tools — van penetration testing tot infrastructuur.',
      seeAll: 'Alle projecten bekijken →',
    },
    events: {
      eyebrow: 'Blog & Events',
      title: 'Wat ik',
      titleEm: 'deel',
      sub: 'Spreekbeurten, workshops en inzichten — ook te volgen via',
      linkedin: 'Bekijk op LinkedIn →',
      seeAll: 'Alle events bekijken →',
    },
    blog: {
      eyebrow: 'Blog',
      title: 'Mijn',
      titleEm: 'bevindingen',
      sub: 'Write-ups, onderzoeksnotities en reflecties over cybersecurity.',
      readMore: 'Lees meer →',
      back: '← Terug naar blog',
      empty: 'Nog geen posts.',
    },
    contact: {
      big: 'Klaar om<br>samen te <em>werken?</em>',
      p1: 'Of je nu een pentest nodig hebt, advies zoekt over je security-architectuur, of gewoon een vraag hebt — ik reageer binnen 24 uur.',
      p2: 'Gebaseerd in Brugge, beschikbaar remote en on-site.',
      labelName: 'Naam',
      labelEmail: 'Email',
      labelMessage: 'Bericht',
      placeholderName: 'Jouw naam',
      placeholderMessage: 'Vertel me hoe ik kan helpen...',
      submit: 'Verstuur bericht →',
    },
    footer: {
      location: '© {{ year }} — BRUGGE, BELGIË',
    },
    project: {
      back: '← Terug naar portfolio',
      collaborators: 'Medewerkers',
      photos: "Foto's",
      details: 'Details',
      viewProject: 'Bekijk project →',
      readMore: 'Lees meer →',
    },
  },
}

export function useLocale() {
  const locale = useState<Locale>('locale', () => 'en')
  const t = computed(() => translations[locale.value])
  function toggle() {
    locale.value = locale.value === 'en' ? 'nl' : 'en'
  }
  return { locale, t, toggle }
}
