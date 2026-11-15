import { SITE_URL } from './site-url'

/**
 * The single place where {{sistema_url}} is resolved.
 *
 * Server-side loaders (plays, campaigns, KB files) call this before content
 * reaches any page, /raw, or /bundle response, so agents never see the
 * placeholder and no client code needs to resolve it.
 */
export function resolveSistemaUrl(text: string, base: string = SITE_URL): string {
  return text.replace(/\{\{sistema_url\}\}/g, base.replace(/\/+$/, ''))
}

/** User-fillable {{variable}} names in a prompt body, in order of first use. */
export function extractVariables(body: string): string[] {
  const names = [...body.matchAll(/\{\{([^}]+)\}\}/g)].map(m => m[1]).filter(v => v !== 'sistema_url')
  return [...new Set(names)]
}

/** "color_direction" -> "Color Direction" */
export function formatVariableLabel(name: string): string {
  return name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}
