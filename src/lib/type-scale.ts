/**
 * Type scale calculation, shared by the API (/api/type-scale) and the tool page
 * (tool-apis.md section 4). Browser-safe: no filesystem access. Registry checks
 * that need the rules files run in the route.
 *
 * Line heights follow the typography guide's "Per-size calibration" bands
 * (guide.typography.architecture#line-height), using the middle of each band
 * (the band's upper value for display). They are starting suggestions; the play
 * sets the final value per role.
 */

export const RATIOS: Record<string, number> = {
  'minor-second': 1.067,
  'major-second': 1.125,
  'minor-third': 1.2,
  'major-third': 1.25,
  'perfect-fourth': 1.333,
  'augmented-fourth': 1.414,
  'perfect-fifth': 1.5,
  'golden-ratio': 1.618,
}

export const NAMING = ['numeric', 'tailwind', 'steps'] as const
export type Naming = (typeof NAMING)[number]

/** Defaults (decision D12): a major third with two steps down gives 10px and 13px under a 16px base. */
export const DEFAULTS = { base: 16, ratio: 'major-third', down: 2, up: 6, names: 'numeric' as Naming, round: true }

export const LIMITS = { base: [10, 32], ratio: [1.01, 2], down: [0, 4], up: [0, 10] } as const

/** Sizes below this get an advisory note (D12). Guidance, not a rule. */
export const SMALL_TEXT_NOTE_PX = 12

export interface TypeScaleInput {
  base?: number
  ratio?: number | string
  down?: number
  up?: number
  names?: Naming
  /** Role names placed on steps, for example { body: 0, label: -1 }. */
  roles?: Record<string, number>
  round?: boolean
}

export interface TypeStep {
  step: number
  name: string
  roles?: string[]
  px: number
  rem: number
  line_height: number
  notes?: string[]
}

export interface TypeScale {
  base: number
  ratio: number
  ratio_name?: string
  names: Naming
  steps: TypeStep[]
  notes?: string[]
}

export type TypeScaleResult = { ok: true; scale: TypeScale } | { ok: false; error: string }

const TAILWIND_UP = ['base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl']
const TAILWIND_DOWN = ['base', 'sm', 'xs', '2xs', '3xs']

const round = (n: number, d: number) => Math.round(n * 10 ** d) / 10 ** d

/**
 * Suggested unitless line height, from the guide's bands. Body text (the step
 * with the body role, or the base step when no roles are given) uses the body
 * band at any size, since it's set for reading rather than display.
 */
export function suggestedLineHeight(px: number, isBody = false): number {
  if (isBody) return 1.5 // body: 1.4 to 1.6
  if (px >= 48) return 1.1 // display / hero: 1.05 to 1.1
  if (px >= 28) return 1.15 // large heading: 1.1 to 1.2
  if (px > 18) return 1.3 // small heading: 1.2 to 1.35
  if (px >= 14) return 1.5 // body: 1.4 to 1.6
  return 1.4 // small / label: 1.3 to 1.5
}

function stepName(step: number, index: number, naming: Naming): string {
  if (naming === 'numeric') return String(index + 1)
  if (naming === 'steps') return String(step)
  return step >= 0 ? TAILWIND_UP[step] : TAILWIND_DOWN[-step]
}

export function resolveRatio(ratio: number | string | undefined): { value: number; name?: string } | null {
  if (ratio === undefined || ratio === '') return { value: RATIOS[DEFAULTS.ratio], name: DEFAULTS.ratio }
  if (typeof ratio === 'string' && ratio in RATIOS) return { value: RATIOS[ratio], name: ratio }
  const n = typeof ratio === 'number' ? ratio : Number(ratio)
  if (!Number.isFinite(n) || n < LIMITS.ratio[0] || n > LIMITS.ratio[1]) return null
  const named = Object.entries(RATIOS).find(([, v]) => v === n)
  return { value: n, name: named?.[0] }
}

export function computeTypeScale(input: TypeScaleInput = {}): TypeScaleResult {
  const base = input.base ?? DEFAULTS.base
  const down = input.down ?? DEFAULTS.down
  const up = input.up ?? DEFAULTS.up
  const names = input.names ?? DEFAULTS.names
  const doRound = input.round ?? DEFAULTS.round

  if (!Number.isFinite(base) || base < LIMITS.base[0] || base > LIMITS.base[1]) return { ok: false, error: `"base" must be a size in px from ${LIMITS.base[0]} to ${LIMITS.base[1]}.` }
  if (!Number.isInteger(down) || down < LIMITS.down[0] || down > LIMITS.down[1]) return { ok: false, error: `"down" must be a whole number from ${LIMITS.down[0]} to ${LIMITS.down[1]}.` }
  if (!Number.isInteger(up) || up < LIMITS.up[0] || up > LIMITS.up[1]) return { ok: false, error: `"up" must be a whole number from ${LIMITS.up[0]} to ${LIMITS.up[1]}.` }
  if (!(NAMING as readonly string[]).includes(names)) return { ok: false, error: `"names" must be one of ${NAMING.join(', ')}.` }
  const ratio = resolveRatio(input.ratio)
  if (!ratio) return { ok: false, error: `"ratio" must be a number from ${LIMITS.ratio[0]} to ${LIMITS.ratio[1]}, or one of ${Object.keys(RATIOS).join(', ')}.` }

  const rolesByStep = new Map<number, string[]>()
  for (const [role, step] of Object.entries(input.roles ?? {})) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(role)) return { ok: false, error: `Role "${role}": use lowercase letters, digits, and hyphens.` }
    if (!Number.isInteger(step) || step < -down || step > up) return { ok: false, error: `Role "${role}" is on step ${step}, outside the scale (${-down} to ${up}).` }
    rolesByStep.set(step, [...(rolesByStep.get(step) ?? []), role])
  }

  // Body text sits on the step named "body", or on the base step when no role is called body.
  const bodyStep = input.roles?.body ?? 0

  const steps: TypeStep[] = []
  for (let step = -down, i = 0; step <= up; step++, i++) {
    const exact = base * Math.pow(ratio.value, step)
    const px = doRound ? Math.round(exact) : round(exact, 2)
    const notes: string[] = []
    if (px < SMALL_TEXT_NOTE_PX) notes.push(`${px}px is below the size most interface text uses; check legibility for this typeface.`)
    const roles = rolesByStep.get(step)
    const isBody = step === bodyStep
    steps.push({
      step,
      name: stepName(step, i, names),
      ...(roles ? { roles } : {}),
      px,
      rem: round(px / 16, 4),
      line_height: suggestedLineHeight(px, isBody),
      ...(notes.length ? { notes } : {}),
    })
  }

  const scaleNotes: string[] = []
  if (names === 'tailwind' && down > 2) scaleNotes.push('Tailwind names only two steps below base (sm, xs); 2xs and 3xs are not Tailwind defaults.')
  if (ratio.value > 1.333 && up > 4) scaleNotes.push('Ratios above 1.333 leave few usable sizes between body and display. The typography guide suggests a tighter scale for interface text, with a separate display scale.')

  return {
    ok: true,
    scale: {
      base,
      ratio: ratio.value,
      ...(ratio.name ? { ratio_name: ratio.name } : {}),
      names,
      steps,
      ...(scaleNotes.length ? { notes: scaleNotes } : {}),
    },
  }
}
