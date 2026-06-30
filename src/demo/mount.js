import { createEngine } from './engine.js'

const REDUCED = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

export function mountDemo(root) {
  const engine = createEngine(0)
  const out = root.querySelector('#demo-output')
  const input = root.querySelector('#demo-input')
  const ghost = root.querySelector('#demo-ghost')
  const term = root.querySelector('#demo-terminal')
  const randomBtn = root.querySelector('#demo-randomize')

  const print = (lines, { cmd } = {}) => {
    if (cmd != null) {
      const el = document.createElement('div')
      el.className = 'demo-out-line'
      el.innerHTML = `<span class="c-prompt">$</span> <span class="demo-out-cmd"></span>`
      el.querySelector('.demo-out-cmd').textContent = ` ${cmd}`
      out.appendChild(el)
    }
    for (const ln of lines) {
      const el = document.createElement('div')
      el.className = 'demo-out-line'
      el.textContent = ln
      out.appendChild(el)
    }
    out.scrollTop = out.scrollHeight
  }

  const exec = (line) => {
    const res = engine.run(line)
    if (res.clear) { out.innerHTML = ''; return }
    print(res.lines, { cmd: line })
  }

  const refreshGhost = () => {
    // empty input → no ghost, so the native placeholder shows alone (no overlap)
    if (!input.value) { ghost.textContent = ''; return }
    const suffix = engine.complete(input.value)
    ghost.textContent = input.value + suffix
  }

  input.addEventListener('input', refreshGhost)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const v = input.value.trim()
      if (v) exec(v)
      input.value = ''
      refreshGhost()
    } else if (e.key === 'Tab' || (e.key === 'ArrowRight' && input.selectionStart === input.value.length)) {
      const suffix = engine.complete(input.value)
      if (suffix) { e.preventDefault(); input.value += suffix; refreshGhost() }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); input.value = engine.history(-1); refreshGhost()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault(); input.value = engine.history(1); refreshGhost()
    }
  })

  randomBtn.addEventListener('click', () => {
    engine.randomize()
    out.innerHTML = ''
    print([`— loaded fleet: ${engine.state.repoId} —`])
    input.focus()
  })

  // left-pane command rows → run on the right (+ pulse the input)
  root.querySelectorAll('[data-run]').forEach((el) => {
    el.addEventListener('click', () => {
      const cmd = el.getAttribute('data-run')
      input.value = ''
      exec(cmd)
      term.classList.remove('demo-pulse'); void term.offsetWidth; term.classList.add('demo-pulse')
      input.focus()
    })
  })

  // first frame + live tick (paused offscreen, off under reduced-motion)
  exec('sage board')
  if (!REDUCED) {
    let timer = null
    const io = new IntersectionObserver((entries) => {
      const visible = entries[0].isIntersecting
      if (visible && !timer) timer = setInterval(() => engine.tick(), 5000)
      else if (!visible && timer) { clearInterval(timer); timer = null }
    }, { threshold: 0.1 })
    io.observe(term)
  }
  refreshGhost()
}
