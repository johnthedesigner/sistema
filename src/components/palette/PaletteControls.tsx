'use client'

import { useState } from 'react'
import { PaletteSwatch } from './PaletteSwatch'
import {
  STOPS, toCss, toTailwind, toFigmaCollection, downloadJson,
  type Format, type PaletteResult,
} from '@/lib/palette-format'

export type { Format }

const GRAY_NAMES = ['slate', 'gray', 'zinc', 'neutral', 'stone']
const CHROMATIC_NAMES = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']

// --- Copy / Download helpers ---

function useCopyButton() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  function copy(key: string, text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 1500)
    })
  }

  return { copiedKey, copy }
}

// --- Sub-components ---

function FormatTab({
  label, value, current, onClick,
}: {
  label: string; value: Format; current: Format; onClick: (f: Format) => void
}) {
  const active = value === current
  return (
    <button
      onClick={() => onClick(value)}
      className={`px-3 py-1.5 text-sm rounded transition-colors ${
        active
          ? 'bg-primary text-on-primary'
          : 'text-on-surface-muted hover:text-on-surface'
      }`}
    >
      {label}
    </button>
  )
}

function CopyButton({
  label, onClick, copied,
}: {
  label?: string; onClick: () => void; copied: boolean
}) {
  return (
    <button
      onClick={onClick}
      className="text-[11px] text-on-surface-muted hover:text-on-surface transition-colors leading-none mt-0.5 text-left"
    >
      {copied ? '✓ copied' : (label ?? 'copy')}
    </button>
  )
}

function PaletteRow({
  name, palette, format, copiedKey, onCopy,
}: {
  name: string
  palette: PaletteResult
  format: Format
  copiedKey: string | null
  onCopy: (key: string, text: string) => void
}) {
  const key = name

  function handleCopy() {
    if (format === 'css') onCopy(key, toCss(name, palette))
    else if (format === 'tailwind') onCopy(key, toTailwind(name, palette))
    else {
      const data = toFigmaCollection([name], { [name]: palette })
      downloadJson(`${name}-palette.json`, data)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 shrink-0 flex flex-col">
        <span className="text-sm text-on-surface font-medium capitalize leading-tight">{name}</span>
        <CopyButton
          label={format === 'figma' ? 'export' : 'copy'}
          onClick={handleCopy}
          copied={copiedKey === key}
        />
      </div>
      <div className="flex gap-0.5 flex-1">
        {STOPS.map(stop => {
          const s = palette.stops[stop]
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
  )
}

// --- Main export ---

export function PaletteControls({
  library,
}: {
  library: Record<string, PaletteResult>
}) {
  const [format, setFormat] = useState<Format>('css')
  const { copiedKey, copy } = useCopyButton()

  const allNames = [...GRAY_NAMES, ...CHROMATIC_NAMES].filter(n => library[n])

  function handleExportAll() {
    if (format === 'css') {
      copy('__all__', allNames.map(n => toCss(n, library[n])).join('\n\n'))
    } else if (format === 'tailwind') {
      const inner = allNames.map(n => toTailwind(n, library[n])).join('\n')
      copy('__all__', `// tailwind.config.js — extend.colors\ncolors: {\n${inner}\n}`)
    } else {
      downloadJson('sistema-palette-library.json', toFigmaCollection(allNames, library))
    }
  }

  return (
    <>
      {/* Format selector + export all */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1 bg-surface rounded-radius-lg p-1">
          <FormatTab label="CSS Variables" value="css" current={format} onClick={setFormat} />
          <FormatTab label="Tailwind Config" value="tailwind" current={format} onClick={setFormat} />
          <FormatTab label="Figma Variables" value="figma" current={format} onClick={setFormat} />
        </div>
        <button
          onClick={handleExportAll}
          className="text-sm text-on-surface-muted hover:text-on-surface border border-border hover:border-on-surface-muted rounded-radius-sm px-3 py-1.5 transition-colors"
        >
          {copiedKey === '__all__'
            ? '✓ copied'
            : format === 'figma'
            ? 'Export all as Figma JSON'
            : format === 'tailwind'
            ? 'Copy all (Tailwind)'
            : 'Copy all (CSS)'}
        </button>
      </div>

      {format === 'figma' && (
        <p className="text-xs text-on-surface-muted mb-4 -mt-2">
          Import the downloaded JSON using the{' '}
          <span className="font-medium text-on-surface-muted">Variables Import &amp; Export</span>{' '}
          Figma community plugin or any plugin that accepts the{' '}
          <code className="font-mono">collections</code> format.
        </p>
      )}

      {/* Stop labels */}
      <div className="flex items-center gap-2 mb-2">
        <span className="w-16 shrink-0" />
        <div className="flex gap-0.5 flex-1">
          {STOPS.map(stop => (
            <div key={stop} className="flex-1 min-w-0 text-center">
              <span className="text-[10px] text-on-surface-muted font-mono">{stop}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gray families */}
      <div className="space-y-2 mb-6">
        {GRAY_NAMES.filter(n => library[n]).map(name => (
          <PaletteRow
            key={name} name={name} palette={library[name]}
            format={format} copiedKey={copiedKey} onCopy={copy}
          />
        ))}
      </div>

      <hr className="border-border mb-6" />

      {/* Chromatic colors */}
      <div className="space-y-2">
        {CHROMATIC_NAMES.filter(n => library[n]).map(name => (
          <PaletteRow
            key={name} name={name} palette={library[name]}
            format={format} copiedKey={copiedKey} onCopy={copy}
          />
        ))}
      </div>
    </>
  )
}
