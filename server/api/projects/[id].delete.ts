import { readData, writeData } from '../../utils/db'
import { requireAuth } from '../../utils/auth'

interface Project { id: number; [key: string]: unknown }

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  const projects = await readData<Project>('projects')
  const filtered = projects.filter(p => p.id !== id)
  if (filtered.length === projects.length) throw createError({ statusCode: 404, message: 'Project niet gevonden' })
  await writeData('projects', filtered)
  return { ok: true }
})
