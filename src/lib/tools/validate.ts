/**
 * Token file validator (D40). Checks a project's DTCG token files against the
 * rules a token file can show: the format, the required color roles, contrast
 * for every implied pair in every theme, mode files, dark surface steps, visible
 * states, type line heights, and the spacing scale. Every required value comes
 * from the rules registry for the project's standard.
 */
import type { Rule } from '@/lib/content/schema'
import { checkPair, contrastRules, type PairResult } from './contrast'
import { DARK_SURFACE_STEPS } from './dark-mode'
import { rolePairs } from './pairs'
import { ruleValue, rulesFrom } from './standards'
import { DTCG_TYPES, colorRoles, rampStop, readTokenFiles, resolve, withMode, type TokenMap } from './tokens'

export interface CheckResult {
  rule: string
  severity: 'blocking' | 'advisory'
  pass: boolean
  message: string
  items?: string[]
}

export interface ValidateResult {
  standard: string
  level: string
  files: string[]
  themes: string[]
  tokens: number
  summary: { blocking_failures: number; advisory_failures: number; passed: number }
  checks: CheckResult[]
}

const ruleById = (rules: Rule[], id: string) => rules.find(r => r.id === id)

/** A stop's position, counting white as the step before 50 and black as the step after 950 (color.states.visible). */
const position = (r: ReturnType<typeof rampStop>) => (r === 'white' ? 0 : r === 'black' ? 20 : r ? r.stop / 50 : null)

