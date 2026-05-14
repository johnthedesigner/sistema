'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Props {
  campaignSlug: string
  stepNumber: number
  totalSteps: number
  playSlug: string
  playTitle: string
  playBody: string
}

function extractVariables(body: string): string[] {
  const matches = [...body.matchAll(/\{\{([^}]+)\}\}/g)]
  const vars = matches.map(m => m[1]).filter(v => v !== 'sistema_url')
  return [...new Set(vars)]
}

function formatLabel(v: string): string {
  return v.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const PLACEHOLDERS: Record<string, string> = {
  project_context: 'e.g. "B2B analytics tool for enterprise finance teams — should feel calm, professional, and trustworthy"',
  color_direction: 'e.g. "deep blue primary with warm amber accents" or a hex value like #2563EB',
  tailwind_colors: 'Paste the colors section from your tailwind.config',
}

function storageKey(campaignSlug: string, stepNumber: number, varName: string) {
  return `campaign:${campaignSlug}:step:${stepNumber}:${varName}`
}

export function CampaignStep({
  campaignSlug, stepNumber, totalSteps, playSlug, playTitle, playBody,
}: Props) {
  const variables = extractVariables(playBody)
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(variables.map(v => [v, '']))
  )
  const [copied, setCopied] = useState(false)

  // Restore from sessionStorage on mount
  useEffect(() => {
    const restored: Record<string, string> = {}
    for (const v of variables) {
      const stored = sessionStorage.getItem(storageKey(campaignSlug, stepNumber, v))
      if (stored !== null) restored[v] = stored
    }
    if (Object.keys(restored).length > 0) {
      setValues(prev => ({ ...prev, ...restored }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleChange(varName: string, value: string) {
    setValues(prev => ({ ...prev, [varName]: value }))
    sessionStorage.setItem(storageKey(campaignSlug, stepNumber, varName), value)
  }

  function resolveBody(): string {
    const base = typeof window !== 'undefined' ? window.location.origin : ''
    let resolved = playBody.replace(/\{\{sistema_url\}\}/g, base)
    for (const [key, value] of Object.entries(values)) {
      resolved = resolved.replace(
        new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
        value.trim() || `{{${key}}}`
      )
    }
    return resolved
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(resolveBody())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isLast = stepNumber === totalSteps
  const prevHref = stepNumber > 1 ? `/campaigns/${campaignSlug}/${stepNumber - 1}` : null
  const nextHref = !isLast ? `/campaigns/${campaignSlug}/${stepNumber + 1}` : null

  return (
    <div>
      {/* Variable inputs */}
      {variables.length > 0 && (
        <div className="mb-6 space-y-4">
          {variables.map(v => (
            <div key={v}>
              <label htmlFor={`var-${v}`} className="block text-sm font-medium text-gray-700 mb-1.5">
                {formatLabel(v)}
              </label>
              <textarea
                id={`var-${v}`}
                value={values[v]}
                onChange={e => handleChange(v, e.target.value)}
                placeholder={PLACEHOLDERS[v] ?? `Enter ${formatLabel(v).toLowerCase()}…`}
                rows={3}
                className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-y"
              />
            </div>
          ))}
        </div>
      )}

      {/* Prompt */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Prompt</span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 transition-colors"
          >
            {copied ? '✓ Copied!' : 'Copy prompt'}
          </button>
        </div>
        <pre className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-sm text-gray-900 font-mono whitespace-pre-wrap leading-relaxed overflow-auto max-h-[480px]">
          {resolveBody()}
        </pre>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          {prevHref && (
            <Link
              href={prevHref}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              ← Previous
            </Link>
          )}
        </div>
        <div>
          {nextHref && (
            <Link
              href={nextHref}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium border border-gray-200 text-gray-700 hover:border-gray-400 hover:text-gray-900 transition-colors"
            >
              Next step →
            </Link>
          )}
          {isLast && (
            <Link
              href={`/campaigns/${campaignSlug}/export`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 transition-colors"
            >
              Export all prompts →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
