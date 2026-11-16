/**
 * The v2 content routes, run against the real content/ catalog.
 * Every rendered play and workflow must be complete agent text: absolute URLs,
 * no placeholders, no literal dates, and the sections agents rely on.
 */
import { describe, expect, it } from 'vitest'
import { loadCatalog } from '@/lib/content/load'
import { workflowSlug } from '@/lib/content/render'
import { GET as playGET } from './plays/[id]/route'
import { GET as workflowGET } from './workflows/[id]/route'
import { GET as fullGET } from './workflows/[id]/full/route'

const catalog = loadCatalog()
const LITERAL_DATE = /\b20\d{2}-\d{2}-\d{2}\b/
const RELATIVE_URL = /(?<![\w/.:-])\/(?:raw|api|bundle|palettes)\//

function clean(text: string) {
  expect(text).not.toContain('{{')
  expect(text).not.toMatch(LITERAL_DATE)
  expect(text).not.toMatch(RELATIVE_URL)
}

describe('/raw/plays/[id]', () => {
  it('has content to test', () => expect(catalog.plays.length).toBeGreaterThan(0))

  for (const play of catalog.plays) {
    it(`renders ${play.id}`, async () => {
      const res = await playGET(new Request(`http://x/raw/plays/${play.id}`), { params: Promise.resolve({ id: play.id }) })
      expect(res.status).toBe(200)
      const text = await res.text()
      clean(text)
      expect(text).toContain(`# ${play.title}`)
      expect(text).toContain('## Procedure')
      expect(text).toContain('## Done when')
      expect(text).toContain(`steps["${play.id}"]`)
      if (play.tools.length) expect(text).toContain('## Tools')
      for (const rule of play.rules) expect(text).toContain(`**${rule}**`)
    })
  }

  it('returns 404 for an unknown play', async () => {
    const res = await playGET(new Request('http://x'), { params: Promise.resolve({ id: 'color.nope' }) })
    expect(res.status).toBe(404)
  })
})

describe('/raw/workflows/[id] and /full', () => {
  for (const w of catalog.workflows) {
    const id = workflowSlug(w.id)
    it(`renders the ${id} starter`, async () => {
      const res = await workflowGET(new Request('http://x'), { params: Promise.resolve({ id }) })
      expect(res.status).toBe(200)
      const text = await res.text()
      clean(text)
      expect(text).toContain('## How to run it')
      if (w.routes) expect(text).toMatch(/^- [a-z-]+: .+\n {4}https?:\/\/\S+\/raw\/plays\//m)
      else expect(text).toMatch(/^ 1\. .+\n {4}https?:\/\/\S+\/raw\/plays\//m)
      expect(text.split('\n').length).toBeLessThan(140)
    })
    it(`renders the ${id} full version`, async () => {
      const res = await fullGET(new Request('http://x'), { params: Promise.resolve({ id }) })
      expect(res.status).toBe(200)
      const text = await res.text()
      clean(text)
      expect(text).toContain('## Play 1:')
    })
  }
})

describe('/raw/schema/sistema.json', () => {
  it('serves a JSON Schema that matches the state file shape', async () => {
    const { GET } = await import('./schema/sistema.json/route')
    const res = GET()
    expect(res.headers.get('content-type')).toContain('schema+json')
    const schema = await res.json()
    expect(schema.properties.continue).toBeDefined()
    expect(schema.properties.steps.additionalProperties.properties.status.enum).toContain('in-progress')
    expect(schema.properties.gates.additionalProperties.required).toEqual(['date', 'by'])
  })
})
