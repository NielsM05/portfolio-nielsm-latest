<script setup lang="ts">
interface Collaborator { name: string; linkedinUrl: string }

interface Project {
  id: number
  category_en: string; category_nl: string
  title_en: string;    title_nl: string
  description_en: string; description_nl: string
  content_en: string;  content_nl: string
  externalLink: string
  photos: string[]
  collaborators: Collaborator[]
}

interface Event {
  id: number
  date_iso: string
  date_en: string;  date_nl: string
  type_en: string;  type_nl: string
  title_en: string; title_nl: string
  description_en: string; description_nl: string
  linkedinUrl: string
}

interface BlogPost {
  id: number
  date_iso: string
  date_en: string; date_nl: string
  title_en: string; title_nl: string
  summary_en: string; summary_nl: string
  content_en: string; content_nl: string
}

interface ExperienceEntry {
  role_en: string; role_nl: string
  company: string; date_from: string; date_to: string; tag: string
  description_en: string; description_nl: string
}

interface Config {
  cv_url?: string
  about_extra_en?: string
  about_extra_nl?: string
  experience?: ExperienceEntry[]
}

// Auth
const isLoggedIn = ref(false)
const loginPassword = ref('')
const loginError = ref('')
const loginLoading = ref(false)

onMounted(async () => {
  try {
    await $fetch('/api/auth')
    isLoggedIn.value = true
    await loadAll()
  } catch {
    isLoggedIn.value = false
  }
})

async function login() {
  loginLoading.value = true
  loginError.value = ''
  try {
    await $fetch('/api/auth', { method: 'POST', body: { password: loginPassword.value } })
    isLoggedIn.value = true
    await loadAll()
  } catch {
    loginError.value = 'Ongeldig wachtwoord'
  } finally {
    loginLoading.value = false
  }
}

async function logout() {
  await $fetch('/api/auth', { method: 'DELETE' })
  isLoggedIn.value = false
  loginPassword.value = ''
}

const projects = ref<Project[]>([])
const events = ref<Event[]>([])
const blogPosts = ref<BlogPost[]>([])
const config = ref<Config>({})

async function loadAll() {
  const [p, e, b, c] = await Promise.all([
    $fetch<Project[]>('/api/projects'),
    $fetch<Event[]>('/api/events'),
    $fetch<BlogPost[]>('/api/blog'),
    $fetch<Config>('/api/config'),
  ])
  projects.value = p
  events.value = e
  blogPosts.value = b
  config.value = c
  aboutForm.value = {
    cv_url: c.cv_url ?? '',
    about_extra_en: c.about_extra_en ?? '',
    about_extra_nl: c.about_extra_nl ?? '',
    experience: (c.experience ?? []).map(e => ({ ...e })),
  }
}

// ─── Projects ────────────────────────────────────────────
const showProjectForm = ref(false)
const editingProjectId = ref<number | null>(null)
const projectSaving = ref(false)
const photoUploading = ref(false)

function emptyProjectForm() {
  return {
    category_en: '', category_nl: '',
    title_en: '',    title_nl: '',
    description_en: '', description_nl: '',
    content_en: '',  content_nl: '',
    externalLink: '',
    photos: [] as string[],
    collaborators: [] as Collaborator[],
  }
}
const projectForm = ref(emptyProjectForm())

function startNewProject() {
  editingProjectId.value = null
  projectForm.value = emptyProjectForm()
  showProjectForm.value = true
}

function startEditProject(p: Project) {
  editingProjectId.value = p.id
  projectForm.value = {
    category_en: p.category_en, category_nl: p.category_nl,
    title_en: p.title_en,       title_nl: p.title_nl,
    description_en: p.description_en, description_nl: p.description_nl,
    content_en: p.content_en,   content_nl: p.content_nl,
    externalLink: p.externalLink ?? '',
    photos: [...(p.photos ?? [])],
    collaborators: (p.collaborators ?? []).map(c => ({ ...c })),
  }
  showProjectForm.value = true
}

function cancelProjectForm() {
  showProjectForm.value = false
  editingProjectId.value = null
}

