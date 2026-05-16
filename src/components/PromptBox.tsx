'use client'

import { useState, useEffect } from 'react'
import { instrumentRawUrls, trackCopy } from '@/lib/analytics'

interface PromptBoxProps {
  label: string
  body: string
  playSlug: string
  tokens?: string
  refs?: string
  variables?: number
  expanded?: boolean
  overflow?: 'expand' | 'scroll'
}

export function PromptBox({
  label,
  body,
  playSlug,
  tokens,
  refs,
  variables,
  expanded: initialExpanded = false,
  overflow = 'expand',
}: PromptBoxProps) {
  const [expanded, setExpanded] = useState(initialExpanded)
  const [copied, setCopied] = useState(false)
  const [displayBody, setDisplayBody] = useState(body)
  const scrollMode = overflow === 'scroll'

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin
    setDisplayBody(body.replace(/\{\{sistema_url\}\}/g, base))
  }, [body])

  async function handleCopy() {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin
    const resolved = instrumentRawUrls(body.replace(/\{\{sistema_url\}\}/g, base), playSlug)
    await navigator.clipboard.writeText(resolved)
    trackCopy(playSlug)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="relative rounded-radius-xl border border-border bg-surface-raised overflow-hidden flex flex-col"
      style={{
        boxShadow: 'var(--shadow-md)',
        maxHeight: scrollMode || !expanded ? '25rem' : 'none',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-raised">
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
            {label}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 h-[34px] px-3.5 rounded-radius-md text-[13px] font-medium text-white"
          style={{
            background: 'var(--color-primary)',
            boxShadow: '0 1px 2px rgba(0,112,255,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Body */}
      <div
        className={`relative font-mono text-[13.5px] leading-[1.65] text-on-surface px-5 py-5 flex-1 min-h-0 ${scrollMode ? 'overflow-y-auto' : 'overflow-hidden'}`}
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {displayBody}
        {!scrollMode && !expanded && (
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: 90,
              background: 'linear-gradient(to bottom, transparent, var(--color-surface-raised))',
            }}
          />
        )}
      </div>

      {/* Expand toggle */}
      {!scrollMode && !expanded && (
        <div className="absolute left-0 right-0 flex justify-center" style={{ bottom: 52 }}>
          <button
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-raised border border-border rounded-full text-[12px] font-medium text-on-surface"
            style={{ boxShadow: 'var(--shadow-sm)', pointerEvents: 'auto' }}
          >
            Show full prompt
            <ChevronDown />
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-4 pt-2.5 pb-3.5 border-t border-border bg-surface">
        <div className="flex gap-4 font-mono text-[11px] text-on-surface-subtle">
          {tokens && <span>{tokens}</span>}
          {tokens && refs && <span>·</span>}
          {refs && <span>{refs}</span>}
          {(tokens || refs) && variables !== undefined && <span>·</span>}
          {variables !== undefined && <span>{variables} variable{variables !== 1 ? 's' : ''}</span>}
        </div>
        <div className="flex items-center gap-2 text-[12px] text-on-surface-muted">
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
  )
}

function CopyIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
