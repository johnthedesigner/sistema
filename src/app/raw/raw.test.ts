/**
 * /raw must never serve {{sistema_url}}. This replaces the
 * checker's former `raw.placeholder` rule (V0.3): it exercises the real route
 * handlers against the real KB.
 */
import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { GET as rawGET } from './[category]/[slug]/[...path]/route'
import { GET as guideGET } from './guides/[topic]/[name]/route'
import fs from 'fs'
import path from 'path'

const KB = path.join(process.cwd(), 'kb')

/** Every KB stub whose versioned target contains the placeholder, as raw URL params. */
function stubsWithPlaceholder(): Array<{ category: string; slug: string; path: string[] }> {
  const out: Array<{ category: string; slug: string; path: string[] }> = []
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, e.name)
      if (e.isDirectory()) walk(abs)
      else if (/@\d{4}-\d{2}-\d{2}\.md$/.test(e.name) && fs.readFileSync(abs, 'utf-8').includes('{{sistema_url}}')) {
        const rel = path.relative(KB, abs).replace(/@\d{4}-\d{2}-\d{2}\.md$/, '').split(path.sep)
        const parts = rel[0] === 'reference' ? rel.slice(1) : rel
        const [category, slug, ...rest] = parts
        out.push({ category, slug, path: rest })
      }
    }
  }
  walk(KB)
  return out
}

describe('/raw', () => {
  const cases = stubsWithPlaceholder()

  for (const c of cases) {
    it(`resolves {{sistema_url}} in /raw/${c.category}/${c.slug}/${c.path.join('/')}`, async () => {
      const req = new NextRequest(`http://localhost/raw/${c.category}/${c.slug}/${c.path.join('/')}`)
      const res = await rawGET(req, { params: Promise.resolve(c) })
      expect(res.status).toBe(200)
      const text = await res.text()
      expect(text).not.toContain('{{sistema_url}}')
      expect(text).toMatch(/https?:\/\/[^/\s]+\/api\//)
    })
  }
})

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
