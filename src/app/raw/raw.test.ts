/**
 * /raw must never serve {{sistema_url}}. This replaces the checker's former
 * `raw.placeholder` rule (V0.3): it exercises the real route handler against
 * the real guides. (The reference-material case went with V1.14: no reference
 * file contains the placeholder any more, and V1.16 removes that route.)
 */
import { describe, expect, it } from 'vitest'
import { GET as guideGET } from './guides/[topic]/[name]/route'
import fs from 'fs'
import path from 'path'

describe('/raw/guides', () => {
  const guidesDir = path.join(process.cwd(), 'content', 'guides')
  const withPlaceholder = fs
    .readdirSync(guidesDir)
    .flatMap(topic => fs.readdirSync(path.join(guidesDir, topic)).map(f => ({ topic, name: f.replace(/\.md$/, '') })))
    .filter(g => fs.readFileSync(path.join(guidesDir, g.topic, `${g.name}.md`), 'utf-8').includes('{{sistema_url}}'))

  it('has at least one guide with the placeholder to test against', () => {
    expect(withPlaceholder.length).toBeGreaterThan(0)
  })

  for (const g of withPlaceholder) {
    it(`resolves {{sistema_url}} in /raw/guides/${g.topic}/${g.name}`, async () => {
      const res = await guideGET(new Request(`http://localhost/raw/guides/${g.topic}/${g.name}`), { params: Promise.resolve(g) })
      expect(res.status).toBe(200)
      const text = await res.text()
      expect(text).not.toContain('{{sistema_url}}')
      expect(text.startsWith('# ')).toBe(true)
    })
  }
})
