'use client'

import { useState } from 'react'

export function ArticleCopyButton({ rawUrl }: { rawUrl: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle')

  async function handleCopy() {
    try {
      const res = await fetch(rawUrl)
      if (!res.ok) throw new Error('fetch failed')
      await navigator.clipboard.writeText(await res.text())
      setState('copied')
      setTimeout(() => setState('idle'), 2000)
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 h-[26px] px-2.5 text-[11.5px] font-mono font-medium border border-border rounded-radius-sm text-on-surface-muted hover:text-on-surface hover:bg-surface-sunken transition-colors shrink-0"
    >
      {state === 'copied' ? (
        <>
          <svg width={11} height={11} viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copied
        </>
      ) : state === 'error' ? (
        'Error'
      ) : (
        <>
          <svg width={11} height={11} viewBox="0 0 24 24" fill="none">
            <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.7" />
          </svg>
          Copy
        </>
      )}
    </button>
  )
}
