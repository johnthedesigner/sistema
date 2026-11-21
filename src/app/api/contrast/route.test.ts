import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from './route'

const post = (body: unknown) =>
  POST(new NextRequest('http://x/api/contrast', { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } }))
const get = (query: string) => GET(new NextRequest(`http://x/api/contrast?${query}`))

describe('/api/contrast GET', () => {
  it('checks one pair, defaulting to WCAG 2.2 AA and saying so', async () => {
    const res = await get('fg=%23000&bg=%23fff')
    expect(res.status).toBe(200)
    expect(res.headers.get('access-control-allow-origin')).toBe('*')
    const body = await res.json()
    expect(body).toMatchObject({ standard: 'wcag-2.2', level: 'AA', defaulted: true })
    expect(body.results[0]).toMatchObject({
      foreground: { hex: '#000000', oklch: 'oklch(0 0 0)' },
      background: { hex: '#FFFFFF' },
      ratio: 21,
      checks: {
        text: { rule: 'color.contrast.text', required: 4.5, pass: true },
        large_text: { rule: 'color.contrast.large-text', required: 3, pass: true },
        ui: { rule: 'color.contrast.ui', required: 3, pass: true },
      },
    })
  })

  it('pairs repeated fg and bg by position, with labels, and accepts any color format', async () => {
    const res = await get('fg=%23FFF&bg=rgb(31,95,209)&fg=oklch(0.2%200%200)&bg=%23FAFAF7&label=on-primary&label=body')
    const { results } = await res.json()
    expect(results).toHaveLength(2)
    expect(results[0]).toMatchObject({ label: 'on-primary', ratio: 5.81 })
    expect(results[1].label).toBe('body')
  })

  it('reads the standard and level from the registry, including the combined sistema.json form', async () => {
    const aaa = await (await get('fg=%23FFF&bg=%231F5FD1&standard=wcag-2.2&level=AAA')).json()
    expect(aaa.results[0].checks.text).toMatchObject({ required: 7, pass: false })
    // wcag-2.2 sets no AAA value for UI contrast, so AA's applies
    expect(aaa.results[0].checks.ui.required).toBe(3)
    const combined = await (await get('fg=%23FFF&bg=%231F5FD1&standard=wcag-2.2%20AAA')).json()
    expect(combined).toMatchObject({ standard: 'wcag-2.2', level: 'AAA' })
    expect(combined.defaulted).toBeUndefined()
  })

  it('leaves out a check the standard does not set', async () => {
    const body = await (await get('fg=%23FFF&bg=%231F5FD1&standard=section-508')).json()
    expect(body.results[0].checks.text).toBeDefined()
    expect(body.results[0].checks.ui).toBeUndefined()
  })

  it('judges passing on the unrounded ratio', async () => {
    // #767676 on white is 4.54; #777777 is 4.48, which rounds to 4.48 and fails
    const body = await (await get('fg=%23777777&bg=%23FFFFFF')).json()
    expect(body.results[0].checks.text.pass).toBe(false)
  })

  it('returns 400 with a working example for bad input', async () => {
    for (const q of ['fg=red&bg=%23fff', 'fg=%23000', '', 'fg=%23000&bg=%23fff&standard=wcag-9']) {
      const res = await get(q)
      expect(res.status, q).toBe(400)
      const body = await res.json()
      expect(body.example).toMatch(/^https?:\/\/.+\/api\/contrast\?fg=/)
    }
  })

  it('limits GET to 50 pairs', async () => {
    const q = Array.from({ length: 51 }, () => 'fg=%23000&bg=%23fff').join('&')
    expect((await get(q)).status).toBe(400)
  })
})

describe('/api/contrast POST', () => {
  it('checks a batch in order, keeping labels and reporting bad pairs in place', async () => {
    const res = await post({
      standard: 'wcag-2.2',
      pairs: [
        { foreground: '#ffffff', background: '#2f8f72', label: 'on-primary on primary-hover' },
        { foreground: 'nope', background: '#fff' },
        { foreground: '#1c2321', background: '#fafaf7' },
      ],
    })
    expect(res.status).toBe(200)
    const { results, defaulted } = await res.json()
    expect(defaulted).toBeUndefined()
    expect(results).toHaveLength(3)
    expect(results[0]).toMatchObject({ label: 'on-primary on primary-hover', ratio: 3.97, checks: { text: { pass: false }, ui: { pass: true } } })
    expect(results[1].error).toMatch(/Invalid foreground/)
    expect(results[2].ratio).toBeGreaterThan(15)
  })

  it('accepts a single pair and returns the same shape', async () => {
    const body = await (await post({ foreground: '#000', background: '#fff' })).json()
    expect(body.results[0].ratio).toBe(21)
  })

  it('rejects an invalid single pair, an empty or oversized batch, and bad JSON', async () => {
    expect((await post({ foreground: 'red', background: '#fff' })).status).toBe(400)
    expect((await post({ pairs: [] })).status).toBe(400)
    const many = Array.from({ length: 201 }, () => ({ foreground: '#000', background: '#fff' }))
    expect((await post({ pairs: many })).status).toBe(400)
    const bad = await POST(new NextRequest('http://x/api/contrast', { method: 'POST', body: '{nope' }))
    expect(bad.status).toBe(400)
  })
})

describe('purpose', () => {
  it('limits checks to one, or none for informational', async () => {
    const { POST } = await import('./route')
    const req = new Request('http://x/api/contrast', { method: 'POST', body: JSON.stringify({ pairs: [
      { foreground: '#767676', background: '#fff', purpose: 'ui' },
      { foreground: '#eeeeee', background: '#fff', purpose: 'informational' },
      { foreground: '#000', background: '#fff', purpose: 'nonsense' },
    ] }) })
    const body = await (await POST(req as never)).json()
    expect(Object.keys(body.results[0].checks)).toEqual(['ui'])
    expect(body.results[1].checks).toEqual({})
    expect(body.results[1].ratio).toBeGreaterThan(1)
    expect(body.results[2].error).toMatch(/purpose/)
  })
})
