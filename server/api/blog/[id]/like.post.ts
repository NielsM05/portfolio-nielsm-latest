import { readData, writeData } from '../../../utils/db'

interface BlogPost { id: number; likes?: number; [key: string]: unknown }

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const posts = await readData<BlogPost>('blog')
  const idx = posts.findIndex(p => p.id === id)
  if (idx === -1) throw createError({ statusCode: 404 })
  posts[idx].likes = (posts[idx].likes ?? 0) + 1
  await writeData('blog', posts)
  return { likes: posts[idx].likes }
})
