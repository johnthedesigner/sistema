'use client'

/**
 * The prompt box. Shows the real prompt in an editable box, as a paste-in prompt
 * or as what to ask an agent with the MCP server connected.
 *
 * On the home page, three choices (start, audit, update; D42) sit above it. Update
 * opens its routes right beneath it as a radio group, and one route is always
 * selected (D43). On the update page the routes show on their own. Workflow and
 * play pages pass a single option and get no choices.
 *
 * Spacing: the box has the same padding on every side, measured to what you see.
 * Text carries half its leading above and below the letters and buttons carry none,
 * so the text box is pulled up by its half-leading, and the gap from the text to the
 * controls equals the padding. "Copied" shows in the button, so nothing reserves
 * space below the controls.
 */
import Link from 'next/link'
import { useId, useState } from 'react'
import type { PromptOption } from '@/lib/content/prompts'
import { promptForCopy, trackPromptSelected } from '@/lib/analytics/browser'

const WORK = 'workflow.session'
const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

/** What to ask an agent that has the MCP server connected. */
function mcpPrompt(o: PromptOption): string {
  const route = o.prompt.split('\n').slice(1).join('\n')
  if (o.kind === 'route' || o.id === WORK) return `Use the Sistema MCP server: call next_step for the "session" workflow and follow it.${route ? `\n${route}` : ''}`
  if (o.id.startsWith('workflow.')) return `Use the Sistema MCP server: call next_step for the "${o.id.replace(/^workflow\./, '')}" workflow and follow it.`
  return `Use the Sistema MCP server: read "${o.id}" and follow it.`
}

