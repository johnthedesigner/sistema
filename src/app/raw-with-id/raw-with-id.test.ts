import { describe, expect, it } from 'vitest'
import { NextRequest, type NextFetchEvent } from 'next/server'
import { GET } from './[...path]/route'
import { middleware } from '../../middleware'
import { SITE_URL } from '@/lib/site-url'

const ID = '3f2b8c1e-1d2a-4c3b-9e8f-0a1b2c3d4e5f'
const get = (path: string[], query = '') => GET(new Request(`http://x/raw-with-id/${path.join('/')}${query}`), { params: Promise.resolve({ path }) })
const sistemaUrls = (text: string) => text.match(new RegExp(`${SITE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/(?:raw|api)[^\\s\`'"()]*`, 'g')) ?? []

describe('/raw-with-id', () => {
  it('serves the starter with c on every Sistema URL, including continue and tool calls', async () => {
    const res = await get(['workflows', 'start'], `?c=${ID}`)
    expect(res.status).toBe(200)
    const text = await res.text()
    const urls = sistemaUrls(text)
    expect(urls.length).toBeGreaterThan(10)
    for (const u of urls) expect(u, u).toContain(`c=${ID}`)
    expect(text).toContain(`"continue": "${SITE_URL}/raw/workflows/start?c=${ID}"`)
  })

  it('serves a play with c on its tool URLs and guide links', async () => {
    const text = await (await get(['plays', 'color.scheme'], `?c=${ID}`)).text()
    expect(text).toMatch(new RegExp(`/api/palette\\?[^\\s]*c=${ID}`))
    expect(text).toMatch(new RegExp(`/raw/guides/color/architecture\\?c=${ID}`))
  })

  it('serves every kind of /raw path, and 404s for unknown ones', async () => {
    for (const path of [['workflows', 'start', 'full'], ['guides', 'color', 'architecture'], ['files', 'design-md'], ['opinions'], ['rules'], ['sources'], ['agents'], ['schema', 'sistema.json']]) {
      expect((await get(path, `?c=${ID}`)).status, path.join('/')).toBe(200)
    }
    expect((await get(['plays', 'nope'], `?c=${ID}`)).status).toBe(404)
    expect((await get(['nothing'], `?c=${ID}`)).status).toBe(404)
  })

  it('leaves content unchanged when c is not a valid ID', async () => {
    const plain = await (await get(['plays', 'color.scheme'])).text()
    expect(await (await get(['plays', 'color.scheme'], '?c=off')).text()).toBe(plain)
  })
})

describe('middleware', () => {
  const event = { waitUntil: () => {} } as unknown as NextFetchEvent
  it('rewrites /raw requests with a valid c to /raw-with-id, and passes others through', () => {
    const withId = middleware(new NextRequest(`http://x/raw/plays/color.scheme?c=${ID}`), event)
    expect(withId.headers.get('x-middleware-rewrite')).toContain(`/raw-with-id/plays/color.scheme?c=${ID}`)
    const without = middleware(new NextRequest('http://x/raw/plays/color.scheme'), event)
    expect(without.headers.get('x-middleware-rewrite')).toBeNull()
    const invalid = middleware(new NextRequest('http://x/raw/plays/color.scheme?c=nope'), event)
    expect(invalid.headers.get('x-middleware-rewrite')).toBeNull()
    const llms = middleware(new NextRequest(`http://x/llms.txt?c=${ID}`), event)
    expect(llms.headers.get('x-middleware-rewrite')).toBeNull()
  })
})

describe('sistema.json telemetry', () => {
  it('accepts telemetry.id and rejects other shapes', async () => {
    const { SistemaState } = await import('@/lib/content/schema')
    expect(SistemaState.safeParse({ sistema: '2', telemetry: { id: ID } }).success).toBe(true)
    expect(SistemaState.safeParse({ sistema: '2', telemetry: false }).success).toBe(false)
    expect(SistemaState.safeParse({ sistema: '2', telemetry: { id: ID, extra: 1 } }).success).toBe(false)
  })
})
