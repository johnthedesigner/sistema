import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from './route'

const post = (body: unknown) =>
  POST(new NextRequest('http://x/api/contrast', { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } }))

describe('/api/contrast', () => {
  it('checks a single pair', async () => {
    const res = await post({ foreground: '#000', background: '#fff' })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ratio).toBe(21)
    expect(body.passes.aa_text).toBe(true)
  })

  it('rejects an invalid single pair', async () => {
    const res = await post({ foreground: 'red', background: '#fff' })
    expect(res.status).toBe(400)
  })

  it('checks a batch in order, keeping labels and reporting bad pairs in place', async () => {
    const res = await post({
      pairs: [
        { foreground: '#ffffff', background: '#2f8f72', label: 'on-primary on primary-hover' },
        { foreground: 'nope', background: '#fff' },
        { foreground: '#1c2321', background: '#fafaf7' },
      ],
    })
    expect(res.status).toBe(200)
    const { results } = await res.json()
    expect(results).toHaveLength(3)
    expect(results[0]).toMatchObject({ label: 'on-primary on primary-hover', ratio: 3.97, passes: { aa_text: false, aa_ui: true } })
    expect(results[1].error).toMatch(/Invalid foreground/)
    expect(results[2].ratio).toBeGreaterThan(15)
  })

  it('rejects an empty or oversized batch', async () => {
    expect((await post({ pairs: [] })).status).toBe(400)
    const many = Array.from({ length: 201 }, () => ({ foreground: '#000', background: '#fff' }))
    expect((await post({ pairs: many })).status).toBe(400)
  })
})
