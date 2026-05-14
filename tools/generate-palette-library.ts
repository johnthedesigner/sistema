/**
 * Generates the pre-built palette library from Tailwind's 22 color families
 * (using each family's -600 stop as the seed). Output is written to
 * public/palettes/library.json and served as a static asset.
 *
 * Run from repo root: npx tsx tools/generate-palette-library.ts
 *
 * Note: imports culori via require() (CJS bundle) to avoid ESM interop issues
 * when running outside the Next.js build pipeline.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const culori = require('culori') as typeof import('culori')
const { oklch, formatHex, wcagContrast, toGamut } = culori

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// --- Algorithm (mirrors src/lib/palette.ts) ---

const toGamutRgb = toGamut('rgb', 'oklch')

const STOPS = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950]

function targetContrast(i: number): number {
  return 1.01 * Math.pow(19.0 / 1.01, i / 18)
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

interface PaletteStop { hex: string; contrast_white: number; contrast_black: number }
interface PaletteResult { seed: string; stops: Record<string, PaletteStop> }

function findMaxChroma(L: number, hue: number): number {
  let lo = 0
  let hi = 0.5
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2
    const mapped = toGamutRgb({ mode: 'oklch', l: L, c: mid, h: hue })
    const mappedC = mapped ? (oklch(mapped)?.c ?? 0) : 0
    if (Math.abs(mappedC - mid) < 0.001) {
      lo = mid
    } else {
      hi = mid
    }
  }
  return lo
}

function generatePalette(seedHex: string): PaletteResult {
  const seed = oklch(seedHex)!
  const hue = seed.h ?? 0
  const candidates: { hex: string; cw: number; cb: number }[] = []

  const maxChromaAtSeedL = findMaxChroma(seed.l, hue)
  const saturation = maxChromaAtSeedL > 0 ? Math.min(1, seed.c / maxChromaAtSeedL) : 0

  for (let L = 0.02; L <= 0.985; L += 0.001) {
    const C = findMaxChroma(L, hue) * saturation
    const inGamut = toGamutRgb({ mode: 'oklch', l: L, c: C, h: hue })
    if (!inGamut) continue
    const hex = formatHex(inGamut)
    if (!hex) continue
    candidates.push({
      hex,
      cw: wcagContrast(hex, '#ffffff'),
      cb: wcagContrast(hex, '#000000'),
    })
  }

  const stops: Record<string, PaletteStop> = {}
  STOPS.forEach((stop, i) => {
    const target = targetContrast(i)
    let best = candidates[0]
    let bestDiff = Infinity
    for (const c of candidates) {
      const diff = Math.abs(c.cw - target)
      if (diff < bestDiff) { best = c; bestDiff = diff }
    }
    stops[String(stop)] = {
      hex: best.hex,
      contrast_white: round2(best.cw),
      contrast_black: round2(best.cb),
    }
  })

  return { seed: seedHex, stops }
}

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
  yellow:  '#ca8a04',
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
