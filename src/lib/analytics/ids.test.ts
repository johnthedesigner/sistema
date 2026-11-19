import { describe, expect, it } from 'vitest'
import { agentFamily, isInternalId, rawKind, validVisitId, withVisitId } from './ids'

const B = 'https://sistema.example'
const ID = '3f2b8c1e-1d2a-4c3b-9e8f-0a1b2c3d4e5f'

describe('withVisitId', () => {
  it('adds c to Sistema /raw and /api URLs, keeping queries, anchors, and trailing punctuation', () => {
    const text = [
      `Fetch ${B}/raw/workflows/start and follow it.`,
      `See ${B}/raw/guides/color/architecture#dark-mode-the-tonal-shift.`,
      `GET ${B}/api/contrast?fg=<color>&bg=<color>&standard=<standard>`,
      `(${B}/raw/plays/color.scheme)`,
      '`' + `${B}/raw/files/design-md#sections` + '`',
      `Index: ${B}/api`,
      `Template: ${B}/raw/plays/<id>.`,
      `Palette: ${B}/api/palette?primary=%231F5FD1&neutral=oklch(0.55%200.01%20260)`,
      `(see ${B}/api/palette?n=oklch(0.5%200.1%20200)).`,
    ].join('\n')
    const out = withVisitId(text, ID, B)
    expect(out).toContain(`${B}/raw/workflows/start?c=${ID} and follow`)
    expect(out).toContain(`${B}/raw/guides/color/architecture?c=${ID}#dark-mode-the-tonal-shift.`)
    expect(out).toContain(`${B}/api/contrast?fg=<color>&bg=<color>&standard=<standard>&c=${ID}`)
    expect(out).toContain(`(${B}/raw/plays/color.scheme?c=${ID})`)
    expect(out).toContain('`' + `${B}/raw/files/design-md?c=${ID}#sections` + '`')
    expect(out).toContain(`Index: ${B}/api?c=${ID}`)
    expect(out).toContain(`Template: ${B}/raw/plays/<id>?c=${ID}.`)
    expect(out).toContain(`Palette: ${B}/api/palette?primary=%231F5FD1&neutral=oklch(0.55%200.01%20260)&c=${ID}`)
    expect(out).toContain(`(see ${B}/api/palette?n=oklch(0.5%200.1%20200)&c=${ID}).`)
  })

  it('leaves other URLs, other sites, and URLs that already carry c alone', () => {
    const text = `${B}/guides/color/architecture https://other.example/raw/x ${B}/raw/rules?c=abc`
    expect(withVisitId(text, ID, B)).toBe(text)
  })
})

describe('ids and agents', () => {
  it('accepts UUIDs with optional test- or internal- prefixes, and flags those as internal', () => {
    expect(validVisitId(ID)).toBe(ID)
    expect(validVisitId(`test-${ID}`)).toBe(`test-${ID}`)
    expect(validVisitId('nope')).toBeNull()
    expect(validVisitId('off')).toBeNull()
    expect(isInternalId(`internal-${ID}`)).toBe(true)
    expect(isInternalId(ID)).toBe(false)
  })
  it('groups user agents into families', () => {
    expect(agentFamily('Claude-User (claude-code/1.0)')).toBe('claude')
    expect(agentFamily('Mozilla/5.0 (compatible; ChatGPT-User/1.0)')).toBe('openai')
    expect(agentFamily('curl/8.4.0')).toBe('script')
    expect(agentFamily('Mozilla/5.0 (Macintosh)')).toBe('browser')
    expect(agentFamily(undefined)).toBe('unknown')
  })
  it('classifies /raw paths', () => {
    expect(rawKind('/raw/workflows/start')).toEqual({ kind: 'workflow', id: 'workflow.start' })
    expect(rawKind('/raw/workflows/start/full')).toEqual({ kind: 'workflow_full', id: 'workflow.start' })
    expect(rawKind('/raw/plays/color.scheme')).toEqual({ kind: 'play', id: 'color.scheme' })
    expect(rawKind('/raw-with-id/guides/color/architecture')).toEqual({ kind: 'guide', id: 'guide.color.architecture' })
    expect(rawKind('/raw/agents')).toEqual({ kind: 'agents' })
  })
})
