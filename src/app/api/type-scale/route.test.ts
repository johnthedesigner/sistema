import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from './route'

const get = (q: string) => GET(new NextRequest(`http://x/api/type-scale?${q}`))
const post = (body: unknown) =>
  POST(new NextRequest('http://x/api/type-scale', { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } }))

describe('/api/type-scale', () => {
  it('defaults to a major third, two steps down and six up, numbered smallest first (D12)', async () => {
    const res = await get('')
    expect(res.status).toBe(200)
    expect(res.headers.get('access-control-allow-origin')).toBe('*')
    const body = await res.json()
    expect(body).toMatchObject({ base: 16, ratio: 1.25, ratio_name: 'major-third', names: 'numeric' })
    expect(body.steps.map((s: { px: number }) => s.px)).toEqual([10, 13, 16, 20, 25, 31, 39, 49, 61])
    expect(body.steps.map((s: { name: string }) => s.name)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9'])
    expect(body.steps[0].notes[0]).toMatch(/10px/)
    expect(body.steps[1].notes).toBeUndefined()
    expect(body.standard).toBeUndefined()
    expect(body.checks).toEqual([{ rule: 'typography.line-height.by-role', pass: true }])
  })

  it('suggests unitless line heights that fall as size grows', async () => {
    const { steps } = await (await get('')).json()
    const lh = steps.map((s: { line_height: number }) => s.line_height)
    for (let i = 1; i < lh.length; i++) if (steps[i].px >= 14) expect(lh[i]).toBeLessThanOrEqual(lh[i - 1] + 0.11)
    expect(lh[lh.length - 1]).toBe(1.1)
    expect(steps.find((s: { px: number }) => s.px === 16).line_height).toBe(1.5)
  })

  it('names steps in the convention asked for and places roles only where named', async () => {
    const tw = await (await get('names=tailwind&roles=caption:-2,body:0,label:0,display:6')).json()
    expect(tw.steps.map((s: { name: string }) => s.name)).toEqual(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'])
    expect(tw.steps[2].roles).toEqual(['body', 'label'])
    expect(tw.steps[1].roles).toBeUndefined()
    const st = await (await get('names=steps&down=1&up=1')).json()
    expect(st.steps.map((s: { name: string }) => s.name)).toEqual(['-1', '0', '1'])
  })

  it('checks body line height against the standard when one sets a minimum', async () => {
    const aaa = await (await get('standard=wcag-2.2%20AAA&roles=body:0')).json()
    expect(aaa).toMatchObject({ standard: 'wcag-2.2', level: 'AAA' })
    expect(aaa.checks[1]).toMatchObject({ rule: 'typography.line-height.body', required: 1.5, value: 1.5, pass: true })
    const aa = await (await get('standard=wcag-2.2&level=AA')).json()
    expect(aa.checks).toHaveLength(1)
    // Body text gets the body band at any size, so a 20px base still passes
    const big = await (await get('base=20&standard=wcag-2.2%20AAA')).json()
    expect(big.checks[1]).toMatchObject({ value: 1.5, pass: true })
    // With body placed off the base step, the base step is sized like any other text
    const moved = await (await get('base=20&roles=body:-1')).json()
    expect(moved.steps.find((s: { step: number }) => s.step === 0).line_height).toBe(1.3)
    expect(moved.steps.find((s: { step: number }) => s.step === -1).line_height).toBe(1.5)
  })

  it('accepts a numeric ratio and matches POST', async () => {
    const g = await (await get('base=14&ratio=1.2&roles=body:0')).json()
    const p = await (await post({ base: 14, ratio: 1.2, roles: { body: 0 } })).json()
    expect(g).toEqual(p)
    expect(g.ratio_name).toBe('minor-third')
  })

  it('returns 400 with a working example for bad input', async () => {
    for (const q of ['base=4', 'ratio=3', 'ratio=huge', 'down=9', 'names=letters', 'roles=body', 'roles=Body:0', 'roles=display:12', 'standard=wcag-9']) {
      const res = await get(q)
      expect(res.status, q).toBe(400)
      expect((await res.json()).example).toMatch(/\/api\/type-scale\?/)
    }
  })
})
