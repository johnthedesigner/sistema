'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type Params = {
  accent: string
  neutral: string
  presence: string
  radius: string
  chips: string
  separation: string
  density: string
  font: string
  theme: string
}

const DEFAULTS: Params = {
  accent: '#1E6B5C',
  neutral: 'neutral',
  presence: 'quiet',
  radius: '8',
  chips: 'scaled',
  separation: 'tone',
  density: 'comfortable',
  font: 'Instrument Sans',
  theme: 'light',
}

/** Each choice, its options, and plain words for what each option looks like. */
const CHOICES: Array<{ key: keyof Params; label: string; options: Array<{ value: string; label: string; says: string }> }> = [
  {
    key: 'presence', label: 'How much color',
    options: [
      { value: 'quiet', label: 'Quiet', says: 'Almost all neutral. Color on the main button, selection, and status only.' },
      { value: 'brand', label: 'Brand', says: 'The brand color also marks the selected navigation item.' },
      { value: 'tinted', label: 'Tinted', says: 'The navigation is a deep block of brand color, and the page takes a faint tint.' },
    ],
  },
  {
    key: 'neutral', label: 'Warm or cool',
    options: [
      { value: 'cool', label: 'Cool', says: 'Grays lean blue.' },
      { value: 'neutral', label: 'Neutral', says: 'Grays carry a trace of the brand hue.' },
      { value: 'warm', label: 'Warm', says: 'Grays lean toward sand.' },
    ],
  },
  {
    key: 'radius', label: 'How round',
    options: [
      { value: '3', label: 'Crisp', says: 'About 3px on controls, 5px on panels.' },
      { value: '8', label: 'Soft', says: 'About 8px on controls, 12px on panels.' },
      { value: '12', label: 'Round', says: 'About 12px on controls, 18px on panels.' },
    ],
  },
  {
    key: 'separation', label: 'How panels separate',
    options: [
      { value: 'tone', label: 'Tone', says: 'No outlines. Panels are a shade lighter than the page.' },
      { value: 'line', label: 'Line', says: 'Panels sit on the page color, outlined with a fine line.' },
      { value: 'shadow', label: 'Shadow', says: 'Panels lift slightly with a soft shadow, no outline.' },
    ],
  },
  {
    key: 'density', label: 'Density',
    options: [
      { value: 'compact', label: 'Compact', says: '13px text, 34px rows.' },
      { value: 'comfortable', label: 'Comfortable', says: '14px text, 42px rows.' },
      { value: 'spacious', label: 'Spacious', says: '15px text, 50px rows.' },
    ],
  },
  {
    key: 'font', label: 'Typeface',
    options: [
      { value: 'Instrument Sans', label: 'Instrument Sans', says: 'Contemporary grotesque, slightly narrow.' },
      { value: 'IBM Plex Sans', label: 'IBM Plex Sans', says: 'Engineered, with a technical edge.' },
      { value: 'Figtree', label: 'Figtree', says: 'Geometric and friendly.' },
      { value: 'Source Sans 3', label: 'Source Sans 3', says: 'Humanist, calm, very readable.' },
      { value: 'Inter', label: 'Inter', says: 'Neutral and familiar; the most common choice.' },
      { value: 'Atkinson Hyperlegible Next', label: 'Atkinson Hyperlegible', says: 'Built so similar letters never look alike.' },
    ],
  },
  {
    key: 'theme', label: 'Theme',
    options: [
      { value: 'light', label: 'Light', says: '' },
      { value: 'dark', label: 'Dark', says: '' },
    ],
  },
  {
    key: 'chips', label: 'Status chips',
    options: [
      { value: 'scaled', label: 'Scaled', says: 'Chips follow the radius.' },
      { value: 'pill', label: 'Pill', says: 'Chips are fully rounded.' },
    ],
  },
]

const W = 1280
const H = 900

function src(p: Params): string {
  const q = new URLSearchParams({ ...p, format: 'html' })
  return `/api/specimen?${q.toString()}`
}

function Frame({ url, title }: { url: string; title: string }) {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(() => setScale(el.clientWidth / W))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={box} className="relative w-full overflow-hidden rounded-radius-lg bg-surface-sunken" style={{ height: H * scale }}>
      <iframe
        src={url}
        title={title}
        loading="lazy"
        style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: '0 0', border: 0, display: 'block' }}
      />
    </div>
  )
}

export function SpecimenTool() {
  const [p, setP] = useState<Params>(DEFAULTS)
  const [compare, setCompare] = useState<keyof Params | ''>('separation')
  const set = (k: keyof Params, v: string) => setP(prev => ({ ...prev, [k]: v }))

  const variants = useMemo(() => {
    if (!compare) return [{ label: '', says: '', url: src(p) }]
    const choice = CHOICES.find(c => c.key === compare)!
    const opts = compare === 'font' ? choice.options.slice(0, 3) : choice.options
    return opts.map(o => ({ label: o.label, says: o.says, url: src({ ...p, [compare]: o.value }) }))
  }, [p, compare])

  const apiUrl = src(p).replace('&format=html', '')

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1.5 text-[13px] text-on-surface-muted">
          Brand color
          <span className="flex items-center gap-2">
            <input type="color" value={p.accent} onChange={e => set('accent', e.target.value.toUpperCase())} className="h-9 w-10 cursor-pointer rounded-radius-sm border border-border bg-surface p-0.5" />
            <input value={p.accent} onChange={e => set('accent', e.target.value)} className="h-9 w-full rounded-radius-sm border border-border bg-surface px-2.5 font-mono text-[13px] text-on-surface" />
          </span>
        </label>
        {CHOICES.map(c => (
          <label key={c.key} className="flex flex-col gap-1.5 text-[13px] text-on-surface-muted">
            {c.label}
            <select
              value={p[c.key]}
              disabled={compare === c.key}
              onChange={e => set(c.key, e.target.value)}
              className="h-9 rounded-radius-sm border border-border bg-surface px-2 text-[14px] text-on-surface disabled:opacity-50"
            >
              {c.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[14px]">
        <span className="text-on-surface-muted mr-1">Compare</span>
        {[{ key: '' as const, label: 'Nothing' }, ...CHOICES.filter(c => c.key !== 'chips').map(c => ({ key: c.key, label: c.label }))].map(c => (
          <button
            key={c.key || 'none'}
            onClick={() => setCompare(c.key)}
            className={`h-8 rounded-full px-3.5 transition-colors ${compare === c.key ? 'bg-on-surface text-surface' : 'bg-surface-sunken text-on-surface hover:bg-border'}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className={`grid grid-cols-1 gap-6 ${variants.length === 2 ? 'lg:grid-cols-2' : variants.length >= 3 ? 'lg:grid-cols-3' : ''}`}>
        {variants.map(v => (
          <figure key={v.url} className="m-0 flex min-w-0 flex-col gap-3">
            <Frame url={v.url} title={v.label || 'Specimen'} />
            {v.label && (
              <figcaption className="text-[14px] leading-snug">
                <span className="font-medium text-on-surface">{v.label}.</span>{' '}
                <span className="text-on-surface-muted">{v.says}</span>
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <p className="text-[13px] text-on-surface-muted">
        Open <a className="underline" href={src(p)} target="_blank" rel="noreferrer">the page at full size</a>, or get the roles as JSON from{' '}
        <a className="underline break-all" href={apiUrl} target="_blank" rel="noreferrer">the API</a>.
      </p>
    </div>
  )
}
