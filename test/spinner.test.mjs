import { test } from 'node:test'
import assert from 'node:assert/strict'
import { SPINNER_FRAMES, SPINNER_INTERVAL_MS } from '../src/demo/spinner.js'
import { isActiveRow } from '../src/demo/mount.js'

// Locks the demo's spinner spec to the CLI's lib/spinner.mjs (identical there).
test('SPINNER_FRAMES is 10 dense single-cell braille frames', () => {
  assert.equal(SPINNER_FRAMES.length, 10)
  for (const f of SPINNER_FRAMES) assert.equal([...f].length, 1)
})

test('SPINNER_INTERVAL_MS is 100', () => {
  assert.equal(SPINNER_INTERVAL_MS, 100)
})

test('isActiveRow matches an active board row only', () => {
  assert.ok(isActiveRow('● feat/auth ✎  active · 71%  src/auth/  fresh 8m  ↳M1'))
  assert.ok(!isActiveRow('● feat/loader   idle          data/      stale 3h')) // idle
  assert.ok(!isActiveRow('SAGE · acme-web · 3 sessions')) // header
  assert.ok(!isActiveRow('sage board')) // command echo
})
