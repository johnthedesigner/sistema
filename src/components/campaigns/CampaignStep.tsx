'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ColorModeSelector, COLOR_MODE_STORAGE_KEY } from '@/components/playbooks/ColorModeSelector'

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
  const [origin, setOrigin] = useState('')

  const isColorSchemePlay = playSlug === 'generate-color-scheme'

  // Restore from sessionStorage on mount; pre-fill color_mode from localStorage for color plays
  useEffect(() => {
    const restored: Record<string, string> = {}
    for (const v of variables) {
      const stored = sessionStorage.getItem(storageKey(campaignSlug, stepNumber, v))
      if (stored !== null) restored[v] = stored
    }
    if (isColorSchemePlay && variables.includes('color_mode') && !restored.color_mode) {
      const stored = localStorage.getItem(COLOR_MODE_STORAGE_KEY)
      if (stored) restored.color_mode = stored
    }
    if (Object.keys(restored).length > 0) {
      setValues(prev => ({ ...prev, ...restored }))
    }
    setOrigin(window.location.origin)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleChange(varName: string, value: string) {
    setValues(prev => ({ ...prev, [varName]: value }))
    sessionStorage.setItem(storageKey(campaignSlug, stepNumber, varName), value)
  }

  function handleColorModeChange(value: string) {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, value)
    handleChange('color_mode', value)
  }

  function resolveBody(): string {
    let resolved = playBody.replace(/\{\{sistema_url\}\}/g, origin)
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
              <label htmlFor={`var-${v}`} className="block text-sm font-medium text-on-surface mb-1.5">
                {formatLabel(v)}
              </label>
              {v === 'color_mode' && isColorSchemePlay ? (
                <ColorModeSelector
                  value={values[v]}
                  onChange={handleColorModeChange}
                />
              ) : (
                <textarea
                  id={`var-${v}`}
                  value={values[v]}
                  onChange={e => handleChange(v, e.target.value)}
                  placeholder={PLACEHOLDERS[v] ?? `Enter ${formatLabel(v).toLowerCase()}…`}
                  rows={3}
                  className="w-full text-sm border border-border rounded-radius-md px-3 py-2 text-on-surface placeholder-on-surface-muted focus:outline-none focus:ring-2 focus:ring-border-focus resize-y"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Prompt */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-on-surface-muted uppercase tracking-wider">Prompt</span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-radius-md text-sm font-medium bg-primary text-on-primary hover:opacity-90 transition-colors"
          >
            {copied ? '✓ Copied!' : 'Copy prompt'}
          </button>
        </div>
        <pre className="bg-surface border border-border rounded-radius-lg p-5 text-sm text-on-surface font-mono whitespace-pre-wrap leading-relaxed overflow-auto max-h-[480px]">
          {resolveBody()}
        </pre>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div>
          {prevHref && (
            <Link
              href={prevHref}
              className="text-sm text-on-surface-muted hover:text-on-surface transition-colors"
            >
              ← Previous
            </Link>
          )}
        </div>
        <div>
          {nextHref && (
            <Link
              href={nextHref}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-radius-md text-sm font-medium border border-border text-on-surface hover:border-on-surface-muted hover:text-on-surface transition-colors"
            >
              Next step →
            </Link>
          )}
          {isLast && (
            <Link
              href={`/campaigns/${campaignSlug}/export`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-radius-md text-sm font-medium bg-primary text-on-primary hover:opacity-90 transition-colors"
            >
              Export all prompts →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
