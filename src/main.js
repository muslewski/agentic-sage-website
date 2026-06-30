(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // ── Scroll reveal (supports .reveal/.visible and .rv/.in) ──
  const revEls = document.querySelectorAll('.reveal, .rv')
  if (!reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible', 'in'); io.unobserve(e.target) }
      })
    }, { threshold: 0.07, rootMargin: '0px 0px -34px 0px' })
    revEls.forEach((el) => io.observe(el))
  } else {
    revEls.forEach((el) => el.classList.add('visible', 'in'))
  }

  // ── Copy command (works in secure + non-secure contexts; shows a "Copied!" toast) ──
  let toastEl = null
  function showToast(el) {
    if (!toastEl) {
      toastEl = document.createElement('div')
      toastEl.id = 'copy-toast'
      toastEl.textContent = 'Copied!'
      document.body.appendChild(toastEl)
    }
    const r = el.getBoundingClientRect()
    toastEl.style.left = (r.left + r.width / 2) + 'px'
    toastEl.style.top = r.top + 'px'
    toastEl.classList.remove('show')
    void toastEl.offsetWidth // reflow so re-triggering the animation works
    toastEl.classList.add('show')
    clearTimeout(showToast._t)
    showToast._t = setTimeout(() => toastEl.classList.remove('show'), 1400)
  }

  // navigator.clipboard only exists in a secure context (https / localhost). On http
  // over LAN/Tailscale it's undefined, so fall back to the legacy execCommand path.
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text)
    }
    return new Promise((resolve, reject) => {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.top = '0'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') ? resolve() : reject(new Error('copy failed')) }
      catch (e) { reject(e) }
      finally { document.body.removeChild(ta) }
    })
  }

  window.copyCmd = function (el) {
    const cmd = el.getAttribute('data-cmd')
    if (!cmd) return
    copyText(cmd).then(() => {
      el.classList.add('copied')
      showToast(el)
      const icon = el.querySelector('.copy-icon')
      if (icon) {
        const orig = icon.textContent
        icon.textContent = '✓'
        setTimeout(() => { icon.textContent = orig }, 1500)
      }
      setTimeout(() => el.classList.remove('copied'), 1500)
    }).catch(() => {})
  }

  // keyboard: Enter/Space copies any focusable element carrying data-cmd
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target instanceof Element && e.target.hasAttribute('data-cmd')) {
      e.preventDefault()
      window.copyCmd(e.target)
    }
  })

  // ── Wavy underline draw-on (v1 technique) ──
  function initWavy(id) {
    const el = document.getElementById(id)
    if (!el) return
    try {
      const len = el.getTotalLength()
      el.style.strokeDasharray = len
      el.style.strokeDashoffset = len
      el.style.transition = 'stroke-dashoffset 1.15s cubic-bezier(0.4,0,0.2,1)'
    } catch (e) {}
  }
  function drawWavy(id) {
    const el = document.getElementById(id)
    if (el) el.style.strokeDashoffset = '0'
  }

  const wavyIds = ['hero-ul-path', 'prob-ul-path', 'cta-ul-path']

  if (!reduced) {
    wavyIds.forEach(initWavy)
    // hero underline draws after entrance settles
    setTimeout(() => drawWavy('hero-ul-path'), 880)
    // scroll-triggered: problem + cta
    const svgObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        const sec = e.target
        ;['prob-ul-path', 'cta-ul-path'].forEach((id) => {
          if (sec.querySelector('#' + id)) setTimeout(() => drawWavy(id), 180)
        })
        svgObs.unobserve(sec)
      })
    }, { threshold: 0.18 })
    document.querySelectorAll('section').forEach((s) => svgObs.observe(s))
  } else {
    wavyIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) { el.style.strokeDasharray = '9999'; el.style.strokeDashoffset = '0' }
    })
  }

  if (reduced) return

  // ── Hero typed terminal (ported from v7 / v2-terminal) ──
  const heroBody = document.getElementById('hero-anim-wrapper')
  if (!heroBody) return

  const fleet = [
    { agent: 'agent-1', path: 'src/auth/',    status: 'active', time: '8m',  color: '#C8972F' },
    { agent: 'agent-2', path: 'src/billing/', status: 'active', time: '12m', color: '#C8972F' },
    { agent: 'agent-3', path: 'src/editor/',  status: 'idle',   time: '3m',  color: '#6B7A3A' },
    { agent: 'agent-4', path: 'src/api/',     status: 'active', time: '1m',  color: '#C8972F' },
    { agent: 'agent-5', path: 'src/tests/',   status: 'done',   time: '22m', color: '#4A8090' },
  ]

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

  function mkEl(tag, html, style) {
    const d = document.createElement(tag || 'div')
    if (html !== undefined) d.innerHTML = html
    if (style) Object.assign(d.style, style)
    return d
  }

  async function typeInto(span, text, base = 52) {
    let s = ''
    for (const ch of text) {
      s += ch
      span.textContent = s
      await sleep(base + Math.random() * 28)
    }
  }

  async function runHero() {
    let active = true
    document.addEventListener('visibilitychange', () => { active = document.visibilityState === 'visible' })

    while (true) {
      heroBody.innerHTML = ''

      // round 1: sage board
      const row1 = mkEl('div')
      const cmd1 = mkEl('span', ''); cmd1.style.color = '#EFE7D8'
      const cur1 = mkEl('span'); cur1.className = 'cursor'
      row1.appendChild(mkEl('span', '<span style="color:#6B7A3A">$</span> '))
      row1.appendChild(cmd1); row1.appendChild(cur1)
      heroBody.appendChild(row1)

      await sleep(380)
      await typeInto(cmd1, 'sage board')
      await sleep(260)

      row1.innerHTML = '<span style="color:#6B7A3A">$</span> <span style="color:#EFE7D8">sage board</span><span style="color:#3E3830">   # fleet at a glance</span>'
      heroBody.appendChild(mkEl('div', '', { height: '8px' }))

      for (const f of fleet) {
        if (!active) { await sleep(200); continue }
        const row = mkEl('div')
        row.innerHTML =
          `<span style="color:${f.color}">●</span> ` +
          `<span style="color:#EFE7D8;display:inline-block;width:68px;">${f.agent}</span>` +
          `<span style="color:#3E3830;display:inline-block;width:96px;">${f.path}</span>` +
          `<span style="color:${f.color};display:inline-block;width:50px;">${f.status}</span>` +
          `<span style="color:#2E2C28;">${f.time} ago</span>`
        heroBody.appendChild(row)
        await sleep(145 + Math.random() * 70)
      }

      await sleep(280)
      heroBody.appendChild(mkEl('div', '', { height: '8px' }))

      // round 2: sage territory
      const row2 = mkEl('div')
      const cmd2 = mkEl('span'); cmd2.style.color = '#EFE7D8'
      const cur2 = mkEl('span'); cur2.className = 'cursor'
      row2.innerHTML = '<span style="color:#6B7A3A">$</span> '
      row2.appendChild(cmd2); row2.appendChild(cur2)
      heroBody.appendChild(row2)

      await typeInto(cmd2, 'sage territory', 48)
      await sleep(240)

      row2.innerHTML = '<span style="color:#6B7A3A">$</span> <span style="color:#EFE7D8">sage territory</span><span style="color:#3E3830">   # who owns what</span>'
      heroBody.appendChild(mkEl('div', '', { height: '6px' }))
      await sleep(110)
      heroBody.appendChild(mkEl('div', '<span style="color:#3E3830;display:inline-block;width:190px;">src/auth/session.ts</span><span style="color:#4A4438">→ </span><span style="color:#C8972F">agent-1</span>'))
      await sleep(130)
      heroBody.appendChild(mkEl('div', '<span style="color:#3E3830;display:inline-block;width:190px;">src/billing/*.ts</span><span style="color:#4A4438">→ </span><span style="color:#C8972F">agent-2</span>'))
      await sleep(130)
      heroBody.appendChild(mkEl('div', '<span style="color:#3E3830;display:inline-block;width:190px;">src/editor/</span><span style="color:#4A4438">→ </span><span style="color:#6B7A3A">agent-3 (idle)</span>'))
      await sleep(130)
      heroBody.appendChild(mkEl('div', '', { height: '12px' }))
      heroBody.appendChild(mkEl('div', '<span style="color:#6B7A3A">$</span> <span class="cursor"></span>'))

      await sleep(3200)

      heroBody.style.transition = 'opacity 0.45s'
      heroBody.style.opacity = '0'
      await sleep(460)
      heroBody.innerHTML = ''
      heroBody.style.opacity = '1'
      heroBody.style.transition = ''
      await sleep(300)
    }
  }

  runHero()
})()
