'use client'

import { useState, useEffect, useRef } from 'react'
import { MarkdownBody } from '@/components/kb/MarkdownBody'
import { instrumentRawUrls, trackCopy } from '@/lib/analytics'
import { ColorModeSelector, COLOR_MODE_STORAGE_KEY } from './ColorModeSelector'
import type { ExemplarFile } from '@/lib/exemplars'

// ── helpers ───────────────────────────────────────────────────────────────────

function extractVariables(body: string): string[] {
  const matches = [...body.matchAll(/\{\{([^}]+)\}\}/g)]
  return [...new Set(matches.map(m => m[1]).filter(v => v !== 'sistema_url'))]
}

function formatLabel(v: string): string {
  return v.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const PLACEHOLDERS: Record<string, string> = {
  project_context:
    'e.g. "B2B analytics tool for enterprise finance teams — calm, professional, trustworthy"',
  color_direction:
    'e.g. "deep blue primary with warm amber accents" or a hex value like #2563EB',
  tailwind_colors: 'Paste the colors section from your tailwind.config',
}

function resolveBody(
  body: string,
  values: Record<string, string>,
  base: string,
): string {
  let out = body.replace(/\{\{sistema_url\}\}/g, base)
  for (const [key, value] of Object.entries(values)) {
    out = out.replace(
      new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
      value.trim() || `{{${key}}}`,
    )
  }
  return out
}

// ── icons ─────────────────────────────────────────────────────────────────────

function CopyIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ── examples flyout ───────────────────────────────────────────────────────────

function ExamplesFlyout({
  exemplars,
  variables,
  onApply,
}: {
  exemplars: ExemplarFile[]
  variables: string[]
  onApply: (values: Record<string, string>) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const usable = exemplars.filter(
    e => e.input && Object.keys(e.input).some(k => variables.includes(k)),
  )
  if (usable.length === 0) return null

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11.5px] font-medium border border-border rounded-radius-md text-on-surface-muted hover:text-on-surface hover:bg-surface-sunken transition-colors"
      >
        <svg width={11} height={11} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M9 9c0-1.66 1.34-3 3-3s3 1.34 3 3c0 1.3-.84 2.4-2 2.82V13"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="12" cy="16.5" r="0.9" fill="currentColor" />
        </svg>
        Examples
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-1.5 z-30 w-[360px] border border-border rounded-radius-lg bg-surface-raised overflow-hidden"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          <div className="px-4 py-2.5 border-b border-border">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-on-surface-muted">
              Example inputs
            </p>
          </div>
          <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
            {usable.map((ex, i) => (
              <div key={i} className="px-4 py-3.5">
                {ex.title && (
                  <p className="text-[13px] font-semibold text-on-surface mb-1">{ex.title}</p>
                )}
                {ex.quality_notes && (
                  <p className="text-[12px] text-on-surface-muted leading-[1.45] mb-2.5">
                    {ex.quality_notes}
                  </p>
                )}
                <div className="space-y-1.5 mb-3">
                  {Object.entries(ex.input ?? {})
                    .filter(([k]) => variables.includes(k))
                    .map(([key, val]) => (
                      <div key={key} className="text-[12px]">
                        <span className="font-mono text-on-surface-muted">{`{{${key}}}`}: </span>
                        <span className="text-on-surface">{val}</span>
                      </div>
                    ))}
                </div>
                <button
                  onClick={() => {
                    onApply(ex.input ?? {})
                    setOpen(false)
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium bg-primary text-on-primary rounded-radius-sm hover:opacity-90 transition-opacity"
                >
                  Use this example
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── main component ─────────────────────────────────────────────────────────────

interface PlayDetailProps {
  body: string
  playSlug: string
  tags: string[]
  refs: string[]
  exemplars: ExemplarFile[]
}

export function PlayDetail({ body, playSlug, tags, refs, exemplars }: PlayDetailProps) {
  const variables = extractVariables(body)
  const hasVariables = variables.length > 0
  const hasExemplars = exemplars.length > 0
  const isColorPlay = tags.includes('color')

  const [tab, setTab] = useState<'prompt' | 'example'>('prompt')
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(variables.map(v => [v, ''])),
  )
  const [copied, setCopied] = useState(false)
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin)
    if (isColorPlay && variables.includes('color_mode')) {
      const stored = localStorage.getItem(COLOR_MODE_STORAGE_KEY)
      if (stored) setValues(prev => ({ ...prev, color_mode: stored }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleColorModeChange(val: string) {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, val)
    setValues(prev => ({ ...prev, color_mode: val }))
  }

  async function handleCopy() {
    const resolved = resolveBody(body, values, origin)
    await navigator.clipboard.writeText(instrumentRawUrls(resolved, playSlug, origin))
    trackCopy(playSlug)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const displayBody = origin ? resolveBody(body, values, origin) : body

  return (
    <div>
      {/* Tab group — only when there are exemplars */}
      {hasExemplars && (
        <div className="flex gap-0 border-b border-border mb-7">
          {(['prompt', 'example'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                'px-4 py-2.5 text-[13.5px] font-medium border-b-2 -mb-px transition-colors',
                tab === t
                  ? 'border-primary text-on-surface'
                  : 'border-transparent text-on-surface-muted hover:text-on-surface',
              ].join(' ')}
            >
              {t === 'prompt' ? 'Play Prompt' : 'Example Output'}
            </button>
          ))}
        </div>
      )}

      {/* ── Play Prompt tab ─────────────────────────────────────────────────── */}
      {tab === 'prompt' && (
        <div>
          {/* Variables card */}
          {hasVariables && (
            <div
              className="rounded-radius-xl border border-border bg-surface-raised mb-6 overflow-hidden"
              style={{ boxShadow: 'var(--shadow-md)' }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted">
                    Variables
                  </span>
                  <span className="text-[12px] text-on-surface-muted">
                    fill in to personalize the prompt
                  </span>
                </div>
                <ExamplesFlyout
                  exemplars={exemplars}
                  variables={variables}
                  onApply={inputs => setValues(prev => ({ ...prev, ...inputs }))}
                />
              </div>
              <div className="p-4 space-y-4">
                {variables.map(v => (
                  <div key={v}>
                    <label
                      htmlFor={`var-${v}`}
                      className="block text-[12px] font-mono text-on-surface-muted mb-1.5"
                    >
                      {`{{${v}}}`}
                    </label>
                    {v === 'color_mode' && isColorPlay ? (
                      <ColorModeSelector
                        value={values[v]}
                        onChange={handleColorModeChange}
                      />
                    ) : (
                      <textarea
                        id={`var-${v}`}
                        value={values[v]}
                        onChange={e =>
                          setValues(prev => ({ ...prev, [v]: e.target.value }))
                        }
                        placeholder={PLACEHOLDERS[v] ?? `Enter ${formatLabel(v).toLowerCase()}…`}
                        rows={3}
                        className="w-full text-[13.5px] border border-border rounded-radius-md px-3 py-2 text-on-surface placeholder-on-surface-muted focus:outline-none focus:ring-2 focus:ring-border-focus resize-y bg-surface"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompt box — campaign style */}
          <div
            className="relative rounded-radius-xl border border-border bg-surface-raised overflow-hidden mb-9"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-border"
              style={{ background: 'var(--color-surface-raised)' }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="block rounded-full"
                  style={{
                    width: 8,
                    height: 8,
                    background: 'var(--color-primary)',
                    boxShadow: '0 0 0 3px rgba(0,112,255,0.15)',
                  }}
                />
                <span className="font-mono text-[11.5px] tracking-[0.04em] uppercase text-on-surface-muted">
                  play · {playSlug}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 h-[34px] px-3.5 rounded-radius-md text-[13px] font-medium text-white"
                style={{
                  background: 'var(--color-primary)',
                  boxShadow:
                    '0 1px 2px rgba(0,112,255,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div
              className="px-5 py-5 font-mono text-[13.5px] leading-[1.65] text-on-surface"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {displayBody}
            </div>
            <div className="flex items-center justify-between px-4 pt-2.5 pb-3.5 border-t border-border bg-surface">
              <div className="font-mono text-[11px] text-on-surface-subtle">
                {refs.length > 0
                  ? `${refs.length} KB ref${refs.length !== 1 ? 's' : ''}`
                  : ''}
              </div>
              <div className="flex items-center gap-2 text-on-surface-muted">
                <span className="font-mono text-[11px]">paste into</span>
                <span className="font-mono text-[11.5px] px-2 py-0.5 border border-border rounded-[6px]">
                  Claude Code
                </span>
                <span className="font-mono text-[11.5px] px-2 py-0.5 border border-border rounded-[6px]">
                  Cursor
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Example Output tab ──────────────────────────────────────────────── */}
      {tab === 'example' && exemplars[0] && (
        <div className="border border-border rounded-radius-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-surface-raised">
            <span className="font-mono text-[11.5px] tracking-[0.04em] uppercase text-on-surface-muted">
              {exemplars[0].title ?? 'Example output'}
            </span>
          </div>
          <div className="px-5 py-4 overflow-y-auto max-h-[70vh]">
            {exemplars[0].quality_notes && (
              <div className="mb-4 text-[12px] text-on-surface-muted bg-surface border border-border rounded-radius-sm px-3 py-2 leading-relaxed">
                <span className="font-medium">About this example: </span>
                {exemplars[0].quality_notes}
              </div>
            )}
            <MarkdownBody>{exemplars[0].body}</MarkdownBody>
          </div>
        </div>
      )}
    </div>
  )
}
