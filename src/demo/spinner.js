// Dense single-cell braille "dots" — one column wide, appears to spin in place.
// Mirrors the agentic-sage CLI's lib/spinner.mjs 1:1 (the portable motion spec,
// like highlight.js mirrors lib/color.mjs). Keep the two in lockstep so the demo
// and a real terminal spin identically.
export const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
export const SPINNER_INTERVAL_MS = 100
