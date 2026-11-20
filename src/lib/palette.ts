/**
 * Palette generation (V3.4, docs/v2/palette-next.md). Three fixed rules, each
 * set by one named constant:
 *
 * 1. Eased contrast curve. Stops are placed by contrast against white from
 *    1.01 to 19, on a curve that eases in and out, so steps are fine near white
 *    and black, where surfaces live, and wider through the mid-tones. Stop 500
 *    sits at 4.38:1.
 * 2. Colorfulness by lightness, the same for every hue. The seed sets how
 *    colorful the ramp is; one shared curve sets how colorfulness rises from
 *    white (in proportion to distance from white), holds through the
 *    mid-tones (and up to the seed's own lightness for bright seeds), and
 *    falls toward black. Where a hue can't reach the target on screen, chroma
 *    approaches the limit smoothly instead of hitting it, so no single stop is
 *    adjusted on its own.
 * 3. Yellows lean warm as they darken. Hues in the yellow band rotate toward
 *    orange in proportion to how dark the stop is, because dark yellow doesn't
 *    exist on screens: without the turn, dark yellows can only be olive.
 */
import { oklch, formatHex, wcagContrast, toGamut, type Oklch } from 'culori'
import { formatOklch } from './color'

const mapToGamut = toGamut('rgb', 'oklch')

const STOPS = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950] as const

export interface PaletteStop {
  hex: string
  /** oklch(L C H), on the scale CSS and the palette tool use. */
  oklch: string
  contrast_white: number
  contrast_black: number
}

export interface PaletteResult {
  seed: string
  stops: Record<string, PaletteStop>
}

/** Rule 1: how strongly the contrast curve eases at both ends (0 = an even logarithmic curve). */
export const EASE = 0.45
/** Rule 2: lightness where colorfulness reaches its full value coming down from white, and where it starts to fall toward black. */
export const CHROMA_PLATEAU = { light: 0.8, dark: 0.32 }
/** Rule 2: how sharply chroma approaches a hue's on-screen limit (higher = closer to a hard limit). */
export const SOFT_LIMIT = 6
/** Rule 3: the yellow band (center and half-width, OKLCH hue degrees), and the most a stop turns at black. */
export const YELLOW = { center: 92, halfWidth: 38, maxTurn: 34 }

export function easedT(t: number, k = EASE): number {
  return t - (k * Math.sin(2 * Math.PI * t)) / (2 * Math.PI)
}

/** Rule 1: the contrast against white that stop i (0 = 50, 18 = 950) aims for. */
export function targetContrast(i: number, k = EASE): number {
  return 1.01 * Math.pow(19 / 1.01, easedT(i / 18, k))
}

/** The highest OKLCH chroma that stays in sRGB at this lightness and hue. */
function maxChroma(L: number, h: number): number {
  let lo = 0
  let hi = 0.5
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) / 2
    const m = mapToGamut({ mode: 'oklch', l: L, c: mid, h })
    const mc = m ? (oklch(m)?.c ?? 0) : 0
    if (Math.abs(mc - mid) < 0.001) lo = mid
    else hi = mid
  }
  return lo
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/**
 * Rule 2's shared curve: 0 at white, rising in proportion to distance from
 * white until the plateau, 1 through the mid-tones, easing down toward black
 * (darks keep some color). The plateau reaches up to the seed's own lightness
 * when the seed is lighter than usual (bright yellows), so the seed's
 * brightness survives in its ramp.
 */
export function chromaShape(L: number, seedL = 0.5): number {
  const edge = Math.max(CHROMA_PLATEAU.light, Math.min(0.92, seedL + 0.02))
  const fromWhite = Math.min(1, Math.max(0, (0.995 - L) / (0.995 - edge)))
  const fromBlack = 0.35 + 0.65 * smoothstep(0.05, CHROMA_PLATEAU.dark, L)
  return Math.min(fromWhite, fromBlack)
}

/** Rule 3: degrees a hue turns toward orange at lightness L. */
export function yellowTurn(h: number, L: number): number {
  const d = Math.abs(((h - YELLOW.center + 540) % 360) - 180)
  if (d >= YELLOW.halfWidth) return 0
  const inBand = Math.cos((Math.PI / 2) * (d / YELLOW.halfWidth)) ** 2
  const darkness = smoothstep(0.78, 0.22, L)
  return YELLOW.maxTurn * inBand * darkness
}

/** Rule 2's soft limit: close to `target` when there's room, approaching `limit` smoothly when there isn't. */
const soft = (target: number, limit: number) =>
  limit <= 0 ? 0 : (target * limit) / Math.pow(target ** SOFT_LIMIT + limit ** SOFT_LIMIT, 1 / SOFT_LIMIT)

const round2 = (n: number) => Math.round(n * 100) / 100
const normalizeHex = (hex: string) => (hex.startsWith('#') ? hex : '#' + hex)
const isValidHex = (hex: string) => /^#[0-9a-fA-F]{6}$/.test(hex)

interface Candidate {
  hex: string
  contrastWhite: number
  contrastBlack: number
}

function buildCandidates(seed: Oklch): Candidate[] {
  const hue = seed.h ?? 0
  // The seed sets the ramp's colorfulness: its chroma at its own place on the curve.
  const amplitude = (seed.c ?? 0) / Math.max(0.25, chromaShape(seed.l, seed.l))
  const candidates: Candidate[] = []
  for (let L = 0.02; L <= 0.99; L += 0.001) {
    const h = hue - yellowTurn(hue, L)
    const limit = maxChroma(L, h) * 0.98
    const c = soft(amplitude * chromaShape(L, seed.l), limit)
    const m = mapToGamut({ mode: 'oklch', l: L, c, h })
    const hex = m ? formatHex(m) : undefined
    if (!hex) continue
    candidates.push({ hex, contrastWhite: wcagContrast(hex, '#ffffff'), contrastBlack: wcagContrast(hex, '#000000') })
  }
  return candidates
}

export function generatePalette(seedHex: string): PaletteResult {
  const normalized = normalizeHex(seedHex)
  if (!isValidHex(normalized)) throw new Error(`Invalid hex color: ${seedHex}`)
  const seed = oklch(normalized)
  if (!seed) throw new Error(`Could not parse color: ${seedHex}`)

  const candidates = buildCandidates(seed)
  if (candidates.length === 0) throw new Error(`No valid candidates generated for seed: ${seedHex}`)

  const stops: Record<string, PaletteStop> = {}
  STOPS.forEach((stop, i) => {
    const target = targetContrast(i)
    let best = candidates[0]
    for (const c of candidates) if (Math.abs(c.contrastWhite - target) < Math.abs(best.contrastWhite - target)) best = c
    stops[String(stop)] = {
      hex: best.hex,
      oklch: formatOklch(oklch(best.hex) as Oklch),
      contrast_white: round2(best.contrastWhite),
      contrast_black: round2(best.contrastBlack),
    }
  })
  return { seed: normalized, stops }
}

export function generatePalettes(colors: Record<string, string>): Record<string, PaletteResult> {
  const result: Record<string, PaletteResult> = {}
  for (const [name, hex] of Object.entries(colors)) result[name] = generatePalette(hex)
  return result
}
