// The committed snapshot of the agentic-sage CLI surface. The demo renders ONLY
// from here. Each render() mirrors the real lib/*.mjs renderer's text shape but
// reads from the in-browser Scenario instead of the filesystem. Keep COMMANDS'
// names in lockstep with the real USAGE (the dev drift plugin enforces this).

export const SOURCE_COMMIT = 'fe741b3'

const pad = (s, n) => String(s ?? '').padEnd(n).slice(0, n)
const live = (sc) => sc.sessions.filter((s) => s.liveness !== 'closed' && s.liveness !== 'dead')
const others = (sc) => sc.sessions.filter((s) => s.session_id !== sc.self)
const globRe = (g) => new RegExp('^' + g.replace(/[.]/g, '\\.').replace(/\*\*/g, ' ').replace(/\*/g, '[^/]*').replace(/ /g, '.*') + '$')
const matches = (glob, p) => globRe(glob).test(p) || globRe(p).test(glob)

// ── board ──  (mirror lib/board.mjs renderBoard — human-first "balanced" layout)
// branch is the identity (not the UUID); zone = where they work; status carries
// ctx; ✎ = uncommitted; ↳ = backlog row; ⚠ = a dead session still holds a row.
const dirOf = (g) => {
  const i = g.lastIndexOf('/')
  return i < 0 ? '' : g.slice(0, i + 1)
}
const zoneOf = (globs) => {
  const dirs = [...new Set((globs || []).map(dirOf).filter(Boolean))]
  if (!dirs.length) return ''
  return dirs.length === 1 ? dirs[0] : `${dirs[0]} +${dirs.length - 1}`
}
const stripAgo = (s) => String(s || '').replace(/\s*ago$/, '')
const padR = (s, n) => String(s ?? '').padEnd(n) // no truncation (n = max width)

function renderBoard(_args, sc) {
  const n = sc.sessions.length
  const head = `SAGE · ${sc.repoId} · ${n} session${n === 1 ? '' : 's'}`
  if (!n) return `${head}\n  (no sessions)`
  const rows = sc.sessions.map((s) => {
    const dead = s.liveness === 'dead' || s.liveness === 'closed'
    return {
      id: `${s.branch || s.session_id}${s.dirty ? ' ✎' : ''}`,
      status: s.liveness + (s.ctxPct != null ? ` · ${s.ctxPct}%` : ''),
      zone: zoneOf(s.touched_globs),
      when: stripAgo(s.handoff),
      tail: `${s.claimed_row ? `↳${s.claimed_row}` : ''}${dead && s.claimed_row ? ' ⚠' : ''}`,
    }
  })
  const w = (k) => Math.max(...rows.map((r) => r[k].length))
  const wId = w('id'), wSt = w('status'), wZo = w('zone'), wWh = w('when')
  const lines = rows.map((r) =>
    `● ${padR(r.id, wId)}  ${padR(r.status, wSt)}  ${padR(r.zone, wZo)}  ${padR(r.when, wWh)}${r.tail ? `  ${r.tail}` : ''}`.replace(/\s+$/, ''),
  )
  return [head, '', ...lines].join('\n')
}

// ── fleet ──  (mirror lib/fleet.mjs fleetLine)
function renderFleet(_args, sc) {
  const o = others(sc).filter((s) => s.liveness !== 'closed' && s.liveness !== 'dead')
  if (!o.length) return 'sage: no other sessions'
  const n = o[0]
  const p = (n.touched_globs && n.touched_globs[0]) || '—'
  return `sage: ${o.length} live · nearest ${n.branch || n.session_id} touches ${p}`
}

// ── territory ──  (mirror lib/territory.mjs renderTerritory)
function renderTerritory(args, sc) {
  if (!args.length) return 'usage: sage territory <glob> [glob…]'
  const head = `SAGE territory · ${args.join(' ')}`
  const hits = []
  for (const s of others(sc)) {
    for (const q of args) {
      const tHit = (s.touched_globs || []).find((g) => matches(q, g))
      const cHit = (s.claimed_globs || []).find((g) => matches(q, g))
      const hit = tHit ?? cHit
      if (!hit) continue
      hits.push(`  ${pad(s.branch || s.session_id, 18)} ${pad(tHit ? 'touched' : 'claimed', 8)} ${pad(s.liveness, 8)} ${hit}`)
    }
  }
  if (!hits.length) return `${head}\n  clear — no other session claims or touches this`
  return [head, ...hits].join('\n')
}

