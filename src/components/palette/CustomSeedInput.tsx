'use client'

import { useState } from 'react'
import { PaletteSwatch } from './PaletteSwatch'
import {
  STOPS, toCss, toTailwind, toFigmaCollection, downloadJson,
  type Format, type PaletteResult,
} from '@/lib/palette-format'

const HEX_RE = /^#[0-9a-fA-F]{6}$/

function FormatTab({
  label, value, current, onClick,
}: {
  label: string; value: Format; current: Format; onClick: (f: Format) => void
}) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`px-3 py-1.5 text-sm rounded transition-colors ${
        value === current ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      {label}
    </button>
  )
}

export function CustomSeedInput() {
  const [hex, setHex] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'done'>('idle')
  const [error, setError] = useState('')
  const [result, setResult] = useState<PaletteResult | null>(null)
  const [resultName, setResultName] = useState('')
  const [format, setFormat] = useState<Format>('css')
  const [copied, setCopied] = useState(false)

  const inputHex = hex.startsWith('#') ? hex : hex ? `#${hex}` : ''
  const isValid = HEX_RE.test(inputHex)

  async function handleGenerate() {
    if (!isValid) return
    setStatus('loading')
    setError('')
    setResult(null)

    const paletteName = name.trim() || 'custom'

    try {
      const res = await fetch('/api/palette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colors: { [paletteName]: inputHex } }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error ?? `API error ${res.status}`)
        setStatus('error')
        return
      }
      const data = await res.json()
      setResult(data.palettes[paletteName])
      setResultName(paletteName)
      setStatus('done')
    } catch {
      setError('Network error — could not reach /api/palette')
      setStatus('error')
    }
  }

  function handleCopy() {
    if (!result) return
    let text: string
    if (format === 'css') text = toCss(resultName, result)
    else if (format === 'tailwind') text = toTailwind(resultName, result)
    else {
      downloadJson(`${resultName}-palette.json`, toFigmaCollection([resultName], { [resultName]: result }))
      return
    }
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="border border-gray-200 rounded-xl p-6 mb-10">
      <h2 className="text-sm font-semibold text-gray-900 mb-1">Generate from a custom seed</h2>
      <p className="text-sm text-gray-500 mb-4">
        Enter any hex color to generate a 19-stop palette using the same contrast-targeting algorithm.
      </p>

      <div className="flex items-start gap-3 flex-wrap">
        {/* Hex swatch preview */}
        <div
          className="w-9 h-9 rounded border border-gray-200 shrink-0 mt-0.5"
          style={{ backgroundColor: isValid ? inputHex : '#f3f4f6' }}
        />

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Hex color</label>
          <input
            type="text"
            value={hex}
            onChange={e => setHex(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            placeholder="#2563eb"
            maxLength={7}
            className={`w-28 text-sm font-mono border rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-300 ${
              hex && !isValid ? 'border-red-300 text-red-700' : 'border-gray-200 text-gray-900'
            }`}
          />
          {hex && !isValid && (
            <span className="text-xs text-red-500">Enter a valid 6-digit hex</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Name <span className="font-normal text-gray-400">(optional)</span></label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value.replace(/[^a-z0-9-]/gi, '-').toLowerCase())}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            placeholder="custom"
            className="w-32 text-sm border border-gray-200 rounded-md px-2.5 py-1.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        <div className="flex flex-col justify-end">
          <label className="text-xs text-gray-500 font-medium invisible">Generate</label>
          <button
            onClick={handleGenerate}
            disabled={!isValid || status === 'loading'}
            className="px-4 py-1.5 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'loading' ? 'Generating…' : 'Generate'}
          </button>
        </div>
      </div>

      {status === 'error' && (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      )}

      {status === 'done' && result && (
        <div className="mt-6">
          {/* Stop labels */}
          <div className="flex items-center gap-2 mb-1">
            <span className="w-16 shrink-0" />
            <div className="flex gap-0.5 flex-1">
              {STOPS.map(stop => (
                <div key={stop} className="flex-1 min-w-0 text-center">
                  <span className="text-[10px] text-gray-400 font-mono">{stop}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Palette row */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-16 shrink-0">
              <span className="text-sm text-gray-600 font-medium leading-tight block truncate">{resultName}</span>
              <span className="text-xs text-gray-400 font-mono">{result.seed}</span>
            </div>
            <div className="flex gap-0.5 flex-1">
              {STOPS.map(stop => {
                const s = result.stops[stop]
                return (
                  <div key={stop} className="flex-1 min-w-0">
                    <PaletteSwatch
                      hex={s.hex}
                      stop={stop}
                      contrastWhite={s.contrast_white}
                      contrastBlack={s.contrast_black}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Format selector + copy */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <FormatTab label="CSS Variables" value="css" current={format} onClick={setFormat} />
              <FormatTab label="Tailwind Config" value="tailwind" current={format} onClick={setFormat} />
              <FormatTab label="Figma Variables" value="figma" current={format} onClick={setFormat} />
            </div>
            <button
              onClick={handleCopy}
              className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-400 rounded px-3 py-1.5 transition-colors"
            >
              {copied
                ? '✓ copied'
                : format === 'figma'
                ? 'Export as Figma JSON'
                : format === 'tailwind'
                ? 'Copy (Tailwind)'
                : 'Copy (CSS)'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
