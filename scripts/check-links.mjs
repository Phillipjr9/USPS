#!/usr/bin/env node
/**
 * Link integrity checker.
 *
 * Verifies that every internal link in the app resolves to a registered
 * route, and flags the patterns that silently break a HashRouter build:
 *
 *   - href="#..."            → interpreted as a route, lands on 404
 *   - toRoute() labels that aren't in LINK_ROUTES → silently redirect home
 *   - links to routes that are not registered in App.tsx
 *   - routes missing a document title
 *
 * Run with:  npm run check:links
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC = "src";
let failures = 0;
const fail = (msg) => {
  console.error(`  ✗ ${msg}`);
  failures++;
};
const pass = (msg) => console.log(`  ✓ ${msg}`);

/* ---------- gather files ---------- */

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.(tsx?|ts)$/.test(name)) out.push(p);
  }
  return out;
}

const files = walk(SRC);
const read = (p) => readFileSync(p, "utf8");

/* ---------- registered routes ---------- */

const app = read(join(SRC, "App.tsx"));
const routes = new Set(
  [...app.matchAll(/path="([^"]+)"/g)].map((m) => m[1]).filter((r) => r !== "*")
);
console.log(`\nRegistered routes: ${routes.size}`);

/* ---------- LINK_ROUTES ---------- */

const linksSrc = read(join(SRC, "data/links.ts"));
const linkRoutes = {};
for (const m of linksSrc.matchAll(/^\s*(?:"([^"]+)"|([A-Za-z_]+)):\s*"(\/[^"]*)",/gm)) {
  linkRoutes[m[1] ?? m[2]] = m[3];
}
console.log(`Label → route mappings: ${Object.keys(linkRoutes).length}`);

const deadRoutes = Object.entries(linkRoutes).filter(([, v]) => !routes.has(v));
if (deadRoutes.length) {
  deadRoutes.forEach(([k, v]) => fail(`"${k}" → ${v} (route not registered)`));
} else {
  pass("every label maps to a registered route");
}

/* ---------- literal link targets ---------- */

const targets = new Map();
for (const f of files) {
  const t = read(f);
  for (const re of [/to="(\/[^"$]*)"/g, /to:\s*"(\/[^"$]*)"/g]) {
    for (const m of t.matchAll(re)) {
      if (!targets.has(m[1])) targets.set(m[1], new Set());
      targets.get(m[1]).add(f);
    }
  }
}
const badTargets = [...targets.keys()].filter((t) => !routes.has(t));
if (badTargets.length) {
  badTargets.forEach((t) => fail(`link target "${t}" is not a registered route (${[...targets.get(t)].join(", ")})`));
} else {
  pass(`${targets.size} distinct literal link targets all resolve`);
}

/* ---------- HashRouter hazards ---------- */

const hashHazards = [];
for (const f of files) {
  const t = read(f);
  for (const m of t.matchAll(/<a\b[\s\S]*?>/g)) {
    const tag = m[0];
    const h = tag.match(/href="#([^"]*)"/);
    if (!h) continue;
    // "#/" is a valid HashRouter root link; "#section" is not.
    if (h[1] === "/" || h[1].startsWith("/")) continue;
    hashHazards.push(`${f}:${t.slice(0, m.index).split("\n").length}  href="#${h[1]}"`);
  }
}
if (hashHazards.length) {
  hashHazards.forEach((h) => fail(`HashRouter hazard — ${h} (navigates to a 404 route)`));
} else {
  pass("no bare href=\"#...\" anchors (these break HashRouter)");
}

/* ---------- page titles ---------- */

const st = read(join(SRC, "components/ScrollToTop.tsx"));
const titled = new Set([...st.matchAll(/"(\/[^"]*)":\s*"[^"]+"/g)].map((m) => m[1]));
const untitled = [...routes].filter((r) => !titled.has(r));
if (untitled.length) {
  untitled.forEach((r) => fail(`route ${r} has no document title`));
} else {
  pass(`all ${routes.size} routes have a document title`);
}

/* ---------- dead buttons ---------- */

/** Read a JSX opening tag starting at `i`, respecting braces so arrow
 *  functions ("onClick={() => ...}") don't terminate the tag early. */
function readTag(src, i) {
  let depth = 0;
  let quote = null;
  for (let j = i; j < src.length; j++) {
    const ch = src[j];
    if (quote) {
      if (ch === quote && src[j - 1] !== "\\") quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { quote = ch; continue; }
    if (ch === "{") { depth++; continue; }
    if (ch === "}") { depth--; continue; }
    if (ch === ">" && depth === 0) return src.slice(i, j + 1);
  }
  return src.slice(i);
}

const deadButtons = [];
for (const f of files.filter((x) => x.endsWith(".tsx"))) {
  const t = read(f);
  const re = /<button\b/g;
  let m;
  while ((m = re.exec(t))) {
    const tag = readTag(t, m.index);
    if (tag.includes("onClick") || tag.includes('type="submit"')) continue;
    const before = t.slice(0, m.index);
    if (before.lastIndexOf("<form") > before.lastIndexOf("</form>")) continue; // implicit submit
    deadButtons.push(`${f}:${before.split("\n").length}`);
  }
}
if (deadButtons.length) {
  deadButtons.forEach((d) => fail(`button with no handler and no form — ${d}`));
} else {
  pass("no dead buttons");
}


/* ---------- reachability ---------- */

const reachable = new Set(Object.values(linkRoutes));
for (const f of files) {
  const t = read(f);
  const patterns = [
    /to="(\/[^"$]*)"/g,
    /to:\s*"(\/[^"$]*)"/g,
    /navigate\("(\/[^"]*)"/g,
    /navigate\(\s*`(\/[^`$]*)`/g,
    /route:\s*"(\/[^"]*)"/g,
  ];
  for (const re of patterns) for (const m of t.matchAll(re)) reachable.add(m[1]);
}
const orphans = [...routes].filter((r) => !reachable.has(r));
if (orphans.length) {
  orphans.forEach((r) => fail(`route ${r} is unreachable — nothing links to it`));
} else {
  pass(`all ${routes.size} routes are reachable from somewhere`);
}

/* ---------- raw codes must never reach the UI ---------- */

/**
 * Internal reason codes (POSTAGE_INVALID, FRAUD_REVIEW, …) are storage keys,
 * not customer-facing copy. Rendering one in JSX leaks a developer token into
 * the page, so flag any interpolation of `.code` / `.reasonCode` / `.formatKey`.
 */
const rawCodeLeaks = [];
for (const f of files) {
  if (!f.endsWith(".tsx")) continue;
  const t = read(f);
  const lines = t.split("\n");
  lines.forEach((line, i) => {
    // Ignore object literals / props — only JSX text interpolation counts.
    // `key={r.code}` / `value={r.code}` are attributes, not visible text.
    const m = line.match(/(?<![=\w$])\{\s*[A-Za-z_$][\w$]*(?:\.[\w$]+)*\.(?:reasonCode|code|formatKey)\s*\}/);
    if (m) rawCodeLeaks.push(`${f}:${i + 1}  ${m[0]}`);
  });
}
if (rawCodeLeaks.length) {
  rawCodeLeaks.forEach((d) => fail(`raw internal code rendered in UI — ${d}`));
} else {
  pass("no raw internal codes rendered in the UI");
}

/* ---------- summary ---------- */

console.log(
  failures === 0
    ? "\n✅ All link checks passed.\n"
    : `\n❌ ${failures} problem(s) found.\n`
);
process.exit(failures === 0 ? 0 : 1);
