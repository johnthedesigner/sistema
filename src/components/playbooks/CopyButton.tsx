'use client'

import { useState } from 'react'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-radius-md text-sm font-medium bg-primary text-on-primary hover:opacity-90 transition-colors"
    >
      {copied ? 'Copied!' : 'Copy prompt'}
    </button>
  )
}
