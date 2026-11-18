/**
 * Generates public/palettes/library.json: the pre-built palettes plays use for
 * feedback hues. Uses the same algorithm as the palette API (src/lib/palette.ts),
 * so the library and the API can't drift. src/lib/palette.test.ts checks that
 * the committed file matches. Run: npm run palettes
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { generatePalette, type PaletteResult } from '../src/lib/palette'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

// --- Seeds ---

const SEEDS: Record<string, string> = {
  slate:   '#475569',
  gray:    '#4b5563',
  zinc:    '#52525b',
  neutral: '#525252',
  stone:   '#57534e',
  red:     '#dc2626',
  orange:  '#ea580c',
  amber:   '#d97706',
  yellow:  '#FFCC33',
  lime:    '#65a30d',
  green:   '#16a34a',
  emerald: '#059669',
  teal:    '#0d9488',
  cyan:    '#0891b2',
  sky:     '#0284c7',
  blue:    '#2563eb',
  indigo:  '#4f46e5',
  violet:  '#7c3aed',
  purple:  '#9333ea',
  fuchsia: '#c026d3',
  pink:    '#db2777',
  rose:    '#e11d48',
}

// --- Run ---

console.log(`Generating ${Object.keys(SEEDS).length} palettes...`)
const start = Date.now()

const palettes: Record<string, PaletteResult> = {}
for (const [name, hex] of Object.entries(SEEDS)) {
  palettes[name] = generatePalette(hex)
  process.stdout.write('.')
}
console.log()

const outDir = path.join(ROOT, 'public', 'palettes')
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, 'library.json'), JSON.stringify(palettes, null, 2))

const elapsed = ((Date.now() - start) / 1000).toFixed(1)
console.log(`Done in ${elapsed}s → public/palettes/library.json`)
