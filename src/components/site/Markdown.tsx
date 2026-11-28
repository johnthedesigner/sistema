import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ReactNode } from 'react'
import { headingSlug } from '@/lib/content/parse'
import { parseSpecimen } from '@/lib/guide-specimen'
import { GuideSpecimenView } from './Specimen'

function text(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(text).join('')
  if (node && typeof node === 'object' && 'props' in node) return text((node as { props: { children?: ReactNode } }).props.children)
  return ''
}

/** Fenced ```specimen blocks become live specimens; other code blocks stay as they are. */
function Pre({ children, ...rest }: { children?: ReactNode }) {
  const child = Array.isArray(children) ? children[0] : children
  const props = (child && typeof child === 'object' && 'props' in child ? (child as { props: { className?: string; children?: ReactNode } }).props : undefined)
  if (props?.className?.includes('language-specimen')) return <GuideSpecimenView spec={parseSpecimen(text(props.children))} />
  return <pre {...rest}>{children}</pre>
}

/**
 * Markdown with heading ids that match the anchors plays cite (headingSlug).
 * compact: for a short item set inside a page (an opinion): its headings render as
 * small labels with no ids, since the same headings repeat from item to item.
 */
export function Markdown({ children, compact }: { children: string; compact?: boolean }) {
  const heading = (Tag: 'h2' | 'h3' | 'h4') =>
    compact
      ? function H({ children: c }: { children?: ReactNode }) {
          return <h4 className="!text-label !font-sans !font-semibold !text-on-surface !mt-5 !mb-1">{c}</h4>
        }
      : function H({ children: c }: { children?: ReactNode }) {
          return <Tag id={headingSlug(text(c))} className="scroll-mt-24">{c}</Tag>
        }
  return (
    <div className="prose max-w-none prose-headings:font-serif prose-headings:font-semibold prose-h2:text-heading-lg prose-h3:text-heading-sm prose-h3:font-sans prose-p:text-body prose-li:text-body prose-a:text-link prose-a:no-underline hover:prose-a:underline prose-code:before:content-none prose-code:after:content-none prose-code:bg-surface-hover prose-code:px-1 prose-code:py-0.5 prose-code:rounded-radius-sm prose-code:font-normal prose-pre:bg-surface-raised prose-pre:text-on-surface prose-pre:rounded-radius-lg prose-th:text-label prose-th:font-sans prose-td:text-body-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ h2: heading('h2'), h3: heading('h3'), h4: heading('h4'), pre: Pre }}>
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
