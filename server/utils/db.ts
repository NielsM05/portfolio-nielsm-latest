import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

// In production (Docker) NODE_ENV=production and cwd=/app, so data goes to /app/data
// In development cwd=project root, so data goes to server/data
const dataDir = process.env.DATA_DIR
  ?? resolve(process.cwd(), process.env.NODE_ENV === 'production' ? 'data' : 'server/data')

export async function readData<T>(name: string): Promise<T[]> {
  try {
    const content = await readFile(resolve(dataDir, `${name}.json`), 'utf-8')
    return JSON.parse(content)
  } catch {
    return []
  }
}

export async function writeData<T>(name: string, data: T[]): Promise<void> {
  await mkdir(dataDir, { recursive: true })
  await writeFile(resolve(dataDir, `${name}.json`), JSON.stringify(data, null, 2), 'utf-8')
}
