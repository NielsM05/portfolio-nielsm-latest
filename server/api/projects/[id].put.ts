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
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const projects = await readData<Project>('projects')
  const idx = projects.findIndex(p => p.id === id)
  if (idx === -1) throw createError({ statusCode: 404, message: 'Project niet gevonden' })
  projects[idx] = { ...projects[idx], ...body, id }
  await writeData('projects', projects)
  return projects[idx]
})
