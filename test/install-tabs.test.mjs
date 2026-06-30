import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')

test('three install tabs, npm selected by default', () => {
  assert.match(html, /id="tab-npm"[^>]*aria-selected="true"/)
  assert.match(html, /id="tab-marketplace"[^>]*aria-selected="false"/)
  assert.match(html, /id="tab-git"[^>]*aria-selected="false"/)
})

test('npm panel visible, marketplace + git hidden by default', () => {
  assert.doesNotMatch(html, /id="panel-npm"[^>]*\shidden/)
  assert.match(html, /id="panel-marketplace"[^>]*\shidden/)
  assert.match(html, /id="panel-git"[^>]*\shidden/)
})

test('each panel carries its expected commands', () => {
  assert.match(html, /panel-npm[\s\S]*?npm install -g agentic-sage[\s\S]*?sage init[\s\S]*?sage on[\s\S]*?sage doctor[\s\S]*?id="panel-marketplace"/)
  assert.match(html, /panel-marketplace[\s\S]*?\/plugin marketplace add muslewski\/agentic-sage[\s\S]*?\/plugin install[\s\S]*?id="panel-git"/)
  assert.match(html, /panel-git[\s\S]*?git clone https:\/\/github\.com\/muslewski\/agentic-sage\.git[\s\S]*?node install\.mjs[\s\S]*?sage on/)
})

test('git clone appears only inside the git panel', () => {
  const idx = html.indexOf('git clone https://github.com/muslewski/agentic-sage.git')
  const panelGit = html.indexOf('id="panel-git"')
  const panelGitEnd = html.indexOf('</section>', panelGit)
  assert.ok(idx > panelGit && idx < panelGitEnd, 'git clone must live in panel-git')
})

test('hero + CTA copy-blocks are npm, never git clone', () => {
  const blocks = html.match(/class="copy-block[^"]*"[^>]*data-cmd="([^"]+)"/g) || []
  assert.ok(blocks.length >= 2, 'expected hero + CTA copy-blocks')
  for (const b of blocks) assert.match(b, /data-cmd="npm install -g agentic-sage"/, `copy-block must be npm: ${b}`)
})
