'use client'

import { useState, useEffect } from 'react'
import { instrumentRawUrls, trackCopy } from '@/lib/analytics'
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
    await navigator.clipboard.writeText(instrumentRawUrls(resolveBody(), playSlug))
    trackCopy(playSlug, { campaign: campaignSlug, step: stepNumber })
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
        <div className="mb-7 space-y-4">
          <div className="flex items-baseline gap-3 mb-3">
            <span className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted">
              Variables
            </span>
            <span className="text-[12px] text-on-surface-muted">fill in to personalize the prompt</span>
          </div>
          {variables.map(v => (
            <div key={v}>
              <label htmlFor={`var-${v}`} className="block text-[12px] font-mono text-on-surface-muted mb-1.5">
                {`{{${v}}}`}
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
                  className="w-full text-[13.5px] border border-border rounded-radius-md px-3 py-2 text-on-surface placeholder-on-surface-muted focus:outline-none focus:ring-2 focus:ring-border-focus resize-y bg-surface"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Prompt box */}
      <div
        className="relative rounded-radius-xl border border-border bg-surface-raised overflow-hidden mb-8"
        style={{ boxShadow: 'var(--shadow-md)' }}
      >
        <div
          className="flex items-center justify-between px-4 py-3 border-b border-border"
          style={{ background: 'var(--color-surface-raised)' }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="block rounded-full"
              style={{ width: 8, height: 8, background: 'var(--color-primary)', boxShadow: '0 0 0 3px rgba(0,112,255,0.15)' }}
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
              boxShadow: '0 1px 2px rgba(0,112,255,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
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
          {resolveBody()}
        </div>
        <div className="flex items-center justify-between px-4 pt-2.5 pb-3.5 border-t border-border bg-surface">
          <div className="font-mono text-[11px] text-on-surface-subtle">
            Step {stepNumber} of {totalSteps} · {playTitle}
          </div>
          <div className="flex items-center gap-2 text-[12px] text-on-surface-muted">
            <span className="font-mono text-[11px]">paste into</span>
            <span className="font-mono text-[11.5px] px-2 py-0.5 border border-border rounded-[6px]">Claude Code</span>
            <span className="font-mono text-[11.5px] px-2 py-0.5 border border-border rounded-[6px]">Cursor</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-5 border-t border-border">
        <div>
          {prevHref ? (
            <Link
              href={prevHref}
              className="inline-flex items-center gap-2 h-[38px] px-4 text-[13.5px] font-medium border border-border rounded-radius-md text-on-surface-muted hover:text-on-surface hover:border-border-strong transition-colors no-underline"
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M11 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Step {stepNumber - 1}
            </Link>
          ) : (
            <span />
          )}
        </div>
        <div>
          {nextHref && (
            <Link
              href={nextHref}
              className="inline-flex items-center gap-2 h-[38px] px-4 text-[13.5px] font-semibold rounded-radius-md text-on-primary bg-primary hover:opacity-90 transition-opacity no-underline"
            >
              Step {stepNumber + 1}
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}
          {isLast && (
            <Link
              href={`/campaigns/${campaignSlug}/export`}
              className="inline-flex items-center gap-2 h-[38px] px-4 text-[13.5px] font-semibold rounded-radius-md text-on-primary bg-primary hover:opacity-90 transition-opacity no-underline"
            >
              Export all prompts
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
