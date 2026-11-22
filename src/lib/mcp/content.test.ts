import { describe, expect, it } from 'vitest'
import { loadCatalog } from '@/lib/content/load'
import { nextStep, read, search, sectionOf } from './content'

const c = loadCatalog()

describe('mcp content tools', () => {
  it('search ranks by title and ID, and filters by kind', () => {
    const hits = search(c, 'color scheme')
    expect(hits[0].id).toBe('color.scheme')
    expect(search(c, 'dark', 'rule').every(h => h.kind === 'rule')).toBe(true)
  })
  it('read returns an item, one section, or a clear error', () => {
    const play = read(c, 'color.scheme')
    expect(play.ok && play.text).toMatch(/Generate the color scheme/)
    const sec = read(c, 'guide.color.architecture#pairs-to-check')
    expect(sec.ok && sec.text).toMatch(/^#+ Pairs to check/)
    expect(read(c, 'nope').ok).toBe(false)
  })
  it('next_step walks the workflow and stops at approvals', () => {
    const first = nextStep(c, 'start', {})
    expect(first.ok && first.text).toMatch(/Step 1 of/)
    const atGate = nextStep(c, 'start', { steps: { 'project.assess': { status: 'complete' }, 'visual-language.direction': { status: 'in-progress' } } })
    expect(atGate.ok && atGate.text).toMatch(/Step 2 of/)
    const waiting = nextStep(c, 'start', { steps: { 'project.assess': { status: 'complete' }, 'visual-language.direction': { status: 'complete' } } })
    expect(waiting.ok && waiting.text).toMatch(/Waiting for the person's approval: direction-approved/)
    const withdrawn = nextStep(c, 'start', { steps: { 'project.assess': { status: 'complete' }, 'visual-language.direction': { status: 'complete' } }, gates: { 'direction-approved': { withdrawn: { date: '2026-11-22' } } } })
    expect(withdrawn.ok && withdrawn.text).toMatch(/Waiting/)
    const routed = nextStep(c, 'start', { steps: { 'project.assess': { status: 'complete' }, 'visual-language.direction': { status: 'complete' }, 'visual-language.design-md': { status: 'complete' }, 'content.voice-and-tone': { status: 'skipped' } }, gates: { 'direction-approved': {} }, routing: { 'color.scheme': 'color.map-existing' } })
    expect(routed.ok && routed.text).toMatch(/existing colors|map/i)
  })
  it('sectionOf stops at the next heading of the same level', () => {
    expect(sectionOf('## A\nx\n### B\ny\n## C\nz', 'a')).toBe('## A\nx\n### B\ny')
  })
})