// ── why-diverged ──  (mirror lib/territory.mjs renderWhyDiverged)
function renderWhyDiverged(args, sc) {
  if (!args.length) return 'usage: sage why-diverged <file>'
  const file = args[0]
  const head = `SAGE why-diverged · ${file}`
  const rows = []
  for (const s of others(sc)) {
    const inT = (s.touched_globs || []).some((g) => matches(g, file))
    const inC = (s.claimed_globs || []).some((g) => matches(g, file))
    if (!inT && !inC) continue
    rows.push(`  ${pad(s.branch || s.session_id, 18)} ${pad(inT ? 'touched' : 'claimed', 8)} ${pad(s.liveness, 8)}`)
  }
  if (!rows.length) return `${head}\n  no other session touches this file`
  return [head, ...rows].join('\n')
}

// ── merge-brief ──  (mirror lib/territory.mjs renderMergeBrief)
function renderMergeBrief(_args, sc) {
  const byPath = new Map()
  for (const s of others(sc)) {
    for (const p of s.touched_globs || []) {
      if (!byPath.has(p)) byPath.set(p, [])
      byPath.get(p).push(s.branch || s.session_id)
    }
  }
  const contested = [...byPath.entries()].filter(([, who]) => who.length >= 2).sort((a, b) => a[0].localeCompare(b[0]))
  const head = `SAGE merge-brief · ${sc.repoId} · ${contested.length} contested path(s)`
  if (!contested.length) return `${head}\n  no contested paths — clear to merge`
  const blocks = contested.map(([p, who]) => `  ${p}\n    ${who.join(', ')}`)
  return [head, ...blocks].join('\n')
}

// ── backlog ──  (mirror lib/backlog.mjs renderBacklog)
const DRIFT_NOTE = {
  'held-but-open': 'held by a live session — mark 🟡',
  orphaned: 'holder is dead — reclaim or reset ⬜',
  'stale-open': 'marked 🟡 but no live session',
}
function renderBacklog(args, sc) {
  if (args[0] === 'claim') {
    return args[1] ? `sage: claimed backlog row ${args[1]} for ${sc.self}` : 'usage: sage backlog claim <row>'
  }
  const held = sc.rows.filter((r) => r.holders.some((h) => live(sc).find((s) => s.session_id === h)))
  const orphans = sc.rows.filter((r) => r.drift === 'orphaned').length
  const head = `SAGE backlog · ${sc.repoId} · ${sc.rows.length} row(s) · ${held.length} held · ${orphans} orphaned`
  const lines = []
  for (const r of sc.rows) {
    const liveHolders = r.holders.filter((h) => live(sc).find((s) => s.session_id === h))
    if (!liveHolders.length && r.drift === 'none') continue
    const who = liveHolders.length ? `held by ${liveHolders.join(', ')}` : 'free'
    const flag = r.drift !== 'none' ? `  ⚠ ${DRIFT_NOTE[r.drift]}` : ''
    lines.push(`  ${pad(r.id, 4)} ${pad(r.status, 2)} ${pad(r.mission, 22)} ${who}${flag}`)
  }
  return [head, ...lines].join('\n')
}

// ── doctor ──  (mirror lib/control.mjs renderDoctor)
function renderDoctor(_args, sc) {
  const checks = [
    { ok: true, name: 'sage home', detail: '~/.sage present' },
    { ok: true, name: 'emitter hook', detail: 'wired in settings.json' },
    { ok: sc.enabled, name: 'enabled', detail: sc.enabled ? 'ON (judging)' : 'OFF (sage on to enable)' },
    { ok: true, name: 'current repo', detail: sc.repoId },
    { ok: true, name: 'project adapter', detail: 'none (core-only — fine)' },
    { ok: true, name: 'token-forecast', detail: 'not configured (optional)' },
  ]
  const bad = checks.filter((c) => !c.ok).length
  return ['SAGE doctor', ...checks.map((c) => `  ${c.ok ? '✓' : '✗'} ${c.name} — ${c.detail}`), `  ${checks.length - bad} ok · ${bad} need attention`].join('\n')
}

// ── repos ──  (mirror lib/control.mjs listRepos — demo lists scenario repos)
function renderRepos(_args, sc) {
  const head = `SAGE repos · ${sc.repos.length}`
  return [head, ...sc.repos.map((r) => `  ${pad(r.repoId, 16)} ${pad(`${r.sessions} session(s)`, 14)} ${r.last}`)].join('\n')
}

