#!/usr/bin/env node
// Screenshots the homepage at 1200×630 and saves it as public/og-image.png.
//
// Requires a production build first:
//   npm run build && npm run og
//   — or combined: npm run build:og
//
// One-time browser setup (after installing playwright):
//   npx playwright install chromium
import { chromium } from 'playwright'
import { spawn } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUTPUT = resolve(ROOT, 'public/og-image.png')
const PORT = 3099

async function waitForServer(url, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      if ((await fetch(url)).ok) return
    } catch { /* not ready yet */ }
    await new Promise(r => setTimeout(r, 400))
  }
  throw new Error(`Server at ${url} did not respond within ${timeoutMs}ms`)
}

async function main() {
  const server = spawn('npx', ['next', 'start', '--port', String(PORT)], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  server.stderr.on('data', d => process.stderr.write(d))

  try {
    console.log('Starting server on port', PORT, '...')
    await waitForServer(`http://localhost:${PORT}`)

    const browser = await chromium.launch()
    const page = await browser.newPage()
    await page.setViewportSize({ width: 1200, height: 630 })
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle' })
    await page.screenshot({
      path: OUTPUT,
      clip: { x: 0, y: 0, width: 1200, height: 630 },
    })
    await browser.close()
    console.log('  public/og-image.png')
    console.log('Done.')
  } finally {
    server.kill()
  }
}

main().catch(err => { console.error(err); process.exit(1) })
