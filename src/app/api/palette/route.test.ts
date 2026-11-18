import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from './route'

const post = (body: unknown) =>
  POST(new NextRequest('http://x/api/palette', { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } }))

describe('/api/palette', () => {
  it('builds the same palette from hex, rgb(), and oklch() forms of one seed', async () => {
    const res = await post({ colors: { a: '#1F5FD1', b: 'rgb(31 95 209)', d: '1f5fd1' } })
    expect(res.status).toBe(200)
    const { palettes } = await res.json()
    expect(palettes.a.stops).toEqual(palettes.b.stops)
    expect(palettes.a.stops).toEqual(palettes.d.stops)
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

describe('/api/palette GET', () => {
  const get = (query: string) => GET(new NextRequest(`http://x/api/palette?${query}`))

  it('treats each query parameter as a named seed and adds OKLCH to every stop', async () => {
    const res = await get('primary=%231F5FD1&neutral=oklch(0.55%200.01%20260)')
    expect(res.status).toBe(200)
    expect(res.headers.get('access-control-allow-origin')).toBe('*')
    const { palettes } = await res.json()
    expect(Object.keys(palettes)).toEqual(['primary', 'neutral'])
    const stop = palettes.primary.stops['500']
    expect(stop.hex).toMatch(/^#[0-9A-F]{6}$/)
    expect(stop.oklch).toMatch(/^oklch\(/)
  })

  it('matches POST for the same seeds, ignores c, and flags mapped seeds', async () => {
    const g = await (await get('primary=%231F5FD1&c=00000000-0000-0000-0000-000000000000')).json()
    const p = await (await post({ colors: { primary: '#1F5FD1' } })).json()
    expect(g).toEqual(p)
    const m = await (await get('green=oklch(0.7%200.4%20145)')).json()
    expect(m.palettes.green.seed_mapped).toBe(true)
  })

  it('rejects reserved names, bad names, too many seeds, and no seeds, with an example', async () => {
    for (const q of ['standard=%23fff', 'bad%20name=%23fff', '', Array.from({ length: 13 }, (_, i) => `s${i}=%23fff`).join('&')]) {
      const res = await get(q)
      expect(res.status, q).toBe(400)
      expect((await res.json()).example).toMatch(/\/api\/palette\?/)
    }
  })
})
