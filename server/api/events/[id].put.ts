import { readData, writeData } from '../../utils/db'
import { requireAuth } from '../../utils/auth'

interface Event {
  id: number
  date: string
  type: string
  title: string
  description: string
  linkedinUrl: string
}

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const events = await readData<Event>('events')
  const idx = events.findIndex(e => e.id === id)
  if (idx === -1) throw createError({ statusCode: 404, message: 'Event niet gevonden' })
  events[idx] = { ...events[idx], ...body, id }
  await writeData('events', events)
  return events[idx]
})
