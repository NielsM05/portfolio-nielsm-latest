import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

// DATA_DIR lets Docker deployments point to a mounted volume
const dataDir = process.env.DATA_DIR ?? resolve(process.cwd(), 'server/data')

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
