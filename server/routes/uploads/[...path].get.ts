import { readFile } from 'node:fs/promises'
import { resolve, extname } from 'node:path'

const uploadDir = resolve(
  process.cwd(),
  process.env.NODE_ENV === 'production' ? 'data/uploads' : 'public/uploads',
)

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'path') as string
  if (!slug) throw createError({ statusCode: 404 })

  const filePath = resolve(uploadDir, slug)
  if (!filePath.startsWith(uploadDir)) throw createError({ statusCode: 403 })

  try {
    const buffer = await readFile(filePath)
    setResponseHeader(event, 'Content-Type', MIME[extname(filePath).toLowerCase()] ?? 'application/octet-stream')
    setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
    return buffer
  } catch {
    throw createError({ statusCode: 404 })
  }
})
