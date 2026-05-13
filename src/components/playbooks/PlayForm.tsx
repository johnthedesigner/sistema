'use client'

import { useState } from 'react'

function extractVariables(body: string): string[] {
  const matches = [...body.matchAll(/\{\{([^}]+)\}\}/g)]
  const vars = matches.map(m => m[1]).filter(v => v !== 'sistema_url')
  return [...new Set(vars)]
}

function formatLabel(varName: string): string {
  return varName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const PLACEHOLDERS: Record<string, string> = {
  project_context: 'e.g. "B2B analytics tool for enterprise finance teams — should feel calm, professional, and trustworthy"',
  color_direction: 'e.g. "deep blue primary with warm amber accents" or paste a hex value like #2563EB',
  tailwind_colors: 'Paste the colors section from your tailwind.config, e.g. blue, indigo, slate',
}

function getPlaceholder(varName: string): string {
  return PLACEHOLDERS[varName] ?? `Enter ${formatLabel(varName).toLowerCase()}…`
}

export function PlayForm({ body }: { body: string }) {
  const variables = extractVariables(body)
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(variables.map(v => [v, '']))
  )
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin
    let resolved = body.replace(/\{\{sistema_url\}\}/g, base)
    for (const [key, value] of Object.entries(values)) {
      resolved = resolved.replace(
        new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
        value.trim() || `{{${key}}}`
      )
    }
    await navigator.clipboard.writeText(resolved)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (variables.length === 0) return null

  return (
    <div className="mb-6 space-y-4">
      {variables.map(v => (
        <div key={v}>
          <label
            htmlFor={`var-${v}`}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {formatLabel(v)}
          </label>
          <textarea
            id={`var-${v}`}
            value={values[v]}
            onChange={e => setValues(prev => ({ ...prev, [v]: e.target.value }))}
            placeholder={getPlaceholder(v)}
            rows={3}
            className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-y"
          />
        </div>
      ))}
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 transition-colors"
      >
        {copied ? 'Copied!' : 'Copy prompt'}
      </button>
    </div>
  )
}
