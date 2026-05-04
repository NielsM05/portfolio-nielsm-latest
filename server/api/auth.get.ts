import { requireAuth } from '../utils/auth'

export default defineEventHandler((event) => {
  requireAuth(event)
  return { ok: true }
})
