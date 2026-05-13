import { MarkdownBody } from '@/components/kb/MarkdownBody'
import type { ExemplarFile } from '@/lib/exemplars'

export function ExemplarPreview({ exemplar, inline }: { exemplar: ExemplarFile; inline?: boolean }) {
  if (inline) {
    return (
      <div className="border border-gray-100 rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Example output</span>
        </div>
        <div className="px-5 py-4 overflow-y-auto max-h-[70vh]">
          {exemplar.quality_notes && (
            <div className="mb-4 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded px-3 py-2 leading-relaxed">
              <span className="font-medium text-gray-600">About this example: </span>
              {exemplar.quality_notes}
            </div>
          )}
          <MarkdownBody>{exemplar.body}</MarkdownBody>
        </div>
      </div>
    )
  }

  return (
    <details className="mt-10 border border-gray-100 rounded-lg overflow-hidden">
      <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer select-none hover:bg-gray-50 transition-colors list-none">
        <span className="text-sm font-medium text-gray-700">Example output</span>
        <span className="text-xs text-gray-400">click to expand</span>
      </summary>

      <div className="border-t border-gray-100 px-6 py-5">
        {exemplar.quality_notes && (
          <div className="mb-6 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded px-4 py-3 leading-relaxed">
            <span className="font-medium text-gray-600">About this example: </span>
            {exemplar.quality_notes}
          </div>
        )}
        <MarkdownBody>{exemplar.body}</MarkdownBody>
      </div>
    </details>
  )
}
