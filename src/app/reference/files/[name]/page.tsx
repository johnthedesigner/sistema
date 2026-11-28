import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { catalog } from '@/lib/content/site'
import { Markdown, headingsOf } from '@/components/site/Markdown'
import { Credits } from '@/components/site/Credits'
import { GITHUB_BLOB } from '@/components/site/ui'
import { DocPage } from '@/components/site/DocPage'
import { KindLabel } from '@/components/site/icons'

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
    <DocPage
      crumbs={[{ label: 'Reference', href: '/reference' }, { label: 'File formats' }, { label: file.title }]}
      raw={`/raw/files/${name}`}
      eyebrow={<KindLabel kind="file" label="File format" />}
      title={file.title}
      lead={file.description}
      meta={`Last reviewed ${file.last_reviewed}`}
      toc={toc.map(h => ({ id: h.id, text: h.text }))}
    >
      <article className="max-w-[760px]">
        <Markdown>{file.body}</Markdown>
        <Credits credits={file.sources} sources={c.sourceById} />
        <p className="mt-8 text-body-sm"><a href={`${GITHUB_BLOB}/${file.file}`} className="text-link no-underline">Edit on GitHub</a></p>
      </article>
    </DocPage>
  )
}

