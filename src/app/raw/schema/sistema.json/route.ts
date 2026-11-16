import { z } from 'zod'
import { SistemaState } from '@/lib/content/schema'

export const dynamic = 'force-static'

/** JSON Schema for sistema.json, generated from the Zod schema so the two can't drift. */
export function GET() {
  const schema = {
    ...z.toJSONSchema(SistemaState, { io: 'input' }),
    title: 'sistema.json',
    description: "State file for a project following a Sistema workflow. See the workflow starter for how each field is used.",
  }
  return new Response(JSON.stringify(schema, null, 2) + '\n', {
    headers: { 'Content-Type': 'application/schema+json; charset=utf-8' },
  })
}
