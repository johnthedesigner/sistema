'use client'

import { useState } from 'react'

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

interface Props {
  prompt: string
  campaignSlug: string
}

export function CampaignPromptBox({ prompt, campaignSlug }: Props) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const promptLines = prompt.split('\n').length

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="relative rounded-radius-xl border border-border bg-surface-raised overflow-hidden"
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-border"
        style={{ background: 'linear-gradient(180deg, #FCFCFC 0%, #FFFFFF 100%)' }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="block rounded-full"
            style={{ width: 8, height: 8, background: 'var(--color-primary)', boxShadow: '0 0 0 3px rgba(0,112,255,0.15)' }}
          />
          <span className="font-mono text-[11.5px] tracking-[0.04em] uppercase text-on-surface-muted">
            campaign · {campaignSlug}
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
          {copied ? 'Copied' : 'Copy prompt'}
        </button>
      </div>

      {/* Prompt body */}
      <div className="relative overflow-hidden">
        <div
          className="px-5 py-5 font-mono text-[13px] leading-[1.65] text-on-surface"
          style={{
            whiteSpace: 'pre-wrap',
            maxHeight: expanded ? 'none' : 320,
            overflow: 'hidden',
          }}
        >
          {prompt}
        </div>
        {!expanded && (
          <div
            className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-4"
            style={{
              height: 96,
              background: 'linear-gradient(to bottom, transparent, var(--color-surface-raised))',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 pt-2.5 pb-3.5 border-t border-border bg-[#FCFCFC]">
        <button
          onClick={() => setExpanded(e => !e)}
          className="font-mono text-[11.5px] text-on-surface-muted hover:text-on-surface transition-colors"
        >
          {expanded ? 'Show less' : `Show full prompt (${promptLines} lines)`}
        </button>
        <div className="flex items-center gap-2 text-[12px] text-on-surface-muted">
          <span className="font-mono text-[11px]">paste into</span>
          <span className="font-mono text-[11.5px] px-2 py-0.5 border border-border rounded-[6px]">Claude Code</span>
          <span className="font-mono text-[11.5px] px-2 py-0.5 border border-border rounded-[6px]">Cursor</span>
        </div>
      </div>
    </div>
  )
}
