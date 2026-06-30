import { test } from 'node:test'
import assert from 'node:assert/strict'
import { highlight } from '../src/demo/highlight.js'

const clsOf = (line, word) => highlight(line).find((t) => t.text === word)?.cls

test('status words map to palette colors', () => {
  const line = 'sesh-12  active  feat/auth  dirty  2f  fresh 8m ago  62%'
  assert.equal(clsOf(line, 'active'), 'c-gold')
  assert.equal(clsOf(line, 'dirty'), 'c-gold')
  assert.equal(clsOf(line, 'sesh-12'), 'c-cmd')
  assert.equal(clsOf(line, '62%'), 'c-cyan')
})

test('idle/done/dead get distinct colors', () => {
  assert.equal(clsOf('x idle y', 'idle'), 'c-olive')
  assert.equal(clsOf('x done y', 'done'), 'c-cyan')
  assert.equal(clsOf('x dead y', 'dead'), 'c-err')
})

test('header line tokens default to cream, separators dim', () => {
  const line = 'SAGE board · acme-web · 3 session(s)'
  assert.equal(clsOf(line, 'board'), 'c-cmd')
  assert.equal(clsOf(line, '·'), 'c-dim')
})

test('glyphs colorize: check ok, warn, bad', () => {
  assert.equal(clsOf('  ✓ sage home — ok', '✓'), 'c-olive')
  assert.equal(clsOf('  ✗ broken — bad', '✗'), 'c-err')
  assert.equal(clsOf('  M3 🟡 thing ⚠ note', '⚠'), 'c-gold')
})

test('paths and globs are dimmed', () => {
  assert.equal(clsOf('claimed src/auth/** here', 'src/auth/**'), 'c-dim')
  assert.equal(clsOf('zone pipelines/ here', 'pipelines/'), 'c-dim') // trailing-slash dir
})

test('a branch (has a slash but is not a path) is NOT dimmed', () => {
  // body line → branch inherits base (''), it must not be mistaken for a path
  assert.equal(clsOf('● feat/distributed-training active', 'feat/distributed-training'), '')
})

test('balanced-board markers colorize: ✎ gold, fresh olive', () => {
  assert.equal(clsOf('● feat/x ✎  active  src/  fresh 21m', '✎'), 'c-gold')
  assert.equal(clsOf('● feat/x ✎  active  src/  fresh 21m', 'fresh'), 'c-olive')
})

test('sage: quip prefix is olive', () => {
  assert.equal(clsOf('sage: this is a demo of SAGE, not cats.', 'sage:'), 'c-olive')
})

test('whitespace is preserved as empty-class tokens (alignment intact)', () => {
  const toks = highlight('a   b')
  assert.equal(toks.map((t) => t.text).join(''), 'a   b')
  assert.ok(toks.some((t) => /^\s+$/.test(t.text) && t.cls === ''))
})
