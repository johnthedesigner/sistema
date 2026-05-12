import { MarkdownBody } from '@/components/kb/MarkdownBody'
import type { ExemplarFile } from '@/lib/exemplars'

export function ExemplarPreview({ exemplar }: { exemplar: ExemplarFile }) {
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
