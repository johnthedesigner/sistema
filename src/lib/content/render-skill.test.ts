import { describe, expect, it } from 'vitest'
import { unzipSync, strFromU8 } from 'fflate'
import { loadCatalog } from './load'
import { buildContext } from './context'
import { renderSkill, skillName, skillPlays, skillZip } from './render-skill'

const c = loadCatalog()
const ctx = buildContext(c)

describe('agent skills', () => {
  it('gives every workflow a skill with valid front matter', () => {
    for (const w of c.workflows) {
      const name = skillName(w.id)
      expect(name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      expect(name.length).toBeLessThanOrEqual(64)
      const skill = renderSkill(w, c, ctx)['SKILL.md']
      const front = skill.match(/^---\nname: (.+)\ndescription: (.+)\n---\n/)
      expect(front?.[1]).toBe(name)
      const description = JSON.parse(front![2]) as string
      expect(description.length).toBeGreaterThan(0)
      expect(description.length).toBeLessThanOrEqual(1024)
      expect(skill.split('\n').length).toBeLessThan(500)
    }
  })

  it('points the outline at its own reference files, and carries every play it points to', () => {
    const w = c.workflowById.get('workflow.start')!
    const files = renderSkill(w, c, ctx)
    const refs = [...files['SKILL.md'].matchAll(/references\/([a-z0-9.-]+)\.md/g)].map(m => m[1]).filter(id => id !== '<id>')
    expect(refs.length).toBeGreaterThan(0)
    for (const id of refs) expect(files[`references/${id}.md`]).toBeDefined()
    expect(files['SKILL.md']).not.toMatch(/Fetch the play's instructions/)
    expect(files['SKILL.md']).not.toMatch(/If you cannot fetch URLs/)
    // A routing target named in a play comes along.
    expect(skillPlays(w, c)).toContain('color.map-existing')
  })

  it('zips the skill inside a folder named for it', () => {
    const w = c.workflowById.get('workflow.session')!
    const files = unzipSync(skillZip(w, c, ctx))
    const paths = Object.keys(files)
    expect(paths).toContain('sistema-session/SKILL.md')
    expect(paths.every(p => p.startsWith('sistema-session/'))).toBe(true)
    expect(strFromU8(files['sistema-session/SKILL.md'])).toMatch(/^---\nname: sistema-session\n/)
  })
})
