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

console.log('SMOKE PASS')
await b.close()
