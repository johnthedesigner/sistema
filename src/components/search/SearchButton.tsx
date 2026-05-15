'use client'

interface Props {
  className?: string
  children: React.ReactNode
}

export function SearchButton({ className, children }: Props) {
  function open() {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))
  }
  return (
    <button onClick={open} className={className}>
      {children}
    </button>
  )
}
