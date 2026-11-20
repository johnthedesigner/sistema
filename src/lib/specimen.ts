/**
 * The specimen tool (D25, docs/v2/aesthetic-baseline.md). Turns a few visual
 * choices into a complete set of roles, applying Sistema's craft baseline:
 * quiet levels separate a little, emphasis surfaces separate a lot, borders
 * only where the edge shows function, radius scaled to the element, shadow
 * only on what lifts or floats. Every color is a stop from a palette tool ramp
 * (or white), and the role reports which one.
 *
 * Pure: the API route, the tool page, and the tests share it.
 */
import { generatePalette, type PaletteResult } from './palette'
import { parseColor } from './color'
import { formatHex, oklch as toOklch } from 'culori'

export const PRESENCE = ['quiet', 'brand', 'tinted'] as const
export const WARMTH = ['cool', 'neutral', 'warm'] as const
export const SEPARATION = ['tone', 'line', 'shadow'] as const
export const DENSITY = ['compact', 'comfortable', 'spacious'] as const
export const THEMES = ['light', 'dark'] as const
export const CHIPS = ['scaled', 'pill'] as const
/** Kinds of page the specimen can render the same choices on. */
export const LAYOUTS = ['operations', 'dashboard', 'record', 'marketing', 'article', 'shop'] as const

/** Typefaces the render page can load from Google Fonts. */
export const FONTS = [
  'Instrument Sans', 'Inter', 'Geist', 'IBM Plex Sans', 'Source Sans 3', 'Public Sans', 'DM Sans',
  'Manrope', 'Figtree', 'Onest', 'Hanken Grotesk', 'Schibsted Grotesk', 'Work Sans', 'Libre Franklin',
  'Plus Jakarta Sans', 'Atkinson Hyperlegible Next', 'Albert Sans', 'Bricolage Grotesque',
] as const
export const DISPLAY_FONTS = [
  ...FONTS, 'Fraunces', 'Newsreader', 'Instrument Serif', 'Source Serif 4', 'Literata', 'Space Grotesk',
] as const

export const SPECIMEN_LIMITS = { radius: { min: 0, max: 20 } } as const

export interface SpecimenInput {
  accent?: string
  neutral?: string
  presence?: string
  radius?: number
  chips?: string
  separation?: string
  density?: string
  font?: string
  display_font?: string
  theme?: string
  layout?: string
}

export interface Role {
  hex: string
  /** Where the color comes from: "neutral 50", "accent 600", "white". */
  from: string
}

export interface Specimen {
  input: Required<Omit<SpecimenInput, 'neutral' | 'display_font'>> & { neutral: string; display_font: string }
  seeds: { accent: string; neutral: string }
  colors: Record<string, Role>
  radius: Record<string, number>
  type: Record<string, { size: number; weight: number; line_height: number; tracking: number }>
  space: { control_height: number; row_height: number; panel_padding: number; gap: number; page_padding: number }
  shadows: Record<string, string>
  notes: string[]
}

export type SpecimenResult = { ok: true; specimen: Specimen } | { ok: false; error: string }

const DEFAULTS = {
  accent: '#1E6B5C',
  presence: 'quiet',
  radius: 8,
  chips: 'scaled',
  separation: 'tone',
  density: 'comfortable',
  font: 'Instrument Sans',
  theme: 'light',
  layout: 'operations',
  warmth: 'neutral',
} as const

function oneOf<T extends readonly string[]>(name: string, value: unknown, allowed: T, fallback: T[number]): T[number] | string {
  if (value === undefined || value === null || value === '') return fallback
  if (typeof value === 'string' && (allowed as readonly string[]).includes(value)) return value
  return `"${name}" must be one of: ${allowed.join(', ')} (got ${JSON.stringify(value)}).`
}

/** A neutral seed from the warmth choice, or the accent's hue at very low chroma. */
function neutralSeed(warmth: string, accentHex: string): string {
  const a = toOklch(accentHex)!
  const hue = warmth === 'cool' ? 255 : warmth === 'warm' ? 65 : (a.h ?? 0)
  const chroma = warmth === 'neutral' ? 0.006 : 0.014
  return formatHex({ mode: 'oklch', l: 0.55, c: chroma, h: hue })!.toUpperCase()
}

// Feedback hues: the library seeds, so specimen roles match library.json.
const FEEDBACK_SEEDS = { red: '#dc2626', amber: '#d97706', green: '#16a34a', blue: '#2563eb' } as const

