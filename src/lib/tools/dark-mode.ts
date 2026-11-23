/**
 * Dark mode mapping (D40). From a light theme's color roles, each pointing at a
 * ramp stop, propose the dark theme the color guide describes
 * (guide.color.architecture#stops-in-a-dark-theme, D29):
 * - surfaces step one stop at a time from the dark end (color.dark.surface-steps);
 * - brand surfaces and their text keep their stops ("the same, or a step lighter");
 * - everything else mirrors, stop n to 1000 - n (color.dark.tonal-shift).
 * Then check every pair in both themes, and suggest the nearest passing stop for a failure.
 */
import { parseColor } from '@/lib/color'
import { generatePalettes } from '@/lib/palette'
import { checkPair, contrastRules, type PairResult, type Purpose } from './contrast'
import { rolePairs } from './pairs'
import { flatten } from './tokens'

/** Dark surface stops (color.dark.surface-steps; the guide's table for hover, selected, and menu highlights). */
export const DARK_SURFACE_STEPS: Record<string, number> = {
  surface: 950,
  'surface-subtle': 950,
  'surface-raised': 900,
  'surface-featured': 850,
  'surface-hover': 850,
  'surface-overlay': 800,
  'surface-selected': 800,
  'surface-highlight': 750,
}

const KEEPS_STOP = /^(on-)?surface-brand(-|$)/

/** A ramp stop, white or black, or a fixed value that isn't on a ramp (kept as it is). */
export type Ref = { ramp: string; stop: number } | 'white' | 'black' | { fixed: string }

/** Read a role's light value: "{palette.neutral.50}", "neutral.50", "neutral 50", "white", or "black". */
export function parseRef(raw: unknown): { ok: true; ref: Ref; path?: string } | { ok: false; error: string } {
  if (typeof raw !== 'string' || !raw.trim()) return { ok: false, error: 'give a ramp and stop, such as "neutral.50" or "{palette.neutral.50}"' }
  const alias = raw.trim().match(/^\{([^{}]+)\}$/)?.[1]
  const text = alias ?? raw.trim()
  if (/(^|\.)white$/i.test(text)) return { ok: true, ref: 'white', path: alias }
  if (/(^|\.)black$/i.test(text)) return { ok: true, ref: 'black', path: alias }
  const m = text.match(/(?:^|\.)([a-z][a-z0-9-]*)[ .-](\d{2,3})$/i)
  if (m) {
    const stop = Number(m[2])
    if (stop % 50 === 0 && stop >= 50 && stop <= 950) return { ok: true, ref: { ramp: m[1], stop }, path: alias }
  }
  return { ok: false, error: `"${raw}" isn't a ramp stop. Give a ramp and stop from 50 to 950, such as "neutral.50", or white or black.` }
}

const refText = (r: Ref) => (typeof r === 'string' ? r : 'fixed' in r ? r.fixed : `${r.ramp}.${r.stop}`)
const isStop = (r: Ref): r is { ramp: string; stop: number } => typeof r !== 'string' && 'ramp' in r

export interface DarkRole {
  light: string
  dark: string
  how: 'surface step' | 'mirrored' | 'kept (brand)' | 'kept (not on a ramp)'
  hex?: { light: string; dark: string }
}

export interface PairCheck {
  foreground: string
  background: string
  purpose: Purpose
  light?: { ratio: number; pass: boolean }
  dark?: { ratio: number; pass: boolean }
  suggestion?: string
}

export interface DarkModeResult {
  standard: string
  level: string
  roles: Record<string, DarkRole>
  /** The dark mode file, ready to save as tokens/src/color.dark.json. */
  tokens: { color: Record<string, { $type: 'color'; $value: string }> }
  pairs: PairCheck[]
  notes: string[]
}

type Hexes = (r: Ref) => string | undefined

/** Hex values for ramp stops, from a DTCG palette file or from seeds through the palette tool. */
export function hexSource(palette: unknown, colors: Record<string, string> | undefined): Hexes {
  const table = new Map<string, string>()
  const byPath = new Map<string, string>()
  if (palette && typeof palette === 'object') {
    for (const t of flatten(palette, 'palette.json')) {
      if (typeof t.value === 'string') byPath.set(t.name, t.value)
      const m = t.name.match(/(?:^|\.)([a-z][a-z0-9-]*)\.(\d{2,3})$/i)
      if (m && typeof t.value === 'string') table.set(`${m[1]}.${Number(m[2])}`, t.value)
    }
  }
  if (colors) {
    for (const [ramp, result] of Object.entries(generatePalettes(colors))) {
      for (const [stop, s] of Object.entries(result.stops)) if (!table.has(`${ramp}.${Number(stop)}`)) table.set(`${ramp}.${Number(stop)}`, s.hex)
    }
  }
  return r => {
    if (r === 'white') return '#FFFFFF'
    if (r === 'black') return '#000000'
    if ('fixed' in r) {
      const path = r.fixed.match(/^\{([^{}]+)\}$/)?.[1]
      const value = path ? byPath.get(path) : r.fixed
      const parsed = value ? parseColor(value) : undefined
      return parsed?.ok ? parsed.color.hex : undefined
    }
    return table.get(`${r.ramp}.${r.stop}`)
  }
}

