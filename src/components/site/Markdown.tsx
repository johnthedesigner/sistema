import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ReactNode } from 'react'
import { headingSlug } from '@/lib/content/parse'

function text(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(text).join('')
  if (node && typeof node === 'object' && 'props' in node) return text((node as { props: { children?: ReactNode } }).props.children)
  return ''
}

/** Markdown with heading ids that match the anchors plays cite (headingSlug). */
export function Markdown({ children }: { children: string }) {
  const heading = (Tag: 'h2' | 'h3' | 'h4') =>
    function H({ children: c }: { children?: ReactNode }) {
      return <Tag id={headingSlug(text(c))} className="scroll-mt-24">{c}</Tag>
    }
  return (
    <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-a:text-primary prose-code:before:content-none prose-code:after:content-none prose-code:bg-surface prose-code:px-1 prose-code:py-0.5 prose-code:rounded-radius-sm prose-pre:bg-surface prose-pre:text-on-surface prose-pre:border prose-pre:border-border">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ h2: heading('h2'), h3: heading('h3'), h4: heading('h4') }}>
        {children}
      </ReactMarkdown>
    </div>
  )
}

/** The h2 and h3 headings of a markdown document, for an "On this page" list. */
export function headingsOf(markdown: string): Array<{ level: 2 | 3; text: string; id: string }> {
  const out: Array<{ level: 2 | 3; text: string; id: string }> = []
  let inFence = false
  for (const line of markdown.split('\n')) {
    if (/^```/.test(line)) inFence = !inFence
    if (inFence) continue
    const m = line.match(/^(##|###)\s+(.+?)\s*$/)
    if (m) out.push({ level: m[1].length as 2 | 3, text: m[2].replace(/[`*_]/g, ''), id: headingSlug(m[2]) })
  }
  return out
}