async function saveProject() {
  projectSaving.value = true
  try {
    if (editingProjectId.value !== null) {
      const updated = await $fetch<Project>(`/api/projects/${editingProjectId.value}`, { method: 'PUT', body: projectForm.value })
      const idx = projects.value.findIndex(p => p.id === editingProjectId.value)
      if (idx >= 0) projects.value[idx] = updated
    } else {
      const created = await $fetch<Project>('/api/projects', { method: 'POST', body: projectForm.value })
      projects.value.push(created)
    }
    cancelProjectForm()
  } finally {
    projectSaving.value = false
  }
}

async function deleteProject(id: number) {
  if (!confirm('Dit project verwijderen?')) return
  await $fetch(`/api/projects/${id}`, { method: 'DELETE' })
  projects.value = projects.value.filter(p => p.id !== id)
}

async function uploadPhotos(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  photoUploading.value = true
  try {
    for (const file of Array.from(files)) {
      const form = new FormData()
      form.append('file', file)
      const { url } = await $fetch<{ url: string }>('/api/upload', { method: 'POST', body: form })
      projectForm.value.photos.push(url)
    }
  } finally {
    photoUploading.value = false
    ;(e.target as HTMLInputElement).value = ''
  }
}

function removePhoto(idx: number) { projectForm.value.photos.splice(idx, 1) }
function addCollaborator() { projectForm.value.collaborators.push({ name: '', linkedinUrl: '' }) }
function removeCollaborator(idx: number) { projectForm.value.collaborators.splice(idx, 1) }

// ─── Events ──────────────────────────────────────────────
const showEventForm = ref(false)
const editingEventId = ref<number | null>(null)
const eventSaving = ref(false)

function emptyEventForm() {
  return {
    date_iso: '',
    date_en: '',  date_nl: '',
    type_en: '',  type_nl: '',
    title_en: '', title_nl: '',
    description_en: '', description_nl: '',
    linkedinUrl: '',
  }
}
const eventForm = ref(emptyEventForm())

function startNewEvent() {
  editingEventId.value = null
  eventForm.value = emptyEventForm()
  showEventForm.value = true
}

function startEditEvent(ev: Event) {
  editingEventId.value = ev.id
  eventForm.value = {
    date_iso: ev.date_iso ?? '',
    date_en: ev.date_en,   date_nl: ev.date_nl,
    type_en: ev.type_en,   type_nl: ev.type_nl,
    title_en: ev.title_en, title_nl: ev.title_nl,
    description_en: ev.description_en, description_nl: ev.description_nl,
    linkedinUrl: ev.linkedinUrl,
  }
  showEventForm.value = true
}

function cancelEventForm() { showEventForm.value = false; editingEventId.value = null }

async function saveEvent() {
  eventSaving.value = true
  try {
    if (editingEventId.value !== null) {
      const updated = await $fetch<Event>(`/api/events/${editingEventId.value}`, { method: 'PUT', body: eventForm.value })
      const idx = events.value.findIndex(e => e.id === editingEventId.value)
      if (idx >= 0) events.value[idx] = updated
    } else {
      const created = await $fetch<Event>('/api/events', { method: 'POST', body: eventForm.value })
      events.value.push(created)
    }
    cancelEventForm()
  } finally {
    eventSaving.value = false
  }
}

async function deleteEvent(id: number) {
  if (!confirm('Dit event verwijderen?')) return
  await $fetch(`/api/events/${id}`, { method: 'DELETE' })
  events.value = events.value.filter(e => e.id !== id)
}

// ─── Blog ─────────────────────────────────────────────────
const showBlogForm = ref(false)
const editingBlogId = ref<number | null>(null)
const blogSaving = ref(false)

function emptyBlogForm() {
  return {
    date_iso: '',
    date_en: '', date_nl: '',
    title_en: '', title_nl: '',
    summary_en: '', summary_nl: '',
    content_en: '', content_nl: '',
  }
}
const blogForm = ref(emptyBlogForm())

function startNewBlog() {
  editingBlogId.value = null
  blogForm.value = emptyBlogForm()
  showBlogForm.value = true
}

function startEditBlog(p: BlogPost) {
  editingBlogId.value = p.id
  blogForm.value = {
    date_iso: p.date_iso ?? '',
    date_en: p.date_en, date_nl: p.date_nl,
    title_en: p.title_en, title_nl: p.title_nl,
    summary_en: p.summary_en, summary_nl: p.summary_nl,
    content_en: p.content_en, content_nl: p.content_nl,
  }
  showBlogForm.value = true
}

