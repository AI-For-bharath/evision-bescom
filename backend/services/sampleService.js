import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataPath = join(__dirname, '..', 'data', 'sample.json')

function loadSample() {
  const raw = readFileSync(dataPath, 'utf8')
  return JSON.parse(raw)
}

export function getMetrics() {
  return loadSample()
}
