'use client'

/**
 * Setup for each MCP client (V4.2). The server URL carries this visit's ID as
 * `c`, so MCP usage is counted like copied prompts (D13). Built in the browser,
 * after mount, because the ID lives in memory only.
 */
import { useEffect, useState } from 'react'
import { getVisitId } from '@/lib/analytics/browser'

const CLIENTS: Array<{ name: string; where: string; code: (url: string) => string; lang: string }> = [
  { name: 'Claude Code', where: 'Run in your terminal, in your project folder:', code: url => `claude mcp add --transport http sistema "${url}"`, lang: 'shell' },
  { name: 'Codex', where: 'Run in your terminal:', code: url => `codex mcp add sistema --url "${url}"`, lang: 'shell' },
  { name: 'Cursor', where: 'Add to ~/.cursor/mcp.json (or .cursor/mcp.json in the project):', code: url => JSON.stringify({ mcpServers: { sistema: { url } } }, null, 2), lang: 'json' },
  { name: 'VS Code', where: 'Add to .vscode/mcp.json in the project:', code: url => JSON.stringify({ servers: { sistema: { type: 'http', url } } }, null, 2), lang: 'json' },
  { name: 'Windsurf', where: 'Add to ~/.codeium/windsurf/mcp_config.json:', code: url => JSON.stringify({ mcpServers: { sistema: { serverUrl: url } } }, null, 2), lang: 'json' },
  { name: 'Clients without remote servers', where: 'Run it through mcp-remote, for example in Claude Desktop’s claude_desktop_config.json:', code: url => JSON.stringify({ mcpServers: { sistema: { command: 'npx', args: ['-y', 'mcp-remote', url] } } }, null, 2), lang: 'json' },
]

function Copy({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2500) } catch {}
      }}
      className="shrink-0 h-control-height-sm px-3 rounded-radius-md text-label bg-surface-raised text-on-surface hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
    >
      {done ? 'Copied' : 'Copy'}
    </button>
  )
}

export function ConnectClients({ base }: { base: string }) {
  const [url, setUrl] = useState(`${base}/mcp`)
  useEffect(() => setUrl(`${base}/mcp?c=${getVisitId()}`), [base])
  return (
    <div className="grid gap-6">
      <div className="rounded-radius-lg bg-surface-featured shadow-featured p-5">
        <p className="text-label m-0 mb-2">Server URL</p>
        <div className="flex items-center gap-3">
          <code className="flex-1 min-w-0 break-all font-mono text-code bg-surface-subtle rounded-radius-sm px-3 py-2">{url}</code>
          <Copy text={url} />
        </div>
        <p className="text-caption text-on-surface-faint m-0 mt-2">Streamable HTTP. The <code>c</code> part is an anonymous usage ID; see the privacy page.</p>
      </div>
      {CLIENTS.map(c => (
        <section key={c.name}>
          <h2 className="text-heading-sm m-0 mb-1">{c.name}</h2>
          <p className="text-body-sm text-on-surface-muted m-0 mb-2">{c.where}</p>
          <div className="flex items-start gap-3 rounded-radius-lg bg-surface-raised p-4">
            <pre className="flex-1 min-w-0 m-0 font-mono text-code whitespace-pre-wrap break-all">{c.code(url)}</pre>
            <Copy text={c.code(url)} />
          </div>
        </section>
      ))}
    </div>
  )
}
