import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { validateTokens } from './validate'
import { DARK_SURFACE_STEPS, hexSource, mapDarkMode, parseRef, type Ref } from './dark-mode'
import { rolePairs } from './pairs'
import { rulesFrom } from './standards'

const siteFiles = Object.fromEntries(readdirSync('tokens/src').map(f => [f, JSON.parse(readFileSync(`tokens/src/${f}`, 'utf8'))]))
const check = (r: ReturnType<typeof validateTokens>, rule: string) => r.checks.find(c => c.rule === rule)!

const c = (v: string) => ({ $type: 'color', $value: v })
const broken = {
  'palette.json': { palette: { $type: 'color', neutral: { 50: { $value: '#F7F7F7' }, 100: { $value: '#EEEEEE' }, 800: { $value: '#333333' }, 900: { $value: '#1A1A1A' }, 950: { $value: '#0D0D0D' } }, white: { $value: '#FFFFFF' } } },
  'color.json': {
    color: {
      surface: c('{palette.neutral.50}'),
      'surface-raised': c('{palette.white}'),
      'surface-hover': c('{palette.neutral.50}'),
      'on-surface': c('#BBBBBB'),
      'gray-600': c('{palette.neutral.missing}'),
      loop: c('{color.loop}'),
      odd: { $type: 'colour', $value: '#123456' },
    },
  },
  'color.dark.json': { color: { surface: c('{palette.neutral.900}'), extra: c('#000000') } },
  'spacing.json': { space: { $type: 'dimension', 1: { $value: '4px' }, 2: { $value: '8px' }, 3: { $value: '12px' }, 4: { $value: '16px' }, odd: { $value: '13px' } } },
  'spacing.dark.json': { space: { 1: { $type: 'dimension', $value: '6px' } } },
  'spacing.compact.json': { space: { 1: { $type: 'dimension', $value: '2px' } } },
  'typography.json': { type: { body: { $type: 'typography', $value: { fontSize: '16px', lineHeight: '24px' } }, label: { $type: 'typography', $value: { fontSize: '14px' } } } },
}

