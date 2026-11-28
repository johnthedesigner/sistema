/**
 * The prompt box's options: start, audit, and update (D42), and update's routes (D43), each with the prompt it puts in the box. Built on the
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

/** Short labels and fill-in lines for update's routes, in the order they're offered. The first is selected by default (D43). */
const ROUTE_TEXT: Record<string, { label: string; line: string }> = {
  'document-the-system': { label: 'Document the system', line: 'I want to document the system: [Storybook, a page in the app, or not sure]' },
  'add-component': { label: 'Add a component', line: 'I want to add a component: [describe it]' },
  'build-a-page': { label: 'Build a page or screen', line: 'I want to build a page: [which one]' },
  'add-mode': { label: 'Add a theme or mode', line: 'I want to add a mode: [dark theme, compact density, or reduced motion]' },
  'bring-in-existing-colors': { label: 'Bring in existing colors', line: 'I want to bring in existing colors from: [where they are]' },
  'change-a-decision': { label: 'Change a decision', line: 'I want to change an approved decision: [what to change]' },
  'audit-component': { label: 'Audit a component', line: 'I want to audit a component: [which one]' },
  'audit-accessibility': { label: 'Audit accessibility', line: 'I want to audit accessibility.' },
  'audit-token-coverage': { label: 'Audit token use', line: 'I want to audit how tokens are used.' },
  'review-the-system': { label: 'Review the system', line: 'I want to review the system.' },
  'plan-next-iteration': { label: 'Plan the next round', line: 'I want to plan the next round.' },
  'not-sure': { label: 'Not sure yet', line: "I'm not sure what to do next. Look at the system and suggest something." },
}

/** The default route under update (D43). */
export const DEFAULT_ROUTE = 'route.document-the-system'

export function promptOptions(): { suggestions: PromptOption[]; routes: PromptOption[] } {
  const c = catalog()
  const sessionPrompt = workflowPrompt('workflow.session')
  const suggestions: PromptOption[] = [
    { id: 'workflow.start', kind: 'workflow', label: 'Start a design system', description: 'For a new product, or a UI with little to keep.', prompt: workflowPrompt('workflow.start') },
    { id: 'workflow.audit', kind: 'workflow', label: 'Audit what I have', description: 'See what’s consistent, what fails, and what’s missing, before anything changes.', prompt: workflowPrompt('workflow.audit') },
    { id: 'workflow.session', kind: 'workflow', label: 'Update my system', description: 'Add, change, or check something in a system Sistema set up.', prompt: sessionPrompt },
  ]
  const session = c.workflowById.get('workflow.session')!
  const ids = Object.keys(session.routes ?? {})
  const order = [...Object.keys(ROUTE_TEXT).filter(id => ids.includes(id)), ...ids.filter(id => !(id in ROUTE_TEXT))]
  const routes: PromptOption[] = order.map(id => {
    const r = session.routes![id]
    const text = ROUTE_TEXT[id] ?? { label: r.title, line: `I want to: ${r.title.toLowerCase()}` }
    return { id: `route.${id}`, kind: 'route', label: text.label, prompt: `${sessionPrompt}\n${text.line}` }
  })
  return { suggestions, routes }
}