function cancelBlogForm() { showBlogForm.value = false; editingBlogId.value = null }

async function saveBlog() {
  blogSaving.value = true
  try {
    if (editingBlogId.value !== null) {
      const updated = await $fetch<BlogPost>(`/api/blog/${editingBlogId.value}`, { method: 'PUT', body: blogForm.value })
      const idx = blogPosts.value.findIndex(p => p.id === editingBlogId.value)
      if (idx >= 0) blogPosts.value[idx] = updated
    } else {
      const created = await $fetch<BlogPost>('/api/blog', { method: 'POST', body: blogForm.value })
      blogPosts.value.push(created)
    }
    cancelBlogForm()
  } finally {
    blogSaving.value = false
  }
}

async function deleteBlog(id: number) {
  if (!confirm('Deze blogpost verwijderen?')) return
  await $fetch(`/api/blog/${id}`, { method: 'DELETE' })
  blogPosts.value = blogPosts.value.filter(p => p.id !== id)
}

// ─── About / CV ───────────────────────────────────────────
const aboutForm = ref({
  cv_url: '',
  about_extra_en: '',
  about_extra_nl: '',
  experience: [] as ExperienceEntry[],
})
const aboutSaving = ref(false)
const cvUploading = ref(false)

async function uploadCv(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  cvUploading.value = true
  try {
    const form = new FormData()
    form.append('file', file)
    const { url } = await $fetch<{ url: string }>('/api/upload', { method: 'POST', body: form })
    aboutForm.value.cv_url = url
  } finally {
    cvUploading.value = false
    ;(e.target as HTMLInputElement).value = ''
  }
}

async function saveAbout() {
  aboutSaving.value = true
  try {
    await $fetch('/api/config', { method: 'PUT', body: aboutForm.value })
  } finally {
    aboutSaving.value = false
  }
}

function addExperience() {
  aboutForm.value.experience.push({ role_en: '', role_nl: '', company: '', date_from: '', date_to: '', tag: '', description_en: '', description_nl: '' })
}

function removeExperience(idx: number) { aboutForm.value.experience.splice(idx, 1) }
</script>

