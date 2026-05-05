import { readData, writeData } from '../../utils/db'
import { requireAuth } from '../../utils/auth'

interface BlogPost {
  id: number
  date_iso: string
  date_en: string
  date_nl: string
  title_en: string
  title_nl: string
  summary_en: string
  summary_nl: string
  blocks: unknown[]
  content_en: string
  content_nl: string
}

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const body = await readBody(event)
  const posts = await readData<BlogPost>('blog')
  const newPost: BlogPost = {
    id: posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1,
    date_iso: body.date_iso ?? '',
    date_en: body.date_en ?? '',
    date_nl: body.date_nl ?? '',
    title_en: body.title_en ?? '',
    title_nl: body.title_nl ?? '',
    summary_en: body.summary_en ?? '',
    summary_nl: body.summary_nl ?? '',
    blocks: body.blocks ?? [],
    likes: 0,
    content_en: '',
    content_nl: '',
  }
  posts.push(newPost)
  await writeData('blog', posts)
  return newPost
})
