import { readData, writeData } from '../../utils/db'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const { ids } = await readBody<{ ids: number[] }>(event)
  const projects = await readData<{ id: number }>('projects')
  const reordered = ids.map(id => projects.find(p => p.id === id)).filter(Boolean)
  await writeData('projects', reordered)
  return reordered
})