<template>
  <div class="admin-wrap">
    <!-- Login -->
    <div v-if="!isLoggedIn" class="login-screen">
      <div class="login-box">
        <div class="login-eyebrow">Niels Maes</div>
        <h1 class="login-title">Admin</h1>
        <form class="login-form" @submit.prevent="login">
          <input v-model="loginPassword" type="password" placeholder="Wachtwoord" class="field" autocomplete="current-password" />
          <p v-if="loginError" class="login-error">{{ loginError }}</p>
          <button type="submit" class="btn-action" :disabled="loginLoading">
            {{ loginLoading ? 'Bezig…' : 'Inloggen' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Admin UI -->
    <div v-else class="admin-inner">
      <header class="admin-header">
        <div>
          <span class="admin-eyebrow">Niels Maes</span>
          <h1 class="admin-title">Admin</h1>
        </div>
        <button class="btn-ghost" @click="logout">Uitloggen</button>
      </header>

      <!-- ── Projecten ── -->
      <section class="admin-section">
        <div class="section-head">
          <h2 class="section-title">Projecten</h2>
          <button class="btn-action" @click="startNewProject">+ Nieuw project</button>
        </div>

        <div v-if="showProjectForm" class="form-card">
          <h3 class="form-title">{{ editingProjectId !== null ? 'Project bewerken' : 'Nieuw project' }}</h3>

          <!-- Bilingual fields -->
          <div class="bilingual-grid">
            <div class="lang-col">
              <div class="lang-tag">EN</div>
              <label class="form-label">Category<input v-model="projectForm.category_en" type="text" class="field" placeholder="Website" /></label>
              <label class="form-label">Title<input v-model="projectForm.title_en" type="text" class="field" placeholder="Project title" /></label>
              <label class="form-label">Short description <span class="form-hint">(shown in list)</span><textarea v-model="projectForm.description_en" class="field field-textarea" placeholder="One-sentence summary…" /></label>
              <label class="form-label">Extended content <span class="form-hint">(shown on detail page)</span><textarea v-model="projectForm.content_en" class="field field-textarea field-lg" placeholder="Full write-up…" /></label>
            </div>
            <div class="lang-col">
              <div class="lang-tag">NL</div>
              <label class="form-label">Categorie<input v-model="projectForm.category_nl" type="text" class="field" placeholder="Website" /></label>
              <label class="form-label">Titel<input v-model="projectForm.title_nl" type="text" class="field" placeholder="Projecttitel" /></label>
              <label class="form-label">Korte omschrijving <span class="form-hint">(zichtbaar in lijst)</span><textarea v-model="projectForm.description_nl" class="field field-textarea" placeholder="Samenvatting in één zin…" /></label>
              <label class="form-label">Uitgebreide inhoud <span class="form-hint">(zichtbaar op detailpagina)</span><textarea v-model="projectForm.content_nl" class="field field-textarea field-lg" placeholder="Volledige beschrijving…" /></label>
            </div>
          </div>

          <!-- Shared fields -->
          <label class="form-label form-single">
            Externe link <span class="form-hint">(optioneel — bijv. GitHub)</span>
            <input v-model="projectForm.externalLink" type="text" class="field" placeholder="https://github.com/…" />
          </label>

          <!-- Photos -->
          <div class="form-block">
            <div class="form-block-label">Foto's</div>
            <div class="photos-grid">
              <div v-for="(photo, idx) in projectForm.photos" :key="idx" class="photo-thumb">
                <img :src="photo" alt="Project foto" />
                <button class="photo-remove" type="button" @click="removePhoto(idx)">×</button>
              </div>
              <label class="photo-add" :class="{ loading: photoUploading }">
                <input type="file" accept="image/*" multiple class="photo-input" :disabled="photoUploading" @change="uploadPhotos" />
                <span>{{ photoUploading ? 'Uploaden…' : '+ Foto' }}</span>
              </label>
            </div>
          </div>

          <!-- Collaborators -->
          <div class="form-block">
            <div class="form-block-label">Medewerkers</div>
            <div class="collab-rows">
              <div v-for="(c, idx) in projectForm.collaborators" :key="idx" class="collab-row">
                <input v-model="c.name" type="text" class="field" placeholder="Naam" />
                <input v-model="c.linkedinUrl" type="text" class="field" placeholder="LinkedIn URL" />
                <button class="btn-icon btn-icon-danger" type="button" @click="removeCollaborator(idx)">×</button>
              </div>
              <button class="btn-ghost btn-sm" type="button" @click="addCollaborator">+ Medewerker toevoegen</button>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-action" :disabled="projectSaving" @click="saveProject">{{ projectSaving ? 'Opslaan…' : 'Opslaan' }}</button>
            <button class="btn-ghost" @click="cancelProjectForm">Annuleren</button>
          </div>
        </div>

        <div class="item-list">
          <div v-for="(p, i) in projects" :key="p.id" class="item-row">
            <div class="item-num">{{ String(i + 1).padStart(2, '0') }}</div>
            <div class="item-info">
              <div class="item-cat">{{ p.category_en || p.category_nl }}</div>
              <div class="item-title">{{ p.title_en || p.title_nl }}</div>
            </div>
            <div class="item-actions">
              <NuxtLink :to="`/projects/${p.id}`" target="_blank" class="btn-icon">Bekijk</NuxtLink>
              <button class="btn-icon" @click="startEditProject(p)">Bewerk</button>
              <button class="btn-icon btn-icon-danger" @click="deleteProject(p.id)">Verwijder</button>
            </div>
          </div>
          <div v-if="!projects.length" class="empty-state">Nog geen projecten.</div>
        </div>
      </section>

      <!-- ── Events ── -->
      <section class="admin-section">
        <div class="section-head">
          <h2 class="section-title">Events &amp; Blog</h2>
          <button class="btn-action" @click="startNewEvent">+ Nieuw event</button>
        </div>

        <div v-if="showEventForm" class="form-card">
          <h3 class="form-title">{{ editingEventId !== null ? 'Event bewerken' : 'Nieuw event' }}</h3>

          <label class="form-label form-single">
            Datum (JJJJ-MM-DD) <span class="form-hint">— voor sortering, bv. 2025-04-15</span>
            <input v-model="eventForm.date_iso" type="date" class="field" />
          </label>

          <div class="bilingual-grid">
            <div class="lang-col">
              <div class="lang-tag">EN</div>
              <label class="form-label">Date (display)<input v-model="eventForm.date_en" type="text" class="field" placeholder="April 15, 2025" /></label>
              <label class="form-label">Type<input v-model="eventForm.type_en" type="text" class="field" placeholder="Conference" /></label>
              <label class="form-label">Title<input v-model="eventForm.title_en" type="text" class="field" placeholder="Event title" /></label>
              <label class="form-label">Description<textarea v-model="eventForm.description_en" class="field field-textarea" placeholder="Describe the event…" /></label>
            </div>
            <div class="lang-col">
              <div class="lang-tag">NL</div>
              <label class="form-label">Datum (weergave)<input v-model="eventForm.date_nl" type="text" class="field" placeholder="15 april 2025" /></label>
              <label class="form-label">Type<input v-model="eventForm.type_nl" type="text" class="field" placeholder="Conferentie" /></label>
              <label class="form-label">Titel<input v-model="eventForm.title_nl" type="text" class="field" placeholder="Evenementtitel" /></label>
              <label class="form-label">Omschrijving<textarea v-model="eventForm.description_nl" class="field field-textarea" placeholder="Beschrijf het event…" /></label>
            </div>
          </div>

          <label class="form-label form-single">
            LinkedIn URL
            <input v-model="eventForm.linkedinUrl" type="text" class="field" placeholder="https://linkedin.com/…" />
          </label>

          <div class="form-actions">
            <button class="btn-action" :disabled="eventSaving" @click="saveEvent">{{ eventSaving ? 'Opslaan…' : 'Opslaan' }}</button>
            <button class="btn-ghost" @click="cancelEventForm">Annuleren</button>
          </div>
        </div>

        <div class="item-list">
          <div v-for="ev in events" :key="ev.id" class="item-row">
            <div class="item-meta-col">
              <div class="item-cat">{{ ev.type_en || ev.type_nl }}</div>
              <div class="item-date">{{ ev.date_en || ev.date_nl }}</div>
            </div>
            <div class="item-info">
              <div class="item-title">{{ ev.title_en || ev.title_nl }}</div>
            </div>
            <div class="item-actions">
              <button class="btn-icon" @click="startEditEvent(ev)">Bewerk</button>
              <button class="btn-icon btn-icon-danger" @click="deleteEvent(ev.id)">Verwijder</button>
            </div>
          </div>
          <div v-if="!events.length" class="empty-state">Nog geen events.</div>
        </div>
      </section>

      <!-- ── About / CV ── -->
      <section class="admin-section">
        <div class="section-head">
          <h2 class="section-title">Over mij &amp; CV</h2>
        </div>

        <div class="form-card">
          <!-- CV upload -->
          <div class="form-block">
            <div class="form-block-label">CV (PDF)</div>
            <div class="cv-row">
              <input
                v-if="aboutForm.cv_url"
                :value="aboutForm.cv_url"
                type="text"
                class="field cv-url-field"
                readonly
              />
              <span v-else class="no-cv-yet">Nog geen CV geüpload</span>
              <label class="photo-add" :class="{ loading: cvUploading }">
                <input type="file" accept=".pdf,application/pdf" class="photo-input" :disabled="cvUploading" @change="uploadCv" />
                <span>{{ cvUploading ? 'Uploaden…' : aboutForm.cv_url ? '↺ Vervang CV' : '+ Upload CV' }}</span>
              </label>
            </div>
          </div>

          <!-- Extra bio -->
          <div class="bilingual-grid">
            <div class="lang-col">
              <div class="lang-tag">EN</div>
              <label class="form-label">Extra bio <span class="form-hint">(dubbele enter = nieuwe alinea)</span>
                <textarea v-model="aboutForm.about_extra_en" class="field field-textarea field-lg" placeholder="Extra informatie over jezelf…" />
              </label>
            </div>
            <div class="lang-col">
              <div class="lang-tag">NL</div>
              <label class="form-label">Extra bio <span class="form-hint">(dubbele enter = nieuwe alinea)</span>
                <textarea v-model="aboutForm.about_extra_nl" class="field field-textarea field-lg" placeholder="Aanvullende informatie…" />
              </label>
            </div>
          </div>

          <!-- Experience -->
          <div class="form-block">
            <div class="form-block-label">Ervaringen</div>
            <div v-for="(exp, idx) in aboutForm.experience" :key="idx" class="exp-form-block">
              <div class="exp-form-head">
                <span class="exp-form-num">{{ String(idx + 1).padStart(2, '0') }}</span>
                <button class="btn-icon btn-icon-danger btn-sm" type="button" @click="removeExperience(idx)">Verwijder</button>
              </div>
              <div class="bilingual-grid">
                <div class="lang-col">
                  <div class="lang-tag">EN</div>
                  <label class="form-label">Role<input v-model="exp.role_en" type="text" class="field" placeholder="Security Engineer Intern" /></label>
                  <label class="form-label">Description<textarea v-model="exp.description_en" class="field field-textarea" placeholder="What you did…" /></label>
                </div>
                <div class="lang-col">
                  <div class="lang-tag">NL</div>
                  <label class="form-label">Functie<input v-model="exp.role_nl" type="text" class="field" placeholder="Security Engineer Stage" /></label>
                  <label class="form-label">Omschrijving<textarea v-model="exp.description_nl" class="field field-textarea" placeholder="Wat je deed…" /></label>
                </div>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:0.75rem;margin-top:0.75rem;">
                <label class="form-label">Bedrijf<input v-model="exp.company" type="text" class="field" placeholder="AZ Sint-Jan Brugge" /></label>
                <label class="form-label">Van<MonthYearPicker v-model="exp.date_from" placeholder="Selecteer maand" /></label>
                <label class="form-label">Tot <span class="form-hint">(leeg = heden)</span><MonthYearPicker v-model="exp.date_to" placeholder="Heden" /></label>
                <label class="form-label">
                  Tag
                  <select v-model="exp.tag" class="field">
                    <option value="">— Geen —</option>
                    <option value="Stage">Stage</option>
                    <option value="Vakantiejob">Vakantiejob</option>
                    <option value="Opleiding">Opleiding</option>
                    <option value="Werk">Werk</option>
                  </select>
                </label>
              </div>
            </div>
            <button class="btn-ghost btn-sm" type="button" style="margin-top:0.75rem;" @click="addExperience">+ Ervaring toevoegen</button>
          </div>

          <div class="form-actions">
            <button class="btn-action" :disabled="aboutSaving" @click="saveAbout">{{ aboutSaving ? 'Opslaan…' : 'Opslaan' }}</button>
          </div>
        </div>
      </section>

      <!-- ── Blog ── -->
      <section class="admin-section">
        <div class="section-head">
          <h2 class="section-title">Blog</h2>
          <button class="btn-action" @click="startNewBlog">+ Nieuwe post</button>
        </div>

        <div v-if="showBlogForm" class="form-card">
          <h3 class="form-title">{{ editingBlogId !== null ? 'Post bewerken' : 'Nieuwe post' }}</h3>

          <label class="form-label form-single">
            Datum (JJJJ-MM-DD) <span class="form-hint">— voor sortering</span>
            <input v-model="blogForm.date_iso" type="date" class="field" />
          </label>

          <div class="bilingual-grid">
            <div class="lang-col">
              <div class="lang-tag">EN</div>
              <label class="form-label">Date (display)<input v-model="blogForm.date_en" type="text" class="field" placeholder="April 15, 2025" /></label>
              <label class="form-label">Title<input v-model="blogForm.title_en" type="text" class="field" placeholder="Post title" /></label>
              <label class="form-label">Summary <span class="form-hint">(shown in list)</span><textarea v-model="blogForm.summary_en" class="field field-textarea" placeholder="Short teaser…" /></label>
              <label class="form-label">Content <span class="form-hint">(full post, double newline = new paragraph)</span><textarea v-model="blogForm.content_en" class="field field-textarea field-lg" placeholder="Write your post…" /></label>
            </div>
            <div class="lang-col">
              <div class="lang-tag">NL</div>
              <label class="form-label">Datum (weergave)<input v-model="blogForm.date_nl" type="text" class="field" placeholder="15 april 2025" /></label>
              <label class="form-label">Titel<input v-model="blogForm.title_nl" type="text" class="field" placeholder="Posttitel" /></label>
              <label class="form-label">Samenvatting <span class="form-hint">(zichtbaar in lijst)</span><textarea v-model="blogForm.summary_nl" class="field field-textarea" placeholder="Korte teaser…" /></label>
              <label class="form-label">Inhoud <span class="form-hint">(volledige post, dubbele newline = nieuwe alinea)</span><textarea v-model="blogForm.content_nl" class="field field-textarea field-lg" placeholder="Schrijf je post…" /></label>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-action" :disabled="blogSaving" @click="saveBlog">{{ blogSaving ? 'Opslaan…' : 'Opslaan' }}</button>
            <button class="btn-ghost" @click="cancelBlogForm">Annuleren</button>
          </div>
        </div>

        <div class="item-list">
          <div v-for="post in blogPosts" :key="post.id" class="item-row">
            <div class="item-meta-col">
              <div class="item-cat">Blog</div>
              <div class="item-date">{{ post.date_en || post.date_nl }}</div>
            </div>
            <div class="item-info">
              <div class="item-title">{{ post.title_en || post.title_nl }}</div>
            </div>
            <div class="item-actions">
              <NuxtLink :to="`/blog/${post.id}`" target="_blank" class="btn-icon">Bekijk</NuxtLink>
              <button class="btn-icon" @click="startEditBlog(post)">Bewerk</button>
              <button class="btn-icon btn-icon-danger" @click="deleteBlog(post.id)">Verwijder</button>
            </div>
          </div>
          <div v-if="!blogPosts.length" class="empty-state">Nog geen blogposts.</div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.admin-wrap { min-height: 100vh; background: var(--bg); color: var(--text); font-family: var(--body); }

/* Login */
.login-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
.login-box { width: 100%; max-width: 380px; padding: 2rem; }
.login-eyebrow { font-family: var(--mono); font-size: 0.6rem; color: var(--accent); letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 0.75rem; }
.login-title { font-family: var(--display); font-size: 2.5rem; color: var(--white); font-weight: 900; margin-bottom: 2rem; }
.login-form { display: flex; flex-direction: column; gap: 1rem; }
.login-error { font-family: var(--mono); font-size: 0.65rem; color: var(--accent); }

/* Layout */
.admin-inner { max-width: 1100px; margin: 0 auto; padding: 3rem 2rem 6rem; }
.admin-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 4rem; padding-bottom: 2rem; border-bottom: 1px solid var(--border); }
.admin-eyebrow { font-family: var(--mono); font-size: 0.6rem; color: var(--accent); letter-spacing: 0.25em; text-transform: uppercase; display: block; margin-bottom: 0.5rem; }
.admin-title { font-family: var(--display); font-size: 2rem; color: var(--white); font-weight: 900; }
.admin-section { margin-bottom: 4rem; }
.section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.section-title { font-family: var(--mono); font-size: 0.65rem; color: var(--white); letter-spacing: 0.2em; text-transform: uppercase; }

/* Form */
.form-card { background: var(--surface); border: 1px solid var(--border); padding: 2rem; margin-bottom: 1.5rem; }
.form-title { font-family: var(--display); font-size: 1.1rem; color: var(--white); font-weight: 700; margin-bottom: 1.5rem; }

/* Bilingual grid */
.bilingual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); margin-bottom: 1.5rem; }
.lang-col { background: var(--bg); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.85rem; }
.lang-tag { font-family: var(--mono); font-size: 0.6rem; color: var(--accent); letter-spacing: 0.2em; font-weight: 700; margin-bottom: 0.25rem; }

