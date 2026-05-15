import { NextResponse } from 'next/server'
import { buildSearchIndex } from '@/lib/search-builder'

export const dynamic = 'force-static'

export function GET() {
  return NextResponse.json(buildSearchIndex())
}
