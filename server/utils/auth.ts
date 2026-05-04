import type { H3Event } from 'h3'

export function requireAuth(event: H3Event) {
  const token = getCookie(event, 'admin_token')
  const password = process.env.ADMIN_PASSWORD
  if (!password) throw createError({ statusCode: 500, message: 'ADMIN_PASSWORD niet ingesteld' })
  if (token !== password) throw createError({ statusCode: 401, message: 'Niet geautoriseerd' })
}