const mirror = (r: Ref): Ref => (r === 'white' ? 'black' : r === 'black' ? 'white' : isStop(r) ? { ramp: r.ramp, stop: 1000 - r.stop } : r)

export function mapDarkMode(
  input: Record<string, Ref>,
  opts: { hex: Hexes; standard: string; level: string; paths?: Record<string, string | undefined> },
): DarkModeResult {
  const notes: string[] = []
  const surfaceRef = input.surface
  const surfaceRamp = surfaceRef && isStop(surfaceRef) ? surfaceRef.ramp : 'neutral'
  const dark: Record<string, Ref> = {}
  const how: Record<string, DarkRole['how']> = {}
  for (const [role, ref] of Object.entries(input)) {
    if (typeof ref !== 'string' && 'fixed' in ref) {
      dark[role] = ref
      how[role] = 'kept (not on a ramp)'
    } else if (role in DARK_SURFACE_STEPS) {
      const ramp = isStop(ref) ? ref.ramp : surfaceRamp
      dark[role] = { ramp, stop: DARK_SURFACE_STEPS[role] }
      how[role] = 'surface step'
    } else if (KEEPS_STOP.test(role)) {
      dark[role] = ref
      how[role] = 'kept (brand)'
    } else {
      dark[role] = mirror(ref)
      how[role] = 'mirrored'
    }
  }

  // Aliases in the same shape the light roles used, so the file drops into the project.
  const prefix = Object.values(opts.paths ?? {}).map(p => p?.match(/^(.*)\.[a-z][a-z0-9-]*\.\d{2,3}$/i)?.[1]).find(Boolean) ?? 'palette'
  const whitePath = Object.values(opts.paths ?? {}).find(p => p && /(^|\.)white$/i.test(p)) ?? `${prefix}.white`
  const alias = (r: Ref) => (typeof r !== 'string' && 'fixed' in r ? r.fixed : `{${r === 'white' ? whitePath : r === 'black' ? whitePath.replace(/white$/i, 'black') : `${prefix}.${r.ramp}.${r.stop}`}}`)

  const roles: Record<string, DarkRole> = {}
  let missingHex = false
  for (const role of Object.keys(input)) {
    const lightHex = opts.hex(input[role])
    const darkHex = opts.hex(dark[role])
    if (!lightHex || !darkHex) missingHex = true
    roles[role] = { light: refText(input[role]), dark: refText(dark[role]), how: how[role], ...(lightHex && darkHex ? { hex: { light: lightHex, dark: darkHex } } : {}) }
  }
  const fixed = Object.keys(input).filter(r => how[r] === 'kept (not on a ramp)')
  if (fixed.length) notes.push(`Not on a ramp, so kept as they are: ${fixed.join(', ')}. Choose their dark values by hand, and check their pairs.`)
  if (missingHex) notes.push('Some stops have no color value, so their pairs are not checked. Send the palette file, or the seed colors as "colors".')
  if (input['surface-hover'] && input['surface-overlay']) notes.push('Hover is 850 on panels. On menus (800), use one stop lighter, 750, as surface-highlight.')

  const rules = contrastRules()
  const ratioOf = (fg: string | undefined, bg: string | undefined, purpose: Purpose) => {
    if (!fg || !bg) return undefined
    const r = checkPair(fg, bg, opts.standard, opts.level, undefined, rules, purpose) as Extract<PairResult, { ratio: number }>
    const checks = Object.values(r.checks)
    return { ratio: r.ratio, pass: checks.every(c => !c || c.pass) }
  }
  const pairs: PairCheck[] = rolePairs(Object.keys(input)).map(p => {
    const lightCheck = ratioOf(opts.hex(input[p.foreground]), opts.hex(input[p.background]), p.purpose)
    const darkCheck = ratioOf(opts.hex(dark[p.foreground]), opts.hex(dark[p.background]), p.purpose)
    const out: PairCheck = { ...p, ...(lightCheck ? { light: lightCheck } : {}), ...(darkCheck ? { dark: darkCheck } : {}) }
    const fgRef = dark[p.foreground]
    if (darkCheck && !darkCheck.pass && isStop(fgRef)) {
      // The nearest stop on the foreground's ramp that passes on the dark background.
      for (let d = 50; d <= 900; d += 50) {
        const hit = [fgRef.stop - d, fgRef.stop + d].find(stop => {
          if (stop < 50 || stop > 950) return false
          const c = ratioOf(opts.hex({ ramp: fgRef.ramp, stop }), opts.hex(dark[p.background]), p.purpose)
          return c?.pass
        })
        if (hit) {
          out.suggestion = `${p.foreground} at ${fgRef.ramp}.${hit} passes in dark.`
          break
        }
      }
    }
    return out
  })

  const tokens = { color: Object.fromEntries(Object.keys(input).map(role => [role, { $type: 'color' as const, $value: alias(dark[role]) }])) }
  return { standard: opts.standard, level: opts.level, roles, tokens, pairs, notes }
}
