import { readData, writeData } from '../../utils/db'
import { requireAuth } from '../../utils/auth'

interface Event {
  id: number
  date_en: string
  date_nl: string
  type_en: string
  type_nl: string
  title_en: string
  title_nl: string
  description_en: string
  description_nl: string
  linkedinUrl: string
}

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const body = await readBody(event)
  const events = await readData<Event>('events')
  const newEvent: Event = {
    id: events.length ? Math.max(...events.map(e => e.id)) + 1 : 1,
    date_en: body.date_en ?? '',
    date_nl: body.date_nl ?? '',
    type_en: body.type_en ?? '',
    type_nl: body.type_nl ?? '',
    title_en: body.title_en ?? '',
    title_nl: body.title_nl ?? '',
    description_en: body.description_en ?? '',
    description_nl: body.description_nl ?? '',
    linkedinUrl: body.linkedinUrl ?? '',
  }
  events.push(newEvent)
  await writeData('events', events)
  return newEvent
})
