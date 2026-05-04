import { readData, writeData } from '../../utils/db'
import { requireAuth } from '../../utils/auth'

interface Project {
  id: number
  category: string
  title: string
  description: string
  link: string
  linkLabel: string
}

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const body = await readBody(event)
  const projects = await readData<Project>('projects')
  const newProject: Project = {
    id: projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1,
    category: body.category,
    title: body.title,
    description: body.description,
    link: body.link || '#',
    linkLabel: body.linkLabel || 'Lees meer →',
  }
  projects.push(newProject)
  await writeData('projects', projects)
  return newProject
})
