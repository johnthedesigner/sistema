import { oklch, formatHex, wcagContrast, toGamut } from 'culori'
import type { Oklch } from 'culori'

const mapToGamut = toGamut('rgb', 'oklch')

const STOPS = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950] as const
type StopValue = (typeof STOPS)[number]

export interface PaletteStop {
  hex: string
  contrast_white: number
  contrast_black: number
}

export interface PaletteResult {
  seed: string
  stops: Record<string, PaletteStop>
}

// Logarithmic distribution: 1.01 × (19.0/1.01)^(i/18) for i=0..18
// Places midpoint (stop 500, i=9) at 4.38:1 — within the WCAG working range
function targetContrast(i: number): number {
  return 1.01 * Math.pow(19.0 / 1.01, i / 18)
}

// Chroma scaling prevents sRGB gamut clipping at extreme lightness values.
// sin curve peaks at L=0.5 and approaches 0 at L=0 and L=1.
function chromaScale(L: number): number {
  return Math.sin(Math.PI * L)
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function normalizeHex(hex: string): string {
  return hex.startsWith('#') ? hex : '#' + hex
}

function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex)
}

interface Candidate {
  hex: string
  contrastWhite: number
  contrastBlack: number
}

function buildCandidates(seed: Oklch): Candidate[] {
  const candidates: Candidate[] = []
  const hue = seed.h ?? 0

  for (let L = 0.02; L <= 0.985; L += 0.001) {
    const C = seed.c * chromaScale(L)
    const color: Oklch = { mode: 'oklch', l: L, c: C, h: hue }
    // Map to nearest in-gamut sRGB; toGamut reduces chroma as needed
    const inGamut = mapToGamut(color)
    if (!inGamut) continue
    const hex = formatHex(inGamut)
    if (!hex) continue

    candidates.push({
      hex,
      contrastWhite: wcagContrast(hex, '#ffffff'),
      contrastBlack: wcagContrast(hex, '#000000'),
    })
  }

  return candidates
}

export function generatePalette(seedHex: string): PaletteResult {
  const normalized = normalizeHex(seedHex)
  if (!isValidHex(normalized)) {
    throw new Error(`Invalid hex color: ${seedHex}`)
  }

  const seed = oklch(normalized)
  if (!seed) throw new Error(`Could not parse color: ${seedHex}`)

  const candidates = buildCandidates(seed)
  if (candidates.length === 0) {
    throw new Error(`No valid candidates generated for seed: ${seedHex}`)
  }

  const stops: Record<string, PaletteStop> = {}

  STOPS.forEach((stop, i) => {
    const target = targetContrast(i)
    let best = candidates[0]
    let bestDiff = Math.abs(candidates[0].contrastWhite - target)

    for (let j = 1; j < candidates.length; j++) {
      const diff = Math.abs(candidates[j].contrastWhite - target)
      if (diff < bestDiff) {
        best = candidates[j]
        bestDiff = diff
      }
    }

    stops[String(stop) as unknown as StopValue] = {
      hex: best.hex,
      contrast_white: round2(best.contrastWhite),
      contrast_black: round2(best.contrastBlack),
    }
  })

  return { seed: normalized, stops }
}

export function generatePalettes(
  colors: Record<string, string>
): Record<string, PaletteResult> {
  const result: Record<string, PaletteResult> = {}
  for (const [name, hex] of Object.entries(colors)) {
    result[name] = generatePalette(hex)
  }
  return result
}
