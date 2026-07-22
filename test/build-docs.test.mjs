import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const site = join(dirname(fileURLToPath(import.meta.url)), "..");

test("build-docs generates docs index with sidebar and brand", () => {
  const r = spawnSync(process.execPath, ["scripts/build-docs.mjs"], {
    cwd: site,
    encoding: "utf8",
  });
  assert.equal(r.status, 0, r.stderr + r.stdout);
  const index = join(site, "generated/docs/index.html");
  assert.ok(existsSync(index), "index.html missing");
  const html = readFileSync(index, "utf8");
  assert.match(html, /SAGE/);
  assert.match(html, /docs-nav/);
  assert.match(html, /Getting started|getting-started/i);
  assert.match(html, /fleet judge/i);
  assert.match(html, /docs\.css/);
});

test("getting-started page exists", () => {
  const p = join(site, "generated/docs/getting-started/index.html");
  assert.ok(existsSync(p));
  const html = readFileSync(p, "utf8");
  assert.match(html, /sage init|npm install/i);
});
