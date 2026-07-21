---
type: zone
summary: "Static public/ assets — AVIF+WebP brand art pairs, favicons, PWA manifests, and OG image served by Vite from the marketing site root."
tags: [public, assets, brand, images]
status: seeded
created: 2026-07-21
updated: 2026-07-21
verifiedAt: unverified
owns:
  routes: []
  testids: []
  globs:
    - "public/**"
  tools: []
depends: []
invariants: []
skills: []
related: []
sources: []
---

## What this is

Deployed static files under `public/`: optimized `assets/sage-*.avif|webp` pairs, favicon set, web app manifests, `og.jpg`. Never reference raw PNG masters from markup — pipeline lives in [[build-tooling]].

## Anchors

Whole `public/**`.

## Invariants

None claimed on seed — AVIF-first `<picture>` convention is a README rule pending formal invariant encoding.

## Lineage

README Images section + `public/` tree on 2026-07-21 seed pass.
