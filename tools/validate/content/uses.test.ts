import { describe, expect, it } from 'vitest'
import { loadCatalog } from '../../../src/lib/content/load'
import { findUses } from './uses'

const c = loadCatalog()
const text = (path: string, text: string) => ({ path, text })

describe('findUses', () => {
  it('finds structured references from plays, workflows, rules, and opinions', () => {
    const uses = findUses(c, [], 'color.contrast.text')
    expect(uses.some(u => u.item === 'color.scheme' && u.how === 'applies it')).toBe(true)
    expect(uses.some(u => u.item.startsWith('opinion.'))).toBe(true)
  })
  it('matches any section of a guide when the query has no anchor, and one section when it does', () => {
    const all = findUses(c, [], 'guide.color.architecture').length
    const one = findUses(c, [], 'guide.color.architecture#dark-mode-the-tonal-shift').length
    expect(all).toBeGreaterThan(one)
    expect(one).toBeGreaterThan(0)
  })
  it('finds text mentions by ID or URL form, but not the item\'s own definition', () => {
    const texts = [
      text('content/plays/x/a.md', '---\nid: x.a\n---\nFetch {{sistema_url}}/raw/files/design-md#sections.'),
      text('content/rules/x.yaml', '- id: file.design-md\n  statement: s'),
    ]
    const uses = findUses(c, texts, 'file.design-md')
    expect(uses.map(u => u.file)).toEqual(['content/plays/x/a.md'])
  })
  it('finds credits and gates', () => {
    expect(findUses(c, [], 'wcag').some(u => u.how === 'credits it')).toBe(true)
    expect(findUses(c, [], 'gate:direction-approved').some(u => u.item === 'workflow.start')).toBe(true)
  })
})
