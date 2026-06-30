// Pure helpers for the dev drift check. Parse the real CLI's USAGE block into a
// set of top-level command names, and diff that against the demo snapshot's set.

// `on | off` → ['on','off']; `backlog claim <row>` → 'backlog'; ignores the
// `usage:` header and any non-indented/blank lines.
export function parseUsageCommands(usageSrc) {
  const cmds = new Set()
  for (const raw of String(usageSrc).split('\n')) {
    if (!/^\s+\S/.test(raw)) continue // command lines are indented
    const line = raw.trim()
    if (!line || line.startsWith('usage:')) continue
    // take the leading "label" before 2+ spaces (the description gap)
    const label = line.split(/\s{2,}/)[0]
    for (const tok of label.split('|')) {
      const head = tok.trim().split(/\s+/)[0] // first word = command; drops <args>
      if (head && /^[a-z][a-z-]*$/.test(head)) cmds.add(head)
    }
  }
  return [...cmds].sort()
}

export function diffCommands(snapshotCmds, realCmds) {
  const snap = new Set(snapshotCmds)
  const real = new Set(realCmds)
  return {
    added: [...real].filter((c) => !snap.has(c)).sort(),
    removed: [...snap].filter((c) => !real.has(c)).sort(),
  }
}
