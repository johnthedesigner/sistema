import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function MarkdownBody({ children }: { children: string }) {
  return (
    <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-a:text-primary prose-code:before:content-none prose-code:after:content-none prose-code:bg-surface prose-code:px-1 prose-code:py-0.5 prose-code:rounded-radius-sm prose-pre:bg-surface prose-pre:text-on-surface prose-pre:border prose-pre:border-border">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
