import { MarkdownBody } from '@/components/kb/MarkdownBody'
import type { ExemplarFile } from '@/lib/exemplars'

export function ExemplarPreview({ exemplar, inline }: { exemplar: ExemplarFile; inline?: boolean }) {
  if (inline) {
    return (
      <div className="border border-border rounded-radius-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-muted">Example output</span>
        </div>
        <div className="px-5 py-4 overflow-y-auto max-h-[70vh]">
          {exemplar.quality_notes && (
            <div className="mb-4 text-xs text-on-surface-muted bg-surface border border-border rounded-radius-sm px-3 py-2 leading-relaxed">
              <span className="font-medium text-on-surface-muted">About this example: </span>
              {exemplar.quality_notes}
            </div>
          )}
          <MarkdownBody>{exemplar.body}</MarkdownBody>
        </div>
      </div>
    )
  }

  return (
    <details className="mt-10 border border-border rounded-radius-lg overflow-hidden">
      <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer select-none hover:bg-surface transition-colors list-none">
        <span className="text-sm font-medium text-on-surface">Example output</span>
        <span className="text-xs text-on-surface-muted">click to expand</span>
      </summary>

      <div className="border-t border-border px-6 py-5">
        {exemplar.quality_notes && (
          <div className="mb-6 text-xs text-on-surface-muted bg-surface border border-border rounded-radius-sm px-4 py-3 leading-relaxed">
            <span className="font-medium text-on-surface-muted">About this example: </span>
            {exemplar.quality_notes}
          </div>
        )}
        <MarkdownBody>{exemplar.body}</MarkdownBody>
      </div>
    </details>
  )
}
