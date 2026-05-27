'use client'

import { useState, useMemo } from 'react'

const NAMED_RATIOS = [
  { label: 'Minor Second', value: 1.067 },
  { label: 'Major Second', value: 1.125 },
  { label: 'Minor Third', value: 1.200 },
  { label: 'Major Third', value: 1.250 },
  { label: 'Perfect Fourth', value: 1.333 },
  { label: 'Augmented Fourth', value: 1.414 },
  { label: 'Perfect Fifth', value: 1.500 },
  { label: 'Golden Ratio', value: 1.618 },
]

const SCALE_STOPS = [
  { name: 'xs',   step: -2, role: 'caption / legal' },
  { name: 'sm',   step: -1, role: 'label / helper text' },
  { name: 'base', step:  0, role: 'body' },
  { name: 'md',   step:  1, role: 'body large / lead' },
  { name: 'lg',   step:  2, role: 'heading small' },
  { name: 'xl',   step:  3, role: 'heading medium' },
  { name: '2xl',  step:  4, role: 'heading large' },
  { name: '3xl',  step:  5, role: 'heading xl' },
  { name: '4xl',  step:  6, role: 'display small' },
  { name: '5xl',  step:  7, role: 'display medium' },
  { name: '6xl',  step:  8, role: 'display large' },
]

function round(n: number, decimals = 2) {
  const f = Math.pow(10, decimals)
  return Math.round(n * f) / f
}

function lineHeightFor(px: number): number {
  if (px >= 48) return 1.0
  if (px >= 32) return 1.1
  if (px >= 24) return 1.2
  if (px >= 18) return 1.4
  return 1.6
}

function CopyIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TypeScaleCalculator() {
  const [base, setBase] = useState(16)
  const [ratioIndex, setRatioIndex] = useState(4) // Perfect Fourth default
  const [customRatio, setCustomRatio] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [tab, setTab] = useState<'css' | 'dtcg'>('css')
  const [copied, setCopied] = useState(false)

  const ratio = useCustom
    ? parseFloat(customRatio) || NAMED_RATIOS[ratioIndex].value
    : NAMED_RATIOS[ratioIndex].value

  const stops = useMemo(() => {
    return SCALE_STOPS.map(stop => {
      const px = round(base * Math.pow(ratio, stop.step))
      const rem = round(px / 16, 3)
      const lh = lineHeightFor(px)
      return { ...stop, px, rem, lh }
    })
  }, [base, ratio])

  const cssOutput = stops
    .map(s => `  --text-${s.name}: ${s.rem}rem; /* ${s.px}px — ${s.role} */`)
    .join('\n')

  const dtcgOutput = JSON.stringify(
    {
      type: Object.fromEntries(
        stops.map(s => [
          s.name,
          {
            $description: s.role,
            size: { $type: 'dimension', $value: `${s.px}px` },
            'line-height': { $type: 'number', $value: s.lh },
          },
        ])
      ),
    },
    null,
    2
  )

  function copy() {
    const text = tab === 'css' ? `:root {\n${cssOutput}\n}` : dtcgOutput
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Base size */}
        <div>
          <label htmlFor="base-size" className="block font-mono text-[11px] tracking-[0.1em] uppercase text-on-surface-muted mb-2">
            Base size
          </label>
          <div className="flex items-center gap-2">
            <input
              id="base-size"
              type="number"
              min={8}
              max={24}
              value={base}
              onChange={e => setBase(Math.max(8, Math.min(24, parseInt(e.target.value) || 16)))}
              className="w-20 h-9 px-3 border border-border rounded-radius-md bg-surface text-on-surface text-[14px] font-mono focus:outline-none focus:border-primary transition-colors"
            />
            <span className="text-[13px] text-on-surface-muted font-mono">px</span>
          </div>
          <p className="text-[11.5px] text-on-surface-subtle mt-1.5 m-0">
            Typically 16px for body text
          </p>
        </div>

        {/* Ratio */}
        <div>
          <label htmlFor="scale-ratio" className="block font-mono text-[11px] tracking-[0.1em] uppercase text-on-surface-muted mb-2">
            Scale ratio
          </label>
          <div className="flex items-center gap-2">
            <select
              id="scale-ratio"
              value={useCustom ? 'custom' : ratioIndex}
              onChange={e => {
                if (e.target.value === 'custom') {
                  setUseCustom(true)
                } else {
                  setUseCustom(false)
                  setRatioIndex(parseInt(e.target.value))
                }
              }}
              className="flex-1 h-9 px-3 border border-border rounded-radius-md bg-surface text-on-surface text-[13px] focus:outline-none focus:border-primary transition-colors appearance-none"
            >
              {NAMED_RATIOS.map((r, i) => (
                <option key={r.label} value={i}>
                  {r.label} — {r.value}
                </option>
              ))}
              <option value="custom">Custom ratio…</option>
            </select>
          </div>
          {useCustom && (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                step="0.001"
                min="1.01"
                max="3"
                placeholder="e.g. 1.35"
                value={customRatio}
                onChange={e => setCustomRatio(e.target.value)}
                className="w-28 h-9 px-3 border border-border rounded-radius-md bg-surface text-on-surface text-[14px] font-mono focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          )}
        </div>
      </div>

      {/* Scale table */}
      <div>
        <div className="border border-border rounded-radius-lg overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[80px_80px_64px_80px_1fr] gap-0 border-b border-border bg-surface-sunken px-5 py-2.5">
            <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-on-surface-subtle">Token</span>
            <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-on-surface-subtle">px</span>
            <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-on-surface-subtle">rem</span>
            <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-on-surface-subtle">Line-h</span>
            <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-on-surface-subtle">Suggested role</span>
          </div>
          {/* Rows — reversed so display is at top */}
          {[...stops].reverse().map(stop => (
            <div
              key={stop.name}
              className="grid grid-cols-[80px_80px_64px_80px_1fr] gap-0 border-b border-border last:border-0 px-5 py-3 items-center hover:bg-surface-sunken transition-colors"
            >
              <span className="font-mono text-[13px] text-primary">text-{stop.name}</span>
              <span className="font-mono text-[13px] text-on-surface">{stop.px}</span>
              <span className="font-mono text-[12px] text-on-surface-muted">{stop.rem}</span>
              <span className="font-mono text-[12px] text-on-surface-muted">{stop.lh}</span>
              <span className="text-[12px] text-on-surface-subtle">{stop.role}</span>
            </div>
          ))}
        </div>
        <p className="text-[11.5px] text-on-surface-subtle mt-3 m-0">
          Line heights are suggested defaults. The{' '}
          <span className="font-mono text-[11px] bg-surface-raised border border-border rounded px-1 py-0.5">generate-type-scale</span>{' '}
          play adjusts these per role based on your product&apos;s density and stance.
        </p>
      </div>

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 border border-border rounded-radius-md p-0.5 bg-surface-sunken">
            <button
              onClick={() => setTab('css')}
              className={[
                'h-7 px-3 rounded text-[12px] font-medium transition-colors',
                tab === 'css'
                  ? 'bg-surface text-on-surface shadow-sm'
                  : 'text-on-surface-muted hover:text-on-surface',
              ].join(' ')}
            >
              CSS variables
            </button>
            <button
              onClick={() => setTab('dtcg')}
              className={[
                'h-7 px-3 rounded text-[12px] font-medium transition-colors',
                tab === 'dtcg'
                  ? 'bg-surface text-on-surface shadow-sm'
                  : 'text-on-surface-muted hover:text-on-surface',
              ].join(' ')}
            >
              DTCG JSON
            </button>
          </div>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 h-8 px-3 border border-border rounded-radius-md text-[12px] font-medium text-on-surface-muted hover:text-on-surface hover:bg-surface-sunken transition-colors"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre className="bg-surface-sunken border border-border rounded-radius-lg p-5 text-[12px] font-mono text-on-surface-muted leading-[1.7] overflow-x-auto m-0 whitespace-pre-wrap">
          {tab === 'css'
            ? `:root {\n${cssOutput}\n}`
            : dtcgOutput}
        </pre>
        {tab === 'dtcg' && (
          <p className="text-[11.5px] text-on-surface-subtle mt-3 m-0">
            DTCG JSON is a starting point for the{' '}
            <span className="font-mono text-[11px] bg-surface-raised border border-border rounded px-1 py-0.5">generate-type-scale</span>{' '}
            play, which adds weights, letter-spacing, and named semantic roles based on your project context.
          </p>
        )}
      </div>

      {/* API callout */}
      <div className="border border-border rounded-radius-lg p-5 bg-surface-raised">
        <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-on-surface-muted mb-2 m-0">
          Use in a play
        </p>
        <p className="text-[13px] text-on-surface-muted leading-[1.5] m-0">
          Paste your chosen ratio and base size into the{' '}
          <code className="font-mono text-[12px] bg-surface border border-border rounded px-1 py-0.5 text-on-surface">typography_direction</code>{' '}
          variable when running{' '}
          <code className="font-mono text-[12px] bg-surface border border-border rounded px-1 py-0.5 text-on-surface">generate-type-scale</code>.
          The play applies this scale to semantic roles with context-appropriate weights and spacing.
        </p>
      </div>
    </div>
  )
}
