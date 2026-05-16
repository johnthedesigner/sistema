import { type NextRequest, NextResponse } from 'next/server'
import { KB_CATEGORIES, type KBCategory, readRawContent } from '@/lib/kb'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ category: string; slug: string; path: string[] }> }
) {
  const { category, slug, path } = await params
  const play = req.nextUrl.searchParams.get('play')
  const sid = req.nextUrl.searchParams.get('sid')
  if (play && sid) {
    const ua = req.headers.get('user-agent') ?? 'unknown'
    console.log(JSON.stringify({ event: 'raw_fetch', play, sid, path: `${category}/${slug}/${path.join('/')}`, ua, t: Date.now() }))
  }

  if (!KB_CATEGORIES.includes(category as KBCategory)) {
    return new NextResponse('Not found', { status: 404 })
  }

  // Strip .md from last segment if present
  const last = path[path.length - 1]
  const cleanLast = last.endsWith('.md') ? last.slice(0, -3) : last
  const cleanPath = [...path.slice(0, -1), cleanLast]

  const stubPath = `kb/${category}/${slug}/${cleanPath.join('/')}`
  const content = readRawContent(stubPath)

  if (content === null) {
    return new NextResponse('Not found', { status: 404 })
  }

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
