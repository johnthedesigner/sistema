import { SITE_URL } from '../site-url'
import { loadCatalog, type Catalog } from './load'
import type { RenderContext } from './render'

/** Render context for the current build: the site origin plus the loaded catalog. */
export function buildContext(catalog: Catalog = loadCatalog()): RenderContext {
  return { base: SITE_URL, plays: catalog.playById, rules: catalog.ruleById }
}

export function textResponse(body: string): Response {
  return new Response(body, { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
