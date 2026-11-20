import { describe, expect, it } from 'vitest'
import { wcagContrast } from 'culori'
import { buildSpecimen, DENSITY, LAYOUTS, PRESENCE, SEPARATION, THEMES, WARMTH } from './specimen'
import { renderSpecimenHtml } from './specimen-html'
import { GET, POST } from '@/app/api/specimen/route'
import { NextRequest } from 'next/server'

// Text pairs must reach 4.5:1 and control edges 3:1 (WCAG 2.2 AA, the default standard).
const TEXT: Array<[string, string]> = [
  ['text', 'canvas'], ['text', 'surface'], ['text-secondary', 'surface'], ['text-secondary', 'canvas'], ['text-tertiary', 'surface'],
  ['text', 'surface-featured'], ['text-secondary', 'surface-featured'], ['text', 'row-hover'], ['text', 'selected-row'],
  ['on-primary', 'primary'], ['on-brand', 'surface-brand'], ['on-brand-muted', 'surface-brand'],
  ['on-inverse', 'surface-inverse'], ['on-inverse-muted', 'surface-inverse'], ['link', 'surface'], ['link', 'surface-featured'],
  ['on-success-container', 'success-container'], ['on-warning-container', 'warning-container'],
  ['on-error-container', 'error-container'], ['on-info-container', 'info-container'], ['on-neutral-container', 'neutral-container'],
  ['on-accent-subtle', 'accent-subtle'], ['nav-text', 'nav-bg'], ['on-nav-selected', 'nav-selected'], ['on-error-container', 'surface-overlay'],
]
const UI: Array<[string, string]> = [['border-control', 'surface'], ['focus', 'surface'], ['primary', 'surface']]

const ACCENTS = ['#1E6B5C', '#3A55C8', '#B4462B', '#C9A227', '#7C3AED']

describe('buildSpecimen', () => {
  it('builds with no input, from defaults', () => {
    const r = buildSpecimen()
    expect(r.ok).toBe(true)
  })

  it('takes every color from a ramp stop or white', () => {
    const r = buildSpecimen({ presence: 'tinted', theme: 'dark' })
    if (!r.ok) throw new Error(r.error)
    for (const role of Object.values(r.specimen.colors)) expect(role.from).toMatch(/^(white|(accent|neutral|red|amber|green|blue) \d{2,3})$/)
  })

  it('scales radius by element: chip ≤ control ≤ overlay ≤ panel ≤ featured', () => {
    for (const radius of [0, 3, 8, 12, 20]) {
      const r = buildSpecimen({ radius })
      if (!r.ok) throw new Error(r.error)
      const x = r.specimen.radius
      expect(x.chip).toBeLessThanOrEqual(x.control)
      expect(x.control).toBeLessThanOrEqual(x.overlay)
      expect(x.overlay).toBeLessThanOrEqual(x.panel)
      expect(x.panel).toBeLessThanOrEqual(x.featured)
    }
  })

  it('separates the featured surface more strongly than panels', () => {
    for (const separation of SEPARATION) {
      const r = buildSpecimen({ separation })
      if (!r.ok) throw new Error(r.error)
      expect(r.specimen.shadows.featured.length).toBeGreaterThan(r.specimen.shadows.panel.length)
    }
  })

  it('meets WCAG 2.2 AA for text and control edges across every choice', () => {
    const failures: string[] = []
    for (const accent of ACCENTS) for (const theme of THEMES) for (const presence of PRESENCE) for (const neutral of WARMTH) for (const separation of SEPARATION) {
      const r = buildSpecimen({ accent, theme, presence, neutral, separation })
      if (!r.ok) throw new Error(r.error)
      const c = r.specimen.colors
      for (const [fg, bg] of TEXT) {
        const ratio = wcagContrast(c[fg].hex, c[bg].hex)
        if (ratio < 4.5) failures.push(`${accent} ${theme} ${presence} ${neutral} ${separation}: ${fg} on ${bg} ${ratio.toFixed(2)}`)
      }
      for (const [fg, bg] of UI) {
        const ratio = wcagContrast(c[fg].hex, c[bg].hex)
        if (ratio < 3) failures.push(`${accent} ${theme} ${presence} ${neutral} ${separation}: ${fg} on ${bg} ${ratio.toFixed(2)}`)
      }
    }
    expect([...new Set(failures)]).toEqual([])
  })

  it('rejects unknown options with the allowed list', () => {
    const r = buildSpecimen({ separation: 'border' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toContain('tone, line, shadow')
    expect(buildSpecimen({ radius: 40 }).ok).toBe(false)
    expect(buildSpecimen({ font: 'Comic Sans' }).ok).toBe(false)
    expect(buildSpecimen({ accent: 'teal-ish' }).ok).toBe(false)
  })

  it('renders every density and escapes content', () => {
    for (const density of DENSITY) {
      const r = buildSpecimen({ density })
      if (!r.ok) throw new Error(r.error)
      const html = renderSpecimenHtml(r.specimen, { product: '<Relay>' })
      expect(html).toContain('&lt;Relay&gt;')
      expect(html).not.toContain('<Relay>')
    }
  })
})

describe('layouts', () => {
  it('renders every layout in both themes, with content escaped', () => {
    for (const layout of LAYOUTS) for (const theme of THEMES) {
      const r = buildSpecimen({ layout, theme, presence: 'tinted' })
      if (!r.ok) throw new Error(r.error)
      const html = renderSpecimenHtml(r.specimen, { product: '<Relay>' })
      expect(html, layout).toContain('&lt;Relay&gt;')
      expect(html, layout).not.toContain('<Relay>')
      expect(html, layout).not.toMatch(/undefined|NaN|\[object Object\]/)
    }
  })

  it('rejects an unknown layout', () => {
    const r = buildSpecimen({ layout: 'brochure' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toContain('operations, dashboard')
  })
})

describe('/api/specimen', () => {
  it('GET returns roles and a render URL', async () => {
    const res = GET(new NextRequest('http://localhost/api/specimen?accent=%233A55C8&presence=brand&radius=10'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.colors.primary.from).toMatch(/^accent /)
    expect(body.render).toContain('format=html')
  })

  it('GET with format=html returns the page', async () => {
    const res = GET(new NextRequest('http://localhost/api/specimen?format=html&theme=dark'))
    expect(res.headers.get('content-type')).toContain('text/html')
    expect(await res.text()).toContain('data-theme="dark"')
  })

  it('POST accepts content and reports errors with an example', async () => {
    const ok = await POST(new NextRequest('http://localhost/api/specimen', { method: 'POST', body: JSON.stringify({ content: { product: 'Relay' }, format: 'html' }) }))
    expect(await ok.text()).toContain('Relay')
    const bad = await POST(new NextRequest('http://localhost/api/specimen', { method: 'POST', body: JSON.stringify({ density: 'roomy' }) }))
    expect(bad.status).toBe(400)
    expect((await bad.json()).example).toContain('/api/specimen?')
  })
})
