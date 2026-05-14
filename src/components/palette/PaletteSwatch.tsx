'use client'

import { useState } from 'react'

interface Props {
  hex: string
  stop: string
  contrastWhite: number
  contrastBlack: number
}

export function PaletteSwatch({ hex, stop, contrastWhite, contrastBlack }: Props) {
  const [copied, setCopied] = useState(false)

  function handleClick() {
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    })
  }

  const useWhiteText = contrastWhite < contrastBlack
  const labelColor = useWhiteText ? '#ffffff' : '#000000'

  return (
    <button
      onClick={handleClick}
      title={`${stop}: ${hex} | ${contrastWhite}:1 on white | ${contrastBlack}:1 on black`}
      className="group relative flex flex-col items-start justify-end w-full h-16 px-1.5 pb-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-border-focus transition-transform hover:scale-105"
      style={{ backgroundColor: hex }}
    >
      <span
        className="text-[9px] font-mono leading-tight opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: labelColor }}
      >
        {stop}
      </span>
      <span
        className="text-[9px] font-mono leading-tight opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: labelColor }}
      >
        {copied ? 'copied!' : hex}
      </span>
    </button>
  )
}
