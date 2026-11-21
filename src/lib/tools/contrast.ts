/**
 * Contrast checks for the contrast API (V2.2). Required values come from the
 * rules registry (color.contrast.text, color.contrast.large-text,
 * color.contrast.ui) for the requested standard and level, so the API follows
 * the project's standard like every play does. Default: WCAG 2.2 AA (D11).
 */
import { wcagContrast } from 'culori'
import { parseColor, type ParsedColor } from '@/lib/color'
import type { Rule } from '@/lib/content/schema'
import { chooseStandard as choose, knownStandards, ruleValue, rulesFrom, type StandardChoice } from './standards'

export const DEFAULT_STANDARD = 'wcag-2.2'
export const DEFAULT_LEVEL = 'AA'

export const CONTRAST_CHECKS = {
  text: 'color.contrast.text',
  large_text: 'color.contrast.large-text',
  ui: 'color.contrast.ui',
} as const
type CheckName = keyof typeof CONTRAST_CHECKS

/** The three contrast rules, read from content/rules/color.yaml. */
export function contrastRules(): Rule[] {
  const ids = new Set<string>(Object.values(CONTRAST_CHECKS))
  return rulesFrom('color').filter(r => ids.has(r.id))
}

/** Contrast always has a standard: WCAG 2.2 AA unless one is given (D11). */
export function chooseStandard(standardRaw: unknown, levelRaw: unknown, rules = contrastRules()): StandardChoice {
  return choose(standardRaw, levelRaw, knownStandards(rules), { standard: DEFAULT_STANDARD, level: DEFAULT_LEVEL })!
}

export const requiredRatio = ruleValue

/** Required ratios by standard, level, and check, for the contrast page (which can't read the rules itself). */
export type ContrastTable = Record<string, Record<string, Partial<Record<CheckName, number>>>>

export function contrastTable(rules = contrastRules()): ContrastTable {
  const table: ContrastTable = {}
  for (const standard of knownStandards(rules)) {
    table[standard] = {}
    // Offer a level only if some contrast rule defines it for this standard.
    const levels = ['AA', 'AAA'].filter(l => rules.some(r => typeof r.parameters?.[standard]?.[l] === 'number'))
    for (const level of levels) {
      const row: Partial<Record<CheckName, number>> = {}
      for (const [name, id] of Object.entries(CONTRAST_CHECKS) as Array<[CheckName, string]>) {
        const rule = rules.find(r => r.id === id)
        const v = rule ? ruleValue(rule, standard, level) : null
        if (v !== null) row[name] = v
      }
      table[standard][level] = row
    }
  }
  return table
}

export interface Check {
  rule: string
  required: number
  pass: boolean
}

/** A color as the API reports it: hex, OKLCH, and `mapped: true` only when it was mapped into sRGB. */
export interface ColorOut {
  hex: string
  oklch: string
  mapped?: true
}

/**
 * What a pair is for. A check name limits the checks to that one; `informational`
 * reports the ratio with no checks, for boundaries no standard requires (a
 * decorative divider, a status dot beside its word). Omitted: every check.
 */
export const PURPOSES = ['text', 'large_text', 'ui', 'informational'] as const
export type Purpose = (typeof PURPOSES)[number]

export type PairResult =
  | {
      label?: string
      purpose?: Purpose
      foreground: ColorOut
      background: ColorOut
      ratio: number
      checks: Partial<Record<CheckName, Check>>
    }
  | { label?: string; error: string }

const colorOut = ({ hex, oklch, mapped }: ParsedColor): ColorOut => (mapped ? { hex, oklch, mapped: true } : { hex, oklch })

/** Check one pair. Passing is judged on the unrounded ratio; WCAG doesn't round up. */
export function checkPair(foreground: unknown, background: unknown, standard: string, level: string, label?: string, rules = contrastRules(), purposeRaw?: unknown): PairResult {
  const lab = typeof label === 'string' && label ? { label } : {}
  if (purposeRaw !== undefined && purposeRaw !== null && purposeRaw !== '' && !(PURPOSES as readonly unknown[]).includes(purposeRaw))
    return { ...lab, error: `"purpose" must be one of: ${PURPOSES.join(', ')} (got ${JSON.stringify(purposeRaw)}).` }
  const purpose = (purposeRaw || undefined) as Purpose | undefined
  const fg = parseColor(foreground)
  if (!fg.ok) return { ...lab, error: `Invalid foreground color. ${fg.error}` }
  const bg = parseColor(background)
  if (!bg.ok) return { ...lab, error: `Invalid background color. ${bg.error}` }
  const exact = wcagContrast(fg.color.hex, bg.color.hex)
  const checks: Partial<Record<CheckName, Check>> = {}
  for (const [name, id] of Object.entries(CONTRAST_CHECKS) as Array<[CheckName, string]>) {
    if (purpose && purpose !== name) continue
    const rule = rules.find(r => r.id === id)
    const required = rule ? requiredRatio(rule, standard, level) : null
    if (required !== null) checks[name] = { rule: id, required, pass: exact >= required }
  }
  return { ...lab, ...(purpose ? { purpose } : {}), foreground: colorOut(fg.color), background: colorOut(bg.color), ratio: Math.round(exact * 100) / 100, checks }
}
