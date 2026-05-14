import Link from 'next/link'

function sourceLabel(src: string): string {
  if (src.startsWith('http')) {
    try {
      const { hostname } = new URL(src)
      return hostname.replace(/^www\./, '')
    } catch {
      return src
    }
  }
  // Internal KB path: kb/reference/design-systems/material/guidance/foundations/color-system
  // → "Material / Color System"
  const segments = src
    .replace(/^kb\/reference\//, '')
    .replace(/^kb\//, '')
    .split('/')
  const format = (s: string) =>
    s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return segments.slice(-2).map(format).join(' / ')
}

function sourceHref(src: string): string {
  if (src.startsWith('http')) return src
  // kb/reference/design-systems/material/guidance/foundations/color-system
  // → /kb/design-systems/material/guidance/foundations/color-system.md
  const path = src.replace(/^kb\/reference\//, '').replace(/^kb\//, '')
  return `/kb/${path}.md`
}

function isExternal(src: string): boolean {
  return src.startsWith('http')
}

interface Props {
  sourceUrl?: string
  derivedFrom?: string[]
  sources?: string[]
}

export function SourcesSidebar({ sourceUrl, derivedFrom, sources }: Props) {
  const all = [
    ...(sourceUrl ? [sourceUrl] : []),
    ...(derivedFrom ?? []),
    ...(sources ?? []),
  ]
  const deduped = [...new Set(all)]

  if (deduped.length === 0) return null

  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-on-surface-muted mb-3">
        Sources
      </h2>
      <ul className="space-y-1.5">
        {deduped.map(src => {
          const external = isExternal(src)
          const href = sourceHref(src)
          const label = sourceLabel(src)
          return (
            <li key={src}>
              {external ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-primary hover:underline inline-flex items-center gap-1"
                >
                  {label}
                  <span className="text-on-surface-muted text-xs">↗</span>
                </a>
              ) : (
                <Link
                  href={href}
                  className="text-sm text-primary hover:text-primary hover:underline"
                >
                  {label}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
