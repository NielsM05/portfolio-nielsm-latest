export default defineEventHandler(async (event) => {
  const { token } = getQuery(event)

  if (!token || typeof token !== 'string') {
    throw createError({ statusCode: 400, message: 'Ongeldige token' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (!apiKey || !audienceId) throw createError({ statusCode: 500, message: 'Service niet beschikbaar' })

  const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts/${token}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (!res.ok) throw createError({ statusCode: 404, message: 'Token niet gevonden' })

  return { ok: true }
})
