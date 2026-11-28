'use client'

import { useEffect, useState, useMemo } from 'react'
import { trackToolPage } from '@/lib/analytics/browser'
import { SITE_URL } from '@/lib/site-url'
import { computeTypeScale, DEFAULTS, LIMITS, NAMING, RATIOS, type Naming } from '@/lib/type-scale'

const RATIO_LABELS: Record<string, string> = {
  'minor-second': 'Minor second',
  'major-second': 'Major second',
  'minor-third': 'Minor third',
  'major-third': 'Major third',
  'perfect-fourth': 'Perfect fourth',
  'augmented-fourth': 'Augmented fourth',
  'perfect-fifth': 'Perfect fifth',
  'golden-ratio': 'Golden ratio',
}

const NAMING_LABELS: Record<Naming, string> = {
  numeric: 'Numbered (1, 2, 3…)',
  tailwind: 'Tailwind sizes (xs, sm, base…)',
  steps: 'Step offsets (-2 … 6)',
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
  const [base, setBase] = useState(DEFAULTS.base)
  const [ratioName, setRatioName] = useState(DEFAULTS.ratio)
  const [customRatio, setCustomRatio] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [names, setNames] = useState<Naming>(DEFAULTS.names)
  const [tab, setTab] = useState<'css' | 'dtcg'>('css')
  const [copied, setCopied] = useState(false)

  const custom = parseFloat(customRatio)
  const ratio: number | string = useCustom && custom >= LIMITS.ratio[0] && custom <= LIMITS.ratio[1] ? custom : ratioName

  // Same calculation and defaults as /api/type-scale, so the page and the API agree.
  // Inputs are clamped to the API's limits, so this always succeeds.
  const scale = useMemo(() => {
    const r = computeTypeScale({ base, ratio, names })
    return r.ok ? r.scale : null
  }, [base, ratio, names])
  const stops = scale?.steps ?? []

  useEffect(() => {
    trackToolPage('type_scale', { base, ratio, names })
  }, [base, ratio, names])
  const apiUrl = `${SITE_URL}/api/type-scale?base=${base}&ratio=${typeof ratio === 'number' ? ratio : ratioName}&names=${names}`

  const cssOutput = stops
    .map(s => `  --text-${s.name}: ${s.rem}rem; /* ${s.px}px */\n  --text-${s.name}--line-height: ${s.line_height};`)
    .join('\n')

  const dtcgOutput = JSON.stringify(
    {
      type: Object.fromEntries(
        stops.map(s => [
          s.name,
          {
            size: { $type: 'dimension', $value: `${s.px}px` },
            'line-height': { $type: 'number', $value: s.line_height },
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
          <label htmlFor="base-size" className="block font-mono text-[11px] text-on-surface-muted mb-2">
            Base size
          </label>
          <div className="flex items-center gap-2">
            <input
              id="base-size"
              type="number"
              min={LIMITS.base[0]}
              max={LIMITS.base[1]}
              value={base}
              onChange={e => setBase(Math.max(LIMITS.base[0], Math.min(LIMITS.base[1], parseInt(e.target.value) || DEFAULTS.base)))}
              className="w-20 h-9 px-3 border border-border-strong rounded-radius-md bg-surface-raised text-on-surface text-[14px] font-mono focus:outline-none focus:border-primary transition-colors"
            />
            <span className="text-[13px] text-on-surface-muted font-mono">px</span>
          </div>
          <p className="text-[11.5px] text-on-surface-faint mt-1.5 m-0">
            Typically 16px for body text
          </p>
        </div>

        {/* Ratio */}
        <div>
          <label htmlFor="scale-ratio" className="block font-mono text-[11px] text-on-surface-muted mb-2">
            Scale ratio
          </label>
          <div className="flex items-center gap-2">
            <select
              id="scale-ratio"
              value={useCustom ? 'custom' : ratioName}
              onChange={e => {
                if (e.target.value === 'custom') {
                  setUseCustom(true)
                } else {
                  setUseCustom(false)
                  setRatioName(e.target.value)
                }
              }}
              className="flex-1 h-9 px-3 border border-border-strong rounded-radius-md bg-surface-raised text-on-surface text-[13px] focus:outline-none focus:border-primary transition-colors appearance-none"
            >
              {Object.entries(RATIOS).map(([name, value]) => (
                <option key={name} value={name}>
                  {RATIO_LABELS[name]}, {value}
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
                max={LIMITS.ratio[1]}
                placeholder="e.g. 1.35"
                value={customRatio}
                onChange={e => setCustomRatio(e.target.value)}
                className="w-28 h-9 px-3 border border-border-strong rounded-radius-md bg-surface-raised text-on-surface text-[14px] font-mono focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          )}
        </div>

        {/* Naming */}
        <div className="sm:col-span-2">
          <label htmlFor="scale-names" className="block font-mono text-[11px] text-on-surface-muted mb-2">
            Step names
          </label>
          <select
            id="scale-names"
            value={names}
            onChange={e => setNames(e.target.value as Naming)}
            className="w-full sm:w-auto h-9 px-3 border border-border-strong rounded-radius-md bg-surface-raised text-on-surface text-[13px] focus:outline-none focus:border-primary transition-colors appearance-none"
          >
            {NAMING.map(n => (
              <option key={n} value={n}>{NAMING_LABELS[n]}</option>
            ))}
          </select>
          <p className="text-[11.5px] text-on-surface-faint mt-1.5 m-0">
            Follow your component library&apos;s convention if it has one. The typography guide&apos;s &ldquo;Naming type&rdquo; section explains the choice.
          </p>
        </div>
      </div>

      {/* Scale table */}
      <div>
        <div className="bg-surface-raised rounded-radius-lg overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[72px_56px_64px_64px] sm:grid-cols-[72px_56px_64px_64px_1fr] gap-0 border-b border-border bg-surface-subtle px-4 sm:px-5 py-2.5">
            <span className="font-mono text-[10px] text-on-surface-faint">Token</span>
            <span className="font-mono text-[10px] text-on-surface-faint">px</span>
            <span className="font-mono text-[10px] text-on-surface-faint">rem</span>
            <span className="font-mono text-[10px] text-on-surface-faint">Line-h</span>
            <span className="hidden sm:block font-mono text-[10px] text-on-surface-faint">Notes</span>
          </div>
          {/* Rows — reversed so display is at top */}
          {[...stops].reverse().map(stop => (
            <div
              key={stop.step}
              className="grid grid-cols-[72px_56px_64px_64px] sm:grid-cols-[72px_56px_64px_64px_1fr] gap-0 border-b border-border last:border-0 px-4 sm:px-5 py-3 items-center hover:bg-surface-subtle transition-colors"
            >
              <span className="font-mono text-[13px] text-primary">text-{stop.name}</span>
              <span className="font-mono text-[13px] text-on-surface">{stop.px}</span>
              <span className="font-mono text-[12px] text-on-surface-muted">{stop.rem}</span>
              <span className="font-mono text-[12px] text-on-surface-muted">{stop.line_height}</span>
              {stop.notes && <span className="col-span-full sm:col-span-1 pt-1 sm:pt-0 text-[12px] text-on-surface-faint">{stop.notes.join(' ')}</span>}
            </div>
          ))}
        </div>
        <p className="text-[11.5px] text-on-surface-faint mt-3 m-0">
          Line heights are starting suggestions from the typography guide, with body text (the base size) at the body range. The{' '}
          <span className="font-mono text-[11px] bg-surface-raised border border-border rounded px-1 py-0.5">typography.scale</span>{' '}
          play sets the final value for each role.
        </p>
      </div>

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 border border-border rounded-radius-md p-0.5 bg-surface-subtle">
            <button
              onClick={() => setTab('css')}
              className={[
                'h-7 px-3 rounded text-[12px] font-medium transition-colors',
                tab === 'css'
                  ? 'bg-surface-raised text-on-surface shadow-control'
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
                  ? 'bg-surface-raised text-on-surface shadow-control'
                  : 'text-on-surface-muted hover:text-on-surface',
              ].join(' ')}
            >
              DTCG JSON
            </button>
          </div>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 h-8 px-3 border border-border rounded-radius-md text-[12px] font-medium text-on-surface-muted hover:text-on-surface hover:bg-surface-subtle transition-colors"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre className="bg-surface-subtle rounded-radius-lg p-5 text-[12px] font-mono text-on-surface-muted leading-[1.7] overflow-x-auto m-0 whitespace-pre-wrap">
          {tab === 'css'
            ? `:root {\n${cssOutput}\n}`
            : dtcgOutput}
        </pre>
        {tab === 'dtcg' && (
          <p className="text-[11.5px] text-on-surface-faint mt-3 m-0">
            DTCG JSON is a starting point for the{' '}
            <span className="font-mono text-[11px] bg-surface-raised border border-border rounded px-1 py-0.5">typography.scale</span>{' '}
            play, which adds weights, letter spacing, and the product&apos;s roles.
          </p>
        )}
      </div>

      {/* API callout */}
      <div className=" rounded-radius-lg p-5 bg-surface-raised">
        <p className="font-mono text-[11px] text-on-surface-muted mb-2 m-0">
          For agents
        </p>
        <p className="text-[13px] text-on-surface-muted leading-[1.5] m-0 mb-2">
          The same scale as an API. The{' '}
          <code className="font-mono text-[12px] bg-surface-raised border border-border rounded px-1 py-0.5 text-on-surface">typography.scale</code>{' '}
          play calls it, with the project&apos;s roles and standard.
        </p>
        <p className="font-mono text-[12px] text-on-surface m-0 break-all">{apiUrl}</p>
      </div>
    </div>
  )
}
