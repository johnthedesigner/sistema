'use client'

/**
 * The prompt box (site-structure.md section 2). Shows the real prompt in an
 * editable box. Suggestions swap the prompt; on the home page a routes row sits
 * below, dimmed until "Work on my system" or a route is chosen. One option and no
 * suggestions on workflow and play pages.
 */
import { useId, useState } from 'react'
import type { PromptOption } from '@/lib/content/prompts'
import { promptForCopy, trackPromptSelected } from '@/lib/analytics/browser'

const WORK = 'workflow.session'

export function PromptBox({
  suggestions = [],
  routes = [],
  initial,
  single,
  label = 'Your prompt',
}: {
  suggestions?: PromptOption[]
  routes?: PromptOption[]
  initial?: string
  /** One prompt with no suggestions, for workflow and play pages. */
  single?: PromptOption
  label?: string
}) {
  const all = single ? [single] : [...suggestions, ...routes]
  const [selected, setSelected] = useState(initial ?? all[0]?.id)
  const current = all.find(o => o.id === selected) ?? all[0]
  const [text, setText] = useState(current?.prompt ?? '')
  const [status, setStatus] = useState('')
  const boxId = useId()
  const routesActive = selected === WORK || selected?.startsWith('route.')

  function choose(o: PromptOption) {
    setSelected(o.id)
    setText(o.prompt)
    setStatus('')
    trackPromptSelected(o.kind, o.id)
  }

  async function copy() {
    const out = promptForCopy(text, current?.id.replace(/\.existing$/, '').replace(/^route\..*/, WORK) ?? WORK)
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
    setStatus(ok ? 'Copied. Paste it into your agent.' : 'Copy failed. Select the text and copy it.')
  }

  const rows = Math.min(6, Math.max(2, text.split('\n').length + 1))

  return (
    <div>
      {!single && suggestions.length > 0 && (
        <div role="group" aria-label="What do you want to do?" className="flex flex-wrap gap-2 mb-3">
          {suggestions.map(o => (
            <button
              key={o.id}
              type="button"
              aria-pressed={selected === o.id || (o.id === WORK && routesActive)}
              onClick={() => choose(o)}
              className="h-control-height-sm px-3 rounded-radius-full text-label border border-border-strong text-on-surface hover:bg-surface-hover aria-pressed:bg-primary aria-pressed:text-on-primary aria-pressed:border-primary transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
            >
              {o.label}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-radius-xl bg-surface-featured shadow-featured p-3 md:p-4">
        <label htmlFor={boxId} className="sr-only">{label}</label>
        <textarea
          id={boxId}
          value={text}
          onChange={e => setText(e.target.value)}
          rows={rows}
          spellCheck={false}
          className="w-full resize-none bg-transparent font-mono text-code text-on-surface outline-none px-1 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-focus rounded-radius-sm"
        />
        <div className="flex items-center justify-between gap-3 mt-2 flex-wrap">
          <p className="text-caption text-on-surface-faint m-0">
            Paste into Claude Code, Cursor, or another coding agent, in your project folder.
          </p>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 h-control-height px-4 rounded-radius-md bg-primary text-on-primary text-label shadow-control hover:bg-primary-hover transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M5 15V6a2 2 0 0 1 2-2h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Copy prompt
          </button>
        </div>
        <p role="status" aria-live="polite" className="text-caption text-on-surface-muted m-0 mt-1 min-h-[1.2em] text-right">{status}</p>
      </div>

      {!single && routes.length > 0 && (
        <div className={`mt-4 transition-opacity motion-reduce:transition-none ${routesActive ? 'opacity-100' : 'opacity-60'}`}>
          <p className="text-caption text-on-surface-faint m-0 mb-2">Or work on your system:</p>
          <div role="group" aria-label="Work on my system" className="flex flex-wrap gap-2">
            {routes.map(o => (
              <button
                key={o.id}
                type="button"
                aria-pressed={selected === o.id}
                onClick={() => choose(o)}
                className="h-control-height-sm px-3 rounded-radius-full text-body-sm bg-surface-raised text-on-surface-muted hover:bg-surface-hover hover:text-on-surface aria-pressed:bg-surface-selected aria-pressed:text-on-surface transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
