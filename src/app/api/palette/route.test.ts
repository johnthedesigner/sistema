import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from './route'

const post = (body: unknown) =>
  POST(new NextRequest('http://x/api/palette', { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } }))

describe('/api/palette', () => {
  it('builds the same palette from hex, rgb(), and oklch() forms of one seed', async () => {
    const res = await post({ colors: { a: '#1F5FD1', b: 'rgb(31 95 209)', c: '1f5fd1' } })
    expect(res.status).toBe(200)
    const { palettes } = await res.json()
    expect(palettes.a.stops).toEqual(palettes.b.stops)
    expect(palettes.a.stops).toEqual(palettes.c.stops)
    expect(Object.keys(palettes.a.stops)).toHaveLength(19)
  })

  it('accepts oklch seeds, including out-of-gamut ones', async () => {
    const res = await post({ colors: { green: 'oklch(0.7 0.4 145)', blue: 'oklch(0.52 0.19 261)' } })
    expect(res.status).toBe(200)
    const { palettes } = await res.json()
    expect(palettes.green.seed).toMatch(/^#[0-9A-Fa-f]{6}$/)
  })

  it('names the accepted formats when a seed is invalid', async () => {
    const res = await post({ colors: { brand: 'red' } })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.details[0]).toMatch(/^brand: .*oklch/)
  })
})
