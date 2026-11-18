/**
 * Shared color input for every tool (V2.1, tool-apis.md section 1).
 * Accepts hex (#RGB, #RRGGBB, with or without #), rgb() in modern or legacy
 * syntax, and oklch(). Returns sRGB hex plus OKLCH. Out-of-gamut OKLCH is
 * mapped into sRGB and flagged. Anything else is rejected with a message that
 * names the accepted formats.
 */
import { formatHex, oklch as toOklch, parse, rgb as toRgb, toGamut, type Oklch } from 'culori'

export const ACCEPTED_FORMATS = 'hex (#1F5FD1 or #15D), rgb(31 95 209), or oklch(0.52 0.19 261)'

export interface ParsedColor {
  /** The input as given. */
  input: string
  /** sRGB hex, uppercase, 6 digits. */
  hex: string
  /** oklch(L C H), from the sRGB value. */
  oklch: string
  /** True when an oklch() input was outside sRGB and was mapped into it. */
  mapped: boolean
}

export type ColorResult = { ok: true; color: ParsedColor } | { ok: false; error: string }

const HEX_RE = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
const FUNC_RE = /^(rgb|rgba|oklch)\(/i
const mapToGamut = toGamut('rgb', 'oklch')
const EPS = 1e-4

const round = (n: number, d: number) => {
  const f = 10 ** d
  return Math.round(n * f) / f
}

export function formatOklch(c: Oklch): string {
  const l = round(c.l, 3)
  const ch = round(c.c, 3)
  const h = ch === 0 || c.h === undefined || Number.isNaN(c.h) ? 0 : round(c.h, 1)
  return `oklch(${l} ${ch} ${h})`
}

function inSrgb(rgb: { r: number; g: number; b: number }): boolean {
  return [rgb.r, rgb.g, rgb.b].every(v => v >= -EPS && v <= 1 + EPS)
}

export function parseColor(raw: unknown): ColorResult {
  if (typeof raw !== 'string' || !raw.trim()) {
    return { ok: false, error: `Color must be a string: ${ACCEPTED_FORMATS}` }
  }
  const input = raw.trim()

  let mapped = false
  let hex: string | undefined

  const hexMatch = input.match(HEX_RE)
  if (hexMatch) {
    const h = hexMatch[1]
    hex = '#' + (h.length === 3 ? [...h].map(ch => ch + ch).join('') : h)
  } else {
    const fn = input.match(FUNC_RE)?.[1]?.toLowerCase()
    const parsed = fn ? parse(input) : undefined
    if (!fn || !parsed) {
      return { ok: false, error: `"${input}" is not a supported color. Use ${ACCEPTED_FORMATS}.` }
    }
    if (parsed.alpha !== undefined && parsed.alpha < 1) {
      return { ok: false, error: `"${input}" has transparency. Use an opaque color: ${ACCEPTED_FORMATS}.` }
    }
    if (parsed.mode === 'oklch' && !inSrgb(toRgb(parsed))) {
      mapped = true
      hex = formatHex(mapToGamut(parsed))
    } else {
      hex = formatHex(parsed)
    }
  }

  if (!hex) return { ok: false, error: `"${input}" could not be converted. Use ${ACCEPTED_FORMATS}.` }
  hex = hex.toUpperCase()
  const ok = toOklch(hex) as Oklch
  return { ok: true, color: { input, hex, oklch: formatOklch(ok), mapped } }
}