.form-label { display: flex; flex-direction: column; gap: 0.35rem; font-family: var(--mono); font-size: 0.55rem; color: var(--text); letter-spacing: 0.15em; text-transform: uppercase; }
.form-hint { font-size: 0.5rem; color: var(--text); letter-spacing: 0.05em; text-transform: none; font-family: var(--body); opacity: 0.6; }

.form-single { display: flex; flex-direction: column; gap: 0.4rem; font-family: var(--mono); font-size: 0.55rem; color: var(--text); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1.25rem; }

.form-block { margin-bottom: 1.5rem; }
.form-block-label { font-family: var(--mono); font-size: 0.6rem; color: var(--text); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 0.75rem; }

.form-actions { display: flex; gap: 0.75rem; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border); margin-top: 1.5rem; }

/* Fields */
.field { background: var(--surface); border: 1px solid var(--border); color: var(--white); font-family: var(--body); font-size: 0.85rem; padding: 0.6rem 0.8rem; outline: none; transition: border-color 0.2s; width: 100%; }
.field:focus { border-color: var(--accent); }
.field-textarea { resize: vertical; min-height: 70px; }
.field-lg { min-height: 130px; }

/* Photos */
.photos-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.photo-thumb { position: relative; width: 110px; height: 80px; overflow: hidden; background: var(--bg); border: 1px solid var(--border); }
.photo-thumb img { width: 100%; height: 100%; object-fit: cover; }
.photo-remove { position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; background: var(--accent); color: var(--white); border: none; cursor: pointer; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; }
.photo-add { width: 110px; height: 80px; border: 1px dashed var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; font-family: var(--mono); font-size: 0.6rem; color: var(--text); letter-spacing: 0.1em; text-transform: uppercase; transition: border-color 0.2s, color 0.2s; }
.photo-add:hover { border-color: var(--accent); color: var(--accent); }
.photo-add.loading { opacity: 0.5; pointer-events: none; }
.photo-input { display: none; }

