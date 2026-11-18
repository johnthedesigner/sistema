/**
 * Accessibility standards for the tool APIs. Required values come from the
 * rules registry (`parameters`, keyed by standard and level), read from
 * content/rules at request time. next.config.ts bundles the files each route reads.
 */
import fs from 'fs'
import path from 'path'
import { parseRuleFile } from '@/lib/content/parse'
import type { Rule } from '@/lib/content/schema'
import { LEVELS, valueAtLevel } from './levels'

export { LEVELS }

const cache = new Map<string, Rule[]>()

/** Rules from content/rules/<topic>.yaml, cached per file. */
export function rulesFrom(topic: string, root = process.cwd()): Rule[] {
  const file = path.join(root, 'content', 'rules', `${topic}.yaml`)
  const hit = cache.get(file)
  if (hit) return hit
  const parsed = parseRuleFile(fs.readFileSync(file, 'utf-8'))
  if (!parsed.ok) throw new Error(`Invalid rules file ${file}: ${parsed.issues.map(i => i.message).join('; ')}`)
  cache.set(file, parsed.value)
  return parsed.value
}

export function knownStandards(rules: Rule[]): string[] {
  return [...new Set(rules.flatMap(r => Object.keys(r.parameters ?? {})))].sort()
}

export type StandardChoice =
  | { ok: true; standard: string; level: string; defaulted: boolean }
  | { ok: false; error: string }

/**
 * Read the standard and level, separately (standard=wcag-2.2&level=AA) or combined,
 * as sistema.json stores them (standard=wcag-2.2 AA). With no standard, return the
 * fallback (or none, when the tool has no default).
 */
export function chooseStandard(
  standardRaw: unknown,
  levelRaw: unknown,
  known: string[],
  fallback: { standard: string; level: string } | null,
): StandardChoice | null {
  const levelGiven = typeof levelRaw === 'string' && levelRaw ? levelRaw.toUpperCase() : undefined
  if (standardRaw === undefined || standardRaw === null || standardRaw === '') {
    return fallback ? { ok: true, standard: fallback.standard, level: levelGiven ?? fallback.level, defaulted: true } : null
  }
  if (typeof standardRaw !== 'string') return { ok: false, error: '"standard" must be a string, for example wcag-2.2' }
  const [std, combinedLevel] = standardRaw.trim().toLowerCase().split(/\s+/)
  const level = levelGiven ?? (combinedLevel ? combinedLevel.toUpperCase() : 'AA')
  if (!known.includes(std)) return { ok: false, error: `Unknown standard "${standardRaw}". Known standards: ${known.join(', ')}` }
  if (!(LEVELS as readonly string[]).includes(level)) return { ok: false, error: `Unknown level "${level}". Use A, AA, or AAA.` }
  return { ok: true, standard: std, level, defaulted: false }
}

/** A rule's value at a level: that level's, or the nearest lower level the standard defines. */
export function ruleValue(rule: Rule, standard: string, level: string): number | null {
  return valueAtLevel(rule.parameters?.[standard], level)
}
