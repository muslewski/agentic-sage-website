import { COMMANDS, commandByName, APHORISMS } from './cli-snapshot.js'
import { SCENARIOS } from './scenarios.js'

const USAGE_HEAD = 'usage: sage <command>'
const USAGE = [
  USAGE_HEAD,
  ...COMMANDS.map((c) => `  ${c.name.padEnd(14)} ${c.summary}`),
].join('\n')

const clone = (o) => JSON.parse(JSON.stringify(o))
const SHELL = ['pwd', 'ls', 'cd', 'rm', 'cp', 'mv', 'clear', 'whoami', 'help']

// deterministic-ish pick without Date/Math.random in tests: rotate by a counter
function makeRotator(arr) {
  let i = 0
  return () => arr[i++ % arr.length]
}

export function createEngine(scenarioIndex = 0) {
  let idx = scenarioIndex % SCENARIOS.length
  let state = clone(SCENARIOS[idx])
  const inputs = []
  let histPos = 0
  const nextAphorism = makeRotator(APHORISMS)

  function applyMutation(name, args) {
    if (name === 'on') state.enabled = true
    else if (name === 'off') state.enabled = false
    else if (name === 'claim' && args.length) {
      const self = state.sessions.find((s) => s.session_id === state.self)
      if (self) self.claimed_globs = [...new Set([...(self.claimed_globs || []), ...args])]
    } else if (name === 'guard') {
      if (args[0] === 'add' && args[1]) state.guard.paths = [...new Set([...state.guard.paths, args[1]])]
      else if (args[0] === 'rm' && args[1]) state.guard.paths = state.guard.paths.filter((p) => p !== args[1])
      else if (args[0] === 'on') state.guard.enabled = true
      else if (args[0] === 'off') state.guard.enabled = false
    } else if (name === 'backlog' && args[0] === 'claim' && args[1]) {
      const self = state.sessions.find((s) => s.session_id === state.self)
      if (self) self.claimed_row = args[1]
    }
  }

  function runShell(cmd, args) {
    switch (cmd) {
      case 'pwd':
        return { lines: [state.cwd] }
      case 'ls':
        return { lines: [state.ls.join('   ')] }
      case 'cd':
        return { lines: [`✨ ${nextAphorism()}`] }
      case 'rm':
        return { lines: ['sage: I judge. I do not delete. Nice try. (read-only demo)'] }
      case 'cp':
      case 'mv':
        return { lines: [`sage: nothing to ${cmd} — this is a read-only demo of a read-only judge.`] }
      case 'whoami':
        return { lines: ['you (a fleet at altitude)'] }
      case 'clear':
        return { lines: [], clear: true }
      case 'help':
        return { lines: USAGE.split('\n') }
      default:
        return { lines: [`sage-demo: ${cmd}: command not found (try: sage board)`] }
    }
  }

  function run(line) {
    const raw = String(line).trim()
    if (raw) {
      inputs.push(raw)
      histPos = inputs.length
    }
    if (!raw) return { lines: [] }
    const parts = raw.split(/\s+/)
    const head = parts[0]

    if (head !== 'sage') return runShell(head, parts.slice(1))

    const sub = parts[1]
    const args = parts.slice(2)
    if (!sub) return { lines: USAGE.split('\n') }
    const cmd = commandByName(sub)
    if (!cmd) return { lines: USAGE.split('\n') }
    if (cmd.mutating) applyMutation(cmd.name, args)
    const out = cmd.render(args, state)
    return { lines: out.split('\n') }
  }

  function complete(line) {
    const raw = String(line)
    const parts = raw.split(/\s+/)
    if (parts.length === 1) {
      const cands = ['sage', ...SHELL].filter((c) => c.startsWith(parts[0]) && c !== parts[0])
      return cands.length ? cands[0].slice(parts[0].length) : ''
    }
    if (parts.length === 2 && parts[0] === 'sage') {
      const cands = COMMANDS.map((c) => c.name).filter((n) => n.startsWith(parts[1]) && n !== parts[1])
      return cands.length ? cands[0].slice(parts[1].length) : ''
    }
    return ''
  }

  function history(dir) {
    if (!inputs.length) return ''
    histPos = Math.max(0, Math.min(inputs.length, histPos + dir))
    return inputs[histPos] ?? (dir > 0 ? '' : inputs[0])
  }

  function randomize() {
    idx = (idx + 1) % SCENARIOS.length
    state = clone(SCENARIOS[idx])
    inputs.length = 0
    histPos = 0
    return idx
  }

  // advance one session's age and occasionally its status — pure step
  let tickN = 0
  function tick() {
    tickN += 1
    const s = state.sessions[tickN % state.sessions.length]
    if (!s) return
    const m = (s.handoff || '').match(/(\d+)m/)
    if (m) s.handoff = s.handoff.replace(/\d+m/, `${Number(m[1]) + 1}m`)
    if (tickN % 4 === 0 && s.liveness === 'active') s.liveness = 'idle'
    else if (tickN % 7 === 0 && s.liveness === 'idle') s.liveness = 'active'
  }

  return {
    run,
    complete,
    history,
    randomize,
    tick,
    get state() {
      return state
    },
  }
}

export { USAGE }
