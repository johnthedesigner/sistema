import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const EXEMPLARS_ROOT = path.join(process.cwd(), '_meta', 'exemplars')

export interface ExemplarFile {
  play_slug: string
  stage: number
  created: string
  quality_notes: string
  title?: string
  input?: Record<string, string>
  body: string
}

function walkDir(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkDir(full))
    } else if (entry.name.endsWith('.md')) {
      files.push(full)
    }
  }
  return files
}

function parseExemplar(filePath: string): ExemplarFile | null {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  if (!data.play_slug) return null
  return {
    play_slug: data.play_slug,
    stage: data.stage,
    created: data.created,
    quality_notes: data.quality_notes ?? '',
    title: data.title,
    input: data.input ?? undefined,
    body: content.trim(),
  }
}

export function loadExemplar(playSlug: string): ExemplarFile | null {
  if (!fs.existsSync(EXEMPLARS_ROOT)) return null
  for (const filePath of walkDir(EXEMPLARS_ROOT)) {
    const ex = parseExemplar(filePath)
    if (ex?.play_slug === playSlug) return ex
  }
  return null
}

export function loadExemplars(playSlug: string): ExemplarFile[] {
  if (!fs.existsSync(EXEMPLARS_ROOT)) return []
  const results: ExemplarFile[] = []
  for (const filePath of walkDir(EXEMPLARS_ROOT)) {
    const ex = parseExemplar(filePath)
    if (ex?.play_slug === playSlug) results.push(ex)
  }
  return results
}
