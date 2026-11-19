// node --test evals/
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const run = (fixture) => {
  const r = spawnSync("node", [join(here, "../plugin/skills/aso/scripts/check.mjs"), join(here, "fixtures", fixture), "--json"], { encoding: "utf8" });
  return { code: r.status, findings: JSON.parse(r.stdout) };
};
const msgs = (findings) => findings.map((f) => `${f.level} ${f.locale} ${f.field}: ${f.msg}`);

test("a clean listing passes", () => {
  const { code, findings } = run("good.json");
  assert.equal(code, 0);
  assert.deepEqual(findings, []);
});

test("a stuffed listing fails on every rule it breaks", () => {
  const { code, findings } = run("bad.json");
  assert.equal(code, 1);
  const m = msgs(findings);
  for (const want of [
    "error en-US ios.name: 50/30 chars",
    'error en-US ios.name: banned "android"',
    "error en-US ios.keywords: space next to a comma wastes budget",
    'error en-US ios.keywords: "habit" already in name, subtitle or developer name',
    'error en-US ios.keywords: wasted on "app"',
    'error en-US ios.keywords: competitor name "Streaks"',
    'warn en-US ios.keywords: "streak" and "streaks" are one word to Apple',
    'error en-US play.title: banned "#1"',
    "error en-US play.title: emoji",
    'error en-US play.shortDescription: banned "download now"',
    "error en-US play.shortDescription: repeated punctuation",
    "error en-US play.fullDescription: repeats the short description",
    'error de-DE ios.subtitle: banned "kostenlos"',
  ])
    assert.ok(m.includes(want), `missing: ${want}`);
  assert.ok(m.some((x) => x.startsWith("error en-US play.fullDescription: keyword list")));
  assert.ok(m.some((x) => x.includes("density")));
});
