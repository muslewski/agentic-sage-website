// Presentation-layer syntax highlighter for the demo terminal. The snapshot
// render() functions stay plain-text mirrors of the real CLI; color is a view
// concern applied here. highlight(line) → [{ text, cls }] where cls is one of
// the hero's palette classes ('' = inherit the line's base color).
//
// This rule table is the portable semantic spec: lib/color.mjs in the real
// agentic-sage repo maps the SAME token kinds → ANSI, so a real `sage board`
// renders identically. Keep the two in lockstep.

// line kind → base color for tokens that match no rule
function lineKind(line) {
  if (/^(SAGE |usage:)/.test(line)) return 'head'
  if (/^✨/.test(line)) return 'aphorism'
  if (/^sage:?\b/.test(line)) return 'quip'
  return 'body'
}
const BASE = { head: 'c-cmd', aphorism: 'c-olive', quip: 'c-cmd', body: '' }

// token → palette class, or null to inherit the line base. First match wins.
function tokenClass(tok) {
  if (/^(active|dirty)$/.test(tok)) return 'c-gold'
  if (/^idle$/.test(tok)) return 'c-olive'
  if (/^done$/.test(tok)) return 'c-cyan'
  if (/^(dead|closed)$/.test(tok)) return 'c-err'
  if (/^(clean|none|free)$/.test(tok)) return 'c-dim'
  if (/^[●✓✨]$/u.test(tok)) return 'c-olive'
  if (/[⚠🟡✎]/u.test(tok)) return 'c-gold' // warn / uncommitted
  if (/^✗$/u.test(tok)) return 'c-err'
  if (/^⬜$/u.test(tok)) return 'c-dim'
  if (/^fresh$/.test(tok)) return 'c-olive' // handoff buckets
  if (/^(aging|stale)$/.test(tok)) return 'c-gold'
  if (/^sage:?$/.test(tok)) return 'c-olive' // the judge speaking / the binary
  if (/^sesh-/.test(tok)) return 'c-cmd'
  if (/^\d+%$/.test(tok)) return 'c-cyan'
  if (/^\d+[fmhd]$/.test(tok)) return 'c-dim'
  if (/^ago$/.test(tok)) return 'c-dim'
  // dirs (end "/"), globs (have "*"), or file paths ("/…​.ext") — NOT branches
  if (/\*/.test(tok) || /\/$/.test(tok) || /\/[^/]*\.\w+$/.test(tok)) return 'c-dim'
  if (/^[↳•·—@]/u.test(tok)) return 'c-dim'
  return null
}

export function highlight(line) {
  const base = BASE[lineKind(line)]
  // split on whitespace runs but KEEP them, so monospace alignment survives
  return String(line)
    .split(/(\s+)/)
    .map((p) => {
      if (p === '' || /^\s+$/.test(p)) return { text: p, cls: '' }
      return { text: p, cls: tokenClass(p) ?? base }
    })
}
