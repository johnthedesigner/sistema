import { describe, expect, it } from 'vitest'
import { POST } from './route'

async function rpc(method: string, params?: unknown, url = 'http://x/mcp') {
  const res = await POST(new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', 'mcp-protocol-version': '2025-06-18' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  }))
  const body = await res.text()
  const line = body.split('\n').find(l => l.startsWith('data:'))
  return JSON.parse(line ? line.slice(5) : body)
}

describe('/mcp', () => {
  it('lists the seven tools and a prompt per workflow', async () => {
    const tools = (await rpc('tools/list')).result.tools.map((t: { name: string }) => t.name)
    expect(tools.sort()).toEqual(['contrast', 'next_step', 'palette', 'read', 'search', 'specimen', 'type_scale'])
    const prompts = (await rpc('prompts/list')).result.prompts.map((p: { name: string }) => p.name)
    expect(prompts.sort()).toEqual(['patterns', 'session', 'start'])
  })
  it('returns the same result as the API, and errors as tool errors', async () => {
    const r = await rpc('tools/call', { name: 'contrast', arguments: { pairs: [{ foreground: '#000000', background: '#FFFFFF' }] } })
    expect(JSON.parse(r.result.content[0].text).results[0].ratio).toBe(21)
    const bad = await rpc('tools/call', { name: 'palette', arguments: { colors: { a: 'not-a-color' } } })
    expect(bad.result.isError).toBe(true)
    const missing = await rpc('tools/call', { name: 'read', arguments: { id: 'nope' } })
    expect(missing.result.isError).toBe(true)
  })
  it('each calculation tool returns exactly what its API returns', async () => {
    const { NextRequest } = await import('next/server')
    const cases: Array<[string, string, Record<string, unknown>]> = [
      ['palette', 'palette', { colors: { accent: '#3A7D5C' } }],
      ['contrast', 'contrast', { pairs: [{ foreground: '#767676', background: '#FFFFFF', purpose: 'text' }], standard: 'wcag-2.2 AA' }],
      ['type_scale', 'type-scale', { base: 16, ratio: '1.25', roles: { body: 0 } }],
      ['specimen', 'specimen', { accent: '#3A7D5C', neutral: 'warm', layout: 'record', content: JSON.stringify({ product: 'Tidy' }) }],
    ]
    for (const [tool, path, args] of cases) {
      const { POST: api } = await import(`@/app/api/${path}/route`)
      const direct = await (await api(new NextRequest(`http://x/api/${path}`, { method: 'POST', body: JSON.stringify(args), headers: { 'content-type': 'application/json' } }))).json()
      const viaMcp = JSON.parse((await rpc('tools/call', { name: tool, arguments: args })).result.content[0].text)
      expect(viaMcp, tool).toEqual(direct)
    }
  })
  it('next_step takes sistema.json as text, and rejects text that is not one JSON object', async () => {
    const later = await rpc('tools/call', { name: 'next_step', arguments: { workflow: 'start', state: JSON.stringify({ workflow: 'start', steps: { 'project.assess': { status: 'complete' } } }) } })
    expect(later.result.content[0].text).toMatch(/Step 2 of/)
    const bad = await rpc('tools/call', { name: 'next_step', arguments: { workflow: 'start', state: '{not json' } })
    expect(bad.result.isError).toBe(true)
  })
  it('next_step hands over the visit ID from the server URL until sistema.json has it', async () => {
    const id = 'internal-0b0e9a3c-1f2d-4c5b-9a8e-7d6c5b4a3f21'
    const ask = await rpc('tools/call', { name: 'next_step', arguments: { workflow: 'start' } }, `http://x/mcp?c=${id}`)
    expect(ask.result.content[0].text).toContain(`set \`telemetry.id\` to \`${id}\``)
    const has = await rpc('tools/call', { name: 'next_step', arguments: { workflow: 'start', state: JSON.stringify({ telemetry: { id } }) } }, `http://x/mcp?c=${id}`)
    expect(has.result.content[0].text).not.toContain('set `telemetry.id`')
    const none = await rpc('tools/call', { name: 'next_step', arguments: { workflow: 'start' } })
    expect(none.result.content[0].text).not.toContain('set `telemetry.id`')
  })
})
