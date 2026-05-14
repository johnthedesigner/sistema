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

// Binary-search the maximum in-gamut OKLCH chroma for a given L and hue.
// The sRGB gamut boundary varies significantly by hue — yellows and greens can
// support much higher chroma at mid-L than a light seed color's raw C value
// would suggest, which is why capping at seed.c produced washed-out palettes.
function findMaxChroma(L: number, hue: number): number {
  let lo = 0
  let hi = 0.5
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2
    const color: Oklch = { mode: 'oklch', l: L, c: mid, h: hue }
    const mapped = mapToGamut(color)
    const mappedC = mapped ? (oklch(mapped)?.c ?? 0) : 0
    if (Math.abs(mappedC - mid) < 0.001) {
      lo = mid
    } else {
      hi = mid
    }
  }
  return lo
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

  // Compute how saturated the seed is relative to the gamut boundary at its
  // own lightness. Applying this ratio at each L produces a palette where the
  // seed's vibrancy is preserved regardless of where it sits on the L axis.
  const maxChromaAtSeedL = findMaxChroma(seed.l, hue)
  const saturation = maxChromaAtSeedL > 0 ? Math.min(1, seed.c / maxChromaAtSeedL) : 0

  // Normalize the sin taper to the seed's own lightness rather than always
  // peaking at L=0.5. For mid-L seeds (blue, red) this is ≈1 and has no
  // effect. For high-L seeds (yellow at L=0.93) this ensures light stops taper
  // proportionally — avoiding oversaturation at the pale end — while midtones
  // remain at full gamut-relative saturation.
  const taperAtSeedL = Math.sin(Math.PI * seed.l)

  for (let L = 0.02; L <= 0.985; L += 0.001) {
    const rawTaper = Math.min(1, Math.sin(Math.PI * L) / taperAtSeedL)
    const taper = (1 + rawTaper) / 2
    const C = findMaxChroma(L, hue) * saturation * taper
    const color: Oklch = { mode: 'oklch', l: L, c: C, h: hue }
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
