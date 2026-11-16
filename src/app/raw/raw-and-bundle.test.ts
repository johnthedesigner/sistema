/**
 * /raw and /bundle must never serve {{sistema_url}}. This replaces the
 * checker's former `raw.placeholder` rule (V0.3): it exercises the real route
 * handlers against the real KB.
 */
import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { GET as rawGET } from './[category]/[slug]/[...path]/route'
import { GET as bundleGET } from '../bundle/[category]/[slug]/route'
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
  // Guides (content/guides since V1.12) are served under the legacy principles category.
  const guides = path.join(process.cwd(), 'content', 'guides')
  for (const topic of fs.readdirSync(guides)) {
    for (const f of fs.readdirSync(path.join(guides, topic))) {
      if (fs.readFileSync(path.join(guides, topic, f), 'utf-8').includes('{{sistema_url}}')) {
        out.push({ category: 'principles', slug: topic, path: [f.replace(/\.md$/, '')] })
      }
    }
  }
  return out
}

describe('/raw', () => {
  const cases = stubsWithPlaceholder()

  it('has at least one KB file with the placeholder to test against', () => {
    expect(cases.length).toBeGreaterThan(0)
  })

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

describe('/bundle', () => {
  it('resolves {{sistema_url}} across a bundled topic', async () => {
    const req = new NextRequest('http://localhost/bundle/principles/color?topics=primitive-ramp-scalability,architecture')
    const res = await bundleGET(req, { params: Promise.resolve({ category: 'principles', slug: 'color' }) })
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(text).not.toContain('{{sistema_url}}')
    expect(text).not.toContain('skipped')
  })
})
