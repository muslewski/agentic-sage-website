# SAGE landing — ROUND 3: the cherry-pick assembly

The user reviewed round 2 and cherry-picked the best part of each section. Build the assembly below as
ONE self-contained page. Read `BRIEF.md` (copy, palette names, hard reqs) and `BRIEF-v2.md` (imagery
law, section intents) FIRST. Then PULL each section from the named round-2 file in THIS folder, recolor
EVERYTHING to v6's palette, and add a paper texture to the nav + image frames. Two candidates exist
(A faithful / B refined) — your task says which.

## Global rules (BOTH candidates)
- **Palette = `v6-dark-pure.html`.** Open it, copy its `:root` color tokens verbatim, and use them as THE
  palette for the whole page. Every ported section is recolored to these tokens (dark warm bg + gold +
  cream text + olive ✓). No section keeps its source's own colors.
- **Paper texture** on (a) the nav/header background and (b) every image frame/band: a subtle warm grain
  — inline SVG `feTurbulence` noise layered at ~5–8% opacity, or a faint repeating paper texture. Subtle,
  never muddy. The user explicitly asked for "that paper pattern" on headers + images.
- **Hero badge text = exactly** `Open Source · Zero Dependencies` (DROP "MIT").
- Self-contained single `.html`: Tailwind Play CDN + `<style>` + vanilla JS, Google Fonts, relative
  `./assets/`, opens via `file://`. All motion gated on `prefers-reduced-motion`. Copy per `BRIEF.md`.

## Assembly map — section ← source file (locate each by its heading/comment, port + recolor)
1. **Nav / header** ← `v8-dark-magazine.html` — the one WITH backdrop-blur. Add paper texture to it.
2. **Hero — LEFT column** ← `v6-dark-pure.html`: wordmark + tagline + sub + dual CTA + badge (edited text
   above). Keep v6's look. **TWEAK: vertically center the left column** so it aligns to the terminal's
   vertical center (don't let it sit top-heavy).
3. **Hero — RIGHT column (terminal)** ← `v7-dark-zine.html`: port v7's hero terminal. **CRITICAL: keep the
   small Caveat cursive line BENEATH the terminal** — that's the reason this one was picked. Typed
   `sage board` → fleet rows → `sage territory` loop stays.
4. **// The Problem** ← `v8-dark-magazine.html`: v8's problem section specifically (its cinematic
   full-bleed / headline-over-image treatment). Recolor to v6 tokens.
5. **// What SAGE is** ← `v7-dark-zine.html`: v7's treatment (square-mascot speech-bubble character + editorial).
6. **// How it works** ← `v6-dark-pure.html`: v6's treatment, `sage-setup.png` at wide width.
7. **Six pillars** ← `v9-light-paper.html`: keep v9's pillar design/layout, **recolored to v6 dark**.
8. **// A peek** ← `v7-dark-zine.html`: v7's dual terminal panes + Caveat callout.
9. **The Judge** ← `v7-dark-zine.html`: v7's judge centerpiece.
10. **Final CTA** ← `v7-dark-zine.html`: v7's CTA (copyable `git clone` + View on GitHub).
11. **Footer** ← `v9-light-paper.html`: v9's footer, recolored to v6 dark.

## Section order (top → bottom)
nav(v8) → Hero[ v6 left + v7 terminal ] → Problem(v8) → What SAGE is(v7) → How it works(v6) →
Pillars(v9·dark) → A peek(v7) → The Judge(v7) → CTA(v7) → Footer(v9).

## Your candidate (your task names A or B)
- **A — Faithful stitch:** reproduce each chosen section as close to its source as possible — only
  recolored to v6 + paper texture + the badge edit + the hero vertical-center tweak. The literal
  cherry-pick, minimal smoothing.
- **B — Cohesive refine:** same sections + same order, but harmonized into ONE polished system: unified
  spacing rhythm, smooth background transitions between the differently-sourced sections, the v9 pillars
  re-imagined to feel native in the dark palette, a slightly stronger cohesive paper grain, and
  micro-polished motion. A designer's pass over the same assembly — same content, more finished.

## Quality bar
This is the convergence candidate — it must look like a real shippable landing, not a seam-y collage.
The hero terminal must animate as well as v7's; every image big; the paper grain felt but subtle.
