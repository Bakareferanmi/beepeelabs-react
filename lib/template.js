import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Bundled explicitly by Vercel. Avoid an HTTP request back into the deployment,
// which adds latency and fails on previews protected by Vercel authentication.
export function readTemplate() {
  return readFile(join(process.cwd(), 'dist', 'index.html'), 'utf8')
}
