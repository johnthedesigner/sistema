/**
 * Plan 13, layer 2: the tools agree with the rules registry and with WCAG.
 * Runs on every build (npm test in CI).
 */
import { describe, expect, it } from 'vitest'
import { loadCatalog } from '@/lib/content/load'
import { computeTypeScale } from '@/lib/type-scale'
import { checkPair, CONTRAST_CHECKS, contrastRules, contrastTable, requiredRatio } from './contrast'
import { knownStandards, ruleValue, rulesFrom } from './standards'

const catalog = loadCatalog()

/** WCAG 2.x contrast, written from the spec's definitions, independent of culori. */
function wcagRatio(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl
  }
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

/** Deterministic pseudo-random hex colors. */
function* colors(n: number, seed = 7): Generator<string> {
  let x = seed
  for (let i = 0; i < n; i++) {
    x = (x * 1103515245 + 12345) % 2 ** 31
    yield '#' + (x % 0x1000000).toString(16).padStart(6, '0').toUpperCase()
  }
}

describe('contrast agrees with WCAG', () => {
  it('matches published values: 21:1 for black on white, 1:1 for a color on itself, 4.54:1 for #767676 on white', () => {
    const r = (fg: string, bg: string) => {
      const res = checkPair(fg, bg, 'wcag-2.2', 'AA')
      if ('error' in res) throw new Error(res.error)
      return res.ratio
    }
    expect(r('#000000', '#FFFFFF')).toBe(21)
    expect(r('#3A7D44', '#3A7D44')).toBe(1)
    expect(r('#767676', '#FFFFFF')).toBe(4.54)
  })

  it('matches an independent implementation of the WCAG formula for 300 random pairs', () => {
    const list = [...colors(600)]
    for (let i = 0; i < list.length; i += 2) {
      const res = checkPair(list[i], list[i + 1], 'wcag-2.2', 'AA')
      if ('error' in res) throw new Error(res.error)
      expect(res.ratio, `${list[i]} on ${list[i + 1]}`).toBeCloseTo(wcagRatio(list[i], list[i + 1]), 2)
    }
  })

  it('is symmetric: swapping foreground and background gives the same ratio', () => {
    const list = [...colors(40, 11)]
    for (let i = 0; i < list.length; i += 2) {
      const a = checkPair(list[i], list[i + 1], 'wcag-2.2', 'AA')
      const b = checkPair(list[i + 1], list[i], 'wcag-2.2', 'AA')
      expect('ratio' in a && 'ratio' in b && a.ratio === b.ratio).toBe(true)
    }
  })
})

describe('tools cite rules that exist', () => {
  const ids = new Set(catalog.rules.map(r => r.id))
  it('every contrast check and type scale check names a registry rule', () => {
    for (const id of [...Object.values(CONTRAST_CHECKS), 'typography.line-height.by-role', 'typography.line-height.body']) {
      expect(ids.has(id), id).toBe(true)
    }
  })
  it('the tools read the same rules the content model loads', () => {
    for (const r of contrastRules()) expect(catalog.ruleById.get(r.id)?.parameters).toEqual(r.parameters)
    for (const r of rulesFrom('typography')) expect(catalog.ruleById.get(r.id)?.statement).toBe(r.statement)
  })
  it('the contrast page table matches what the API requires', () => {
    const table = contrastTable()
    for (const [standard, levels] of Object.entries(table)) {
      for (const [level, row] of Object.entries(levels)) {
        for (const [check, id] of Object.entries(CONTRAST_CHECKS)) {
          const rule = contrastRules().find(r => r.id === id)!
          const v = requiredRatio(rule, standard, level)
          expect(row[check as keyof typeof row] ?? null, `${standard} ${level} ${check}`).toBe(v)
        }
      }
    }
  })
})

describe('tool defaults pass the registry', () => {
  const lineHeightBody = rulesFrom('typography').find(r => r.id === 'typography.line-height.body')!
  const standards = knownStandards(contrastRules())

  it('the default type scale meets every standard and level the registry defines for body line height', () => {
    const result = computeTypeScale()
    if (!result.ok) throw new Error(result.error)
    const body = result.scale.steps.find(s => s.step === 0)!
    for (const standard of standards) {
      for (const level of ['AA', 'AAA']) {
        const min = ruleValue(lineHeightBody, standard, level)
        if (min !== null) expect(body.line_height, `${standard} ${level}`).toBeGreaterThanOrEqual(min)
      }
    }
  })

  it('every default type scale step has a unitless line height', () => {
    const result = computeTypeScale()
    if (!result.ok) throw new Error(result.error)
    for (const s of result.scale.steps) {
      expect(Number.isFinite(s.line_height)).toBe(true)
      expect(s.line_height).toBeGreaterThan(0.9)
      expect(s.line_height).toBeLessThan(2)
    }
  })

  it('body text meets the strictest body line-height minimum at any base size and ratio', () => {
    const strictest = Math.max(...standards.flatMap(s => ['AA', 'AAA'].map(l => ruleValue(lineHeightBody, s, l) ?? 0)))
    for (const base of [12, 14, 16, 18, 20, 24]) {
      for (const ratio of ['minor-second', 'major-third', 'golden-ratio']) {
        const r = computeTypeScale({ base, ratio })
        if (!r.ok) throw new Error(r.error)
        expect(r.scale.steps.find(s => s.step === 0)!.line_height, `${base} ${ratio}`).toBeGreaterThanOrEqual(strictest)
      }
    }
  })

  it('contrast defaults to a standard the registry defines (D11)', () => {
    expect(standards).toContain('wcag-2.2')
    for (const id of Object.values(CONTRAST_CHECKS)) {
      expect(requiredRatio(contrastRules().find(r => r.id === id)!, 'wcag-2.2', 'AA')).not.toBeNull()
    }
  })
})
