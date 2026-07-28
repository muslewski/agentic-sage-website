import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseUsageCommands, diffCommands } from '../src/demo/usage-diff.js'

const USAGE = `usage: sage <command>
  board                roster of this repo's sessions
  fleet                one-line nearest-neighbour summary
  territory <glob…>    who else claims/touches these paths (pre-flight)
  on | off             enable/disable SAGE globally
  backlog              rows × live sessions
  backlog claim <row>  register THIS session's backlog row`

test('parseUsageCommands extracts top-level command tokens', () => {
  const cmds = parseUsageCommands(USAGE)
  assert.ok(cmds.includes('board'))
  assert.ok(cmds.includes('territory'))
  assert.ok(cmds.includes('on'))
  assert.ok(cmds.includes('off'))
  assert.ok(cmds.includes('backlog'))
  // sub-usages collapse to their head command; no duplicates
  assert.equal(cmds.filter((c) => c === 'backlog').length, 1)
  // the literal "usage:" header line is not a command
  assert.ok(!cmds.includes('usage:'))
})

test('diffCommands reports added and removed', () => {
  const d = diffCommands(['board', 'fleet'], ['board', 'territory'])
  assert.deepEqual(d.added, ['territory'])
  assert.deepEqual(d.removed, ['fleet'])
})

test('parseUsageCommands ignores harness enums inside brackets', () => {
  const usage = `usage: sage <command>
  judge run [--auto|--fleet|--repo] [--harness auto|grok|claude|none]
            [--once] [--takeover] [--print-only]  start live judge
  on | off             enable/disable SAGE globally
  board [--watch] [--wide|-w]  roster`
  const cmds = parseUsageCommands(usage)
  assert.ok(cmds.includes('judge'))
  assert.ok(cmds.includes('on'))
  assert.ok(cmds.includes('off'))
  assert.ok(cmds.includes('board'))
  // must NOT invent top-level verbs from option lists
  assert.ok(!cmds.includes('grok'))
  assert.ok(!cmds.includes('claude'))
  assert.ok(!cmds.includes('none'))
  assert.ok(!cmds.includes('auto'))
  assert.ok(!cmds.includes('wide'))
})

test('snapshot COMMANDS match sibling agentic-sage USAGE (no drift)', async () => {
  const fs = await import('node:fs')
  const path = await import('node:path')
  const { fileURLToPath } = await import('node:url')
  const { COMMANDS } = await import('../src/demo/cli-snapshot.js')
  const sibling = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../agentic-sage/bin/sage')
  let src
  try {
    src = fs.readFileSync(sibling, 'utf8')
  } catch {
    // no sibling checkout in CI clone-of-site-only — skip
    return
  }
  const m = src.match(/const USAGE = `([\s\S]*?)`/)
  assert.ok(m, 'USAGE block present in sibling bin/sage')
  const real = parseUsageCommands(m[1])
  const snap = COMMANDS.map((c) => c.name).sort()
  const { added, removed } = diffCommands(snap, real)
  assert.deepEqual(added, [], `snapshot missing: ${added.join(', ')}`)
  assert.deepEqual(removed, [], `snapshot extra: ${removed.join(', ')}`)
})
