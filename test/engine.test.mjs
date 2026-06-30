import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createEngine } from '../src/demo/engine.js'

test('run sage board returns board output lines', () => {
  const e = createEngine(0)
  const r = e.run('sage board')
  assert.ok(r.lines.join('\n').startsWith('SAGE board · acme-web'))
})

test('bare sage prints USAGE', () => {
  const e = createEngine(0)
  assert.ok(e.run('sage').lines.join('\n').startsWith('usage: sage <command>'))
})

test('unknown sage subcommand prints USAGE', () => {
  const e = createEngine(0)
  assert.ok(e.run('sage wat').lines.join('\n').startsWith('usage: sage <command>'))
})

test('sage on flips enabled and board reflects it', () => {
  const e = createEngine(0)
  e.run('sage off')
  assert.equal(e.state.enabled, false)
  assert.ok(e.run('sage doctor').lines.join('\n').includes('OFF'))
})

test('cd prints an aphorism, never moves', () => {
  const e = createEngine(0)
  const out = e.run('cd /etc').lines.join('\n')
  assert.ok(out.length > 0 && !out.includes('SAGE board'))
})

test('rm prints a read-only quip', () => {
  const e = createEngine(0)
  assert.match(e.run('rm -rf /').lines.join('\n'), /judge|read-only|nice try/i)
})

test('clear signals a wipe', () => {
  const e = createEngine(0)
  assert.equal(e.run('clear').clear, true)
})

test('cat returns a cats pun, not command-not-found', () => {
  const e = createEngine(0)
  const out = e.run('cat package.json').lines.join('\n')
  assert.match(out, /cat/i)
  assert.doesNotMatch(out, /command not found/i)
})

test('unknown command gets a sage-flavored quip, not bare command-not-found', () => {
  const e = createEngine(0)
  const out = e.run('vim').lines.join('\n')
  assert.match(out, /sage/i)
  assert.doesNotMatch(out, /command not found/i)
})

test('complete gives ghost suffix for a prefix', () => {
  const e = createEngine(0)
  assert.equal(e.complete('sage boa'), 'rd')
  assert.equal(e.complete('sage board'), '')
})

test('randomize swaps scenario', () => {
  const e = createEngine(0)
  const before = e.state.repoId
  e.randomize()
  assert.notEqual(e.state.repoId, before)
})

test('history walks previous inputs', () => {
  const e = createEngine(0)
  e.run('sage board')
  e.run('sage fleet')
  assert.equal(e.history(-1), 'sage fleet')
  assert.equal(e.history(-1), 'sage board')
})
