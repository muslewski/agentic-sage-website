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
