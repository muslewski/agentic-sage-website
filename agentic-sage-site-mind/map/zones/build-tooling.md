---
type: zone
summary: "Vite build tooling — vite.config.js, sage-drift plugin, package.json scripts, and scripts/optimize-image.sh AVIF/WebP pipeline."
tags: [vite, build, tooling, images]
status: seeded
created: 2026-07-21
updated: 2026-07-21
verifiedAt: unverified
owns:
  routes: []
  testids: []
  globs:
    - "vite.config.js"
    - "vite-plugin-sage-drift.js"
    - "scripts/**"
    - "package.json"
    - "package-lock.json"
  tools: []
depends: []
invariants: []
skills: []
related: []
sources: []
---

## What this is

Build and asset pipeline for the static marketing site: Vite 6 config, custom **sage-drift** plugin (content drift guard), npm package metadata, and `optimize-image.sh` that produces AVIF+WebP pairs into `public/assets/`.

## Anchors

Config/plugin/scripts listed in globs — not app UI.

## Invariants

None claimed on seed.

## Lineage

README + package.json + plugin file on 2026-07-21 seed pass.
