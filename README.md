<p align="center">
  <img src="public/assets/sage-banner.webp" alt="SAGE — Session Awareness &amp; Guidance Engine: a passive, read-only fleet judge. “I don’t do the work. I judge it.”" />
</p>

# SAGE — marketing website

The **marketing website** for **SAGE**, the passive, read-only *fleet judge* for parallel AI
coding sessions. **This repo is only the landing page** — a one-page static site built with
[Vite](https://vite.dev).

> **→ Looking for SAGE itself?**
> The tool — CLI, source, install, and docs — lives in the main repo:
> **https://github.com/muslewski/agentic-sage**
> This repo only builds the page that markets it.

## Develop

```bash
pnpm install        # or npm install
pnpm dev            # http://localhost:5173
```

## Build

```bash
pnpm build          # → dist/
pnpm preview        # serve the production build locally
```

## Deploy (Vercel)

Vercel auto-detects Vite. Framework preset **Vite**, build command `vite build`,
output directory `dist`. No config needed — import the repo and ship.

## Structure

```
index.html        markup
src/style.css     all styles (custom CSS, no framework)
src/main.js       vanilla JS — typed terminal, scroll-reveal, wavy underlines, copy buttons
public/assets/    optimized brand art (.avif + .webp pairs)
scripts/          optimize-image.sh — the image pipeline
explorations/     design archive (HTML mockups + source PNG masters — not built or deployed)
```

## Images

Every image ships as an **AVIF + WebP pair** behind a `<picture>` block — **never reference a raw
PNG/JPG in markup.** This is the convention; follow it for every image added later.

**Add or change an image:**

1. Keep the full-res master PNG in `explorations/assets/`.
2. Generate the optimized pair — width ≈ **2× the largest size it renders at** (never upscaled):

   ```bash
   scripts/optimize-image.sh explorations/assets/<master>.png <name> <max-width-px>
   # → public/assets/<name>.avif  +  public/assets/<name>.webp
   ```

3. Reference it with this exact block — AVIF first, WebP next, the `<img>` is the WebP fallback.
   Set `width`/`height` to the generated pixel size so layout reserves the box (no shift):

   ```html
   <picture>
     <source srcset="/assets/<name>.avif" type="image/avif">
     <source srcset="/assets/<name>.webp" type="image/webp">
     <img src="/assets/<name>.webp" width="W" height="H" alt="…"
          style="display:block;width:100%;height:auto;">
   </picture>
   ```

`picture { display: block; }` (in `src/style.css`) lets the inner `<img width:100%>` fill its frame.
Quality/speed knobs live at the top of `scripts/optimize-image.sh`.
