'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type Params = {
  layout: string
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
  layout: 'operations',
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

const LAYOUT_OPTIONS = [
  { value: 'operations', label: 'Operations list' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'record', label: 'Record and forms' },
  { value: 'marketing', label: 'Marketing page' },
  { value: 'article', label: 'Article' },
  { value: 'shop', label: 'Product listing' },
]

const W = 1280
const H = 900

function src(p: Params): string {
  const q = new URLSearchParams({ ...p, format: 'html' })
  return `/api/specimen?${q.toString()}`
}

function Frame({ url, title, onOpen }: { url: string; title: string; onOpen: () => void }) {
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
    <div ref={box} className="group relative w-full overflow-hidden rounded-radius-lg bg-surface-subtle" style={{ height: H * scale }}>
      <iframe
        src={url}
        title={title}
        loading="lazy"
        tabIndex={-1}
        style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: '0 0', border: 0, display: 'block', pointerEvents: 'none' }}
      />
      <button
        onClick={onOpen}
        aria-label={`Open ${title} full size`}
        className="absolute inset-0 flex items-end justify-end p-3 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      >
        <span className="rounded-full bg-on-surface px-3 py-1.5 text-[13px] text-surface-raised">Open full size</span>
      </button>
    </div>
  )
}

type Variant = { label: string; says: string; url: string }

/**
 * Full-size viewer. Every option stays loaded, stacked in the same place, and
 * only the current one is visible, so flipping is instant (no slide or fade)
 * and keeps the scroll position, which makes differences easy to see.
 */
