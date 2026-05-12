import { type NextRequest, NextResponse } from 'next/server'
import { KB_CATEGORIES, type KBCategory, listSystems, listStubsForSystem, readRawContent } from '@/lib/kb'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ category: string; slug: string }> }
) {
  const { category, slug } = await params

  if (!KB_CATEGORIES.includes(category as KBCategory)) {
    return new NextResponse('Not found', { status: 404 })
  }
  const cat = category as KBCategory

  const systems = listSystems(cat)
  if (!systems.includes(slug)) {
    return new NextResponse('Not found', { status: 404 })
  }

  const topicsParam = req.nextUrl.searchParams.get('topics')

  let topics: string[]
  if (topicsParam) {
    topics = topicsParam.split(',').map(t => t.trim()).filter(Boolean)
  } else {
    // Default: all guidance stubs first, then design-md/DESIGN
    const allStubs = listStubsForSystem(slug, cat)
    const guidanceTopics = allStubs
      .filter(parts => parts[0] === 'guidance')
      .map(parts => parts.join('/'))
    const designMdTopics = allStubs
      .filter(parts => parts[0] === 'design-md' && parts[parts.length - 1] === 'DESIGN')
      .map(parts => parts.join('/'))
    topics = [...guidanceTopics, ...designMdTopics]
  }

  const skipped: string[] = []
  const sections: string[] = []

  for (const topic of topics) {
    const stubPath = `kb/${category}/${slug}/${topic}`
    const content = readRawContent(stubPath)
    if (content === null) {
      skipped.push(topic)
      continue
    }
    sections.push(`## ${topic}\n\n${content}`)
  }

  let output = ''
  if (skipped.length > 0) {
    output += `<!-- skipped (stub not found): ${skipped.join(', ')} -->\n\n`
  }
  output += sections.join('\n\n---\n\n')

  return new NextResponse(output, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
