#!/usr/bin/env node
// Generates PNG favicon variants from src/app/icon.svg.
// Run once after changing the logo: npm run favicons
// Requires sharp: already listed in devDependencies.
import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const svg = readFileSync(resolve(ROOT, 'src/app/icon.svg'))
const PUBLIC = resolve(ROOT, 'public')

mkdirSync(PUBLIC, { recursive: true })

// padding adds white breathing room so the mark doesn't bleed to the edge
const targets = [
  { name: 'apple-touch-icon.png', canvas: 180, padding: 18 },
  { name: 'icon-192.png',         canvas: 192, padding: 20 },
  { name: 'icon-512.png',         canvas: 512, padding: 54 },
]

for (const { name, canvas, padding } of targets) {
  const inner = canvas - padding * 2
  await sharp(svg)
    .resize(inner, inner, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .extend({ top: padding, bottom: padding, left: padding, right: padding,
              background: { r: 255, g: 255, b: 255, alpha: 255 } })
    .png()
    .toFile(resolve(PUBLIC, name))
  console.log(`  public/${name}  (${canvas}×${canvas})`)
}

console.log('Done.')