function Viewer({ variants, start, heading, onClose }: { variants: Variant[]; start: number; heading: string; onClose: () => void }) {
  const [i, setI] = useState(start)
  const [size, setSize] = useState({ w: 1200, h: 800 })
  const frames = useRef<Array<HTMLIFrameElement | null>>([])
  const n = variants.length

  const go = (next: number) => {
    const to = (next + n) % n
    if (to === i) return
    try {
      const y = frames.current[i]?.contentWindow?.scrollY ?? 0
      frames.current[to]?.contentWindow?.scrollTo(0, y)
    } catch {}
    setI(to)
  }

  useEffect(() => {
    const measure = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    measure()
    window.addEventListener('resize', measure)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('resize', measure); document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(i + 1)
      else if (e.key === 'ArrowLeft') go(i - 1)
      else if (/^[1-9]$/.test(e.key) && Number(e.key) <= n) go(Number(e.key) - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const bar = 64
  const availW = size.w - 32
  const scale = Math.min(1, availW / W)
  const frameH = (size.h - bar - 16) / scale

  return (
    <div role="dialog" aria-modal="true" aria-label={heading} className="fixed inset-0 z-[100] flex flex-col" style={{ background: '#0c0c0d' }}>
      <div className="flex shrink-0 items-center gap-4 px-4 text-[14px] text-white" style={{ height: bar }}>
        <div className="min-w-0 flex-1 truncate">
          <span className="text-white/60">{heading}</span>
          {variants[i].label && <span className="ml-3 font-medium">{variants[i].label}.</span>}
          {variants[i].says && <span className="ml-1.5 text-white/70">{variants[i].says}</span>}
        </div>
        {n > 1 && (
          <div className="flex items-center gap-1">
            <button onClick={() => go(i - 1)} className="h-8 rounded-md px-2.5 text-white/80 hover:bg-white/10" aria-label="Previous option">←</button>
            {variants.map((v, k) => (
              <button
                key={v.url}
                onClick={() => go(k)}
                aria-pressed={k === i}
                className={`h-8 rounded-md px-3 ${k === i ? 'bg-white text-black' : 'text-white/80 hover:bg-white/10'}`}
              >
                <span className="mr-1.5 text-[11px] opacity-50">{k + 1}</span>{v.label}
              </button>
            ))}
            <button onClick={() => go(i + 1)} className="h-8 rounded-md px-2.5 text-white/80 hover:bg-white/10" aria-label="Next option">→</button>
          </div>
        )}
        <button onClick={onClose} className="h-8 rounded-md px-3 text-white/80 hover:bg-white/10">Close <span className="text-white/40">Esc</span></button>
      </div>
      <div className="relative mx-auto overflow-hidden rounded-[6px]" style={{ width: W * scale, height: size.h - bar - 16 }}>
        {variants.map((v, k) => (
          <iframe
            key={v.url}
            ref={el => { frames.current[k] = el }}
            src={v.url}
            title={v.label || 'Specimen'}
            style={{
              position: 'absolute', top: 0, left: 0, width: W, height: frameH, border: 0,
              transform: `scale(${scale})`, transformOrigin: '0 0',
              visibility: k === i ? 'visible' : 'hidden',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export function SpecimenTool() {
  const [p, setP] = useState<Params>(DEFAULTS)
  const [compare, setCompare] = useState<keyof Params | ''>('separation')
  const [open, setOpen] = useState<number | null>(null)
  const set = (k: keyof Params, v: string) => setP(prev => ({ ...prev, [k]: v }))

  const variants = useMemo(() => {
    if (!compare) return [{ label: '', says: '', url: src(p) }] as Variant[]
    const choice = CHOICES.find(c => c.key === compare)!
    const opts = compare === 'font' ? choice.options.slice(0, 3) : choice.options
    return opts.map(o => ({ label: o.label, says: o.says, url: src({ ...p, [compare]: o.value }) }))
  }, [p, compare])

  const apiUrl = src(p).replace('&format=html', '')

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2 text-[14px]">
        <span className="text-on-surface-muted mr-1">Page</span>
        {LAYOUT_OPTIONS.map(l => (
          <button
            key={l.value}
            onClick={() => set('layout', l.value)}
            aria-pressed={p.layout === l.value}
            className={`h-8 rounded-full px-3.5 transition-colors ${p.layout === l.value ? 'bg-on-surface text-surface-raised' : 'bg-surface-subtle text-on-surface hover:bg-border'}`}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1.5 text-[13px] text-on-surface-muted">
          Brand color
          <span className="flex items-center gap-2">
            <input type="color" value={p.accent} onChange={e => set('accent', e.target.value.toUpperCase())} className="h-9 w-10 cursor-pointer rounded-radius-sm border border-border bg-surface-raised p-0.5" />
            <input value={p.accent} onChange={e => set('accent', e.target.value)} className="h-9 w-full rounded-radius-sm border border-border bg-surface-raised px-2.5 font-mono text-[13px] text-on-surface" />
          </span>
        </label>
        {CHOICES.map(c => (
          <label key={c.key} className="flex flex-col gap-1.5 text-[13px] text-on-surface-muted">
            {c.label}
            <select
              value={p[c.key]}
              disabled={compare === c.key}
              onChange={e => set(c.key, e.target.value)}
              className="h-9 rounded-radius-sm border border-border bg-surface-raised px-2 text-[14px] text-on-surface disabled:opacity-50"
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
            className={`h-8 rounded-full px-3.5 transition-colors ${compare === c.key ? 'bg-on-surface text-surface-raised' : 'bg-surface-subtle text-on-surface hover:bg-border'}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className={`grid grid-cols-1 gap-6 ${variants.length === 2 ? 'lg:grid-cols-2' : variants.length >= 3 ? 'lg:grid-cols-3' : ''}`}>
        {variants.map((v, k) => (
          <figure key={v.url} className="m-0 flex min-w-0 flex-col gap-3">
            <Frame url={v.url} title={v.label || 'Specimen'} onOpen={() => setOpen(k)} />
            {v.label && (
              <figcaption className="text-[14px] leading-snug">
                <span className="font-medium text-on-surface">{v.label}.</span>{' '}
                <span className="text-on-surface-muted">{v.says}</span>
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {open !== null && (
        <Viewer
          variants={variants}
          start={open}
          heading={compare ? CHOICES.find(c => c.key === compare)!.label : LAYOUT_OPTIONS.find(l => l.value === p.layout)!.label}
          onClose={() => setOpen(null)}
        />
      )}

      <p className="text-[13px] text-on-surface-muted">
        Click any option to see it full size and flip between options with the arrow keys or number keys. Open <a className="underline" href={src(p)} target="_blank" rel="noreferrer">this page in a new tab</a>, or get the roles as JSON from{' '}
        <a className="underline break-all" href={apiUrl} target="_blank" rel="noreferrer">the API</a>.
      </p>
    </div>
  )
}
