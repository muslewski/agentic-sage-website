# SAGE landing — shared build brief (read fully before building)

You are building ONE self-contained HTML landing-page mockup for **SAGE**, an open-source dev tool.
Five different visual directions are being built in parallel from this same brief; yours is ONE of them
(named in your task). **Content is identical across all five; only the visual treatment + motion differ.**

## What SAGE is (so your copy is accurate)
SAGE = **Session Awareness & Guidance Engine**. A passive, read-only *judge* for fleets of many
parallel AI coding sessions (e.g. 8 Claude Code agents at once). It watches every session and answers
when asked — it **never edits, spawns, or blocks**. "Advisor, not a boss. Just the truth." One judge
per repo. Zero-dependency Node CLI. Default-OFF (installing changes nothing until `sage on`).

## Hard requirements
- **Single self-contained `.html` file** at the exact output path given in your task. No build step.
- Use **Tailwind Play CDN** (`<script src="https://cdn.tailwindcss.com"></script>`) for utilities,
  a `<style>` block for custom CSS, and **vanilla JS** for animation. Google Fonts via `<link>`.
- Must **open directly via `file://`** and look complete. Responsive enough (looks good 390px + 1280px).
- **Animated** — the user explicitly wants motion. At minimum:
  - Hero entrance animation on load.
  - Scroll-reveal for each section (IntersectionObserver adding a visible class; respect
    `prefers-reduced-motion` — gate the JS so reduced-motion users see everything statically).
  - At least one signature motion piece for your direction (e.g. typed-terminal effect, count-up,
    parallax, marquee, hover micro-interactions).
- **Accessible-ish:** real semantic tags, alt text on images, sufficient contrast.

## Brand palette (derive Tailwind config / CSS vars from these)
- Paper / cream backgrounds: `#F4EFE6`, `#EFE7D8`, lighter `#FBF8F2`
- Ink (near-black text): `#1A1714`
- Gold accent (primary): `#B8862F` (hover `#9E7325`), bright gold `#C8972F`
- Olive green (success/checks): `#6B7A3A`
- Use the gold as the single primary accent. Keep it warm + editorial, not neon.
- Each direction overrides this mood per its own brief (e.g. terminal = dark; brutalist = stark
  black/white + gold) — but the gold accent and the mascot tie all five together.

## Fonts (Google Fonts; pick per direction)
- Display / wordmark: a heavy condensed sans — e.g. `Archivo Black`, `Anton`, or `Archivo` 900.
- Body: `Inter`.
- Mono (for commands/terminal): `JetBrains Mono` or `IBM Plex Mono`.
- Hand-drawn accent (editorial direction only): `Caveat`.

## Assets (in `./assets/`, relative to your html file)
Full-bleed composite banners (cream bg, robed sage mascot w/ sunglasses + staff, gold/black). Use
tastefully — as hero art, section dividers, or a framed showcase. Do NOT stretch; keep aspect ratio.
- `assets/sage-banner.png` (1774×887) — main tagline banner ("I DON'T DO THE WORK. I JUDGE IT.")
- `assets/sage-setup.png` — 4-step setup (Clone→Install→Enable→Doctor)
- `assets/sage-conventions.png` — controller conventions
- `assets/sage-adapters.png` — adapter contract
- `assets/sage-uninstall.png` — goodbye/uninstall
The mascot recurs in every banner — that's the brand character. There is no transparent cutout, so
either feature a whole banner, or lean on typography + CSS and use a banner lower on the page.

## Canonical copy (use verbatim; light per-direction trimming OK)
- Wordmark: **SAGE**
- Expansion (small, near wordmark): Session Awareness & Guidance Engine
- Hero tagline: **I don't do the work. I judge it.**
- Hero sub: A passive, read-only judge for fleets of parallel AI coding sessions. One judge per repo.
- Primary CTA button: **View on GitHub** → `https://github.com/muslewski/agentic-sage`
- Secondary CTA: a copyable command — `git clone https://github.com/muslewski/agentic-sage`

### Section 2 — The problem
Heading: **Eight agents, one repo, zero coordination.**
Body: Run a fleet of coding agents at once and they collide — same files, duplicated work, lost
context across sessions, no shared source of truth. Nobody is watching the fleet as a whole.

### Section 3 — What SAGE is
Heading: **A judge, not a boss.**
Body: SAGE sits beside your fleet and watches every session. Ask it anything — who's touching what,
where two branches diverged, what the backlog says — and it answers. It never edits your code, never
spawns agents, never blocks an action. Passive by design. *Advisor, not a boss — just the truth.*

### Section 4 — How it works (4 steps, numbered)
1. **Clone** — `git clone …`
2. **Install** — `node install.mjs` (wires the hook; touches nothing else)
3. **Enable** — `sage on` (nothing runs until you do)
4. **Verify** — `sage doctor` (checks the setup is valid)

### Section 5 — Pillars (6, as a grid of cards w/ an icon each)
- **Passive by design** — watches and answers; never edits, spawns, or blocks.
- **Read-only & safe** — it cannot change your repo. Ever.
- **Zero-dependency** — one Node CLI, no install bloat. Clone and run.
- **Default-off** — installing changes nothing until `sage on`.
- **Fail-open** — any error in the optional guard allows the action. Never in your way.
- **Hot-path-cheap** — when idle the hook short-circuits instantly. Zero cost.

### Section 6 — A peek (terminal block)
Show a faux terminal running these (style per direction). Prompt is `$`.
```
$ sage board          # the whole fleet at a glance
$ sage territory      # who's touching which files
$ sage backlog        # what each session claimed
$ sage doctor         # is my setup valid?
```

### Section 7 — Final CTA + footer
CTA heading: **Bring a judge to your fleet.**
Command to copy: `git clone https://github.com/muslewski/agentic-sage`
Buttons: **View on GitHub** (primary). 
Footer line: SAGE · Session Awareness & Guidance Engine · MIT · one judge per repo.

## Quality bar
A senior designer should call it "clean and intentional," not "AI-generated template." Commit to your
direction's personality hard. Polished spacing, real type hierarchy, motion that feels designed. No
lorem ipsum, no broken images, no dead links. Ship one beautiful file.