export function validateTokens(files: Record<string, unknown>, standard: string, level: string): ValidateResult {
  const rules = [...rulesFrom('color'), ...rulesFrom('tokens'), ...rulesFrom('typography'), ...rulesFrom('spacing')]
  const set = readTokenFiles(files)
  const checks: CheckResult[] = []
  const severityOf = (id: string) => ruleById(rules, id)?.severity ?? 'advisory'
  const add = (rule: string, items: string[], ok: string, bad: string, skip?: string) => {
    if (skip) return checks.push({ rule, severity: severityOf(rule), pass: true, message: skip })
    checks.push({ rule, severity: severityOf(rule), pass: items.length === 0, message: items.length ? bad : ok, ...(items.length ? { items } : {}) })
  }
  const themes = ['default', ...Object.entries(set.modes).filter(([, m]) => m.kind === 'theme').map(([name]) => name)]
  const all: TokenMap[] = [set.base, ...Object.keys(set.modes).map(m => withMode(set, m))]

  // Format: valid JSON, known types, aliases that resolve, no cycles (tokens.source.dtcg).
  const format = set.errors.map(e => `${e.file} ${e.message}`)
  for (const tokens of all)
    for (const t of tokens.values()) {
      if (!t.type) format.push(`${t.name} (${t.file}) has no $type, on itself or its group.`)
      else if (!DTCG_TYPES.has(t.type)) format.push(`${t.name} (${t.file}) has an unknown $type "${t.type}".`)
      const r = resolve(t.name, tokens)
      if (!r.ok) format.push(`${t.name} (${t.file}): ${r.error}.`)
    }
  add('tokens.source.dtcg', [...new Set(format)], 'Every file is DTCG JSON, every token has a type, and every alias resolves.', 'Some tokens are not valid DTCG.')

  // Required color roles (color.roles.required), from the rule's own list.
  const roles = colorRoles(set.base)
  const required = ruleById(rules, 'color.roles.required')?.measure?.values ?? []
  const missing = required.filter(r => !roles.includes(r))
  add('color.roles.required', missing.map(r => `color.${r}`), `All ${required.length} required color roles are defined.`, `${missing.length} required color roles are missing.`, roles.length ? undefined : 'No color roles found (tokens named color.<role>), so this was not checked.')

  // Contrast for every implied pair, in every theme.
  const cRules = contrastRules()
  const failing: string[] = []
  const ifUsed: string[] = []
  const unchecked: string[] = []
  let checked = 0
  for (const theme of themes) {
    const tokens = withMode(set, theme === 'default' ? undefined : theme)
    for (const p of rolePairs(colorRoles(tokens))) {
      const fg = resolve(`color.${p.foreground}`, tokens)
      const bg = resolve(`color.${p.background}`, tokens)
      if (!fg.ok || !bg.ok) continue
      const r = checkPair(fg.value, bg.value, standard, level, undefined, cRules, p.purpose) as PairResult
      if ('error' in r) {
        unchecked.push(`${theme}: ${p.foreground} on ${p.background} (${r.error})`)
        continue
      }
      checked++
      const fail = Object.values(r.checks).find(c => c && !c.pass)
      if (fail) (p.when ? ifUsed : failing).push(`${theme}: ${p.foreground} on ${p.background} is ${r.ratio}, needs ${fail.required} (${fail.rule})${p.when ? `, if ${p.when}` : ''}`)
    }
  }
  const contrastSkip = checked === 0 && failing.length === 0 ? 'No color pairs could be checked: no on-* roles with their surfaces, or no color values.' : undefined
  checks.push({
    rule: 'color.contrast.text',
    severity: 'blocking',
    pass: failing.length === 0,
    message: contrastSkip ?? (failing.length ? `${failing.length} of ${checked} pairs fail ${standard} ${level}.` : `All ${checked} pairs pass ${standard} ${level}, in ${themes.length === 1 ? 'the one theme' : `all ${themes.length} themes`}.`),
    ...(failing.length || unchecked.length ? { items: [...failing, ...unchecked] } : {}),
  })
  if (ifUsed.length)
    checks.push({ rule: 'color.contrast.text', severity: 'advisory', pass: false, message: 'Some pairs fail where the product may not use them. Check each if it does.', items: ifUsed })

  // Mode files hold only overrides, and each token changes with one kind of mode.
  const extra: string[] = []
  const kindsByToken = new Map<string, Set<string>>()
  for (const [mode, m] of Object.entries(set.modes)) {
    for (const name of m.tokens.keys()) {
      if (!set.base.has(name)) extra.push(`${name} (${m.files.join(', ')}) isn't in the defaults.`)
      const kinds = kindsByToken.get(name) ?? new Set()
      kinds.add(`${m.kind} (${mode})`)
      kindsByToken.set(name, kinds)
    }
  }
  const noModes = Object.keys(set.modes).length ? undefined : 'No mode files (such as color.dark.json), so this was not checked.'
  add('tokens.modes.overrides-only', extra, 'Every mode file overrides existing tokens only.', 'Some mode files define new tokens.', noModes)
  const kindOf = (k: string) => k.split(' ')[0]
  const conflicts = [...kindsByToken].filter(([, k]) => new Set([...k].map(kindOf)).size > 1).map(([name, k]) => `${name}: ${[...k].join(', ')}`)
  add('tokens.modes.one-kind', conflicts, 'Each token changes with one kind of mode.', 'Some tokens change with more than one kind of mode.', noModes)

  // Dark surfaces step one stop at a time (color.dark.surface-steps).
  const darkTheme = themes.find(t => t === 'dark')
  if (darkTheme) {
    const tokens = withMode(set, darkTheme)
    const off: string[] = []
    for (const [role, stop] of Object.entries(DARK_SURFACE_STEPS)) {
      if (!tokens.has(`color.${role}`)) continue
      const at = rampStop(`color.${role}`, tokens)
      if (at && at !== 'white' && at !== 'black' && at.stop !== stop) off.push(`${role} is ${at.ramp}.${at.stop}; the guide's step is ${stop}.`)
    }
    add('color.dark.surface-steps', off, 'Dark surfaces step one stop at a time.', 'Some dark surfaces differ from the guide\'s steps. If that was a choice, record why in DECISIONS.md.')
  }

  // Hover and selected fills at least one stop from the surfaces they sit on (color.states.visible).
  const states: string[] = []
  for (const theme of themes) {
    const tokens = withMode(set, theme === 'default' ? undefined : theme)
    const spots: Array<[string, string]> = [['surface-hover', 'surface'], ['surface-hover', 'surface-raised'], ['surface-selected', 'surface-raised'], ['surface-selected', 'surface-hover'], ['surface-highlight', 'surface-overlay']]
    for (const [state, on] of spots) {
      if (!tokens.has(`color.${state}`) || !tokens.has(`color.${on}`)) continue
      const a = rampStop(`color.${state}`, tokens)
      const b = rampStop(`color.${on}`, tokens)
      const pa = position(a)
      const pb = position(b)
      const sameRamp = a && b && (typeof a === 'string' || typeof b === 'string' || a.ramp === b.ramp)
      if (pa !== null && pb !== null && sameRamp && Math.abs(pa - pb) < 1) states.push(`${theme}: ${state} and ${on} are the same stop.`)
      else if (pa === null || pb === null) {
        const x = resolve(`color.${state}`, tokens)
        const y = resolve(`color.${on}`, tokens)
        if (x.ok && y.ok && String(x.value).toLowerCase() === String(y.value).toLowerCase()) states.push(`${theme}: ${state} and ${on} are the same color.`)
      }
    }
  }
  add('color.states.visible', states, 'Hover and selected fills stand apart from the surfaces they sit on.', 'Some states would vanish on the surface they sit on.', roles.length ? undefined : 'No color roles found, so this was not checked.')

  // Line heights: unitless and set per role; body text meets the standard's minimum where it sets one.
  const typeTokens = [...set.base.values()].filter(t => t.type === 'typography')
  const lh: string[] = []
  const values = new Set<number>()
  for (const t of typeTokens) {
    const r = resolve(t.name, set.base)
    const v = r.ok && r.value && typeof r.value === 'object' ? (r.value as Record<string, unknown>).lineHeight : undefined
    if (v === undefined) lh.push(`${t.name} has no lineHeight.`)
    else if (typeof v !== 'number') lh.push(`${t.name} lineHeight is ${JSON.stringify(v)}; use a unitless number.`)
    else values.add(v)
  }
  if (typeTokens.length > 2 && values.size === 1) lh.push(`Every role uses ${[...values][0]}; set line height per role.`)
  add('typography.line-height.by-role', lh, `Every type role sets its own unitless line height.`, 'Some type roles need their line height fixed.', typeTokens.length ? undefined : 'No typography tokens found, so this was not checked.')
  const bodyRule = ruleById(rules, 'typography.line-height.body')
  const bodyMin = bodyRule ? ruleValue(bodyRule, standard, level) : null
  if (bodyMin !== null && typeTokens.length) {
    const low = typeTokens
      .filter(t => /body|paragraph|prose|long/.test(t.name))
      .flatMap(t => {
        const r = resolve(t.name, set.base)
        const v = r.ok && r.value && typeof r.value === 'object' ? (r.value as Record<string, unknown>).lineHeight : undefined
        return typeof v === 'number' && v < bodyMin ? [`${t.name} is ${v}; ${standard} ${level} needs at least ${bodyMin}.`] : []
      })
    add('typography.line-height.body', low, `Body text meets ${standard} ${level}'s line height.`, 'Some body text is below the standard\'s line height.')
  }

  // Spacing steps are multiples, or half multiples, of one base unit (spacing.scale.base-unit).
  const space = [...set.base.values()].filter(t => t.type === 'dimension' && /^(space|spacing)\./.test(t.name))
  const px = space
    .map(t => {
      const r = resolve(t.name, set.base)
      return { t, v: r.ok ? Number(String(r.value).replace(/px$/, '')) : NaN }
    })
    .filter(x => Number.isFinite(x.v) && x.v > 0)
  if (px.length > 2) {
    const base = [8, 4, 6, 5, 2].find(b => px.filter(x => (x.v * 2) % b === 0).length >= px.length * 0.8) ?? Math.min(...px.map(x => x.v))
    const odd = px.filter(x => (x.v * 2) % base !== 0).map(x => `${x.t.name} is ${x.v}px, not a multiple or half multiple of ${base}px.`)
    add('spacing.scale.base-unit', odd, `Every spacing step is a multiple or half multiple of ${base}px.`, 'Some spacing steps are off the base unit.')
  }

  // Role names, not value names (tokens.naming.role).
  const valueNamed = roles.filter(r => /(^|-)(\d{2,3}|gray|grey|red|blue|green|yellow|orange|purple|pink|teal|black|white)(-|$)/.test(r)).map(r => `color.${r}`)
  add('tokens.naming.role', valueNamed, 'Color roles are named for their job.', 'Some color roles are named for their value.', roles.length ? undefined : 'No color roles found, so this was not checked.')

  const fails = (s: 'blocking' | 'advisory') => checks.filter(c => !c.pass && c.severity === s).length
  return {
    standard,
    level,
    files: Object.keys(files).map(f => f.split('/').pop() ?? f),
    themes,
    tokens: set.base.size,
    summary: { blocking_failures: fails('blocking'), advisory_failures: fails('advisory'), passed: checks.filter(c => c.pass).length },
    checks,
  }
}
