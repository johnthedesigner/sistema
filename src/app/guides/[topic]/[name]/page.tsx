import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { catalog, playHref, playsForTopic, ruleHref, TOPIC_LABELS } from '@/lib/content/site'
import { Markdown, headingsOf } from '@/components/site/Markdown'
import { AgentNote, Container, GITHUB_BLOB, RailBox, RailLink } from '@/components/site/ui'

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
  const toc = headingsOf(body).filter(h => h.level === 2)
  const plays = playsForTopic(guide.topic)
  const citing = c.plays.filter(p => p.topic !== guide.topic && p.knowledge.some(k => k.split('#')[0] === guide.id))
  const rules = c.rules.filter(r => r.id.startsWith(`${guide.topic}.`) || r.sources.some(s => s.split('#')[0] === guide.id))

  return (
    <main>
      <Container>
        <nav className="flex items-center gap-2 text-[12.5px] text-on-surface-muted mb-4">
          <Link href="/guides" className="no-underline text-on-surface-muted hover:text-on-surface">Guides</Link>
          <span className="text-on-surface-subtle">/</span>
          <Link href={`/guides#${guide.topic}`} className="no-underline text-on-surface-muted hover:text-on-surface">{TOPIC_LABELS[guide.topic]}</Link>
        </nav>
        <AgentNote raw={`/raw/guides/${topic}/${name}`} />

        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-8 md:gap-12">
          <article className="min-w-0">
            <h1 className="font-serif font-medium text-on-surface m-0 mb-3 text-[28px] md:text-[40px]" style={{ lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              {guide.title}
            </h1>
            <p className="text-on-surface-muted font-serif m-0 mb-2" style={{ fontSize: 16, lineHeight: 1.55, maxWidth: 680 }}>
              {guide.description}
            </p>
            <p className="text-[12px] text-on-surface-subtle m-0 mb-6">Last reviewed {guide.last_reviewed}</p>
            {guide.note && (
              <p className="text-[13px] leading-[1.55] text-on-surface-muted border-l-2 pl-3 mb-6" style={{ borderColor: 'var(--color-brand-yellow)' }}>
                {guide.note}
              </p>
            )}
            <Markdown>{body}</Markdown>

            {(plays.length > 0 || citing.length > 0) && (
              <section className="mt-12 pt-6 border-t border-border">
                <h2 className="font-serif font-medium m-0 mb-3" style={{ fontSize: 20 }}>Plays that use this</h2>
                <ul className="m-0 pl-4 list-disc text-[14px] leading-[1.7]">
                  {[...plays, ...citing].map(p => (
                    <li key={p.id}>
                      <Link href={playHref(p.id)} className="text-primary">{p.title}</Link>
                      <span className="text-on-surface-muted"> · {p.description}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {rules.length > 0 && (
              <section className="mt-8">
                <h2 className="font-serif font-medium m-0 mb-3" style={{ fontSize: 20 }}>Rules for this topic</h2>
                <ul className="m-0 pl-4 list-disc text-[14px] leading-[1.7]">
                  {rules.map(r => (
                    <li key={r.id}>
                      <Link href={ruleHref(r.id)} className="font-mono text-[12.5px] text-primary">{r.id}</Link>
                      <span className="text-on-surface-muted"> · {r.statement}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <p className="mt-8 text-[12.5px]"><a href={`${GITHUB_BLOB}/${guide.file}`} className="text-primary no-underline">Edit on GitHub</a></p>
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
