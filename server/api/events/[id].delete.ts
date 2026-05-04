import { readData, writeData } from '../../utils/db'
import { requireAuth } from '../../utils/auth'

interface Event { id: number; [key: string]: unknown }

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  const events = await readData<Event>('events')
  const filtered = events.filter(e => e.id !== id)
  if (filtered.length === events.length) throw createError({ statusCode: 404, message: 'Event niet gevonden' })
  await writeData('events', filtered)
  return { ok: true }
})
