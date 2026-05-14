import type { ContentFrontmatter } from '@/lib/types'

const TYPE_LABELS: Record<string, string> = {
  guidance: 'Guidance',
  implementation: 'Implementation',
  asset: 'Asset',
  'design-md': 'DESIGN.md',
}

const STATUS_STYLES: Record<string, string> = {
  latest: 'bg-green-50 text-green-700 border-green-200',
  legacy: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  draft: 'bg-gray-50 text-gray-600 border-gray-200',
  deprecated: 'bg-red-50 text-red-700 border-red-200',
}

function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${className}`}>
      {children}
    </span>
  )
}

export function ContentMeta({ frontmatter }: { frontmatter: ContentFrontmatter }) {
  const {
    content_type,
    status,
    version_label,
    retrieved,
  } = frontmatter

  const retrievedDate = typeof retrieved === 'string'
    ? retrieved
    : new Date(retrieved as Date).toISOString().split('T')[0]

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 pb-6 mb-6 border-b border-gray-100">
      {content_type && (
        <Pill className="bg-gray-50 text-gray-600 border-gray-200">
          {TYPE_LABELS[content_type] ?? content_type}
        </Pill>
      )}
      {status && (
        <Pill className={STATUS_STYLES[status] ?? STATUS_STYLES.draft}>
          {status}
        </Pill>
      )}
      {version_label && (
        <Pill className="bg-blue-50 text-blue-700 border-blue-200">
          {version_label}
        </Pill>
      )}
      <span className="text-gray-400">Retrieved {retrievedDate}</span>
    </div>
  )
}
