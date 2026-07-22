import { defineConfig } from "vite";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync, statSync, existsSync, readFileSync } from "node:fs";
import sageDrift from "./vite-plugin-sage-drift.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Collect generated docs MPA HTML entries */
function docsInputs() {
  const root = resolve(__dirname, "generated/docs");
  const inputs = {};
  if (!existsSync(root)) return inputs;

  function walk(dir, base = "") {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      const st = statSync(p);
      if (st.isDirectory()) {
        walk(p, base ? `${base}/${name}` : name);
      } else if (name === "index.html") {
        const key = base ? `docs-${base.replace(/\//g, "-")}` : "docs";
        inputs[key] = p;
      }
    }
  }
  walk(root);
  return inputs;
}

function tryServeDocs(urlPath) {
  if (!urlPath.startsWith("/docs")) return null;
  let rel = urlPath.replace(/^\/docs\/?/, "");
  if (!rel || rel.endsWith("/")) rel = `${rel}index.html`;
  else if (!rel.endsWith(".html") && !rel.includes(".")) rel = `${rel}/index.html`;
  const file = resolve(__dirname, "generated/docs", rel);
  if (existsSync(file) && statSync(file).isFile()) return file;
  const alt = resolve(
    __dirname,
    "generated/docs",
    urlPath.replace(/^\/docs\/?/, "").replace(/\/$/, ""),
    "index.html",
  );
  if (existsSync(alt) && statSync(alt).isFile()) return alt;
  return null;
}

export default defineConfig({
  plugins: [
    sageDrift(),
    {
      name: "sage-docs-dev",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url?.split("?")[0] || "";
          const file = tryServeDocs(url);
          if (!file) return next();
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(readFileSync(file));
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        ...docsInputs(),
      },
    },
  },
  appType: "mpa",
});
