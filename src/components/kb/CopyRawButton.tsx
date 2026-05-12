'use client'

import { useState } from 'react'

export function CopyRawButton({ rawUrl }: { rawUrl: string }) {
  const [state, setState] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle')

  async function handleCopy() {
    setState('copying')
    try {
      const res = await fetch(rawUrl)
      if (!res.ok) throw new Error('fetch failed')
      const text = await res.text()
      await navigator.clipboard.writeText(text)
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
      disabled={state === 'copying'}
      className="flex-shrink-0 mt-1.5 text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded px-2 py-1 hover:border-gray-400 transition-colors disabled:opacity-50"
    >
      {state === 'copied' ? 'Copied!' : state === 'error' ? 'Error' : state === 'copying' ? '...' : 'Copy markdown'}
    </button>
  )
}
