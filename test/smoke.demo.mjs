// Standalone Playwright smoke for the PEEK demo. Run against `pnpm preview`.
// Usage: pnpm preview &  then  node test/smoke.demo.mjs
import { chromium } from 'playwright'

const URL = process.env.SMOKE_URL || 'http://localhost:4173'
const b = await chromium.launch({ channel: 'chrome' })
const p = await b.newPage()
await p.goto(URL)
await p.locator('#peek').scrollIntoViewIfNeeded()
await p.waitForSelector('#demo-input', { timeout: 5000 })

const input = p.locator('#demo-input')
await input.fill('sage fleet')
await input.press('Enter')
await p.waitForFunction(() => document.querySelector('#demo-output').textContent.includes('live'))

await input.fill('sage boa')
await input.press('Tab')
if ((await input.inputValue()) !== 'sage board') throw new Error('ghost-complete failed')

await p.locator('[data-run="sage doctor"]').click()
await p.waitForFunction(() => document.querySelector('#demo-output').textContent.includes('SAGE doctor'))

await p.locator('#demo-randomize').click()
await input.fill('cd /etc')
await input.press('Enter')
await p.waitForFunction(() => /sage|directories|path/i.test(document.querySelector('#demo-output').textContent))

// install tabs: npm default, switching reveals the right command
await p.locator('#tab-npm').scrollIntoViewIfNeeded()
if (await p.locator('#panel-npm').isHidden()) throw new Error('npm panel should be visible by default')
if (!(await p.locator('#panel-git').isHidden())) throw new Error('git panel should be hidden by default')
await p.locator('#tab-git').click()
await p.waitForFunction(() => !document.querySelector('#panel-git').hidden && document.querySelector('#panel-npm').hidden)
if (!(await p.locator('#panel-git').getByText('git clone https://github.com/muslewski/agentic-sage.git').isVisible())) {
  throw new Error('git clone command not visible after selecting git tab')
}

console.log('SMOKE PASS')
await b.close()
