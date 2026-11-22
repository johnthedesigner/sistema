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

const GRID_COLS = '64px repeat(19, minmax(3rem, 1fr))'

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

function FormatTab({ label, value, current, onClick }: {
  label: string; value: Format; current: Format; onClick: (f: Format) => void
}) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`px-3 py-1.5 text-sm rounded transition-colors ${
        value === current ? 'bg-primary text-on-primary' : 'text-on-surface-muted hover:text-on-surface'
      }`}
    >
      {label}
    </button>
  )
}

function CopyButton({ label, onClick, copied }: { label?: string; onClick: () => void; copied: boolean }) {
  return (
    <button
      onClick={onClick}
      className="text-[11px] text-on-surface-muted hover:text-on-surface transition-colors leading-none mt-0.5 text-left"
    >
      {copied ? '✓ copied' : (label ?? 'copy')}
    </button>
  )
}

function PaletteGridRow({ name, palette, format, copiedKey, onCopy }: {
  name: string
  palette: PaletteResult
  format: Format
  copiedKey: string | null
  onCopy: (key: string, text: string) => void
}) {
  function handleCopy() {
    if (format === 'css') onCopy(name, toCss(name, palette))
    else if (format === 'tailwind') onCopy(name, toTailwind(name, palette))
    else downloadJson(`${name}-palette.json`, toFigmaCollection([name], { [name]: palette }))
  }

  return (
    <>
      <div className="flex flex-col justify-center pr-1" style={{ position: 'sticky', left: 0, background: 'var(--color-surface)', zIndex: 1, alignSelf: 'stretch', padding: ".5rem 0" }}>
        <span className="text-sm text-on-surface font-medium capitalize leading-tight">{name}</span>
        <CopyButton
          label={format === 'figma' ? 'export' : 'copy'}
          onClick={handleCopy}
          copied={copiedKey === name}
        />
      </div>
      {STOPS.map(stop => {
        const s = palette.stops[stop]
        return (
          <PaletteSwatch
            key={stop}
            hex={s.hex}
            stop={stop}
            contrastWhite={s.contrast_white}
            contrastBlack={s.contrast_black}
          />
        )
      })}
    </>
  )
}

export function PaletteControls({ library }: { library: Record<string, PaletteResult> }) {
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1 bg-surface-raised rounded-radius-lg p-1">
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

      <div className="overflow-x-auto">
        <div
          className="min-w-[500px]"
          style={{ display: 'grid', gridTemplateColumns: GRID_COLS, columnGap: 2, rowGap: 8, alignItems: 'center' }}
        >
          {/* Header row: empty name cell + stop labels */}
          <div style={{ position: 'sticky', left: 0, background: 'var(--color-surface)', zIndex: 1 }} />
          {STOPS.map(stop => (
            <div key={stop} className="text-center">
              <span className="text-[10px] text-on-surface-muted font-mono">{stop}</span>
            </div>
          ))}

          {/* Gray families */}
          {GRAY_NAMES.filter(n => library[n]).map(name => (
            <PaletteGridRow
              key={name} name={name} palette={library[name]}
              format={format} copiedKey={copiedKey} onCopy={copy}
            />
          ))}

          {/* Separator spanning all columns */}
          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--color-border)' }} />

          {/* Chromatic colors */}
          {CHROMATIC_NAMES.filter(n => library[n]).map(name => (
            <PaletteGridRow
              key={name} name={name} palette={library[name]}
              format={format} copiedKey={copiedKey} onCopy={copy}
            />
          ))}
        </div>
      </div>
    </>
  )
}
