import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { catalog, guideHref, playHref, playsForTopic, ruleHref, TOPIC_LABELS } from '@/lib/content/site'
import { Credits } from '@/components/site/Credits'
import { Markdown, headingsOf } from '@/components/site/Markdown'
import { GITHUB_BLOB } from '@/components/site/ui'
import { DocPage, type TocItem } from '@/components/site/DocPage'
import { KindLabel } from '@/components/site/icons'

export const dynamicParams = false

export function generateStaticParams() {
  return catalog().guides.map(g => ({ topic: g.topic, name: g.id.split('.')[2] }))
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string; name: string }> }): Promise<Metadata> {
  const { topic, name } = await params
  const g = catalog().guideById.get(`guide.${topic}.${name}`)
  return g ? { title: g.title, description: g.description } : {}
}

export default async function GuidePage({ params }: { params: Promise<{ topic: string; name: string }> }) {
  const { topic, name } = await params
  const c = catalog()
  const guide = c.guideById.get(`guide.${topic}.${name}`)
  if (!guide) notFound()

  const body = guide.body.replace(/^# .*\n+/, '')
  const plays = playsForTopic(guide.topic)
  const citing = c.plays.filter(p => p.topic !== guide.topic && p.knowledge.some(k => k.split('#')[0] === guide.id))
  const rules = c.rules.filter(r => r.id.startsWith(`${guide.topic}.`) || r.sources.some(s => s.split('#')[0] === guide.id))
  const related = guide.related.map(ref => ({ ref, g: c.guideById.get(ref.split('#')[0]) })).filter(x => x.g)

  // h2 sections with their h3 subsections, then the page's own closing sections.
  const toc: TocItem[] = []
  for (const h of headingsOf(body)) {
    if (h.level === 2) toc.push({ id: h.id, text: h.text, children: [] })
    else toc[toc.length - 1]?.children?.push({ id: h.id, text: h.text })
  }
  if (plays.length + citing.length) toc.push({ id: 'plays-that-use-this', text: 'Plays that use this' })
  if (rules.length) toc.push({ id: 'rules-for-this-topic', text: 'Rules for this topic' })
  if (related.length) toc.push({ id: 'builds-on', text: 'Builds on' })

  const closing = 'text-heading-md font-serif text-on-surface m-0 mb-3 scroll-mt-24'
  return (
    <DocPage
      crumbs={[{ label: 'Guides', href: '/guides' }, { label: TOPIC_LABELS[guide.topic], href: `/guides#${guide.topic}` }, { label: guide.title }]}
      raw={`/raw/guides/${topic}/${name}`}
      eyebrow={<KindLabel kind="guide" label="Guide" />}
      title={guide.title}
      lead={guide.description}
      meta={`Last reviewed ${guide.last_reviewed}`}
      toc={toc}
    >
      <article className="max-w-[760px]">
        {guide.note && <p className="text-body-sm text-on-surface-muted border-l-2 border-brand-yellow pl-3 mt-0 mb-8">{guide.note}</p>}
        <Markdown>{body}</Markdown>

        {(plays.length > 0 || citing.length > 0) && (
          <section className="mt-14 pt-8 border-t border-border">
            <h2 id="plays-that-use-this" className={closing}>Plays that use this</h2>
            <ul className="m-0 pl-5 list-disc text-body grid gap-1">
              {[...plays, ...citing].map(p => (
                <li key={p.id}>
                  <Link href={playHref(p.id)} className="text-link">{p.title}</Link>
                  <span className="text-on-surface-muted"> · {p.description}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        {rules.length > 0 && (
          <section className="mt-10">
            <h2 id="rules-for-this-topic" className={closing}>Rules for this topic</h2>
            <ul className="m-0 pl-5 list-disc text-body grid gap-1">
              {rules.map(r => (
                <li key={r.id}>
                  <Link href={ruleHref(r.id)} className="font-mono text-code text-link">{r.id}</Link>
                  <span className="text-on-surface-muted"> · {r.statement}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 id="builds-on" className={closing}>Builds on</h2>
            <ul className="m-0 pl-5 list-disc text-body grid gap-1">
              {related.map(({ ref, g }) => (
                <li key={ref}><Link href={guideHref(ref)} className="text-link">{g!.title}</Link></li>
              ))}
            </ul>
          </section>
        )}
        <Credits credits={guide.sources} sources={c.sourceById} />
        <p className="mt-8 text-body-sm"><a href={`${GITHUB_BLOB}/${guide.file}`} className="text-link no-underline">Edit on GitHub</a></p>
      </article>
    </DocPage>
  )
}
