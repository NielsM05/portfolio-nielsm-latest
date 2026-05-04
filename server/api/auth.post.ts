export default defineEventHandler(async (event) => {
  const { password } = await readBody(event)
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) throw createError({ statusCode: 500, message: 'ADMIN_PASSWORD niet ingesteld' })
  if (password !== adminPassword) throw createError({ statusCode: 401, message: 'Ongeldig wachtwoord' })

  setCookie(event, 'admin_token', password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
  })
  return { ok: true }
})
