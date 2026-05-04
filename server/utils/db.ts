import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const dataDir = resolve(process.cwd(), 'server/data')

export async function readData<T>(name: string): Promise<T[]> {
  try {
    const content = await readFile(resolve(dataDir, `${name}.json`), 'utf-8')
    return JSON.parse(content)
  } catch {
    return []
  }
}

export async function writeData<T>(name: string, data: T[]): Promise<void> {
  await writeFile(resolve(dataDir, `${name}.json`), JSON.stringify(data, null, 2), 'utf-8')
}
