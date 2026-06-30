import { test } from 'node:test'
import assert from 'node:assert/strict'
import { COMMANDS, commandByName, SOURCE_COMMIT } from '../src/demo/cli-snapshot.js'
import { SCENARIOS } from '../src/demo/scenarios.js'

const s0 = SCENARIOS[0]

test('SOURCE_COMMIT is recorded', () => {
  assert.match(SOURCE_COMMIT, /^[0-9a-f]{7,}$/)
})

test('board renders the real header + one row per session', () => {
  const out = commandByName('board').render([], s0)
  assert.ok(out.startsWith(`SAGE board · ${s0.repoId} · ${s0.sessions.length} session(s)`))
  assert.ok(out.includes('sesh-12'))
  assert.ok(out.includes('active'))
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
