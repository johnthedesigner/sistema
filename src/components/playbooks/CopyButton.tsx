'use client'

import { useState } from 'react'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const resolved = text.replace(/\{\{sistema_url\}\}/g, window.location.origin)
    await navigator.clipboard.writeText(resolved)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 transition-colors"
    >
      {copied ? 'Copied!' : 'Copy prompt'}
    </button>
  )
}
