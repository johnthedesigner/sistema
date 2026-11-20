import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { GET as index } from './route'
import { GET as contrast } from './contrast/route'
import { GET as palette } from './palette/route'
import { GET as typeScale } from './type-scale/route'
import { GET as specimen } from './specimen/route'

const HANDLERS: Record<string, (r: NextRequest) => Response | Promise<Response>> = { contrast, palette, type_scale: typeScale, specimen }

describe('/api index', () => {
  it('lists every tool with absolute URLs, limits, and docs', async () => {
    const body = await index(new Request('http://x/api')).json()
    expect(body.tools.map((t: { name: string }) => t.name)).toEqual(['contrast', 'palette', 'type_scale', 'specimen'])
    for (const t of body.tools) {
      for (const url of [t.get, t.example, t.post.url, t.docs]) expect(url, t.name).toMatch(/^https?:\/\//)
      expect(t.limits).toBeTruthy()
    }
  })

  it('every example URL in the index works', async () => {
    const body = await index(new Request('http://x/api')).json()
    for (const t of body.tools) {
      const url = new URL(t.example)
      const res = await HANDLERS[t.name](new NextRequest(`http://x${url.pathname}${url.search}`))
      expect(res.status, t.example).toBe(200)
    }
  })
})
