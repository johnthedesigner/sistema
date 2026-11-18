import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { catalog } from '@/lib/content/site'
import { Markdown, headingsOf } from '@/components/site/Markdown'
import { Credits } from '@/components/site/Credits'
import { AgentNote, Container, GITHUB_BLOB, RailBox, RailLink } from '@/components/site/ui'

export const dynamicParams = false

export function generateStaticParams() {
  return catalog().files.map(f => ({ name: f.name }))
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params
  const f = catalog().fileById.get(`file.${name}`)
  return f ? { title: f.title, description: f.description } : {}
}

export default async function FileFormatPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const c = catalog()
  const file = c.fileById.get(`file.${name}`)
  if (!file) notFound()
  const toc = headingsOf(file.body).filter(h => h.level === 2)

  return (
    <main>
      <Container>
        <nav className="flex items-center gap-2 text-[12.5px] text-on-surface-muted mb-4">
          <Link href="/reference" className="no-underline text-on-surface-muted hover:text-on-surface">Reference</Link>
          <span className="text-on-surface-subtle">/</span>
          <span>File formats</span>
        </nav>
        <AgentNote raw={`/raw/files/${name}`} />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-8 md:gap-12">
          <article className="min-w-0">
            <h1 className="font-serif font-medium text-on-surface m-0 mb-3 text-[28px] md:text-[40px]" style={{ lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              {file.title}
            </h1>
            <p className="text-on-surface-muted font-serif m-0 mb-2" style={{ fontSize: 16, lineHeight: 1.55, maxWidth: 680 }}>
              {file.description}
            </p>
            <p className="text-[12px] text-on-surface-subtle m-0 mb-6">Last reviewed {file.last_reviewed}</p>
            <Markdown>{file.body}</Markdown>
            <Credits credits={file.sources} sources={c.sourceById} />
            <p className="mt-8 text-[12.5px]"><a href={`${GITHUB_BLOB}/${file.file}`} className="text-primary no-underline">Edit on GitHub</a></p>
          </article>
          {toc.length > 1 && (
            <aside className="hidden md:block md:sticky md:top-24 self-start">
              <RailBox title="On this page">
                {toc.map(h => (
                  <RailLink key={h.id} href={`#${h.id}`}>{h.text}</RailLink>
                ))}
              </RailBox>
            </aside>
          )}
        </div>
      </Container>
    </main>
  )
}