describe('token validator', () => {
  it("passes the site's own tokens with no blocking failures", () => {
    const r = validateTokens(siteFiles, 'wcag-2.2', 'AA')
    expect(r.themes).toEqual(['default', 'dark'])
    expect(r.checks.filter(x => !x.pass && x.severity === 'blocking')).toEqual([])
    expect(check(r, 'color.contrast.text').message).toMatch(/pairs pass/)
  })

  it('reports each kind of problem in a broken set', () => {
    const r = validateTokens(broken, 'wcag-2.2', 'AA')
    const items = (rule: string) => (check(r, rule).items ?? []).join('\n')
    expect(items('tokens.source.dtcg')).toMatch(/doesn't exist/)
    expect(items('tokens.source.dtcg')).toMatch(/alias cycle/)
    expect(items('tokens.source.dtcg')).toMatch(/unknown \$type "colour"/)
    expect(items('color.roles.required')).toMatch(/color\.primary/)
    expect(items('color.contrast.text')).toMatch(/on-surface on surface is/)
    expect(items('tokens.modes.overrides-only')).toMatch(/color\.extra/)
    expect(items('tokens.modes.one-kind')).toMatch(/space\.1/)
    expect(items('color.dark.surface-steps')).toMatch(/surface is neutral\.900; the guide's step is 950/)
    expect(items('color.states.visible')).toMatch(/surface-hover and surface are the same stop/)
    expect(items('typography.line-height.by-role')).toMatch(/type\.body lineHeight is "24px"/)
    expect(items('typography.line-height.by-role')).toMatch(/type\.label has no lineHeight/)
    expect(items('spacing.scale.base-unit')).toMatch(/space\.odd is 13px/)
    expect(items('tokens.naming.role')).toMatch(/color\.gray-600/)
    expect(r.summary.blocking_failures).toBeGreaterThan(0)
  })

  it("applies a standard's body line height only where it sets one", () => {
    const files = { 'typography.json': { type: { body: { $type: 'typography', $value: { lineHeight: 1.4 } } } } }
    expect(validateTokens(files, 'wcag-2.2', 'AA').checks.some(x => x.rule === 'typography.line-height.body')).toBe(false)
    expect(check(validateTokens(files, 'wcag-2.2', 'AAA'), 'typography.line-height.body').pass).toBe(false)
  })

  it('reads files given as text, and reports text that is not JSON', () => {
    const r = validateTokens({ 'color.json': '{"color": {"surface": {"$type": "color", "$value": "#FFFFFF"}}}', 'bad.json': '{nope' }, 'wcag-2.2', 'AA')
    expect(r.tokens).toBe(1)
    expect(check(r, 'tokens.source.dtcg').items?.join('\n')).toMatch(/bad\.json is not valid JSON/)
  })
})

describe('dark mode mapping', () => {
  const roles: Record<string, Ref> = {}
  const paths: Record<string, string | undefined> = {}
  for (const [role, raw] of Object.entries({
    surface: '{palette.neutral.50}', 'surface-raised': '{palette.white}', 'surface-overlay': '{palette.white}', 'surface-hover': '{palette.neutral.100}',
    'on-surface': '{palette.neutral.850}', primary: '{palette.accent.550}', 'on-primary': '{palette.white}', 'surface-brand': '{palette.accent.600}', 'on-surface-brand': '{palette.white}',
  })) {
    const p = parseRef(raw)
    if (!p.ok) throw new Error(p.error)
    roles[role] = p.ref
    paths[role] = p.path
  }
  const r = mapDarkMode(roles, { hex: hexSource(undefined, { neutral: '#6B7280', accent: '#3A7D5C' }), standard: 'wcag-2.2', level: 'AA', paths })

  it("follows the color guide's dark stops", () => {
    expect(r.roles.surface).toMatchObject({ dark: 'neutral.950', how: 'surface step' })
    expect(r.roles['surface-raised']).toMatchObject({ dark: 'neutral.900', how: 'surface step' })
    expect(r.roles['surface-overlay'].dark).toBe('neutral.800')
    expect(r.roles['on-surface']).toMatchObject({ dark: 'neutral.150', how: 'mirrored' })
    expect(r.roles.primary.dark).toBe('accent.450')
    expect(r.roles['on-primary'].dark).toBe('black')
    expect(r.roles['surface-brand']).toMatchObject({ dark: 'accent.600', how: 'kept (brand)' })
  })

  it('writes a dark mode file in the same alias shape', () => {
    expect(r.tokens.color.surface.$value).toBe('{palette.neutral.950}')
    expect(r.tokens.color['on-primary'].$value).toBe('{palette.black}')
  })

  it('checks every pair in both themes', () => {
    const pair = r.pairs.find(p => p.foreground === 'on-surface' && p.background === 'surface')!
    expect(pair.light?.pass).toBe(true)
    expect(pair.dark?.pass).toBe(true)
  })

  it('reads stops written several ways, and rejects colors that are not stops', () => {
    expect(parseRef('neutral.50')).toMatchObject({ ok: true, ref: { ramp: 'neutral', stop: 50 } })
    expect(parseRef('neutral 950')).toMatchObject({ ok: true, ref: { ramp: 'neutral', stop: 950 } })
    expect(parseRef('#FFFFFF').ok).toBe(false)
    expect(parseRef('neutral.42').ok).toBe(false)
  })
})

describe('tools follow the rules registry', () => {
  const color = rulesFrom('color')
  it("keeps the dark surface stops in step with color.dark.surface-steps", () => {
    const text = color.find(r => r.id === 'color.dark.surface-steps')!.statement
    for (const [label, role] of [['page', 'surface'], ['panels', 'surface-raised'], ['featured', 'surface-featured'], ['menus and dialogs', 'surface-overlay']] as const)
      expect(text).toContain(`${label} ${DARK_SURFACE_STEPS[role]}`)
  })
  it("lists only required roles the rule's statement names", () => {
    const rule = color.find(r => r.id === 'color.roles.required')!
    for (const role of rule.measure?.values ?? []) expect(rule.statement).toMatch(new RegExp(`(^|[^a-z-])${role}([^a-z-]|$)`))
  })
  it('checks menus only for the items on the highlight', () => {
    expect(rolePairs(['on-surface', 'on-surface-muted', 'surface-highlight']).map(p => p.foreground)).toEqual(['on-surface'])
  })
})