export function PromptBox({
  suggestions = [],
  routes = [],
  initial,
  defaultRoute,
  single,
  center,
  label = 'Your prompt',
}: {
  suggestions?: PromptOption[]
  routes?: PromptOption[]
  initial?: string
  /** The route selected when update is chosen (D43). */
  defaultRoute?: string
  /** One prompt with no choices, for workflow and play pages. */
  single?: PromptOption
  /** Center the mode switch and the choices (the home page). */
  center?: boolean
  label?: string
}) {
  const choices = single ? [single] : suggestions
  const [top, setTop] = useState(initial ?? choices[0]?.id ?? WORK)
  const [route, setRoute] = useState(defaultRoute ?? routes[0]?.id)
  const showRoutes = !single && routes.length > 0 && (top === WORK || suggestions.length <= 1)
  const current = single ?? (showRoutes ? routes.find(r => r.id === route) : undefined) ?? choices.find(o => o.id === top) ?? choices[0]

  const [mode, setMode] = useState<'prompt' | 'mcp'>('prompt')
  const textFor = (o: PromptOption | undefined, m: 'prompt' | 'mcp') => (o ? (m === 'mcp' ? mcpPrompt(o) : o.prompt) : '')
  const [text, setText] = useState(textFor(current, 'prompt'))
  const [copied, setCopied] = useState<'' | 'ok' | 'failed'>('')
  const boxId = useId()

  function show(o: PromptOption | undefined, m = mode) {
    setText(textFor(o, m))
    setCopied('')
  }
  function chooseTop(o: PromptOption) {
    setTop(o.id)
    const next = o.id === WORK && routes.length ? routes.find(r => r.id === route) ?? routes[0] : o
    show(next)
    trackPromptSelected(o.kind, o.id)
  }
  function chooseRoute(o: PromptOption) {
    setRoute(o.id)
    show(o)
    trackPromptSelected(o.kind, o.id)
  }
  function switchMode(m: 'prompt' | 'mcp') {
    setMode(m)
    show(current, m)
  }

  async function copy() {
    const out = promptForCopy(text, current?.id.replace(/^route\..*/, WORK) ?? WORK)
    let ok = false
    try {
      await navigator.clipboard.writeText(out)
      ok = true
    } catch {
      const t = document.createElement('textarea')
      t.value = out
      document.body.appendChild(t)
      t.select()
      try { ok = document.execCommand('copy') } catch {}
      t.remove()
    }
    setCopied(ok ? 'ok' : 'failed')
    if (ok) setTimeout(() => setCopied(''), 2000)
  }

  const rows = Math.min(8, Math.max(1, text.split("\n").length))
  const workIndex = suggestions.findIndex(o => o.id === WORK)

  return (
    <div>
      <div className={`flex mb-5 ${center ? 'justify-center' : ''}`}>
        <div role="group" aria-label="How to use Sistema" className="inline-flex p-1 rounded-radius-lg bg-surface-hover">
          {(['prompt', 'mcp'] as const).map(m => (
            <button key={m} type="button" aria-pressed={mode === m} onClick={() => switchMode(m)}
              className={`h-control-height px-4 rounded-radius-md text-label text-on-surface-muted hover:text-on-surface aria-pressed:bg-surface-raised aria-pressed:text-on-surface aria-pressed:shadow-control transition-colors motion-reduce:transition-none ${focusRing}`}>
              {m === 'prompt' ? 'Paste a prompt' : 'Use the MCP server'}
            </button>
          ))}
        </div>
      </div>

      {!single && suggestions.length > 1 && (
        <div role="radiogroup" aria-label="What do you want to do?" className="grid gap-2 sm:grid-cols-3">
          {suggestions.map(o => {
            const on = top === o.id
            return (
              <button key={o.id} type="button" role="radio" aria-checked={on} onClick={() => chooseTop(o)}
                className={`flex flex-col justify-start text-left rounded-radius-lg px-4 py-3 transition-colors motion-reduce:transition-none ${focusRing} ${
                  on ? 'bg-surface-raised shadow-control ring-2 ring-primary' : 'bg-surface-raised/60 hover:bg-surface-raised ring-1 ring-border'
                }`}>
                <span className="block text-label text-on-surface">{o.label}</span>
                {o.description && <span className="block text-caption text-on-surface-muted mt-0.5">{o.description}</span>}
              </button>
            )
          })}
        </div>
      )}

      {showRoutes && (
        <div className={`relative mt-3 rounded-radius-xl bg-surface-raised p-4 ${suggestions.length > 1 ? 'ring-2 ring-primary' : 'shadow-control'}`}>
          {suggestions.length > 1 && workIndex >= 0 && (
            // A notch pointing at the update choice, so its routes read as part of it.
            <span aria-hidden="true" className="absolute -top-[7px] w-3 h-3 rotate-45 bg-surface-raised border-l-2 border-t-2 border-primary left-6 sm:left-[calc(var(--notch)-6px)]"
              style={{ ['--notch' as string]: `${((workIndex + 0.5) / suggestions.length) * 100}%` }} />
          )}
          <p id={`${boxId}-routes`} className="text-caption text-on-surface-muted m-0 mb-2">What do you want to update?</p>
          <div role="radiogroup" aria-labelledby={`${boxId}-routes`} className="flex flex-wrap gap-2">
            {routes.map(o => (
              <button key={o.id} type="button" role="radio" aria-checked={route === o.id} onClick={() => chooseRoute(o)}
                className={`h-control-height-sm px-3 rounded-radius-full text-body-sm transition-colors motion-reduce:transition-none ${focusRing} ${
                  route === o.id ? 'bg-primary-container text-on-primary-container ring-1 ring-primary' : 'ring-1 ring-border text-on-surface-muted hover:bg-surface-hover hover:text-on-surface'
                }`}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={`rounded-radius-xl bg-surface-featured shadow-featured p-5 ${!single && (suggestions.length > 1 || showRoutes) ? 'mt-4' : ''}`}>
        <label htmlFor={boxId} className="sr-only">{label}</label>
        <textarea
          id={boxId}
          value={text}
          onChange={e => setText(e.target.value)}
          rows={rows}
          spellCheck={false}
          className={`block w-full resize-none bg-transparent font-mono text-code text-on-surface outline-none p-0 -mt-1 rounded-radius-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-focus`}
        />
        <div className="flex items-center justify-between gap-3 mt-4 flex-wrap">
          <p className="text-caption text-on-surface-faint m-0">
            {mode === 'mcp' ? 'Ask this in your agent, with the Sistema MCP server connected.' : 'Paste into Claude Code, Cursor, or another coding agent, in your project folder.'}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {mode === 'mcp' && (
              <Link href="/connect" className={`inline-flex items-center h-control-height px-4 rounded-radius-md border border-border-strong bg-surface-raised text-on-surface text-label no-underline hover:bg-surface-hover transition-colors motion-reduce:transition-none ${focusRing}`}>
                Connect the MCP server
              </Link>
            )}
            <button type="button" onClick={copy}
              className={`inline-flex items-center gap-2 h-control-height px-4 rounded-radius-md text-label shadow-control transition-colors motion-reduce:transition-none ${focusRing} ${
                copied === 'ok' ? 'bg-success text-on-success' : 'bg-primary text-on-primary hover:bg-primary-hover'
              }`}>
              {copied === 'ok' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M5 15V6a2 2 0 0 1 2-2h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              )}
              {copied === 'ok' ? 'Copied' : 'Copy prompt'}
            </button>
          </div>
        </div>
        <p role="status" aria-live="polite" className="sr-only">{copied === 'ok' ? 'Copied. Paste it into your agent.' : copied === 'failed' ? 'Copy failed. Select the text and copy it.' : ''}</p>
        {copied === 'failed' && <p className="text-caption text-on-surface-muted m-0 mt-3">Copy failed. Select the text and copy it.</p>}
      </div>
    </div>
  )
}
