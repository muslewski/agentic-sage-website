// Dev-only drift guard. On serve, read the sibling agentic-sage CLI, parse its
// USAGE command set, diff against the demo snapshot's COMMANDS, and if they
// differ, log a warning AND inject a fixed overlay into the page. Never throws;
// no sibling → silent no-op. Inert in `vite build` (apply: 'serve').
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseUsageCommands, diffCommands } from './src/demo/usage-diff.js'
import { COMMANDS } from './src/demo/cli-snapshot.js'

const SIBLING = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../agentic-sage/bin/sage',
)

function computeDrift() {
  let src
  try {
    src = fs.readFileSync(SIBLING, 'utf8')
  } catch {
    return null // no sibling checkout → nothing to check
  }
  const m = src.match(/const USAGE = `([\s\S]*?)`/)
  if (!m) return null
  const real = parseUsageCommands(m[1])
  const snap = COMMANDS.map((c) => c.name).sort()
  const { added, removed } = diffCommands(snap, real)
  return added.length || removed.length ? { added, removed } : null
}

export default function sageDrift() {
  let drift = null
  return {
    name: 'sage-drift',
    apply: 'serve',
    configResolved() {
      drift = computeDrift()
      if (drift) {
        const parts = [
          ...drift.added.map((c) => `+sage ${c}`),
          ...drift.removed.map((c) => `-sage ${c}`),
        ].join(', ')
        // eslint-disable-next-line no-console
        console.warn(
          `\n\x1b[33m⚠ SAGE snapshot stale vs ../agentic-sage: ${parts}\n  → regenerate src/demo/cli-snapshot.js\x1b[0m\n`,
        )
      }
    },
    transformIndexHtml(html) {
      if (!drift) return html
      const parts = [
        ...drift.added.map((c) => `+sage ${c}`),
        ...drift.removed.map((c) => `-sage ${c}`),
      ].join(', ')
      const overlay = `<div style="position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#3a1f12;color:#ffb27a;font:13px/1.5 monospace;padding:10px 16px;border-top:2px solid #C8972F;">⚠ SAGE demo snapshot stale vs ../agentic-sage: ${parts} — regenerate <code>src/demo/cli-snapshot.js</code></div>`
      return html.replace('</body>', `${overlay}</body>`)
    },
  }
}
