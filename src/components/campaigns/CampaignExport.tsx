'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface StepMeta {
  number: number
  playSlug: string
  playTitle: string
  playBody: string
}

interface Props {
  campaignSlug: string
  campaignTitle: string
  steps: StepMeta[]
}

function storageKey(campaignSlug: string, stepNumber: number, varName: string) {
  return `campaign:${campaignSlug}:step:${stepNumber}:${varName}`
}

function extractVariables(body: string): string[] {
  const matches = [...body.matchAll(/\{\{([^}]+)\}\}/g)]
  const vars = matches.map(m => m[1]).filter(v => v !== 'sistema_url')
  return [...new Set(vars)]
}

function resolveBody(body: string, campaignSlug: string, stepNumber: number): string {
  const base = window.location.origin
  let resolved = body.replace(/\{\{sistema_url\}\}/g, base)
  const variables = extractVariables(body)
  for (const key of variables) {
    const value = sessionStorage.getItem(storageKey(campaignSlug, stepNumber, key)) ?? ''
    resolved = resolved.replace(
      new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
      value.trim() || `{{${key}}}`
    )
  }
  return resolved
}

function buildDocument(
  campaignTitle: string,
  campaignSlug: string,
  steps: StepMeta[]
): string {
  const sections = steps.map(step => {
    const resolved = resolveBody(step.playBody, campaignSlug, step.number)
    return `## Step ${step.number} — ${step.playTitle}\n\n${resolved}`
  })
  return `# ${campaignTitle} — Campaign Prompts\n\n${sections.join('\n\n---\n\n')}`
}

export function CampaignExport({ campaignSlug, campaignTitle, steps }: Props) {
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  function getDocument() {
    return buildDocument(campaignTitle, campaignSlug, steps)
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(getDocument())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    const doc = getDocument()
    const blob = new Blob([doc], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${campaignSlug}-campaign.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <p className="text-gray-500 mb-6">
        All 6 prompts assembled in order with your variable values filled in. Copy or download to keep a record of this campaign run.
      </p>

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 transition-colors"
        >
          {copied ? '✓ Copied!' : 'Copy all'}
        </button>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium border border-gray-200 text-gray-700 hover:border-gray-400 hover:text-gray-900 transition-colors"
        >
          Download .md
        </button>
      </div>

      <div className="space-y-4">
        {steps.map(step => (
          <details key={step.number} className="border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 select-none">
              Step {step.number} — {step.playTitle}
            </summary>
            <pre className="px-4 pb-4 text-xs text-gray-600 font-mono whitespace-pre-wrap leading-relaxed overflow-auto max-h-64 border-t border-gray-100 pt-3">
              {mounted ? resolveBody(step.playBody, campaignSlug, step.number) : '…'}
            </pre>
          </details>
        ))}
      </div>

      <div className="mt-8 pt-4 border-t border-gray-100">
        <Link
          href={`/campaigns/${campaignSlug}/6`}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Back to last step
        </Link>
      </div>
    </div>
  )
}
