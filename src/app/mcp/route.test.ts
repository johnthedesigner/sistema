import { describe, expect, it } from 'vitest'
import { POST } from './route'

async function rpc(method: string, params?: unknown) {
  const res = await POST(new Request('http://x/mcp', {
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
})
