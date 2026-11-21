import { describe, expect, it } from 'vitest'
import { GET as opinion } from './opinions/[id]/route'
import { GET as rule } from './rules/[id]/route'

const call = (fn: typeof opinion, id: string) => fn(new Request('http://x'), { params: Promise.resolve({ id }) })

describe('per-item raw routes', () => {
  it('serves one opinion and one rule, and 404s an unknown id', async () => {
    const o = await call(opinion, 'opinion.both-themes')
    expect(o.status).toBe(200)
    expect(await o.text()).toMatch(/One decision for both themes/)
    const r = await call(rule, 'color.states.visible')
    expect(r.status).toBe(200)
    expect(await r.text()).toMatch(/color\.states\.visible/)
    expect((await call(rule, 'nope.nope')).status).toBe(404)
  })
})