// Ramps are deterministic per seed, so keep the ones already computed.
const RAMPS = new Map<string, PaletteResult>()
function ramp(hex: string): PaletteResult {
  const key = hex.toUpperCase()
  let r = RAMPS.get(key)
  if (!r) {
    r = generatePalette(key)
    if (RAMPS.size > 200) RAMPS.clear()
    RAMPS.set(key, r)
  }
  return r
}

export function buildSpecimen(raw: SpecimenInput = {}): SpecimenResult {
  const accentIn = parseColor(raw.accent ?? DEFAULTS.accent)
  if (!accentIn.ok) return { ok: false, error: `"accent": ${accentIn.error}` }

  let neutralHex: string
  let warmthLabel: string
  const nRaw = raw.neutral
  if (nRaw === undefined || nRaw === '' || (WARMTH as readonly string[]).includes(String(nRaw))) {
    warmthLabel = (nRaw as string) || DEFAULTS.warmth
    neutralHex = neutralSeed(warmthLabel, accentIn.color.hex)
  } else {
    const n = parseColor(nRaw)
    if (!n.ok) return { ok: false, error: `"neutral" is cool, neutral, warm, or a color: ${n.error}` }
    neutralHex = n.color.hex
    warmthLabel = n.color.hex
  }

  const checks = {
    presence: oneOf('presence', raw.presence, PRESENCE, DEFAULTS.presence),
    chips: oneOf('chips', raw.chips, CHIPS, DEFAULTS.chips),
    separation: oneOf('separation', raw.separation, SEPARATION, DEFAULTS.separation),
    density: oneOf('density', raw.density, DENSITY, DEFAULTS.density),
    theme: oneOf('theme', raw.theme, THEMES, DEFAULTS.theme),
    layout: oneOf('layout', raw.layout, LAYOUTS, DEFAULTS.layout),
    font: oneOf('font', raw.font, FONTS, DEFAULTS.font),
    display_font: oneOf('display_font', raw.display_font, DISPLAY_FONTS, ((raw.font as string) ?? DEFAULTS.font) as (typeof DISPLAY_FONTS)[number]),
  }
  for (const v of Object.values(checks)) if (v.startsWith('"')) return { ok: false, error: v }
  const { presence, chips, separation, density, theme, font, layout } = checks
  const display_font = checks.display_font

  const r = raw.radius === undefined || (raw.radius as unknown) === '' ? DEFAULTS.radius : Number(raw.radius)
  const { min, max } = SPECIMEN_LIMITS.radius
  if (!Number.isFinite(r) || r < min || r > max) return { ok: false, error: `"radius" is the control radius in px, from ${min} to ${max} (got ${JSON.stringify(raw.radius)}).` }

  const ramps: Record<string, PaletteResult> = {
    accent: ramp(accentIn.color.hex),
    neutral: ramp(neutralHex),
    ...Object.fromEntries(Object.entries(FEEDBACK_SEEDS).map(([k, v]) => [k, ramp(v)])),
  }
  const s = (ramp: string, stop: number): Role => ({ hex: ramps[ramp].stops[String(stop)].hex.toUpperCase(), from: `${ramp} ${stop}` })
  const white: Role = { hex: '#FFFFFF', from: 'white' }
  const dark = theme === 'dark'

  // ── Colors ────────────────────────────────────────────────────────────────
  const c: Record<string, Role> = {}
  const notes: string[] = []

  if (!dark) {
    // Quiet levels: the page and its zones differ by one small step.
    c.canvas = separation === 'line' ? white : s('neutral', 50)
    c.surface = white
    c['surface-subtle'] = separation === 'line' ? s('neutral', 50) : s('neutral', 50)
    c['surface-hover'] = s('neutral', 150)
    c['row-hover'] = s('neutral', 50)
    c['surface-overlay'] = white
    // Emphasis: the featured surface lifts much further than a panel (see shadows).
    c['surface-featured'] = white
    c['surface-inverse'] = s('neutral', 850)
    c['on-inverse'] = s('neutral', 50)
    c['on-inverse-muted'] = s('neutral', 350)
    c['surface-brand'] = s('accent', 600)
    c['on-brand'] = white
    c['on-brand-muted'] = s('accent', 200)
    c.text = s('neutral', 850)
    c['text-secondary'] = s('neutral', 600)
    c['text-tertiary'] = s('neutral', 550)
    c['text-disabled'] = s('neutral', 400)
    c.hairline = s('neutral', 200)
    c['border-control'] = s('neutral', 450)
    c['border-quiet'] = s('neutral', 250)
    c.primary = s('accent', 550)
    c['primary-hover'] = s('accent', 650)
    c['on-primary'] = white
    c['accent-subtle'] = s('accent', 150)
    c['on-accent-subtle'] = s('accent', 750)
    c.link = s('accent', 600)
    c.focus = s('accent', 500)
    c['selected-row'] = s('accent', 50)
    for (const [k, ramp] of [['success', 'green'], ['warning', 'amber'], ['error', 'red'], ['info', 'blue']] as const) {
      c[`${k}-container`] = s(ramp, 150)
      c[`on-${k}-container`] = s(ramp, 750)
      c[`${k}-dot`] = s(ramp, k === 'warning' ? 450 : 550)
    }
    c['neutral-container'] = s('neutral', 150)
    c['on-neutral-container'] = s('neutral', 650)
    c['neutral-dot'] = s('neutral', 400)
    // Data and imagery: one accent series, a quiet comparison series, a soft area.
    c['chart-1'] = s('accent', 500)
    c['chart-2'] = s('neutral', 300)
    c['chart-area'] = s('accent', 150)
    c['image-1'] = s('neutral', 150)
    c['image-2'] = s('accent', 150)
    c['image-ink'] = s('neutral', 750)
    c['image-accent'] = s('accent', 450)
  } else {
    // Quiet levels step one stop at a time (color.dark.surface-steps): page 950,
    // panels 900. Mirroring the light stops gave a step about seven times the
    // light theme's (D29).
    c.canvas = s('neutral', 950)
    c.surface = separation === 'line' ? s('neutral', 950) : s('neutral', 900)
    c['surface-subtle'] = s('neutral', 950)
    c['surface-hover'] = s('neutral', 850)
    c['row-hover'] = s('neutral', 850)
    c['surface-overlay'] = s('neutral', 800)
    c['surface-featured'] = s('neutral', 850)
    c['surface-inverse'] = s('neutral', 150)
    c['on-inverse'] = s('neutral', 850)
    c['on-inverse-muted'] = s('neutral', 600)
    c['surface-brand'] = s('accent', 600)
    c['on-brand'] = white
    c['on-brand-muted'] = s('accent', 200)
    c.text = s('neutral', 50)
    c['text-secondary'] = s('neutral', 350)
    c['text-tertiary'] = s('neutral', 400)
    c['text-disabled'] = s('neutral', 600)
    c.hairline = s('neutral', 750)
    c['border-control'] = s('neutral', 500)
    c['border-quiet'] = s('neutral', 700)
    // A lighter fill with dark text, so the filled control still stands out
    // from dark panels (checked boxes, the primary button).
    c.primary = s('accent', 450)
    c['primary-hover'] = s('accent', 400)
    c['on-primary'] = s('accent', 950)
    c['accent-subtle'] = s('accent', 800)
    c['on-accent-subtle'] = s('accent', 250)
    c.link = s('accent', 400)
    c.focus = s('accent', 400)
    c['selected-row'] = s('accent', 850)
    for (const [k, ramp] of [['success', 'green'], ['warning', 'amber'], ['error', 'red'], ['info', 'blue']] as const) {
      c[`${k}-container`] = s(ramp, 850)
      c[`on-${k}-container`] = s(ramp, 250)
      c[`${k}-dot`] = s(ramp, 400)
    }
    c['neutral-container'] = s('neutral', 750)
    c['on-neutral-container'] = s('neutral', 250)
    c['neutral-dot'] = s('neutral', 450)
    c['chart-1'] = s('accent', 400)
    c['chart-2'] = s('neutral', 600)
    c['chart-area'] = s('accent', 850)
    c['image-1'] = s('neutral', 800)
    c['image-2'] = s('accent', 850)
    c['image-ink'] = s('neutral', 250)
    c['image-accent'] = s('accent', 400)
  }

  // Color presence: how far the accent reaches beyond actions and focus.
  if (presence === 'quiet') {
    c['nav-bg'] = c['surface-subtle']
    c['nav-text'] = c['text-secondary']
    c['nav-selected'] = c['surface-hover']
    c['on-nav-selected'] = c.text
  } else if (presence === 'brand') {
    c['nav-bg'] = c['surface-subtle']
    c['nav-text'] = c['text-secondary']
    c['nav-selected'] = c['accent-subtle']
    c['on-nav-selected'] = c['on-accent-subtle']
  } else {
    // Tinted: the brand carries the frame. The navigation is a deep accent block,
    // and the page takes the faintest accent tint.
    c['nav-bg'] = dark ? s('accent', 950) : s('accent', 800)
    c['nav-text'] = dark ? s('accent', 350) : s('accent', 250)
    c['nav-selected'] = dark ? s('accent', 800) : s('accent', 700)
    c['on-nav-selected'] = white
    if (!dark) c.canvas = separation === 'line' ? white : s('accent', 50)
  }

  // ── Radius: scaled to the element ─────────────────────────────────────────
  const rr = (n: number) => Math.round(n)
  const radius = {
    control: rr(r),
    chip: chips === 'pill' ? 999 : rr(Math.max(r > 0 ? 2 : 0, r * 0.6)),
    small: rr(r * 0.75),
    panel: r === 0 ? 0 : rr(r * 1.5),
    featured: r === 0 ? 0 : rr(r * 1.75),
    overlay: r === 0 ? 0 : rr(r * 1.25),
  }

  // ── Density: type and rhythm ──────────────────────────────────────────────
  const D = {
    compact: { body: 13, small: 12, label: 11, heading: 15, title: 20, metric: 24, control: 28, row: 34, pad: 16, gap: 12, page: 20 },
    comfortable: { body: 14, small: 12.5, label: 11, heading: 16, title: 22, metric: 28, control: 32, row: 42, pad: 20, gap: 16, page: 28 },
    spacious: { body: 15, small: 13, label: 11.5, heading: 18, title: 26, metric: 32, control: 38, row: 50, pad: 24, gap: 20, page: 36 },
  }[density as 'compact' | 'comfortable' | 'spacious']

  const type = {
    title: { size: D.title, weight: 600, line_height: 1.2, tracking: -0.02 },
    heading: { size: D.heading, weight: 600, line_height: 1.3, tracking: -0.01 },
    metric: { size: D.metric, weight: 500, line_height: 1.1, tracking: -0.025 },
    body: { size: D.body, weight: 400, line_height: 1.5, tracking: 0 },
    'body-strong': { size: D.body, weight: 500, line_height: 1.5, tracking: 0 },
    small: { size: D.small, weight: 400, line_height: 1.45, tracking: 0 },
    label: { size: D.label, weight: 500, line_height: 1.3, tracking: 0.02 },
  }

  // ── Shadows: only for what lifts or floats ────────────────────────────────
  const ink = dark ? '0 0 0' : hexToRgb(ramps.neutral.stops['950'].hex)
  const a = (x: number) => `rgb(${ink} / ${dark ? Math.min(1, x * 3) : x})`
  const shadows = {
    none: 'none',
    control: `0 1px 2px ${a(0.06)}`,
    panel: separation === 'shadow' ? `0 1px 2px ${a(0.05)}, 0 2px 6px ${a(0.04)}` : 'none',
    featured: `0 1px 2px ${a(0.04)}, 0 6px 16px -4px ${a(0.08)}, 0 24px 48px -12px ${a(0.14)}`,
    overlay: `0 0 0 1px ${a(0.06)}, 0 4px 8px -2px ${a(0.08)}, 0 16px 32px -8px ${a(0.16)}`,
  }

  if (dark) notes.push('Dark theme: raised and floating surfaces get lighter as well as casting shadow, because shadow alone barely shows on a dark page.')
  if (separation === 'line') notes.push('Line separation: panels sit on the same color as the page and are outlined with a hairline.')
  if (separation === 'tone') notes.push('Tone separation: panels are one small step lighter than the page, with no outline.')
  if (separation === 'shadow') notes.push('Shadow separation: panels lift slightly with a soft shadow, with no outline.')
  notes.push('The featured surface always separates much more strongly than ordinary panels, whatever the separation choice.')

  return {
    ok: true,
    specimen: {
      input: {
        accent: accentIn.color.hex, neutral: warmthLabel, presence, radius: r, chips, separation, density, font, display_font, theme, layout,
      },
      seeds: { accent: accentIn.color.hex, neutral: neutralHex },
      colors: c,
      radius,
      type,
      space: { control_height: D.control, row_height: D.row, panel_padding: D.pad, gap: D.gap, page_padding: D.page },
      shadows,
      notes,
    },
  }
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '')
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)).join(' ')
}