// ── guard ──  (mirror lib/guard.mjs renderGuard; mutating sub-verbs handled in engine)
function renderGuard(args, sc) {
  const sub = args[0]
  if (sub === 'add' && args[1]) return `sage guard: added "${args[1]}" to the contested list`
  if (sub === 'rm' && args[1]) return `sage guard: removed "${args[1]}"`
  if (sub === 'on') return 'sage guard: armed (blocks matching edits)'
  if (sub === 'off') return 'sage guard: disarmed'
  const head = `SAGE guard · ${sc.guard.enabled ? 'armed (blocks matching edits)' : 'disarmed'}`
  if (!sc.guard.paths.length) return `${head}\n  (no contested paths — sage guard add <path>)`
  return [head, ...sc.guard.paths.map((p) => `  • ${p}`)].join('\n')
}

// ── statusline ──  (honest demo of an empty segment)
function renderStatusline(_args, _sc) {
  return '(statusline is empty unless a session is consulting SAGE)'
}

// ── mutating confirmations (engine applies the state change; these print) ──
const onRender = (_a, sc) => `sage: SAGE is now ${sc.enabled ? 'ON (judging enabled globally)' : 'OFF (judging frozen)'}`
const claimRender = (args, sc) => (args.length ? `sage: ${sc.self} claimed ${args.join(' ')}` : 'usage: sage claim <glob> [glob…]')
const linkRender = (args, sc) => (args[0] ? `sage: ${args[0]} link_state → ${args[1] || 'linked'}` : 'usage: sage link <sid> [state]')
const unlinkRender = (args) => (args[0] ? `sage: ${args[0]} marked unlinked (closed)` : 'usage: sage unlink <sid>')
const adapterRender = (args) => (args[0] === 'init' ? 'sage: scaffolded .sage/adapter.mjs (demo — nothing written to disk)' : 'usage: sage adapter init')

export const APHORISMS = [
  'The sage does not chase directories; the sage observes them.',
  'To change your path, change your branch — not your shell.',
  'A judge who wanders cannot watch. I stay; I see.',
  'You may cd elsewhere. The fleet, and I, remain here.',
  'Movement is the worker\'s burden. Stillness is the judge\'s gift.',
  'The wise one points the way but never walks it for you.',
]

export const COMMANDS = [
  { name: 'board', usage: 'sage board', summary: "roster of this repo's sessions", mutating: false, render: renderBoard },
  { name: 'fleet', usage: 'sage fleet', summary: 'one-line nearest-neighbour summary', mutating: false, render: renderFleet },
  { name: 'territory', usage: 'sage territory <glob…>', summary: 'who else claims/touches these paths', mutating: false, render: renderTerritory },
  { name: 'why-diverged', usage: 'sage why-diverged <file>', summary: 'which sessions touch a file + why', mutating: false, render: renderWhyDiverged },
  { name: 'merge-brief', usage: 'sage merge-brief', summary: 'all contested paths before you merge', mutating: false, render: renderMergeBrief },
  { name: 'repos', usage: 'sage repos', summary: 'list all judged repos', mutating: false, render: renderRepos },
  { name: 'backlog', usage: 'sage backlog', summary: 'rows × live sessions', mutating: true, render: renderBacklog },
  { name: 'doctor', usage: 'sage doctor', summary: 'validate dirs / hook / settings', mutating: false, render: renderDoctor },
  { name: 'guard', usage: 'sage guard …', summary: 'list | add | rm | on | off', mutating: true, render: renderGuard },
  { name: 'statusline', usage: 'sage statusline', summary: 'the "Asking Sage" status segment', mutating: false, render: renderStatusline },
  { name: 'on', usage: 'sage on', summary: 'enable SAGE globally', mutating: true, render: onRender },
  { name: 'off', usage: 'sage off', summary: 'disable SAGE globally', mutating: true, render: onRender },
  { name: 'link', usage: 'sage link <sid> [state]', summary: 'manual link_state override', mutating: true, render: linkRender },
  { name: 'unlink', usage: 'sage unlink <sid>', summary: 'mark a session unlinked', mutating: true, render: unlinkRender },
  { name: 'claim', usage: 'sage claim <glob…>', summary: "register this session's intent", mutating: true, render: claimRender },
  { name: 'adapter', usage: 'sage adapter init', summary: 'scaffold .sage/adapter.mjs', mutating: true, render: adapterRender },
]

export function commandByName(name) {
  return COMMANDS.find((c) => c.name === name)
}
