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
  const body = await readBody(event)
  const events = await readData<Event>('events')
  const newEvent: Event = {
    id: events.length ? Math.max(...events.map(e => e.id)) + 1 : 1,
    date: body.date,
    type: body.type,
    title: body.title,
    description: body.description,
    linkedinUrl: body.linkedinUrl || '#',
  }
  events.push(newEvent)
  await writeData('events', events)
  return newEvent
})
