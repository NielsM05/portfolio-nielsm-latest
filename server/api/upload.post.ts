import { requireAuth } from '../utils/auth'
import { writeFile, mkdir } from 'node:fs/promises'
import { resolve, extname } from 'node:path'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 10 * 1024 * 1024

const uploadDir = resolve(
  process.cwd(),
  process.env.NODE_ENV === 'production' ? 'server/data/uploads' : 'public/uploads',
)

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const form = await readMultipartFormData(event)
  const file = form?.find(f => f.name === 'file')
  if (!file?.data || !file.filename) {
    throw createError({ statusCode: 400, message: 'Geen bestand gevonden' })
  }
  if (file.type && !ALLOWED_TYPES.includes(file.type)) {
    throw createError({ statusCode: 400, message: 'Alleen afbeeldingen toegestaan' })
  }
  if (file.data.length > MAX_SIZE) {
    throw createError({ statusCode: 400, message: 'Bestand te groot (max 10MB)' })
  }
  const ext = extname(file.filename).toLowerCase() || '.jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  await mkdir(uploadDir, { recursive: true })
  await writeFile(resolve(uploadDir, filename), file.data)
  return { url: `/uploads/${filename}` }
})
