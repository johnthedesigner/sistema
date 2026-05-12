'use client'

import { useState, useEffect } from 'react'

type CopyState = 'idle' | 'copying' | 'copied' | 'error'

function useCopy(): [CopyState, (fn: () => Promise<void>) => void] {
  const [state, setState] = useState<CopyState>('idle')
  function run(fn: () => Promise<void>) {
    setState('copying')
    fn()
      .then(() => {
        setState('copied')
        setTimeout(() => setState('idle'), 2000)
      })
      .catch(() => {
        setState('error')
        setTimeout(() => setState('idle'), 2000)
      })
  }
  return [state, run]
}

function label(state: CopyState, idle: string) {
  if (state === 'copied') return 'Copied!'
  if (state === 'error') return 'Error'
  if (state === 'copying') return '…'
  return idle
}

export function DesignMdPanel({
  rawPath,
  systemName,
}: {
  rawPath: string
  systemName: string
}) {
  const [origin, setOrigin] = useState('')
  useEffect(() => { setOrigin(window.location.origin) }, [])

  const [contentState, runContent] = useCopy()
  const [urlState, runUrl] = useCopy()
  const [promptState, runPrompt] = useCopy()

  function copyContent() {
    runContent(async () => {
      const res = await fetch(rawPath)
      if (!res.ok) throw new Error('fetch failed')
      await navigator.clipboard.writeText(await res.text())
    })
  }

  function copyUrl() {
    runUrl(async () => {
      await navigator.clipboard.writeText(`${window.location.origin}${rawPath}`)
    })
  }

  function copyPrompt() {
    runPrompt(async () => {
      const url = `${window.location.origin}${rawPath}`
      await navigator.clipboard.writeText(
        `Fetch ${url} and use it as the design foundation for this project.`
      )
    })
  }

  const btnBase = 'px-3 py-1.5 text-sm font-medium rounded transition-colors disabled:opacity-50'
  const btnPrimary = `${btnBase} bg-gray-900 text-white hover:bg-gray-700`
  const btnSecondary = `${btnBase} border border-gray-200 text-gray-700 hover:bg-gray-50`

  return (
    <section className="border border-gray-200 rounded-lg p-6 mb-10">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1">
        Add to your project
      </h2>
      <p className="text-sm text-gray-600 mb-5 max-w-xl">
        DESIGN.md encodes {systemName}&apos;s visual language for AI coding tools. Add it
        to your project so Claude Code, Cursor, or any agent that reads files can
        reference it directly.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={copyContent}
          disabled={contentState === 'copying'}
          className={btnPrimary}
        >
          {label(contentState, 'Copy DESIGN.md')}
        </button>
        <button
          onClick={copyUrl}
          disabled={urlState === 'copying'}
          className={btnSecondary}
        >
          {label(urlState, 'Copy raw URL')}
        </button>
      </div>

      <div className="border-t border-gray-100 pt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Quick start
        </p>
        <div className="flex items-start justify-between gap-4 bg-gray-50 border border-gray-100 rounded-md p-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Fetch{' '}
            <span className="font-mono text-xs break-all text-gray-800">
              {origin}{rawPath}
            </span>{' '}
            and use it as the design foundation for this project.
          </p>
          <button
            onClick={copyPrompt}
            disabled={promptState === 'copying'}
            className={`flex-shrink-0 ${btnSecondary} text-xs`}
          >
            {label(promptState, 'Copy')}
          </button>
        </div>
      </div>
    </section>
  )
}
