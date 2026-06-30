# SAGE landing — ROUND 2 brief (convergence). Read BRIEF.md FIRST.

Round 1 produced 5 wild directions. The user picked **v2-terminal as the winner** and wants 5 REFINED
variants that fuse the best traits and fix the weak spots. This file is the round-2 delta — **all the
brand palette, exact copy, the 7 content sections, and hard requirements still come from `BRIEF.md`,
which you MUST read first.** This file changes the LAYOUT, IMAGERY, and a few section treatments.

## Reuse proven code from the round-1 files (READ THEM, port the mechanics)
Two existing files in THIS folder contain the exact effects the user loves. Open and reuse them — do
NOT re-invent these from scratch (the user specifically loves how they already look):

- **`v2-terminal.html`** — the **hero terminal animation**. A traffic-light-chrome terminal window that
  TYPES `$ sage board`, reveals fleet rows one-by-one, then types `$ sage territory`, loops with a
  blinking cursor. **Port this hero almost verbatim** (adapt only the colors to your variant's theme).
  Also reuse its "// how it works" image treatment (wide right image — the user called it beautiful)
  and its end CTA (the user loves it). This is the BACKBONE of every round-2 variant.
- **`v1-editorial.html`** — the **Caveat cursive** accents and the **SVG hand-drawn wavy underline /
  selection** that draws on (stroke-dasharray/`getTotalLength()`). Port this wavy-underline technique
  and the tasteful Caveat annotation style.

## THE BIG FIX — imagery (this is why round 1 failed)
Round 1 shoved **landscape** banners into a small right column → they rendered tiny and ugly. New law:

**Landscape images (banner/setup/conventions/adapters/uninstall) — NEVER a small right thumbnail.**
Use ONE of:
- **Full-width band** — the image spans the section (content-width or edge-to-edge), real height.
- **Wide column** — at least **55%** of the row, min ~520px effective width on desktop (this is what
  v2's "how it works" did — copy that proportion).
Always preserve aspect ratio (`object-fit: contain`/natural), framed per theme (border + shadow/glow).
On mobile every image stacks full-width.

**Square mascot (`assets/sage-square.png`, 1254×1254) — use as a SPEECH-BUBBLE CHARACTER.** The robed
sage "speaks." Put it 280–440px beside or above text with a CSS speech-bubble (rounded panel + tail)
carrying a line like *"Advisor, not a boss — just the truth."* This is the user's explicit idea — the
square shape is a "message-bubble type of thing." Great for the "what SAGE is / the judge" sections.

### Per-image intended use (follow unless your variant brief overrides)
| Asset | Shape | Where | How |
|---|---|---|---|
| `assets/sage-banner.png` | landscape | hero-adjacent OR "the judge" centerpiece OR closing band | full-width band or ≥55% column |
| `assets/sage-square.png` | **square** | "what SAGE is" / "the judge" / problem | **speech-bubble character**, 280–440px |
| `assets/sage-setup.png` | landscape | "// how it works" | **wide** like v2 (the beautiful one); enlarge if anything |
| `assets/sage-conventions.png` | landscape | "// principles" | full-width band behind/beside the pillars |
| `assets/sage-adapters.png` / `sage-uninstall.png` | landscape | optional extra band | only if it earns its place |

## Refined section structure (apply the fixes; keep BRIEF.md copy)
1. **Hero** = the v2 terminal animation (ported). Wordmark + tagline + sub + dual CTA. Put a **gold wavy
   underline** (v1 technique) under the tagline or a key word. The centerpiece of the page.
2. **The Problem** — keep the "problem → solution" framing the user liked. Editorial treatment: a big
   statement, a **Caveat margin annotation**, a **wavy underline** on the key phrase. Optionally the
   square mascot looking on.
3. **The Solution / What SAGE is** — **FIX:** the boring right side becomes the **square-mascot speech
   bubble** delivering *"Advisor, not a boss — just the truth."* Make this section feel alive.
4. **// How it works** (4 steps) — keep v2's treatment but use **`sage-setup.png` at proper/large
   width** (wide column or full band). This already works; make it bigger, not smaller.
5. **// Principles** (6 pillars) — **FIX the flat 6 cards.** Pick per your variant: (a) render them as a
   `sage doctor` **green-✓ checklist inside a terminal pane**, and/or (b) add a **full-width
   `sage-conventions.png` band** beside/behind them, and/or (c) richer cards with lucide-style icons +
   real hover. Not six plain boxes.
6. **// A peek** (commands) — **FIX "missing something":** add a **second terminal pane** with fake
   output, or pair the command list with a board visual, plus a **Caveat callout** pointing at a line.
7. **The Judge** — keep the liked **central image** (banner or square mascot, centered, as a statement).
8. **Final CTA** — port v2's CTA (the user loves it). Copyable `git clone …` + **View on GitHub**.
9. Footer (from BRIEF.md).

## Editorial accents — required in every variant
- **Caveat** cursive for 2–4 hand-written annotations/labels (not body text).
- At least **2 wavy hand-drawn underlines/selections** (v1's SVG draw-on) on key phrases.
- Keep them tasteful — seasoning, not clutter.

## Motion (every variant)
- Hero terminal typed animation (ported from v2).
- Scroll-reveal per section; wavy underlines draw on entry.
- All motion gated on `prefers-reduced-motion` (reduced users see terminal output + underlines static).

## The 5 round-2 variants (you build ONE; this is the set so yours stays distinct)
- **v6 dark — "Terminal Pure"**: closest to v2, every weak section fixed. Safe evolution of the winner.
- **v7 dark — "Zine-Terminal"**: heavy editorial fusion — lots of Caveat + wavy lines, mascot as big
  central character, banners as framed plates. v1's soul on v2's engine, dark.
- **v8 dark — "Cinematic Magazine"**: full-bleed banner bands with headline overlays, asymmetric big
  type, mascot as a pull-quote bubble. Most "designed magazine."
- **v9 light — "Warm Paper Terminal"**: cream editorial page, the dark terminal embedded as the jewel;
  editorial fonts + wavy lines shine on paper; full-width image bands. Best-of-both.
- **v10 light — "Editorial Minimal"**: light, calm, whitespace, restrained; dark terminal block, Caveat
  + wavy used sparingly, generous full-width imagery. The premium minimal take.

## Quality bar
Senior-designer "clean and intentional," not template. The terminal hero must look as good as v2's.
Every image must be big enough to enjoy. One beautiful self-contained file.
