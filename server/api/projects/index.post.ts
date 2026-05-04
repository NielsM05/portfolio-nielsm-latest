import { readData, writeData } from '../../utils/db'
import { requireAuth } from '../../utils/auth'

interface Collaborator { name: string; linkedinUrl: string }

interface Project {
  id: number
  category_en: string
  category_nl: string
  title_en: string
  title_nl: string
  description_en: string
  description_nl: string
  content_en: string
  content_nl: string
  externalLink: string
  photos: string[]
  collaborators: Collaborator[]
}

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const body = await readBody(event)
  const projects = await readData<Project>('projects')
  const newProject: Project = {
    id: projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1,
    category_en: body.category_en ?? '',
    category_nl: body.category_nl ?? '',
    title_en: body.title_en ?? '',
    title_nl: body.title_nl ?? '',
    description_en: body.description_en ?? '',
    description_nl: body.description_nl ?? '',
    content_en: body.content_en ?? '',
    content_nl: body.content_nl ?? '',
    externalLink: body.externalLink ?? '',
    photos: body.photos ?? [],
    collaborators: body.collaborators ?? [],
  }
  projects.push(newProject)
  await writeData('projects', projects)
  return newProject
})