/* Collaborators */
.collab-rows { display: flex; flex-direction: column; gap: 0.5rem; }
.collab-row { display: grid; grid-template-columns: 1fr 1fr auto; gap: 0.5rem; align-items: center; }

/* CV */
.cv-row { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
.cv-url-field { flex: 1; min-width: 0; font-size: 0.75rem; color: var(--text); }
.no-cv-yet { font-family: var(--mono); font-size: 0.6rem; color: var(--text); letter-spacing: 0.1em; }

/* Experience form */
.exp-form-block { border: 1px solid var(--border); padding: 1.25rem; margin-bottom: 0.75rem; }
.exp-form-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.exp-form-num { font-family: var(--mono); font-size: 0.6rem; color: var(--accent); letter-spacing: 0.1em; }

/* Item list */
.item-list { display: flex; flex-direction: column; gap: 1px; }
.item-row { display: grid; grid-template-columns: 3rem 1fr auto; align-items: center; gap: 1.5rem; padding: 1.25rem 0; border-bottom: 1px solid var(--border); }
.item-row:first-child { border-top: 1px solid var(--border); }
.item-num { font-family: var(--mono); font-size: 0.65rem; color: var(--accent); letter-spacing: 0.1em; }
.item-meta-col { display: flex; flex-direction: column; gap: 0.25rem; min-width: 130px; }
.item-cat { font-family: var(--mono); font-size: 0.55rem; color: var(--accent); letter-spacing: 0.2em; text-transform: uppercase; }
.item-date { font-family: var(--mono); font-size: 0.6rem; color: var(--text); }
.item-title { font-size: 0.9rem; color: var(--white); }
.item-actions { display: flex; gap: 0.5rem; }
.empty-state { font-family: var(--mono); font-size: 0.65rem; color: var(--text); letter-spacing: 0.1em; padding: 1.5rem 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }

/* Buttons */
.btn-action { font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.75rem 1.5rem; background: var(--accent); color: var(--white); border: 1px solid var(--accent); cursor: pointer; transition: all 0.2s; }
.btn-action:hover:not(:disabled) { background: transparent; color: var(--accent); }
.btn-action:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-ghost { font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.75rem 1.5rem; background: transparent; color: var(--text); border: 1px solid var(--border); cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; }
.btn-ghost:hover { border-color: var(--white); color: var(--white); }
.btn-sm { padding: 0.5rem 1rem; }
.btn-icon { font-family: var(--mono); font-size: 0.55rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.4rem 0.8rem; background: transparent; color: var(--text); border: 1px solid var(--border); cursor: pointer; transition: all 0.2s; white-space: nowrap; text-decoration: none; display: inline-block; }
.btn-icon:hover { border-color: var(--white); color: var(--white); }
.btn-icon-danger:hover { border-color: var(--accent); color: var(--accent); }
</style>
