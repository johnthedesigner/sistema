/**
 * The prompt box's options (site-structure.md section 2): three suggestions and
 * the session routes, each with the prompt it puts in the box. Built on the
 * server from workflow and route data, so labels follow the content.
 */
import { catalog, workflowPrompt } from './site'

export interface PromptOption {
  id: string
  kind: 'workflow' | 'route'
  label: string
  description?: string
  prompt: string
}

/** Short labels and fill-in lines for the routes row. */
const ROUTE_TEXT: Record<string, { label: string; line: string }> = {
  'add-component': { label: 'Add a component', line: 'I want to add a component: [describe it]' },
  'add-mode': { label: 'Add a theme or mode', line: 'I want to add a mode: [dark theme, compact density, or reduced motion]' },
  'bring-in-existing-colors': { label: 'Bring in existing colors', line: 'I want to bring in existing colors from: [where they are]' },
  'audit-component': { label: 'Audit a component', line: 'I want to audit a component: [which one]' },
  'audit-accessibility': { label: 'Audit accessibility', line: 'I want to audit accessibility.' },
  'audit-token-coverage': { label: 'Audit token use', line: 'I want to audit how tokens are used.' },
  'change-a-decision': { label: 'Change a decision', line: 'I want to change an approved decision: [what to change]' },
  'review-the-system': { label: 'Review the system', line: 'I want to review the system.' },
  'plan-next-iteration': { label: 'Plan the next round', line: 'I want to plan the next round.' },
}

export function promptOptions(): { suggestions: PromptOption[]; routes: PromptOption[] } {
  const c = catalog()
  const start = c.workflowById.get('workflow.start')!
  const session = c.workflowById.get('workflow.session')!
  const startPrompt = workflowPrompt(start.id)
  const sessionPrompt = workflowPrompt(session.id)
  const suggestions: PromptOption[] = [
    { id: 'workflow.start', kind: 'workflow', label: 'Start a design system', description: 'From nothing, or from what you have.', prompt: startPrompt },
    { id: 'workflow.start.existing', kind: 'workflow', label: 'I already have a design system', description: 'Same prompt. It keeps what you have.', prompt: startPrompt },
    { id: 'workflow.session', kind: 'workflow', label: 'Work on my system', description: 'Components, themes, audits, and what’s next.', prompt: sessionPrompt },
  ]
  const routes: PromptOption[] = Object.entries(session.routes ?? {}).map(([id, r]) => {
    const text = ROUTE_TEXT[id] ?? { label: r.title, line: `I want to: ${r.title.toLowerCase()}` }
    return { id: `route.${id}`, kind: 'route', label: text.label, prompt: `${sessionPrompt}\n${text.line}` }
  })
  return { suggestions, routes }
}
