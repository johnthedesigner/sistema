/**
 * Contrast checks for the contrast API (V2.2). Required values come from the
 * rules registry (color.contrast.text, color.contrast.large-text,
 * color.contrast.ui) for the requested standard and level, so the API follows
 * the project's standard like every play does. Default: WCAG 2.2 AA (D11).
 */
import fs from 'fs'
import path from 'path'
import { wcagContrast } from 'culori'
import { parseColor, type ParsedColor } from '@/lib/color'
import { parseRuleFile } from '@/lib/content/parse'
import type { Rule } from '@/lib/content/schema'

export const DEFAULT_STANDARD = 'wcag-2.2'
export const DEFAULT_LEVEL = 'AA'
const LEVELS = ['A', 'AA', 'AAA'] as const

export const CONTRAST_CHECKS = {
  text: 'color.contrast.text',
  large_text: 'color.contrast.large-text',
  ui: 'color.contrast.ui',
} as const
type CheckName = keyof typeof CONTRAST_CHECKS

let cached: Rule[] | null = null

/** The three contrast rules, read from content/rules/color.yaml (bundled with the route; see next.config.ts). */
export function contrastRules(rulesFile = path.join(process.cwd(), 'content', 'rules', 'color.yaml')): Rule[] {
  if (cached) return cached
  const parsed = parseRuleFile(fs.readFileSync(rulesFile, 'utf-8'))
  if (!parsed.ok) throw new Error(`Invalid rules file: ${parsed.issues.map(i => i.message).join('; ')}`)
  const ids = new Set<string>(Object.values(CONTRAST_CHECKS))
  cached = parsed.value.filter(r => ids.has(r.id))
  return cached
}

export function knownStandards(rules = contrastRules()): string[] {
  return [...new Set(rules.flatMap(r => Object.keys(r.parameters ?? {})))].sort()
}

export type StandardChoice =
  | { ok: true; standard: string; level: string; defaulted: boolean }
  | { ok: false; error: string }

/**
 * Read the standard and level. Accepts them separately (standard=wcag-2.2&level=AA)
 * or combined, as sistema.json stores them (standard=wcag-2.2 AA).
 */
export function chooseStandard(standardRaw: unknown, levelRaw: unknown, rules = contrastRules()): StandardChoice {
  if (standardRaw === undefined || standardRaw === null || standardRaw === '') {
    return { ok: true, standard: DEFAULT_STANDARD, level: typeof levelRaw === 'string' && levelRaw ? levelRaw.toUpperCase() : DEFAULT_LEVEL, defaulted: true }
  }
  if (typeof standardRaw !== 'string') return { ok: false, error: '"standard" must be a string, for example wcag-2.2' }
  const [std, combinedLevel] = standardRaw.trim().toLowerCase().split(/\s+/)
  const level = (typeof levelRaw === 'string' && levelRaw ? levelRaw : combinedLevel ?? DEFAULT_LEVEL).toUpperCase()
  const known = knownStandards(rules)
  if (!known.includes(std)) return { ok: false, error: `Unknown standard "${standardRaw}". Known standards: ${known.join(', ')}` }
  if (!(LEVELS as readonly string[]).includes(level)) return { ok: false, error: `Unknown level "${level}". Use A, AA, or AAA.` }
  return { ok: true, standard: std, level, defaulted: false }
}

/** The required ratio for a rule at a level: that level's value, or the nearest lower level the standard defines. */
export function requiredRatio(rule: Rule, standard: string, level: string): number | null {
  const values = rule.parameters?.[standard]
  if (!values) return null
  for (let i = LEVELS.indexOf(level as (typeof LEVELS)[number]); i >= 0; i--) {
    const v = values[LEVELS[i]]
    if (typeof v === 'number') return v
  }
  return null
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

export type PairResult =
  | {
      label?: string
      foreground: ColorOut
      background: ColorOut
      ratio: number
      checks: Partial<Record<CheckName, Check>>
    }
  | { label?: string; error: string }

const colorOut = ({ hex, oklch, mapped }: ParsedColor): ColorOut => (mapped ? { hex, oklch, mapped: true } : { hex, oklch })

/** Check one pair. Passing is judged on the unrounded ratio; WCAG doesn't round up. */
export function checkPair(foreground: unknown, background: unknown, standard: string, level: string, label?: string, rules = contrastRules()): PairResult {
  const lab = typeof label === 'string' && label ? { label } : {}
  const fg = parseColor(foreground)
  if (!fg.ok) return { ...lab, error: `Invalid foreground color. ${fg.error}` }
  const bg = parseColor(background)
  if (!bg.ok) return { ...lab, error: `Invalid background color. ${bg.error}` }
  const exact = wcagContrast(fg.color.hex, bg.color.hex)
  const checks: Partial<Record<CheckName, Check>> = {}
  for (const [name, id] of Object.entries(CONTRAST_CHECKS) as Array<[CheckName, string]>) {
    const rule = rules.find(r => r.id === id)
    const required = rule ? requiredRatio(rule, standard, level) : null
    if (required !== null) checks[name] = { rule: id, required, pass: exact >= required }
  }
  return { ...lab, foreground: colorOut(fg.color), background: colorOut(bg.color), ratio: Math.round(exact * 100) / 100, checks }
}
