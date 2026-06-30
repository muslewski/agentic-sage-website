import { test } from 'node:test'
import assert from 'node:assert/strict'
import { COMMANDS, commandByName, SOURCE_COMMIT } from '../src/demo/cli-snapshot.js'
import { SCENARIOS } from '../src/demo/scenarios.js'

const s0 = SCENARIOS[0]

test('SOURCE_COMMIT is recorded', () => {
  assert.match(SOURCE_COMMIT, /^[0-9a-f]{7,}$/)
})

test('board renders a branch-led balanced header + rows', () => {
  const out = commandByName('board').render([], s0)
  assert.ok(out.startsWith(`SAGE · ${s0.repoId} · ${s0.sessions.length} sessions`))
  assert.ok(out.includes('feat/auth-passkeys')) // branch is the identity, not the UUID
  assert.ok(!out.includes('sesh-12')) // session id no longer shown on the board
  assert.ok(out.includes('active'))
  assert.ok(out.includes('✎')) // a dirty session is marked
  assert.ok(out.includes('src/')) // zone (where they work) is shown
})

test('board marks a dead session that still holds a backlog row as orphaned', () => {
  const ml = SCENARIOS[2] // ml-pipeline has sesh-47 dead holding M3
  const out = commandByName('board').render([], ml)
  const deadLine = out.split('\n').find((l) => l.includes('feat/data-loader-v2'))
  assert.ok(deadLine.includes('dead'))
  assert.ok(deadLine.includes('↳M3'))
  assert.ok(deadLine.includes('⚠'))
})

test('territory with no glob prints the real usage line', () => {
  const out = commandByName('territory').render([], s0)
  assert.equal(out, 'usage: sage territory <glob> [glob…]')
})

test('territory matches a claimed path', () => {
  const out = commandByName('territory').render(['src/auth/**'], s0)
  assert.ok(out.startsWith('SAGE territory · src/auth/**'))
  assert.ok(out.includes('feat/auth-passkeys'))
})

test('all three scenarios are internally coherent (holders are real sessions)', () => {
  for (const sc of SCENARIOS) {
    const ids = new Set(sc.sessions.map((s) => s.session_id))
    for (const r of sc.rows) for (const h of r.holders) assert.ok(ids.has(h), `${r.id} holder ${h}`)
  }
})
